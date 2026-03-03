import { StarRating } from "@/components/StarRating";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useAddToCart, useGetProduct } from "@/hooks/useQueries";
import { formatPrice, getProductImage } from "@/utils/format";
import { clamp } from "@/utils/format";
import { Link, useParams } from "@tanstack/react-router";
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle,
  Loader2,
  Minus,
  Package,
  Plus,
  ShoppingCart,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";

export function ProductDetailPage() {
  const { id } = useParams({ from: "/products/$id" });
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);

  const productId = BigInt(id);
  const { data: product, isLoading, isError } = useGetProduct(productId);
  const addToCart = useAddToCart();

  const maxQuantity = product ? Math.min(Number(product.stock), 10) : 10;

  const handleAddToCart = async () => {
    if (!product) return;
    setIsAdding(true);
    try {
      await addToCart.mutateAsync({
        productId: product.id,
        quantity: BigInt(quantity),
      });
      toast.success(`${product.name} added to cart!`);
    } catch {
      toast.error("Failed to add item. Please sign in first.");
    } finally {
      setIsAdding(false);
    }
  };

  if (isLoading) {
    return (
      <main className="max-w-[1400px] mx-auto px-4 py-8">
        <Skeleton className="h-4 w-32 mb-6 skeleton-shimmer" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16">
          <Skeleton className="aspect-square rounded-xl skeleton-shimmer" />
          <div className="space-y-4">
            <Skeleton className="h-6 w-24 skeleton-shimmer" />
            <Skeleton className="h-8 w-full skeleton-shimmer" />
            <Skeleton className="h-8 w-3/4 skeleton-shimmer" />
            <Skeleton className="h-5 w-40 skeleton-shimmer" />
            <Skeleton className="h-10 w-32 skeleton-shimmer" />
            <Skeleton className="h-px w-full skeleton-shimmer" />
            <Skeleton className="h-20 w-full skeleton-shimmer" />
            <Skeleton className="h-12 w-full skeleton-shimmer" />
          </div>
        </div>
      </main>
    );
  }

  if (isError || !product) {
    return (
      <main className="max-w-[1400px] mx-auto px-4 py-8 flex flex-col items-center justify-center min-h-[50vh]">
        <AlertCircle
          className="w-12 h-12 mb-4"
          style={{ color: "oklch(0.62 0.22 25)" }}
        />
        <h2 className="font-display font-bold text-xl text-foreground mb-2">
          Product Not Found
        </h2>
        <p className="text-sm text-muted-foreground mb-6">
          This product may have been removed or doesn't exist.
        </p>
        <Link to="/products" search={{ category: "all", q: "" }}>
          <Button
            style={{
              backgroundColor: "oklch(0.75 0.17 55)",
              color: "oklch(0.1 0.01 260)",
            }}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Products
          </Button>
        </Link>
      </main>
    );
  }

  const imageUrl = getProductImage(product.imageUrl, product.name, 600);
  const isInStock = Number(product.stock) > 0;
  const isLowStock = isInStock && Number(product.stock) <= 5;

  return (
    <main className="max-w-[1400px] mx-auto px-4 py-8 min-h-screen">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <Link to="/" className="hover:text-foreground transition-colors">
          Home
        </Link>
        <span>/</span>
        <Link
          to="/products"
          search={{ category: product.category, q: "" }}
          className="hover:text-foreground transition-colors"
        >
          {product.category}
        </Link>
        <span>/</span>
        <span className="text-foreground truncate max-w-xs">
          {product.name}
        </span>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16">
        {/* Product image */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="relative"
        >
          <div
            className="rounded-xl overflow-hidden border border-border aspect-square"
            style={{ backgroundColor: "oklch(0.16 0.02 260)" }}
          >
            <img
              src={imageUrl}
              alt={product.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = `https://placehold.co/600x600/1a2040/f0a030?text=${encodeURIComponent(product.name.substring(0, 20))}`;
              }}
            />
          </div>
          {!isInStock && (
            <div className="absolute inset-0 rounded-xl bg-background/70 flex items-center justify-center">
              <Badge
                variant="destructive"
                className="text-base px-4 py-2 font-bold"
              >
                Out of Stock
              </Badge>
            </div>
          )}
        </motion.div>

        {/* Product details */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="flex flex-col gap-4"
        >
          {/* Category badge */}
          <Badge
            variant="secondary"
            className="w-fit text-xs font-semibold"
            style={{
              backgroundColor: "oklch(0.72 0.15 195 / 0.15)",
              color: "oklch(0.72 0.15 195)",
              borderColor: "oklch(0.72 0.15 195 / 0.3)",
            }}
          >
            {product.category}
          </Badge>

          {/* Product name */}
          <h1 className="font-display font-bold text-2xl md:text-3xl text-foreground leading-tight">
            {product.name}
          </h1>

          {/* Rating */}
          <StarRating
            rating={product.rating}
            reviewCount={product.reviewCount}
            size="md"
          />

          {/* Price */}
          <div>
            <span
              className="font-display font-black text-3xl"
              style={{ color: "oklch(0.78 0.18 55)" }}
            >
              {formatPrice(product.priceCents)}
            </span>
          </div>

          <Separator style={{ backgroundColor: "oklch(0.28 0.025 260)" }} />

          {/* Description */}
          <div>
            <h3 className="font-display font-semibold text-sm text-foreground mb-2 uppercase tracking-wide">
              Description
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Stock info */}
          <div className="flex items-center gap-2">
            {isInStock ? (
              <>
                <CheckCircle
                  className="w-4 h-4"
                  style={{ color: "oklch(0.68 0.16 145)" }}
                />
                <span
                  className="text-sm font-semibold"
                  style={{ color: "oklch(0.68 0.16 145)" }}
                >
                  {isLowStock
                    ? `Only ${product.stock.toString()} left in stock!`
                    : "In Stock"}
                </span>
              </>
            ) : (
              <>
                <AlertCircle
                  className="w-4 h-4"
                  style={{ color: "oklch(0.62 0.22 25)" }}
                />
                <span
                  className="text-sm font-semibold"
                  style={{ color: "oklch(0.62 0.22 25)" }}
                >
                  Out of Stock
                </span>
              </>
            )}
          </div>

          {/* Quantity selector */}
          {isInStock && (
            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold text-foreground">
                Quantity:
              </span>
              <div
                className="flex items-center rounded-lg border overflow-hidden"
                style={{ borderColor: "oklch(0.28 0.025 260)" }}
              >
                <button
                  type="button"
                  data-ocid="product.quantity_input"
                  onClick={() =>
                    setQuantity((q) => clamp(q - 1, 1, maxQuantity))
                  }
                  className="w-9 h-9 flex items-center justify-center text-foreground hover:bg-secondary transition-colors"
                  disabled={quantity <= 1}
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span
                  className="w-10 text-center font-display font-bold text-sm text-foreground select-none"
                  style={{ backgroundColor: "oklch(0.16 0.02 260)" }}
                >
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    setQuantity((q) => clamp(q + 1, 1, maxQuantity))
                  }
                  className="w-9 h-9 flex items-center justify-center text-foreground hover:bg-secondary transition-colors"
                  disabled={quantity >= maxQuantity}
                  aria-label="Increase quantity"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
              {isLowStock && (
                <span
                  className="text-xs"
                  style={{ color: "oklch(0.62 0.22 25)" }}
                >
                  Max {maxQuantity}
                </span>
              )}
            </div>
          )}

          {/* Add to cart */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              data-ocid="product.add_button"
              size="lg"
              className="flex-1 font-semibold"
              disabled={!isInStock || isAdding}
              onClick={handleAddToCart}
              style={
                isInStock
                  ? {
                      backgroundColor: "oklch(0.75 0.17 55)",
                      color: "oklch(0.1 0.01 260)",
                    }
                  : {}
              }
            >
              {isAdding ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Adding...
                </>
              ) : (
                <>
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  {isInStock ? "Add to Cart" : "Out of Stock"}
                </>
              )}
            </Button>
            <Link to="/cart" className="sm:w-auto">
              <Button
                variant="outline"
                size="lg"
                className="w-full border-border text-foreground hover:bg-secondary font-semibold"
              >
                <Package className="w-4 h-4 mr-2" />
                View Cart
              </Button>
            </Link>
          </div>

          {/* Delivery info */}
          <div
            className="rounded-lg p-4 border border-border text-sm"
            style={{ backgroundColor: "oklch(0.16 0.02 260)" }}
          >
            <div className="flex items-start gap-2 mb-2">
              <Package
                className="w-4 h-4 mt-0.5 flex-shrink-0"
                style={{ color: "oklch(0.75 0.17 55)" }}
              />
              <div>
                <p className="font-semibold text-foreground">
                  Free delivery on orders over $50
                </p>
                <p className="text-muted-foreground text-xs mt-0.5">
                  Usually ships within 1–2 business days
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
