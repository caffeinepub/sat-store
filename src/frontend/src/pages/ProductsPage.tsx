import { ProductCard, ProductCardSkeleton } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  useAddToCart,
  useFilterProductsByCategory,
  useListProducts,
  useSearchProducts,
} from "@/hooks/useQueries";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { Loader2, Search, ShoppingBag, SlidersHorizontal } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import type { Product } from "../backend.d";

const CATEGORIES = [
  { label: "All", value: "all", icon: "🛍️" },
  { label: "Laptops", value: "Laptops", icon: "💻" },
  { label: "Mobiles", value: "Mobiles", icon: "📱" },
  { label: "Tablets", value: "Tablets", icon: "📟" },
  { label: "Accessories", value: "Accessories", icon: "🎧" },
  { label: "Electronics", value: "Electronics", icon: "⚡" },
  { label: "Gaming", value: "Gaming", icon: "🎮" },
];

export function ProductsPage() {
  const search = useSearch({ from: "/products" });
  const navigate = useNavigate();

  const initialQ = (search as { q?: string; category?: string }).q ?? "";
  const initialCategory =
    (search as { q?: string; category?: string }).category ?? "all";

  const [searchInput, setSearchInput] = useState(initialQ);
  const [activeSearch, setActiveSearch] = useState(initialQ);
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [addingId, setAddingId] = useState<string | null>(null);

  // Sync URL params
  useEffect(() => {
    setSearchInput(initialQ);
    setActiveSearch(initialQ);
    setActiveCategory(initialCategory);
  }, [initialQ, initialCategory]);

  // Decide which query to use
  const searchQuery = useSearchProducts(activeSearch);
  const categoryQuery = useFilterProductsByCategory(activeCategory);
  const allQuery = useListProducts();

  let displayProducts: Product[] = [];
  let isLoading = false;

  if (activeSearch.trim()) {
    displayProducts = searchQuery.data ?? [];
    isLoading = searchQuery.isLoading;
  } else if (activeCategory !== "all") {
    displayProducts = categoryQuery.data ?? [];
    isLoading = categoryQuery.isLoading;
  } else {
    displayProducts = allQuery.data ?? [];
    isLoading = allQuery.isLoading;
  }

  const addToCart = useAddToCart();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setActiveSearch(searchInput.trim());
    navigate({
      to: "/products",
      search: { q: searchInput.trim(), category: activeCategory },
    });
  };

  const handleCategoryChange = (cat: string) => {
    setActiveCategory(cat);
    setActiveSearch("");
    setSearchInput("");
    navigate({ to: "/products", search: { q: "", category: cat } });
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
      toast.error("Failed to add item. Please sign in first.");
    } finally {
      setAddingId(null);
    }
  };

  return (
    <main className="max-w-[1400px] mx-auto px-4 py-6 min-h-screen">
      {/* Page header */}
      <div className="mb-6">
        <h1 className="font-display font-bold text-2xl text-foreground">
          {activeSearch
            ? `Search results for "${activeSearch}"`
            : activeCategory !== "all"
              ? activeCategory
              : "All Products"}
        </h1>
        {!isLoading && (
          <p className="text-sm text-muted-foreground mt-1">
            {displayProducts.length} product
            {displayProducts.length !== 1 ? "s" : ""} found
          </p>
        )}
      </div>

      {/* Search + Filter bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <form onSubmit={handleSearch} className="flex-1 flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            <Input
              data-ocid="products.search_input"
              type="search"
              placeholder="Search products..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="pl-9 h-10 text-sm font-body"
              style={{
                backgroundColor: "oklch(0.16 0.02 260)",
                borderColor: "oklch(0.28 0.025 260)",
                color: "oklch(0.96 0.008 260)",
              }}
            />
          </div>
          <Button
            type="submit"
            size="sm"
            className="h-10 px-4 font-semibold flex-shrink-0"
            style={{
              backgroundColor: "oklch(0.75 0.17 55)",
              color: "oklch(0.1 0.01 260)",
            }}
          >
            <Search className="w-4 h-4 sm:mr-2" />
            <span className="hidden sm:inline">Search</span>
          </Button>
        </form>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <SlidersHorizontal className="w-4 h-4" />
          <span className="font-semibold">{displayProducts.length} items</span>
        </div>
      </div>

      {/* Category tabs */}
      <div className="mb-6 overflow-x-auto scrollbar-thin">
        <Tabs value={activeCategory} onValueChange={handleCategoryChange}>
          <TabsList
            className="inline-flex h-9 gap-0.5 p-1 rounded-lg"
            style={{ backgroundColor: "oklch(0.16 0.02 260)" }}
          >
            {CATEGORIES.map((cat) => (
              <TabsTrigger
                key={cat.value}
                value={cat.value}
                data-ocid={`products.${cat.value.toLowerCase().replace(/ & /g, "_").replace(/ /g, "_")}.tab`}
                className="text-xs px-3 whitespace-nowrap rounded-md data-[state=active]:text-[oklch(0.1_0.01_260)] font-semibold flex items-center gap-1.5"
                style={
                  activeCategory === cat.value
                    ? {
                        backgroundColor: "oklch(0.75 0.17 55)",
                        color: "oklch(0.1 0.01 260)",
                      }
                    : {}
                }
              >
                <span className="text-sm">{cat.icon}</span>
                {cat.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      {/* Products grid */}
      {isLoading ? (
        <div
          data-ocid="products.loading_state"
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
        >
          {["p1", "p2", "p3", "p4", "p5", "p6", "p7", "p8", "p9", "p10"].map(
            (k) => (
              <ProductCardSkeleton key={k} />
            ),
          )}
        </div>
      ) : displayProducts.length === 0 ? (
        <motion.div
          data-ocid="products.empty_state"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-20 rounded-lg border border-border bg-card"
        >
          <ShoppingBag className="w-12 h-12 mb-4 text-muted-foreground" />
          <h3 className="font-display font-semibold text-lg text-foreground mb-2">
            No products found
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            Try a different search term or category.
          </p>
          <Button
            variant="outline"
            onClick={() => {
              setSearchInput("");
              setActiveSearch("");
              setActiveCategory("all");
              navigate({ to: "/products", search: { q: "", category: "all" } });
            }}
          >
            Clear filters
          </Button>
        </motion.div>
      ) : (
        <AnimatePresence mode="wait">
          <motion.div
            key={`${activeCategory}-${activeSearch}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
          >
            {displayProducts.map((product, idx) => (
              <ProductCard
                key={product.id.toString()}
                product={product}
                index={idx + 1}
                onAddToCart={handleAddToCart}
                isAddingToCart={addingId === product.id.toString()}
              />
            ))}
          </motion.div>
        </AnimatePresence>
      )}
    </main>
  );
}
