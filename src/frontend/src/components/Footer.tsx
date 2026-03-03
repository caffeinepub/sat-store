import { Link } from "@tanstack/react-router";
import { Heart } from "lucide-react";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      className="border-t border-border mt-auto"
      style={{ backgroundColor: "oklch(0.09 0.015 260)" }}
    >
      <div className="max-w-[1400px] mx-auto px-4 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div
                className="w-8 h-8 rounded flex items-center justify-center font-display font-black text-sm"
                style={{
                  backgroundColor: "oklch(0.75 0.17 55)",
                  color: "oklch(0.1 0.01 260)",
                }}
              >
                S
              </div>
              <span className="font-display font-bold text-foreground">
                SAT<span style={{ color: "oklch(0.75 0.17 55)" }}>Store</span>
              </span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Your one-stop shop for everything you need, delivered fast and
              reliably.
            </p>
          </div>

          {/* Shop */}
          <div>
            <h4 className="font-display font-semibold text-sm text-foreground mb-3 uppercase tracking-wider">
              Shop
            </h4>
            <ul className="space-y-2">
              {[
                { label: "Electronics", value: "Electronics" },
                { label: "Clothing", value: "Clothing" },
                { label: "Books", value: "Books" },
                { label: "Home & Kitchen", value: "Home & Kitchen" },
              ].map((cat) => (
                <li key={cat.value}>
                  <Link
                    to="/products"
                    search={{ category: cat.value, q: "" }}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {cat.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Account */}
          <div>
            <h4 className="font-display font-semibold text-sm text-foreground mb-3 uppercase tracking-wider">
              Account
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/orders"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  My Orders
                </Link>
              </li>
              <li>
                <Link
                  to="/cart"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  My Cart
                </Link>
              </li>
            </ul>
          </div>

          {/* Info */}
          <div>
            <h4 className="font-display font-semibold text-sm text-foreground mb-3 uppercase tracking-wider">
              Info
            </h4>
            <ul className="space-y-2">
              <li>
                <span className="text-sm text-muted-foreground">
                  Fast Delivery
                </span>
              </li>
              <li>
                <span className="text-sm text-muted-foreground">
                  Secure Payments
                </span>
              </li>
              <li>
                <span className="text-sm text-muted-foreground">
                  Easy Returns
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div
          className="border-t pt-6 flex flex-col sm:flex-row items-center justify-between gap-3"
          style={{ borderColor: "oklch(0.28 0.025 260)" }}
        >
          <p className="text-xs text-muted-foreground">
            &copy; {year} SAT Store. All rights reserved.
          </p>
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
          >
            Built with{" "}
            <Heart
              className="w-3 h-3 fill-current"
              style={{ color: "oklch(0.62 0.22 25)" }}
            />{" "}
            using caffeine.ai
          </a>
        </div>
      </div>
    </footer>
  );
}
