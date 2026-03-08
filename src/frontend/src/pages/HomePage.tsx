import { ProductCard, ProductCardSkeleton } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  useAddToCart,
  useFilterProductsByCategory,
  useInitialize,
  useListProducts,
} from "@/hooks/useQueries";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  ArrowRight,
  ChevronRight,
  RotateCcw,
  Search,
  Shield,
  ShoppingBag,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import type { Product } from "../backend.d";

const CATEGORIES = [
  {
    name: "Laptops",
    icon: "💻",
    desc: "Powerful Machines",
    color: "oklch(0.72 0.15 195)",
    featured: true,
  },
  {
    name: "Mobiles",
    icon: "📱",
    desc: "Latest Smartphones",
    color: "oklch(0.75 0.17 55)",
    featured: true,
  },
  {
    name: "Tablets",
    icon: "📟",
    desc: "Portable Screens",
    color: "oklch(0.65 0.18 320)",
    featured: false,
  },
  {
    name: "Accessories",
    icon: "🎧",
    desc: "Gear & Peripherals",
    color: "oklch(0.7 0.14 145)",
    featured: false,
  },
  {
    name: "Electronics",
    icon: "⚡",
    desc: "Gadgets & More",
    color: "oklch(0.68 0.16 85)",
    featured: false,
  },
  {
    name: "Gaming",
    icon: "🎮",
    desc: "Play & Compete",
    color: "oklch(0.62 0.22 25)",
    featured: false,
  },
];

const FEATURES = [
  {
    icon: Zap,
    title: "Fast Delivery",
    desc: "Orders shipped within 24 hours",
    color: "oklch(0.75 0.17 55)",
  },
  {
    icon: Shield,
    title: "Secure Payments",
    desc: "Your data is always protected",
    color: "oklch(0.72 0.15 195)",
  },
  {
    icon: RotateCcw,
    title: "Easy Returns",
    desc: "30-day hassle-free returns",
    color: "oklch(0.7 0.14 145)",
  },
];

// ── Category Section Component ─────────────────────
interface CategorySectionProps {
  title: string;
  subtitle: string;
  category: string;
  sectionId: string;
  accentColor: string;
  bannerImage: string;
  onAddToCart: (product: Product) => void;
  addingId: string | null;
}

