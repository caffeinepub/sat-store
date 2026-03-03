import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetUserOrders } from "@/hooks/useQueries";
import { formatPrice, formatTimestamp, getProductImage } from "@/utils/format";
import { Link } from "@tanstack/react-router";
import {
  AlertCircle,
  ArrowRight,
  CheckCircle,
  Clock,
  Package,
  ShoppingBag,
  Truck,
} from "lucide-react";
import { motion } from "motion/react";
import { OrderStatus } from "../backend.d";

const STATUS_CONFIG: Record<
  OrderStatus,
  { label: string; color: string; icon: typeof Clock }
> = {
  [OrderStatus.pending]: {
    label: "Pending",
    color: "oklch(0.75 0.17 55)",
    icon: Clock,
  },
  [OrderStatus.confirmed]: {
    label: "Confirmed",
    color: "oklch(0.72 0.15 195)",
    icon: CheckCircle,
  },
  [OrderStatus.shipped]: {
    label: "Shipped",
    color: "oklch(0.7 0.14 145)",
    icon: Truck,
  },
  [OrderStatus.delivered]: {
    label: "Delivered",
    color: "oklch(0.68 0.16 145)",
    icon: CheckCircle,
  },
};

export function OrdersPage() {
  const { data: orders, isLoading, isError } = useGetUserOrders();

  if (isLoading) {
    return (
      <main className="max-w-3xl mx-auto px-4 py-8 min-h-screen">
        <Skeleton className="h-8 w-40 mb-6 skeleton-shimmer" />
        <div className="space-y-4">
          {["o1", "o2", "o3"].map((k) => (
            <Skeleton
              key={k}
              className="h-36 w-full rounded-xl skeleton-shimmer"
            />
          ))}
        </div>
      </main>
    );
  }

  if (isError) {
    return (
      <main className="max-w-3xl mx-auto px-4 py-8 min-h-screen flex flex-col items-center justify-center">
        <AlertCircle
          className="w-12 h-12 mb-4"
          style={{ color: "oklch(0.62 0.22 25)" }}
        />
        <h2 className="font-display font-bold text-xl text-foreground mb-2">
          Unable to load orders
        </h2>
        <p className="text-sm text-muted-foreground mb-6">
          Please sign in to view your orders.
        </p>
        <Link to="/">
          <Button
            style={{
              backgroundColor: "oklch(0.75 0.17 55)",
              color: "oklch(0.1 0.01 260)",
            }}
          >
            Go Home
          </Button>
        </Link>
      </main>
    );
  }

  return (
    <main className="max-w-3xl mx-auto px-4 py-8 min-h-screen">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display font-bold text-2xl text-foreground flex items-center gap-2">
          <Package
            className="w-6 h-6"
            style={{ color: "oklch(0.75 0.17 55)" }}
          />
          My Orders
        </h1>
        {orders && orders.length > 0 && (
          <Badge
            className="font-semibold"
            style={{
              backgroundColor: "oklch(0.22 0.025 260)",
              color: "oklch(0.96 0.008 260)",
            }}
          >
            {orders.length} order{orders.length !== 1 ? "s" : ""}
          </Badge>
        )}
      </div>

      {!orders || orders.length === 0 ? (
        <motion.div
          data-ocid="orders.empty_state"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center py-24 rounded-xl border border-border bg-card"
        >
          <ShoppingBag className="w-16 h-16 mb-4 text-muted-foreground" />
          <h2 className="font-display font-bold text-xl text-foreground mb-2">
            No orders yet
          </h2>
          <p className="text-sm text-muted-foreground mb-6">
            Start shopping to place your first order!
          </p>
          <Link to="/products" search={{ category: "all", q: "" }}>
            <Button
              style={{
                backgroundColor: "oklch(0.75 0.17 55)",
                color: "oklch(0.1 0.01 260)",
              }}
            >
              <ShoppingBag className="w-4 h-4 mr-2" />
              Browse Products
            </Button>
          </Link>
        </motion.div>
      ) : (
        <div className="space-y-4">
          {[...orders].reverse().map((order, idx) => {
            const config =
              STATUS_CONFIG[order.status] ?? STATUS_CONFIG[OrderStatus.pending];
            const StatusIcon = config.icon;

            return (
              <motion.div
                key={order.id.toString()}
                data-ocid={`orders.item.${idx + 1}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.06 }}
                className="rounded-xl border border-border bg-card overflow-hidden"
              >
                {/* Order header */}
                <div
                  className="flex items-center justify-between px-5 py-3 border-b"
                  style={{
                    backgroundColor: "oklch(0.14 0.018 260)",
                    borderColor: "oklch(0.28 0.025 260)",
                  }}
                >
                  <div className="flex items-center gap-4 flex-wrap">
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wide font-semibold">
                        Order #
                      </p>
                      <p className="font-display font-bold text-sm text-foreground">
                        {order.id.toString()}
                      </p>
                    </div>
                    <div className="hidden sm:block">
                      <p className="text-xs text-muted-foreground uppercase tracking-wide font-semibold">
                        Placed
                      </p>
                      <p className="text-sm text-foreground font-medium">
                        {formatTimestamp(order.timestamp)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wide font-semibold">
                        Total
                      </p>
                      <p
                        className="font-display font-bold text-sm"
                        style={{ color: "oklch(0.78 0.18 55)" }}
                      >
                        {formatPrice(order.totalAmountCents)}
                      </p>
                    </div>
                  </div>
                  <Badge
                    className="font-semibold flex items-center gap-1.5 flex-shrink-0"
                    style={{
                      backgroundColor: `${config.color}`.replace(
                        ")",
                        " / 0.15)",
                      ),
                      color: config.color,
                      borderColor: `${config.color}`.replace(")", " / 0.3)"),
                    }}
                  >
                    <StatusIcon className="w-3 h-3" />
                    {config.label}
                  </Badge>
                </div>

                {/* Order items preview */}
                <div className="p-4">
                  {order.items.length > 0 ? (
                    <div className="flex flex-col gap-3">
                      {order.items.slice(0, 3).map((item, iIdx) => {
                        const imageUrl = getProductImage(
                          item.product.imageUrl,
                          item.product.name,
                          80,
                        );
                        return (
                          <div
                            key={`oi-${item.product.id.toString()}-${iIdx}`}
                            className="flex items-center gap-3"
                          >
                            <div
                              className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 border border-border"
                              style={{ backgroundColor: "oklch(0.2 0.02 260)" }}
                            >
                              <img
                                src={imageUrl}
                                alt={item.product.name}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.currentTarget.src = `https://placehold.co/80x80/1a2040/f0a030?text=${encodeURIComponent(item.product.name.substring(0, 10))}`;
                                }}
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold text-foreground truncate">
                                {item.product.name}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                Qty: {item.quantity.toString()} ×{" "}
                                {formatPrice(item.product.priceCents)}
                              </p>
                            </div>
                            <span
                              className="font-display font-bold text-sm flex-shrink-0"
                              style={{ color: "oklch(0.78 0.18 55)" }}
                            >
                              {formatPrice(item.totalPriceCents)}
                            </span>
                          </div>
                        );
                      })}
                      {order.items.length > 3 && (
                        <p className="text-xs text-muted-foreground ml-13 pl-13">
                          +{order.items.length - 3} more item
                          {order.items.length - 3 !== 1 ? "s" : ""}
                        </p>
                      )}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      No item details available.
                    </p>
                  )}

                  <Separator
                    className="my-3"
                    style={{ backgroundColor: "oklch(0.28 0.025 260)" }}
                  />

                  <div className="flex items-center justify-between">
                    <p className="text-xs text-muted-foreground sm:hidden">
                      {formatTimestamp(order.timestamp)}
                    </p>
                    <Link
                      to="/order-confirmation/$orderId"
                      params={{ orderId: order.id.toString() }}
                      className="ml-auto"
                      data-ocid={`orders.item.${idx + 1}`}
                    >
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs border-border text-foreground hover:bg-secondary font-semibold"
                      >
                        View Details
                        <ArrowRight className="w-3 h-3 ml-1.5" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </main>
  );
}
