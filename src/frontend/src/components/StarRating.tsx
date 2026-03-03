import { cn } from "@/lib/utils";
import { Star, StarHalf } from "lucide-react";

interface StarRatingProps {
  rating: number;
  reviewCount?: bigint | number;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function StarRating({
  rating,
  reviewCount,
  size = "sm",
  className,
}: StarRatingProps) {
  const sizeClasses = {
    sm: "w-3.5 h-3.5",
    md: "w-4 h-4",
    lg: "w-5 h-5",
  };
  const textClasses = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
  };

  const stars = Array.from({ length: 5 }, (_, i) => {
    const filled = i + 1 <= Math.floor(rating);
    const half = !filled && i < rating && rating - i >= 0.5;
    return { filled, half, pos: i };
  });

  return (
    <div className={cn("flex items-center gap-1", className)}>
      <div className="flex items-center gap-0.5">
        {stars.map((star) => (
          <span key={`star-${star.pos}`} className="text-star">
            {star.filled ? (
              <Star
                className={cn(sizeClasses[size], "fill-current")}
                style={{ color: "oklch(0.78 0.18 55)" }}
              />
            ) : star.half ? (
              <StarHalf
                className={cn(sizeClasses[size], "fill-current")}
                style={{ color: "oklch(0.78 0.18 55)" }}
              />
            ) : (
              <Star
                className={cn(sizeClasses[size])}
                style={{ color: "oklch(0.4 0.015 260)" }}
              />
            )}
          </span>
        ))}
      </div>
      {reviewCount !== undefined && (
        <span
          className={cn(textClasses[size], "text-muted-foreground")}
          style={{ color: "oklch(0.65 0.015 200)" }}
        >
          (
          {typeof reviewCount === "bigint"
            ? reviewCount.toString()
            : reviewCount}
          )
        </span>
      )}
    </div>
  );
}
