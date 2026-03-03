import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useGetCart,
  useListProducts,
  usePlaceOrder,
  useRemoveFromCart,
  useUpdateCartItem,
} from "@/hooks/useQueries";
import { formatPrice, getProductImage } from "@/utils/format";
import { clamp } from "@/utils/format";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  AlertCircle,
  ArrowRight,
  Loader2,
  Minus,
  Package,
  Plus,
  ShoppingBag,
  ShoppingCart,
  Trash2,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import type { Product } from "../backend.d";

export function CartPage() {
  const navigate = useNavigate();
  const [placingOrder, setPlacingOrder] = useState(false);

  const { data: cartItems, isLoading: cartLoading } = useGetCart();
  const { data: allProducts, isLoading: productsLoading } = useListProducts();
  const removeFromCart = useRemoveFromCart();
  const updateCartItem = useUpdateCartItem();
  const placeOrder = usePlaceOrder();

  const isLoading = cartLoading || productsLoading;

  // Build enriched cart items
  const enrichedItems = (cartItems ?? []).map((item) => {
    const product = (allProducts ?? []).find(
      (p: Product) => p.id === item.productId,
    );
    return { ...item, product };
  });

  const subtotal = enrichedItems.reduce((sum, item) => {
    if (!item.product) return sum;
    return sum + Number(item.product.priceCents) * Number(item.quantity);
  }, 0);

  const shipping = subtotal > 5000 ? 0 : 499;
  const total = subtotal + shipping;

  const handleRemove = async (productId: bigint, name?: string) => {
    try {
      await removeFromCart.mutateAsync(productId);
      toast.success(`${name ?? "Item"} removed from cart`);
    } catch {
      toast.error("Failed to remove item");
    }
  };

  const handleQuantityChange = async (productId: bigint, newQty: number) => {
    try {
      await updateCartItem.mutateAsync({
        productId,
        quantity: BigInt(clamp(newQty, 1, 10)),
      });
    } catch {
      toast.error("Failed to update quantity");
    }
  };

  const handlePlaceOrder = async () => {
    setPlacingOrder(true);
    try {
      const orderId = await placeOrder.mutateAsync();
      toast.success("Order placed successfully!");
      navigate({
        to: "/order-confirmation/$orderId",
        params: { orderId: orderId.toString() },
      });
    } catch {
      toast.error("Failed to place order. Please sign in first.");
    } finally {
      setPlacingOrder(false);
    }
  };

  if (isLoading) {
    return (
      <main className="max-w-[1400px] mx-auto px-4 py-8 min-h-screen">
        <Skeleton className="h-8 w-40 mb-6 skeleton-shimmer" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {["s1", "s2", "s3"].map((k) => (
              <Skeleton
                key={k}
                className="h-28 w-full rounded-lg skeleton-shimmer"
              />
            ))}
          </div>
          <Skeleton className="h-64 w-full rounded-lg skeleton-shimmer" />
        </div>
      </main>
    );
  }

  if (!enrichedItems.length) {
    return (
      <main className="max-w-[1400px] mx-auto px-4 py-8 min-h-screen">
        <h1 className="font-display font-bold text-2xl text-foreground mb-8">
          Shopping Cart
        </h1>
        <motion.div
          data-ocid="cart.empty_state"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center py-24 rounded-xl border border-border bg-card"
        >
          <ShoppingBag className="w-16 h-16 mb-4 text-muted-foreground" />
          <h2 className="font-display font-bold text-xl text-foreground mb-2">
            Your cart is empty
          </h2>
          <p className="text-sm text-muted-foreground mb-6">
            Add some products to get started!
          </p>
          <Link to="/products" search={{ category: "all", q: "" }}>
            <Button
              style={{
                backgroundColor: "oklch(0.75 0.17 55)",
                color: "oklch(0.1 0.01 260)",
              }}
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              Start Shopping
            </Button>
          </Link>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="max-w-[1400px] mx-auto px-4 py-8 min-h-screen">
      <h1 className="font-display font-bold text-2xl text-foreground mb-6 flex items-center gap-2">
        <ShoppingCart
          className="w-6 h-6"
          style={{ color: "oklch(0.75 0.17 55)" }}
        />
        Shopping Cart
        <Badge
          className="ml-1 text-sm"
          style={{
            backgroundColor: "oklch(0.75 0.17 55)",
            color: "oklch(0.1 0.01 260)",
          }}
        >
          {enrichedItems.length}
        </Badge>
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-3">
          <AnimatePresence>
            {enrichedItems.map((item, idx) => {
              const product = item.product;
              if (!product) return null;
              const imageUrl = getProductImage(
                product.imageUrl,
                product.name,
                200,
              );
              const itemTotal =
                Number(product.priceCents) * Number(item.quantity);

              return (
                <motion.div
                  key={item.productId.toString()}
                  data-ocid={`cart.item.${idx + 1}`}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ delay: idx * 0.05 }}
                  className="flex gap-4 p-4 rounded-xl border border-border bg-card"
                >
                  {/* Image */}
                  <Link
                    to="/products/$id"
                    params={{ id: product.id.toString() }}
                    className="flex-shrink-0"
                  >
                    <div
                      className="w-24 h-24 rounded-lg overflow-hidden border border-border"
                      style={{ backgroundColor: "oklch(0.2 0.02 260)" }}
                    >
                      <img
                        src={imageUrl}
                        alt={product.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = `https://placehold.co/200x200/1a2040/f0a030?text=${encodeURIComponent(product.name.substring(0, 15))}`;
                        }}
                      />
                    </div>
                  </Link>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p
                          className="text-xs font-medium uppercase tracking-wide"
                          style={{ color: "oklch(0.72 0.15 195)" }}
                        >
                          {product.category}
                        </p>
                        <Link
                          to="/products/$id"
                          params={{ id: product.id.toString() }}
                          className="font-display font-semibold text-sm text-foreground hover:text-primary transition-colors line-clamp-2"
                        >
                          {product.name}
                        </Link>
                        <p
                          className="text-sm font-medium mt-1"
                          style={{ color: "oklch(0.6 0.015 260)" }}
                        >
                          {formatPrice(product.priceCents)} each
                        </p>
                      </div>
                      <button
                        type="button"
                        data-ocid={`cart.delete_button.${idx + 1}`}
                        onClick={() =>
                          handleRemove(item.productId, product.name)
                        }
                        className="flex-shrink-0 p-1.5 rounded-lg hover:bg-destructive/20 text-muted-foreground hover:text-destructive transition-colors"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Quantity + subtotal */}
                    <div className="flex items-center justify-between mt-3 gap-4">
                      <div
                        className="flex items-center rounded-lg border overflow-hidden"
                        style={{ borderColor: "oklch(0.28 0.025 260)" }}
                      >
                        <button
                          type="button"
                          onClick={() =>
                            handleQuantityChange(
                              item.productId,
                              Number(item.quantity) - 1,
                            )
                          }
                          disabled={
                            Number(item.quantity) <= 1 ||
                            updateCartItem.isPending
                          }
                          className="w-8 h-8 flex items-center justify-center text-foreground hover:bg-secondary transition-colors disabled:opacity-40"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span
                          className="w-8 text-center font-bold text-sm text-foreground select-none"
                          style={{ backgroundColor: "oklch(0.16 0.02 260)" }}
                        >
                          {item.quantity.toString()}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            handleQuantityChange(
                              item.productId,
                              Number(item.quantity) + 1,
                            )
                          }
                          disabled={
                            Number(item.quantity) >=
                              Math.min(Number(product.stock), 10) ||
                            updateCartItem.isPending
                          }
                          className="w-8 h-8 flex items-center justify-center text-foreground hover:bg-secondary transition-colors disabled:opacity-40"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      <span
                        className="font-display font-bold text-base"
                        style={{ color: "oklch(0.78 0.18 55)" }}
                      >
                        {formatPrice(itemTotal)}
                      </span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-xl border border-border bg-card p-6 sticky top-24"
          >
            <h2 className="font-display font-bold text-lg text-foreground mb-4">
              Order Summary
            </h2>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>
                  Subtotal ({enrichedItems.length} item
                  {enrichedItems.length !== 1 ? "s" : ""})
                </span>
                <span className="font-semibold text-foreground">
                  {formatPrice(subtotal)}
                </span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Shipping</span>
                <span className="font-semibold text-foreground">
                  {shipping === 0 ? (
                    <span style={{ color: "oklch(0.68 0.16 145)" }}>FREE</span>
                  ) : (
                    formatPrice(shipping)
                  )}
                </span>
              </div>
              {shipping > 0 && (
                <p
                  className="text-xs"
                  style={{ color: "oklch(0.72 0.15 195)" }}
                >
                  Add {formatPrice(5000 - subtotal)} more for free shipping!
                </p>
              )}
            </div>

            <Separator
              className="my-4"
              style={{ backgroundColor: "oklch(0.28 0.025 260)" }}
            />

            <div className="flex justify-between text-base font-bold mb-6">
              <span className="text-foreground">Total</span>
              <span style={{ color: "oklch(0.78 0.18 55)" }}>
                {formatPrice(total)}
              </span>
            </div>

            <Button
              data-ocid="cart.checkout_button"
              size="lg"
              className="w-full font-bold text-base"
              onClick={handlePlaceOrder}
              disabled={placingOrder}
              style={{
                backgroundColor: "oklch(0.75 0.17 55)",
                color: "oklch(0.1 0.01 260)",
              }}
            >
              {placingOrder ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Placing Order...
                </>
              ) : (
                <>
                  Proceed to Checkout
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>

            <div className="flex items-center gap-1.5 mt-3 text-xs text-muted-foreground justify-center">
              <Package className="w-3.5 h-3.5" />
              <span>Secure checkout</span>
            </div>

            <Separator
              className="my-4"
              style={{ backgroundColor: "oklch(0.28 0.025 260)" }}
            />

            <Link to="/products" search={{ category: "all", q: "" }}>
              <Button
                variant="ghost"
                className="w-full text-sm text-muted-foreground hover:text-foreground"
              >
                ← Continue Shopping
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