function CategorySection({
  title,
  subtitle,
  category,
  sectionId,
  accentColor,
  bannerImage,
  onAddToCart,
  addingId,
}: CategorySectionProps) {
  const { data: products, isLoading } = useFilterProductsByCategory(category);
  const displayProducts = products?.slice(0, 4) ?? [];

  return (
    <section
      className="max-w-[1400px] mx-auto px-4 py-8"
      data-ocid={`${sectionId}.section`}
    >
      {/* Section header with banner */}
      <div
        className="relative rounded-xl overflow-hidden mb-6 border border-border"
        style={{ minHeight: "140px" }}
      >
        {/* Banner image */}
        <img
          src={bannerImage}
          alt={title}
          className="absolute inset-0 w-full h-full object-cover opacity-25"
        />
        {/* Gradient overlay */}
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(135deg, ${accentColor.replace(")", " / 0.35)")} 0%, oklch(0.12 0.018 260 / 0.85) 60%)`,
          }}
        />
        {/* Content */}
        <div className="relative z-10 flex items-center justify-between p-6">
          <div>
            <p
              className="text-xs font-semibold uppercase tracking-widest mb-1"
              style={{ color: accentColor }}
            >
              {subtitle}
            </p>
            <h2 className="font-display font-black text-2xl md:text-3xl text-foreground">
              {title}
            </h2>
          </div>
          <Link
            to="/products"
            search={{ category, q: "" }}
            data-ocid={`${sectionId}.link`}
            className="hidden sm:flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-lg border transition-colors hover:bg-secondary"
            style={{
              color: accentColor,
              borderColor: `${accentColor.replace(")", " / 0.3)")}`,
            }}
          >
            View All {category}
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Products Grid */}
      {isLoading ? (
        <div
          data-ocid={`${sectionId}.loading_state`}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4"
        >
          {["s1", "s2", "s3", "s4"].map((k) => (
            <ProductCardSkeleton key={k} />
          ))}
        </div>
      ) : displayProducts.length === 0 ? (
        <div
          data-ocid={`${sectionId}.empty_state`}
          className="flex flex-col items-center justify-center py-12 rounded-lg border border-border bg-card"
        >
          <ShoppingBag className="w-8 h-8 mb-3 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            No {category} available yet.
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Try initializing the store with the button above.
          </p>
        </div>
      ) : (
        <AnimatePresence>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {displayProducts.map((product, idx) => (
              <motion.div
                key={product.id.toString()}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.07, duration: 0.35 }}
              >
                <ProductCard
                  product={product}
                  index={idx + 1}
                  onAddToCart={onAddToCart}
                  isAddingToCart={addingId === product.id.toString()}
                />
              </motion.div>
            ))}
          </div>
        </AnimatePresence>
      )}

      {/* Mobile "view all" link */}
      <div className="sm:hidden mt-4 text-center">
        <Link
          to="/products"
          search={{ category, q: "" }}
          data-ocid={`${sectionId}.link`}
          className="inline-flex items-center gap-1.5 text-sm font-semibold"
          style={{ color: accentColor }}
        >
          View All {category} <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </section>
  );
}

// ── HomePage ───────────────────────────────────────
export function HomePage() {
  const navigate = useNavigate();
  const [heroSearch, setHeroSearch] = useState("");
  const [addingId, setAddingId] = useState<string | null>(null);
  const [initAttempted, setInitAttempted] = useState(false);

  const { data: products, isLoading } = useListProducts();
  const addToCart = useAddToCart();
  const initialize = useInitialize();

  // Auto-initialize store on first load
  const initializeMutate = initialize.mutate;
  useEffect(() => {
    if (!initAttempted) {
      setInitAttempted(true);
      initializeMutate(undefined, {
        onError: () => {
          // silently fail — user may not be admin
        },
      });
    }
  }, [initAttempted, initializeMutate]);

  const featuredProducts = products?.slice(0, 8) ?? [];

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (heroSearch.trim()) {
      navigate({
        to: "/products",
        search: { q: heroSearch.trim(), category: "all" },
      });
    }
  };

  const handleAddToCart = async (product: Product) => {
    const key = product.id.toString();
    setAddingId(key);
    try {
      await addToCart.mutateAsync({
        productId: product.id,
        quantity: BigInt(1),
      });
      toast.success(`${product.name} added to cart!`);
    } catch {
      toast.error("Failed to add item to cart. Please sign in first.");
    } finally {
      setAddingId(null);
    }
  };

  return (
    <main className="min-h-screen">
      {/* ── Hero Section ─────────────────────────────────── */}
      <section className="hero-gradient relative overflow-hidden">
        <div className="max-w-[1400px] mx-auto px-4 py-16 md:py-24">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="max-w-2xl"
          >
            <p
              className="text-xs font-semibold uppercase tracking-widest mb-3"
              style={{ color: "oklch(0.72 0.15 195)" }}
            >
              Welcome to SAT Store
            </p>
            <h1 className="font-display font-black text-4xl md:text-6xl leading-[1.05] text-foreground mb-4">
              Top Laptops
              <span style={{ color: "oklch(0.75 0.17 55)" }}> & Mobiles</span>
              <br />
              <span className="text-3xl md:text-5xl font-bold text-muted-foreground">
                at Best Prices
              </span>
            </h1>
            <p className="text-base text-muted-foreground mb-8 max-w-lg leading-relaxed">
              Discover the latest laptops, smartphones, tablets and accessories.
              Fast shipping, easy returns, and secure checkout guaranteed.
            </p>

            {/* Hero Search */}
            <form
              onSubmit={handleHeroSearch}
              className="flex items-center gap-2 max-w-lg"
            >
              <div className="relative flex-1">
                <Input
                  data-ocid="hero.search_input"
                  type="search"
                  placeholder="Search laptops, mobiles, tablets..."
                  value={heroSearch}
                  onChange={(e) => setHeroSearch(e.target.value)}
                  className="h-12 pl-4 pr-4 text-sm rounded-lg border-0 font-body"
                  style={{
                    backgroundColor: "oklch(0.97 0.005 260)",
                    color: "oklch(0.1 0.01 260)",
                  }}
                />
              </div>
              <Button
                data-ocid="hero.primary_button"
                type="submit"
                size="lg"
                className="h-12 px-6 font-semibold rounded-lg flex-shrink-0"
                style={{
                  backgroundColor: "oklch(0.75 0.17 55)",
                  color: "oklch(0.1 0.01 260)",
                }}
              >
                <Search className="w-4 h-4 mr-2" />
                Search
              </Button>
            </form>

            {/* Quick category links */}
            <div className="flex flex-wrap items-center gap-3 mt-6">
              <Link
                to="/products"
                search={{ category: "Laptops", q: "" }}
                data-ocid="hero.laptops.link"
              >
                <Button
                  variant="outline"
                  className="border-border text-foreground hover:bg-secondary font-semibold"
                  style={{ borderColor: "oklch(0.72 0.15 195 / 0.5)" }}
                >
                  💻 Shop Laptops
                </Button>
              </Link>
              <Link
                to="/products"
                search={{ category: "Mobiles", q: "" }}
                data-ocid="hero.mobiles.link"
              >
                <Button
                  variant="outline"
                  className="border-border text-foreground hover:bg-secondary font-semibold"
                  style={{ borderColor: "oklch(0.75 0.17 55 / 0.5)" }}
                >
                  📱 Shop Mobiles
                </Button>
              </Link>
              <Link
                to="/products"
                search={{ category: "all", q: "" }}
                data-ocid="hero.browse.link"
              >
                <Button
                  variant="ghost"
                  className="text-muted-foreground hover:text-foreground font-semibold"
                >
                  Browse All
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Decorative blur blobs */}
        <div
          className="absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl pointer-events-none"
          style={{ backgroundColor: "oklch(0.75 0.17 55 / 0.08)" }}
        />
        <div
          className="absolute bottom-0 right-1/4 w-64 h-64 rounded-full blur-3xl pointer-events-none"
          style={{ backgroundColor: "oklch(0.72 0.15 195 / 0.06)" }}
        />
      </section>

      {/* ── Features Bar ─────────────────────────────────── */}
      <section
        className="border-y border-border"
        style={{ backgroundColor: "oklch(0.11 0.016 260)" }}
      >
        <div className="max-w-[1400px] mx-auto px-4 py-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {FEATURES.map((feat) => (
              <div key={feat.title} className="flex items-center gap-3 py-2">
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{
                    backgroundColor: `${feat.color.replace(")", " / 0.15)")}`,
                  }}
                >
                  <feat.icon
                    className="w-5 h-5"
                    style={{ color: feat.color }}
                  />
                </div>
                <div>
                  <p className="font-display font-semibold text-sm text-foreground">
                    {feat.title}
                  </p>
                  <p className="text-xs text-muted-foreground">{feat.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Category Navigation ───────────────────────────── */}
      <section className="max-w-[1400px] mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display font-bold text-2xl text-foreground">
            Shop by Category
          </h2>
          <Link
            to="/products"
            search={{ category: "all", q: "" }}
            data-ocid="categories.link"
            className="text-sm font-semibold hover:underline flex items-center gap-1"
            style={{ color: "oklch(0.75 0.17 55)" }}
          >
            View All <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {CATEGORIES.map((cat, idx) => (
            <motion.div
              key={cat.name}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.06, duration: 0.35 }}
            >
              <Link
                to="/products"
                search={{ category: cat.name, q: "" }}
                data-ocid={`categories.${cat.name.toLowerCase()}.button`}
                className="block group"
              >
                <div
                  className={`rounded-lg p-4 border border-border flex flex-col items-center gap-2 transition-all duration-200 ${cat.featured ? "ring-1" : ""}`}
                  style={{
                    backgroundColor: cat.featured
                      ? `${cat.color.replace(")", " / 0.08)")}`
                      : "oklch(0.16 0.02 260)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = cat.color;
                    e.currentTarget.style.boxShadow = `0 4px 20px ${cat.color.replace(")", " / 0.2)")}`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "";
                    e.currentTarget.style.boxShadow = "";
                  }}
                >
                  <span className="text-2xl">{cat.icon}</span>
                  <span className="font-display font-semibold text-xs text-foreground text-center leading-tight">
                    {cat.name}
                  </span>
                  <span className="text-[10px] text-muted-foreground text-center">
                    {cat.desc}
                  </span>
                  {cat.featured && (
                    <span
                      className="text-[9px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded"
                      style={{
                        backgroundColor: `${cat.color.replace(")", " / 0.2)")}`,
                        color: cat.color,
                      }}
                    >
                      Popular
                    </span>
                  )}
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Featured Products ─────────────────────────────── */}
      <section
        className="py-8"
        style={{ backgroundColor: "oklch(0.11 0.016 260)" }}
      >
        <div className="max-w-[1400px] mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-display font-bold text-2xl text-foreground">
                Featured Products
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Hand-picked items just for you
              </p>
            </div>
            <Link
              to="/products"
              search={{ category: "all", q: "" }}
              data-ocid="featured.link"
              className="text-sm font-semibold hover:underline flex items-center gap-1"
              style={{ color: "oklch(0.75 0.17 55)" }}
            >
              View All <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {isLoading ? (
            <div
              data-ocid="featured.loading_state"
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4"
            >
              {["p1", "p2", "p3", "p4", "p5", "p6", "p7", "p8"].map((k) => (
                <ProductCardSkeleton key={k} />
              ))}
            </div>
          ) : featuredProducts.length === 0 ? (
            <div
              data-ocid="featured.empty_state"
              className="flex flex-col items-center justify-center py-20 rounded-lg border border-border bg-card"
            >
              <ShoppingBag className="w-12 h-12 mb-4 text-muted-foreground" />
              <h3 className="font-display font-semibold text-lg text-foreground mb-2">
                No products yet
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                The store needs to be initialized first.
              </p>
              <Button
                data-ocid="featured.init.button"
                onClick={() => initialize.mutate()}
                disabled={initialize.isPending}
                style={{
                  backgroundColor: "oklch(0.75 0.17 55)",
                  color: "oklch(0.1 0.01 260)",
                }}
              >
                {initialize.isPending ? "Loading..." : "Initialize Store"}
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {featuredProducts.map((product, idx) => (
                <motion.div
                  key={product.id.toString()}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05, duration: 0.35 }}
                >
                  <ProductCard
                    product={product}
                    index={idx + 1}
                    onAddToCart={handleAddToCart}
                    isAddingToCart={addingId === product.id.toString()}
                  />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Top Laptops Section ───────────────────────────── */}
      <CategorySection
        title="Top Laptops"
        subtitle="High-Performance Computing"
        category="Laptops"
        sectionId="laptops"
        accentColor="oklch(0.72 0.15 195)"
        bannerImage="/assets/generated/category-laptops.dim_600x400.jpg"
        onAddToCart={handleAddToCart}
        addingId={addingId}
      />

      {/* ── Divider ───────────────────────────────────────── */}
      <div className="max-w-[1400px] mx-auto px-4">
        <div className="border-t border-border" />
      </div>

      {/* ── Best Mobiles Section ──────────────────────────── */}
      <CategorySection
        title="Best Mobiles"
        subtitle="Latest Smartphones"
        category="Mobiles"
        sectionId="mobiles"
        accentColor="oklch(0.75 0.17 55)"
        bannerImage="/assets/generated/category-mobiles.dim_600x400.jpg"
        onAddToCart={handleAddToCart}
        addingId={addingId}
      />

      {/* ── Promo Banner ─────────────────────────────────── */}
      <section
        className="relative overflow-hidden mt-4"
        style={{ backgroundColor: "oklch(0.11 0.016 260)" }}
      >
        <div className="max-w-[1400px] mx-auto px-4 py-12 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            viewport={{ once: true }}
          >
            <p
              className="text-xs font-semibold uppercase tracking-widest mb-2"
              style={{ color: "oklch(0.72 0.15 195)" }}
            >
              Limited Time Offer
            </p>
            <h2 className="font-display font-black text-3xl md:text-4xl text-foreground mb-4">
              Get <span style={{ color: "oklch(0.75 0.17 55)" }}>10% off</span>{" "}
              your first order
            </h2>
            <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto">
              Sign in to your account and unlock exclusive discounts on laptops,
              mobiles, and thousands of other products.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link
                to="/products"
                search={{ category: "Laptops", q: "" }}
                data-ocid="promo.laptops.button"
              >
                <Button
                  size="lg"
                  className="font-semibold px-6"
                  style={{
                    backgroundColor: "oklch(0.72 0.15 195)",
                    color: "oklch(0.1 0.01 260)",
                  }}
                >
                  💻 Shop Laptops
                </Button>
              </Link>
              <Link
                to="/products"
                search={{ category: "Mobiles", q: "" }}
                data-ocid="promo.mobiles.button"
              >
                <Button
                  size="lg"
                  className="font-semibold px-6"
                  style={{
                    backgroundColor: "oklch(0.75 0.17 55)",
                    color: "oklch(0.1 0.01 260)",
                  }}
                >
                  📱 Shop Mobiles
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 60% 50% at 50% 50%, oklch(0.75 0.17 55 / 0.05) 0%, transparent 70%)",
          }}
        />
      </section>
    </main>
  );
}
