import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { formatPrice, getProductImage } from "@/utils/format";
import { Link } from "@tanstack/react-router";
import { Loader2, ShoppingCart } from "lucide-react";
import type { Product } from "../backend.d";
import { StarRating } from "./StarRating";

interface ProductCardProps {
  product: Product;
  index: number;
  onAddToCart?: (product: Product) => void;
  isAddingToCart?: boolean;
  className?: string;
}

export function ProductCard({
  product,
  index,
  onAddToCart,
  isAddingToCart,
  className,
}: ProductCardProps) {
  const imageUrl = getProductImage(product.imageUrl, product.name, 400);

  return (
    <div
      data-ocid={`products.item.${index}`}
      className={cn(
        "group relative flex flex-col rounded-lg overflow-hidden product-card-hover",
        "bg-card border border-border",
        className,
      )}
    >
      {/* Product image */}
      <Link
        to="/products/$id"
        params={{ id: product.id.toString() }}
        className="block"
      >
        <div className="relative aspect-square overflow-hidden bg-secondary">
          <img
            src={imageUrl}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={(e) => {
              const target = e.currentTarget;
              target.src = `https://placehold.co/400x400/1a2040/f0a030?text=${encodeURIComponent(product.name.substring(0, 15))}`;
            }}
          />
          {Number(product.stock) === 0 && (
            <div className="absolute inset-0 bg-background/70 flex items-center justify-center">
              <Badge variant="destructive" className="text-sm font-semibold">
                Out of Stock
              </Badge>
            </div>
          )}
          {Number(product.stock) > 0 && Number(product.stock) <= 5 && (
            <div className="absolute top-2 left-2">
              <Badge
                className="text-xs font-semibold"
                style={{
                  backgroundColor: "oklch(0.62 0.22 25)",
                  color: "oklch(0.98 0 0)",
                }}
              >
                Only {product.stock.toString()} left!
              </Badge>
            </div>
          )}
        </div>
      </Link>

      {/* Product info */}
      <div className="flex flex-col flex-1 p-3 gap-2">
        <Link
          to="/products/$id"
          params={{ id: product.id.toString() }}
          data-ocid={`products.item.${index}`}
          className="block"
        >
          <p
            className="text-xs font-medium uppercase tracking-wide"
            style={{ color: "oklch(0.72 0.15 195)" }}
          >
            {product.category}
          </p>
          <h3 className="font-display font-semibold text-sm leading-snug mt-0.5 line-clamp-2 text-foreground hover:text-primary transition-colors">
            {product.name}
          </h3>
        </Link>

        <StarRating
          rating={product.rating}
          reviewCount={product.reviewCount}
          size="sm"
        />

        <div className="flex items-center justify-between mt-auto pt-1">
          <span
            className="font-display font-bold text-lg"
            style={{ color: "oklch(0.78 0.18 55)" }}
          >
            {formatPrice(product.priceCents)}
          </span>
        </div>

        <Button
          data-ocid={`products.add_button.${index}`}
          size="sm"
          className="w-full font-semibold mt-1"
          style={{
            backgroundColor: "oklch(0.75 0.17 55)",
            color: "oklch(0.1 0.01 260)",
          }}
          disabled={Number(product.stock) === 0 || isAddingToCart}
          onClick={() => onAddToCart?.(product)}
        >
          {isAddingToCart ? (
            <>
              <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
              Adding...
            </>
          ) : (
            <>
              <ShoppingCart className="w-3.5 h-3.5 mr-1.5" />
              Add to Cart
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="rounded-lg overflow-hidden bg-card border border-border">
      <Skeleton className="aspect-square w-full skeleton-shimmer" />
      <div className="p-3 space-y-2">
        <Skeleton className="h-3 w-16 skeleton-shimmer" />
        <Skeleton className="h-4 w-full skeleton-shimmer" />
        <Skeleton className="h-4 w-3/4 skeleton-shimmer" />
        <Skeleton className="h-3 w-24 skeleton-shimmer" />
        <Skeleton className="h-6 w-20 skeleton-shimmer" />
        <Skeleton className="h-8 w-full skeleton-shimmer" />
      </div>
    </div>
  );
}
