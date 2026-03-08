import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Principal "mo:core/Principal";
import Time "mo:core/Time";
import Iter "mo:core/Iter";

module {
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
    user : Principal.Principal;
  };

  type UserProfile = {
    name : Text;
    email : Text;
    address : Text;
  };

  public type OldActor = {
    products : Map.Map<Nat, Product>;
    carts : Map.Map<Principal.Principal, [CartItem]>;
    orders : Map.Map<Nat, Order>;
    userProfiles : Map.Map<Principal.Principal, UserProfile>;
  };

  public type NewActor = {
    products : Map.Map<Nat, Product>;
    carts : Map.Map<Principal.Principal, [CartItem]>;
    orders : Map.Map<Nat, Order>;
    userProfiles : Map.Map<Principal.Principal, UserProfile>;
  };

  public func run(old : OldActor) : NewActor {
    let additionalProducts : [Product] = [
      // Accessories (15-17)
      {
        id = 15;
        name = "MechType Pro Keyboard";
        description = "Mechanical RGB keyboard, Cherry MX, tenkeyless";
        priceCents = 12900;
        category = "Accessories";
        imageUrl = "https://images.unsplash.com/photo-1561112078-7d24e04c3407";
        rating = 4.7;
        reviewCount = 185;
        stock = 40;
      },
      {
        id = 16;
        name = "PrecisionGlide Mouse";
        description = "Wireless ergonomic mouse, 4000 DPI, 70h battery";
        priceCents = 5900;
        category = "Accessories";
        imageUrl = "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46";
        rating = 4.5;
        reviewCount = 140;
        stock = 55;
      },
      {
        id = 17;
        name = "4K USB-C Monitor 27\"";
        description = "27\" 4K IPS, USB-C 90W, HDR400";
        priceCents = 39900;
        category = "Accessories";
        imageUrl = "https://images.unsplash.com/photo-1585792180666-f7347c490ee2";
        rating = 4.6;
        reviewCount = 95;
        stock = 12;
      },
      // Tablets (18-20)
      {
        id = 18;
        name = "SmartTab Pro 11";
        description = "11\" tablet with Snapdragon processor, 128GB storage, stylus support.";
        priceCents = 59900;
        category = "Tablets";
        imageUrl = "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2";
        rating = 4.5;
        reviewCount = 130;
        stock = 22;
      },
      {
        id = 19;
        name = "iPad Air 5th Gen";
        description = "10.9\" Apple M1, 256GB, Wi-Fi 6, Touch ID";
        priceCents = 74900;
        category = "Tablets";
        imageUrl = "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0";
        rating = 4.8;
        reviewCount = 310;
        stock = 18;
      },
      {
        id = 20;
        name = "Galaxy Tab S8";
        description = "11\" Snapdragon 8 Gen 1, 128GB, S Pen";
        priceCents = 69900;
        category = "Tablets";
        imageUrl = "https://images.unsplash.com/photo-1527698952873-8cd94b13f8bc";
        rating = 4.6;
        reviewCount = 210;
        stock = 20;
      },
      // Electronics (21-25)
      {
        id = 21;
        name = "SmartWatch Ultra X";
        description = "GPS, heart rate, SpO2, 7-day battery, IP68";
        priceCents = 19900;
        category = "Electronics";
        imageUrl = "https://images.unsplash.com/photo-1523275335684-37898b6baf30";
        rating = 4.5;
        reviewCount = 275;
        stock = 35;
      },
      {
        id = 22;
        name = "Bluetooth Speaker 360";
        description = "360-degree surround, IPX7, 24h playtime";
        priceCents = 8900;
        category = "Electronics";
        imageUrl = "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1";
        rating = 4.4;
        reviewCount = 190;
        stock = 48;
      },
      {
        id = 23;
        name = "Dash Cam 4K Pro";
        description = "Front+rear 4K, night vision, GPS, 32GB";
        priceCents = 11900;
        category = "Electronics";
        imageUrl = "https://images.unsplash.com/photo-1558618666-fcd25c85cd64";
        rating = 4.3;
        reviewCount = 88;
        stock = 22;
      },
      {
        id = 24;
        name = "E-Reader Lite 6\"";
        description = "6\" e-ink, warm light, 8GB, 4-week battery";
        priceCents = 13900;
        category = "Electronics";
        imageUrl = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d";
        rating = 4.6;
        reviewCount = 160;
        stock = 30;
      },
      {
        id = 25;
        name = "Smart Home Hub";
        description = "Alexa/Google/Zigbee compatible smart home controller";
        priceCents = 9900;
        category = "Electronics";
        imageUrl = "https://images.unsplash.com/photo-1558002038-1055907df827";
        rating = 4.2;
        reviewCount = 115;
        stock = 25;
      },
      // Gaming (26-30)
      {
        id = 26;
        name = "GamePad Pro Controller";
        description = "Wireless, haptic feedback, adaptive triggers, 20h battery";
        priceCents = 7900;
        category = "Gaming";
        imageUrl = "https://images.unsplash.com/photo-1493711662062-fa541adb3fc8";
        rating = 4.7;
        reviewCount = 320;
        stock = 50;
      },
      {
        id = 27;
        name = "Gaming Headset 7.1";
        description = "Surround sound, noise-cancelling mic, 50mm drivers, RGB";
        priceCents = 6900;
        category = "Gaming";
        imageUrl = "https://images.unsplash.com/photo-1583394838336-acd977736f90";
        rating = 4.5;
        reviewCount = 240;
        stock = 38;
      },
      {
        id = 28;
        name = "Gaming Chair ErgoX";
        description = "Ergonomic, lumbar support, 4D armrests, mesh back";
        priceCents = 34900;
        category = "Gaming";
        imageUrl = "https://images.unsplash.com/photo-1598550476439-6847785fcea6";
        rating = 4.4;
        reviewCount = 175;
        stock = 10;
      },
      {
        id = 29;
        name = "RGB Gaming Mouse Pad XL";
        description = "900x400mm, RGB edge lighting, anti-slip";
        priceCents = 2900;
        category = "Gaming";
        imageUrl = "https://images.unsplash.com/photo-1616588589676-62b3bd4ff6d2";
        rating = 4.6;
        reviewCount = 198;
        stock = 65;
      },
      {
        id = 30;
        name = "Portable Gaming Console";
        description = "7\" OLED, 64GB, 8h battery";
        priceCents = 29900;
        category = "Gaming";
        imageUrl = "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3";
        rating = 4.8;
        reviewCount = 410;
        stock = 15;
      },
    ];

    let newProducts = Map.empty<Nat, Product>();

    let fromOld = old.products.entries();
    for ((id, product) in fromOld) {
      newProducts.add(id, product);
    };

    for (product in additionalProducts.values()) {
      newProducts.add(product.id, product);
    };

    { old with products = newProducts };
  };
};
