import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetOrder } from "@/hooks/useQueries";
import { formatPrice, formatTimestamp, getProductImage } from "@/utils/format";
import { Link, useParams } from "@tanstack/react-router";
import { ArrowRight, CheckCircle, Clock, Package } from "lucide-react";
import { motion } from "motion/react";
import { OrderStatus } from "../backend.d";

const STATUS_LABELS: Record<OrderStatus, string> = {
  [OrderStatus.pending]: "Pending",
  [OrderStatus.confirmed]: "Confirmed",
  [OrderStatus.shipped]: "Shipped",
  [OrderStatus.delivered]: "Delivered",
};

const STATUS_COLORS: Record<OrderStatus, string> = {
  [OrderStatus.pending]: "oklch(0.75 0.17 55)",
  [OrderStatus.confirmed]: "oklch(0.72 0.15 195)",
  [OrderStatus.shipped]: "oklch(0.68 0.16 145)",
  [OrderStatus.delivered]: "oklch(0.68 0.16 145)",
};

export function OrderConfirmationPage() {
  const { orderId } = useParams({ from: "/order-confirmation/$orderId" });
  const orderIdBig = BigInt(orderId);
  const { data: order, isLoading, isError } = useGetOrder(orderIdBig);

  if (isLoading) {
    return (
      <main className="max-w-2xl mx-auto px-4 py-12 min-h-screen">
        <Skeleton className="h-16 w-16 rounded-full mx-auto mb-4 skeleton-shimmer" />
        <Skeleton className="h-8 w-64 mx-auto mb-2 skeleton-shimmer" />
        <Skeleton className="h-4 w-48 mx-auto mb-8 skeleton-shimmer" />
        <Skeleton className="h-64 w-full rounded-xl skeleton-shimmer" />
      </main>
    );
  }

  return (
    <main className="max-w-2xl mx-auto px-4 py-12 min-h-screen">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="text-center mb-10"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{
            delay: 0.15,
            type: "spring",
            stiffness: 200,
            damping: 15,
          }}
          className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
          style={{ backgroundColor: "oklch(0.68 0.16 145 / 0.15)" }}
        >
          <CheckCircle
            className="w-9 h-9"
            style={{ color: "oklch(0.68 0.16 145)" }}
          />
        </motion.div>
        <h1 className="font-display font-black text-3xl text-foreground mb-2">
          Order Confirmed!
        </h1>
        <p className="text-muted-foreground text-sm">
          Thank you for your order. We're preparing it for shipment.
        </p>
      </motion.div>

      {/* Order details card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="rounded-xl border border-border bg-card p-6 mb-6"
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-xs text-muted-foreground mb-0.5 uppercase tracking-wide font-semibold">
              Order ID
            </p>
            <p className="font-display font-bold text-lg text-foreground">
              #{orderId}
            </p>
          </div>
          {order && (
            <Badge
              className="font-semibold text-sm px-3 py-1"
              style={{
                backgroundColor: `${STATUS_COLORS[order.status]} / 0.15`,
                color: STATUS_COLORS[order.status],
                borderColor: `${STATUS_COLORS[order.status]} / 0.3`,
              }}
            >
              {STATUS_LABELS[order.status]}
            </Badge>
          )}
        </div>

        {order && (
          <p className="text-xs text-muted-foreground mb-4">
            Placed on {formatTimestamp(order.timestamp)}
          </p>
        )}

        <Separator
          className="mb-4"
          style={{ backgroundColor: "oklch(0.28 0.025 260)" }}
        />

        {/* Estimated delivery */}
        <div
          className="flex items-center gap-3 rounded-lg p-3 mb-4"
          style={{ backgroundColor: "oklch(0.72 0.15 195 / 0.1)" }}
        >
          <Clock
            className="w-5 h-5 flex-shrink-0"
            style={{ color: "oklch(0.72 0.15 195)" }}
          />
          <div>
            <p className="font-semibold text-sm text-foreground">
              Estimated Delivery
            </p>
            <p className="text-xs text-muted-foreground">
              {order
                ? "3–7 business days"
                : "Please check your order status for details"}
            </p>
          </div>
        </div>

        {/* Order items */}
        {order && order.items.length > 0 && (
          <div>
            <h3 className="font-display font-semibold text-sm text-foreground mb-3 uppercase tracking-wide">
              Items Ordered
            </h3>
            <div className="space-y-3">
              {order.items.map((item, idx) => {
                const imageUrl = getProductImage(
                  item.product.imageUrl,
                  item.product.name,
                  80,
                );
                return (
                  <div
                    key={`item-${item.product.id.toString()}-${idx}`}
                    className="flex items-center gap-3"
                  >
                    <div
                      className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 border border-border"
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
            </div>

            <Separator
              className="my-4"
              style={{ backgroundColor: "oklch(0.28 0.025 260)" }}
            />

            <div className="flex justify-between font-bold text-base">
              <span className="text-foreground">Total</span>
              <span style={{ color: "oklch(0.78 0.18 55)" }}>
                {formatPrice(order.totalAmountCents)}
              </span>
            </div>
          </div>
        )}

        {isError && (
          <p className="text-sm text-muted-foreground text-center py-4">
            Order details unavailable. Your order was placed successfully (#
            {orderId}).
          </p>
        )}
      </motion.div>

      {/* Delivery steps */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="rounded-xl border border-border bg-card p-5 mb-8"
      >
        <h3 className="font-display font-semibold text-sm text-foreground mb-4 uppercase tracking-wide">
          What Happens Next
        </h3>
        <div className="space-y-3">
          {[
            {
              step: "1",
              title: "Order Processing",
              desc: "We're preparing your items for shipment.",
              active: true,
            },
            {
              step: "2",
              title: "Shipped",
              desc: "Your order is on its way to you.",
              active: false,
            },
            {
              step: "3",
              title: "Delivered",
              desc: "Enjoy your new products!",
              active: false,
            },
          ].map((s) => (
            <div key={s.step} className="flex items-start gap-3">
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5"
                style={
                  s.active
                    ? {
                        backgroundColor: "oklch(0.75 0.17 55)",
                        color: "oklch(0.1 0.01 260)",
                      }
                    : {
                        backgroundColor: "oklch(0.22 0.025 260)",
                        color: "oklch(0.6 0.015 260)",
                      }
                }
              >
                {s.step}
              </div>
              <div>
                <p
                  className="text-sm font-semibold"
                  style={{
                    color: s.active
                      ? "oklch(0.78 0.18 55)"
                      : "oklch(0.96 0.008 260)",
                  }}
                >
                  {s.title}
                </p>
                <p className="text-xs text-muted-foreground">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      <div className="flex flex-col sm:flex-row gap-3">
        <Link to="/orders" className="flex-1">
          <Button
            variant="outline"
            className="w-full border-border text-foreground hover:bg-secondary font-semibold"
          >
            <Package className="w-4 h-4 mr-2" />
            View My Orders
          </Button>
        </Link>
        <Link
          to="/products"
          search={{ category: "all", q: "" }}
          className="flex-1"
        >
          <Button
            className="w-full font-semibold"
            style={{
              backgroundColor: "oklch(0.75 0.17 55)",
              color: "oklch(0.1 0.01 260)",
            }}
          >
            Continue Shopping
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </Link>
      </div>
    </main>
  );
}
