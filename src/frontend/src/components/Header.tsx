import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useInternetIdentity } from "@/hooks/useInternetIdentity";
import { useGetCart } from "@/hooks/useQueries";
import { cn } from "@/lib/utils";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  LogIn,
  LogOut,
  Menu,
  Package,
  Search,
  ShoppingCart,
  X,
} from "lucide-react";
import { useState } from "react";

export function Header() {
  const [searchValue, setSearchValue] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { data: cartItems } = useGetCart();
  const { login, clear, loginStatus, identity } = useInternetIdentity();

  const cartCount =
    cartItems?.reduce((sum, item) => sum + Number(item.quantity), 0) ?? 0;
  const isLoggedIn = !!identity;
  const isLoggingIn = loginStatus === "logging-in";

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim()) {
      navigate({
        to: "/products",
        search: { q: searchValue.trim(), category: "all" },
      });
      setMobileMenuOpen(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch(e as unknown as React.FormEvent);
    }
  };

  return (
    <header
      className="sticky top-0 z-50 border-b border-border"
      style={{ backgroundColor: "oklch(0.09 0.015 260)" }}
    >
      {/* Main header row */}
      <div className="flex items-center gap-2 px-4 py-2.5 max-w-[1400px] mx-auto">
        {/* Logo */}
        <Link
          to="/"
          data-ocid="header.link"
          className="flex-shrink-0 flex items-center gap-1.5 mr-2"
        >
          <div
            className="flex items-center justify-center w-8 h-8 rounded font-display font-black text-sm"
            style={{
              backgroundColor: "oklch(0.75 0.17 55)",
              color: "oklch(0.1 0.01 260)",
            }}
          >
            S
          </div>
          <span className="font-display font-bold text-base hidden sm:block text-foreground">
            SAT<span style={{ color: "oklch(0.75 0.17 55)" }}>Store</span>
          </span>
        </Link>

        {/* Search bar - desktop */}
        <form
          onSubmit={handleSearch}
          className="flex-1 hidden sm:flex items-center"
        >
          <div className="relative w-full max-w-2xl">
            <Input
              data-ocid="header.search_input"
              type="search"
              placeholder="Search products..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onKeyDown={handleKeyDown}
              className="header-search pr-12 h-10 rounded-lg border-0 text-sm font-body focus-visible:ring-2"
              style={{
                backgroundColor: "oklch(0.97 0.005 260)",
                color: "oklch(0.1 0.01 260)",
              }}
            />
            <button
              type="submit"
              className="absolute right-0 top-0 h-10 px-3 rounded-r-lg flex items-center justify-center transition-colors"
              style={{
                backgroundColor: "oklch(0.75 0.17 55)",
                color: "oklch(0.1 0.01 260)",
              }}
            >
              <Search className="w-4 h-4" />
            </button>
          </div>
        </form>

        {/* Right actions */}
        <div className="flex items-center gap-1 ml-auto sm:ml-0">
          {/* My Orders */}
          <Link to="/orders" data-ocid="header.orders_link">
            <Button
              variant="ghost"
              size="sm"
              className="hidden sm:flex items-center gap-1.5 text-foreground hover:text-primary hover:bg-secondary text-sm"
            >
              <Package className="w-4 h-4" />
              <span className="hidden md:inline">My Orders</span>
            </Button>
          </Link>

          {/* Cart */}
          <Link to="/cart" data-ocid="header.cart_button">
            <Button
              variant="ghost"
              size="sm"
              className="relative text-foreground hover:text-primary hover:bg-secondary"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <Badge
                  className="absolute -top-1 -right-1 min-w-[18px] h-[18px] text-[10px] p-0 flex items-center justify-center rounded-full font-bold"
                  style={{
                    backgroundColor: "oklch(0.75 0.17 55)",
                    color: "oklch(0.1 0.01 260)",
                  }}
                >
                  {cartCount > 99 ? "99+" : cartCount}
                </Badge>
              )}
            </Button>
          </Link>

          {/* Login/logout */}
          {isLoggedIn ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => clear()}
              className="hidden sm:flex items-center gap-1.5 text-foreground hover:text-primary hover:bg-secondary text-sm"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden md:inline">Logout</span>
            </Button>
          ) : (
            <Button
              size="sm"
              onClick={() => login()}
              disabled={isLoggingIn}
              className="hidden sm:flex items-center gap-1.5 font-semibold text-sm"
              style={{
                backgroundColor: "oklch(0.75 0.17 55)",
                color: "oklch(0.1 0.01 260)",
              }}
            >
              <LogIn className="w-4 h-4" />
              <span>{isLoggingIn ? "Signing in..." : "Sign In"}</span>
            </Button>
          )}

          {/* Mobile menu toggle */}
          <Button
            variant="ghost"
            size="sm"
            className="sm:hidden text-foreground"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile search + menu */}
      {mobileMenuOpen && (
        <div
          className="sm:hidden border-t border-border px-4 py-3 space-y-3"
          style={{ backgroundColor: "oklch(0.09 0.015 260)" }}
        >
          <form onSubmit={handleSearch} className="flex items-center gap-2">
            <Input
              type="search"
              placeholder="Search products..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 h-9 text-sm"
              style={{
                backgroundColor: "oklch(0.97 0.005 260)",
                color: "oklch(0.1 0.01 260)",
              }}
            />
            <Button
              type="submit"
              size="sm"
              style={{
                backgroundColor: "oklch(0.75 0.17 55)",
                color: "oklch(0.1 0.01 260)",
              }}
            >
              <Search className="w-4 h-4" />
            </Button>
          </form>
          <div className="flex items-center gap-2">
            <Link
              to="/orders"
              className="flex items-center gap-1.5 text-sm text-foreground"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Package className="w-4 h-4" />
              My Orders
            </Link>
            <span className="text-border">|</span>
            {isLoggedIn ? (
              <button
                type="button"
                onClick={() => {
                  clear();
                  setMobileMenuOpen(false);
                }}
                className="flex items-center gap-1.5 text-sm text-foreground"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  login();
                  setMobileMenuOpen(false);
                }}
                className="flex items-center gap-1.5 text-sm font-semibold"
                style={{ color: "oklch(0.75 0.17 55)" }}
                disabled={isLoggingIn}
              >
                <LogIn className="w-4 h-4" />
                {isLoggingIn ? "Signing in..." : "Sign In"}
              </button>
            )}
          </div>
        </div>
      )}

      {/* Category nav bar */}
      <nav
        className="border-t border-border"
        style={{ backgroundColor: "oklch(0.11 0.016 260)" }}
      >
        <div className="max-w-[1400px] mx-auto px-4">
          <div
            className={cn(
              "flex items-center gap-0 overflow-x-auto scrollbar-thin",
            )}
          >
            {[
              { label: "All", value: "all" },
              { label: "Electronics", value: "Electronics" },
              { label: "Clothing", value: "Clothing" },
              { label: "Books", value: "Books" },
              { label: "Home & Kitchen", value: "Home & Kitchen" },
              { label: "Sports", value: "Sports" },
              { label: "Toys", value: "Toys" },
            ].map((cat) => (
              <Link
                key={cat.value}
                to="/products"
                search={{ category: cat.value, q: "" }}
                data-ocid={`header.${cat.value.toLowerCase().replace(/ & /g, "_").replace(/ /g, "_")}.link`}
                className="flex-shrink-0 px-3 py-2 text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors whitespace-nowrap"
              >
                {cat.label}
              </Link>
            ))}
          </div>
        </div>
      </nav>
    </header>
  );
}
