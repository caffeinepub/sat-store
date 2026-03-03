import List "mo:core/List";
import Order "mo:core/Order";
import Map "mo:core/Map";
import Array "mo:core/Array";
import Text "mo:core/Text";
import Time "mo:core/Time";
import Iter "mo:core/Iter";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import Int "mo:core/Int";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  // Product type and comparison
  type Product = {
    id : Nat;
    name : Text;
    description : Text;
    priceCents : Nat;
    category : Text;
    imageUrl : Text;
    rating : Float;
    reviewCount : Nat;
    stock : Nat;
  };

  module Product {
    public func compare(product1 : Product, product2 : Product) : Order.Order {
      Int.compare(product1.id, product2.id);
    };
  };

  // Cart item type and comparison
  type CartItem = {
    productId : Nat;
    quantity : Nat;
  };

  // Order item type
  type OrderItem = {
    product : Product;
    quantity : Nat;
    totalPriceCents : Nat;
  };

  // Order status type
  type OrderStatus = {
    #pending;
    #confirmed;
    #shipped;
    #delivered;
  };

  // Order type
  type Order = {
    id : Nat;
    items : [OrderItem];
    totalAmountCents : Nat;
    status : OrderStatus;
    timestamp : Time.Time;
    user : Principal;
  };

  // State for products, carts, and orders
  let products = Map.empty<Nat, Product>();
  let carts = Map.empty<Principal, [CartItem]>();
  let orders = Map.empty<Nat, Order>();

  // Access control state
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // Function to safely convert Int to Nat with runtime trap for negative values
  func safeIntToNat(intValue : Int) : Nat {
    intValue.toNat();
  };

  // Initialize with sample products
  public shared ({ caller }) func initialize() : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can initialize products");
    };
    products.add(1, {
      id = 1;
      name = "Smartphone";
      description = "Latest model quad-core smartphone";
      priceCents = 69900;
      category = "Electronics";
      imageUrl = "/images/smartphone.jpg";
      rating = 4.5;
      reviewCount = 120;
      stock = 50;
    });
    products.add(2, {
      id = 2;
      name = "Laptop";
      description = "13\" ultrabook with 16GB RAM";
      priceCents = 129900;
      category = "Electronics";
      imageUrl = "/images/laptop.jpg";
      rating = 4.7;
      reviewCount = 85;
      stock = 30;
    });
    products.add(3, {
      id = 3;
      name = "Headphones";
      description = "Premium noise-cancelling headphones";
      priceCents = 24900;
      category = "Electronics";
      imageUrl = "/images/headphones.jpg";
      rating = 4.3;
      reviewCount = 200;
      stock = 80;
    });
  };

  // Products
  public query ({ caller }) func listProducts() : async [Product] {
    products.values().toArray().sort();
  };

  public query ({ caller }) func getProduct(id : Nat) : async Product {
    switch (products.get(id)) {
      case (null) { Runtime.trap("Product not found") };
      case (?product) { product };
    };
  };

  public query ({ caller }) func filterProductsByCategory(category : Text) : async [Product] {
    let filtered = products.values().toArray().filter(
      func(p) { p.category == category }
    );
    filtered.sort();
  };

  public query ({ caller }) func searchProducts(searchTerm : Text) : async [Product] {
    let filtered = products.values().toArray().filter(
      func(p) { p.name.contains(#text searchTerm) }
    );
    filtered.sort();
  };

  // Cart
  public shared ({ caller }) func addToCart(productId : Nat, quantity : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add items to cart");
    };
    if (quantity == 0) {
      Runtime.trap("Quantity must be greater than 0");
    };
    switch (products.get(productId)) {
      case (null) { Runtime.trap("Product not found") };
      case (?product) {
        if (product.stock < quantity) {
          Runtime.trap("Not enough stock");
        };
      };
    };
    let cart = switch (carts.get(caller)) {
      case (null) { [] };
      case (?existing) { existing };
    };
    let cartItem : CartItem = { productId; quantity };
    let updatedCart = cart.concat([cartItem]);
    carts.add(caller, updatedCart);
  };

  public shared ({ caller }) func removeFromCart(productId : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can remove items from cart");
    };
    let cart = switch (carts.get(caller)) {
      case (null) { Runtime.trap("Cart is empty") };
      case (?existing) { existing };
    };
    let filtered = cart.filter(func(item) { item.productId != productId });
    carts.add(caller, filtered);
  };

  public shared ({ caller }) func updateCartItem(productId : Nat, quantity : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update cart items");
    };
    if (quantity == 0) {
      Runtime.trap("Quantity must be greater than 0");
    };
    let cart = switch (carts.get(caller)) {
      case (null) { Runtime.trap("Cart is empty") };
      case (?existing) { existing };
    };
    let updated = cart.map(
      func(item) {
        if (item.productId == productId) {
          { productId; quantity };
        } else {
          item;
        };
      }
    );
    carts.add(caller, updated);
  };

  public query ({ caller }) func getCart() : async [CartItem] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view cart");
    };
    switch (carts.get(caller)) {
      case (null) { [] };
      case (?cart) { cart };
    };
  };

  public shared ({ caller }) func clearCart() : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can clear cart");
    };
    carts.remove(caller);
  };

  // Orders
  public shared ({ caller }) func placeOrder() : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can place orders");
    };

    let cart = switch (carts.get(caller)) {
      case (null) { Runtime.trap("Cart is empty") };
      case (?existing) { existing };
    };

    let orderItems = List.empty<OrderItem>();
    var totalAmount = 0;

    for (item in cart.values()) {
      switch (products.get(item.productId)) {
        case (null) { Runtime.trap("Product not found") };
        case (?product) {
          if (product.stock < item.quantity) {
            Runtime.trap("Not enough stock for product " # item.productId.toText());
          };
          let orderItem : OrderItem = {
            product;
            quantity = item.quantity;
            totalPriceCents = product.priceCents * item.quantity;
          };
          orderItems.add(orderItem);
          totalAmount += orderItem.totalPriceCents;
        };
      };
    };

    let orderIdInt = totalAmount + Time.now();
    let orderId = safeIntToNat(orderIdInt);
    let order : Order = {
      id = orderId;
      items = orderItems.toArray();
      totalAmountCents = totalAmount;
      status = #pending;
      timestamp = Time.now();
      user = caller;
    };
    orders.add(orderId, order);
    carts.remove(caller);
    orderId;
  };

  public query ({ caller }) func getUserOrders() : async [Order] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view orders");
    };
    orders.values().toArray().filter(func(order) { order.user == caller });
  };

  public query ({ caller }) func getOrder(orderId : Nat) : async Order {
    switch (orders.get(orderId)) {
      case (null) { Runtime.trap("Order not found") };
      case (?order) {
        if (caller != order.user and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Can only view your own orders");
        };
        order;
      };
    };
  };

  public shared ({ caller }) func updateOrderStatus(orderId : Nat, status : OrderStatus) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update order statuses");
    };
    let existingOrder = switch (orders.get(orderId)) {
      case (null) { Runtime.trap("Order not found") };
      case (?order) { order };
    };
    let updatedOrder : Order = {
      id = existingOrder.id;
      items = existingOrder.items;
      totalAmountCents = existingOrder.totalAmountCents;
      status;
      timestamp = existingOrder.timestamp;
      user = existingOrder.user;
    };
    orders.add(orderId, updatedOrder);
  };
};
