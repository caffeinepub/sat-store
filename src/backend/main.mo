import List "mo:core/List";
import Map "mo:core/Map";
import Text "mo:core/Text";
import Time "mo:core/Time";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import Int "mo:core/Int";
import Order "mo:core/Order";
import Iter "mo:core/Iter";
import Array "mo:core/Array";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import Migration "migration";

(with migration = Migration.run)
actor {
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

  type CartItem = {
    productId : Nat;
    quantity : Nat;
  };

  type OrderItem = {
    product : Product;
    quantity : Nat;
    totalPriceCents : Nat;
  };

  type OrderStatus = {
    #pending;
    #confirmed;
    #shipped;
    #delivered;
  };

  type Order = {
    id : Nat;
    items : [OrderItem];
    totalAmountCents : Nat;
    status : OrderStatus;
    timestamp : Time.Time;
    user : Principal;
  };

  type UserProfile = {
    name : Text;
    email : Text;
    address : Text;
  };

  module Product {
    public func compare(a : Product, b : Product) : Order.Order {
      Int.compare(a.id, b.id);
    };
  };

  let products : Map.Map<Nat, Product> = Map.empty();
  let carts : Map.Map<Principal, [CartItem]> = Map.empty();
  let orders : Map.Map<Nat, Order> = Map.empty();
  let userProfiles : Map.Map<Principal, UserProfile> = Map.empty();

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  func safeIntToNat(intValue : Int) : Nat {
    intValue.toNat();
  };

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  public shared ({ caller }) func initialize() : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can initialize products");
    };

    let initialProducts : [Product] = [
      // Laptops
      {
        id = 1;
        name = "ProBook Ultra 14";
        description = "14\" high-performance laptop with Intel Core i7, 16GB RAM, 512GB SSD.";
        priceCents = 129900;
        category = "Laptops";
        imageUrl = "https://images.unsplash.com/photo-1517336714731-489689fd1ca8";
        rating = 4.8;
        reviewCount = 245;
        stock = 20;
      },
      {
        id = 2;
        name = "GameForce X17";
        description = "17\" gaming laptop with RTX 3070, AMD Ryzen 7, 32GB RAM, 1TB SSD.";
        priceCents = 189900;
        category = "Laptops";
        imageUrl = "https://images.unsplash.com/photo-1519125323398-675f0ddb6308";
        rating = 4.6;
        reviewCount = 180;
        stock = 15;
      },
      {
        id = 3;
        name = "SlimBook Air 13";
        description = "Ultra-thin 13\" laptop with Intel Core i5, 8GB RAM, 256GB SSD.";
        priceCents = 99900;
        category = "Laptops";
        imageUrl = "https://images.unsplash.com/photo-1498050108023-c5249f4df085";
        rating = 4.4;
        reviewCount = 160;
        stock = 25;
      },
      {
        id = 4;
        name = "WorkStation Pro 15";
        description = "15\" productivity laptop with Intel Core i9, 32GB RAM, 1TB SSD.";
        priceCents = 159900;
        category = "Laptops";
        imageUrl = "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2";
        rating = 4.7;
        reviewCount = 210;
        stock = 12;
      },
      {
        id = 5;
        name = "BudgetBook 15.6";
        description = "Affordable 15.6\" laptop with Intel Core i3, 4GB RAM, 256GB SSD.";
        priceCents = 54900;
        category = "Laptops";
        imageUrl = "https://images.unsplash.com/photo-1461749280684-dccba630e2f6";
        rating = 4.2;
        reviewCount = 95;
        stock = 30;
      },
      // Mobiles
      {
        id = 6;
        name = "Galaxy Nova Pro";
        description = "5G smartphone with Snapdragon 888, 128GB storage, 48MP camera.";
        priceCents = 89900;
        category = "Mobiles";
        imageUrl = "https://images.unsplash.com/photo-1506744038136-46273834b3fb";
        rating = 4.5;
        reviewCount = 310;
        stock = 50;
      },
      {
        id = 7;
        name = "iPhone Ultra 15";
        description = "Latest iPhone with A15 Bionic chip, 256GB storage, 6.7\" OLED display.";
        priceCents = 119900;
        category = "Mobiles";
        imageUrl = "https://images.unsplash.com/photo-1512436991641-6745cdb1723f";
        rating = 4.7;
        reviewCount = 400;
        stock = 40;
      },
      {
        id = 8;
        name = "Pixel Vision 8";
        description = "Android smartphone with Google Tensor chip, 128GB storage, dual cameras.";
        priceCents = 69900;
        category = "Mobiles";
        imageUrl = "https://images.unsplash.com/photo-1454023492550-5696f8ff10e1";
        rating = 4.4;
        reviewCount = 175;
        stock = 35;
      },
      {
        id = 9;
        name = "Xperia Edge 5G";
        description = "5G smartphone with 64MP camera, 256GB storage, waterproof design.";
        priceCents = 79900;
        category = "Mobiles";
        imageUrl = "https://images.unsplash.com/photo-1465101046530-73398c7f28ca";
        rating = 4.3;
        reviewCount = 120;
        stock = 28;
      },
      {
        id = 10;
        name = "BudgetPhone 5G";
        description = "Affordable 5G smartphone with 64GB storage, 24MP camera.";
        priceCents = 29900;
        category = "Mobiles";
        imageUrl = "https://images.unsplash.com/photo-1468449032589-876ed4b3e049";
        rating = 4.1;
        reviewCount = 80;
        stock = 60;
      },
      // Accessories
      {
        id = 11;
        name = "NoiseBlock Pro Headphones";
        description = "Wireless noise-cancelling headphones with 40-hour battery life.";
        priceCents = 24900;
        category = "Accessories";
        imageUrl = "https://images.unsplash.com/photo-1517336714731-489689fd1ca8";
        rating = 4.6;
        reviewCount = 150;
        stock = 45;
      },
      {
        id = 12;
        name = "TurboCharge 65W";
        description = "Fast-charging adapter compatible with laptops and mobiles.";
        priceCents = 3900;
        category = "Accessories";
        imageUrl = "https://images.unsplash.com/photo-1519125323398-675f0ddb6308";
        rating = 4.8;
        reviewCount = 110;
        stock = 100;
      },
      {
        id = 13;
        name = "WirelessBuds X3";
        description = "True wireless earbuds with Bluetooth 5.2 and noise isolation.";
        priceCents = 9900;
        category = "Accessories";
        imageUrl = "https://images.unsplash.com/photo-1512436991641-6745cdb1723f";
        rating = 4.4;
        reviewCount = 220;
        stock = 75;
      },
      {
        id = 14;
        name = "ProCase Laptop Sleeve";
        description = "Waterproof laptop sleeve for 13\" to 15.6\" laptops.";
        priceCents = 2900;
        category = "Accessories";
        imageUrl = "https://images.unsplash.com/photo-1454023492550-5696f8ff10e1";
        rating = 4.7;
        reviewCount = 95;
        stock = 60;
      },
    ];

    for (product in initialProducts.values()) {
      products.add(product.id, product);
    };
  };

  public query func listProducts() : async [Product] {
    products.values().toArray().sort();
  };

  public query func getProduct(id : Nat) : async Product {
    switch (products.get(id)) {
      case (null) { Runtime.trap("Product not found") };
      case (?product) { product };
    };
  };

  public query func filterProductsByCategory(category : Text) : async [Product] {
    let filtered = products.values().toArray().filter(
      func(p) { p.category == category }
    );
    filtered.sort();
  };

  public query func searchProducts(searchTerm : Text) : async [Product] {
    let filtered = products.values().toArray().filter(
      func(p) { p.name.contains(#text searchTerm) }
    );
    filtered.sort();
  };

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
