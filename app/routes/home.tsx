import { useLoaderData, useSearchParams, useNavigate } from "react-router";
import type { Route } from "./+types/home";
import { ProductCard } from "~/components/ProductCard";
import { PAGE_SIZE } from "~/utils/pagination";
import { getSortConfig } from "~/utils/sorting";
import { EmptyState } from "~/components/EmptyState";
import { fetchCategories, fetchProducts } from "~/utils/api.server";
import { HeroSection } from "~/components/HeroSection";
import { ProductFilters } from "~/components/ProductFilters";
import { motion } from "motion/react";


export function meta({}: Route.MetaArgs) {
  return [
    { title: "LTP Online Store" },
    { name: "description", content: "Online Store Frontend Challenge!" },
  ];
}

export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const pageParam = Number(url.searchParams.get("page")) || 1;
  const sortParam = url.searchParams.get("sort") ?? "relevance";
  const categoryParam = url.searchParams.get("category") ?? "all";

  const sortConfig = getSortConfig(sortParam);

  //Calculate skip and limit for pagination
  const currentPage = Math.max(pageParam, 1);
  const skip = (currentPage - 1) * PAGE_SIZE;
  const limit = PAGE_SIZE;

  // Fetch products and categories data in parallel
  const [productsData, categories] = await Promise.all([
    fetchProducts({
      category: categoryParam,
      limit,
      skip,
      sortBy: sortConfig.sortBy,
      order: sortConfig.order,
    }),
    fetchCategories(),
  ]);

  // Calculate full pagination with total
  // const pagination = calculatePagination(productsData.total, {
  //   page: currentPage,
  //   pageSize: PAGE_SIZE,
  // });
  
  return {
    products: productsData.products,
    total: productsData.total,
    //...pagination,
    sort: sortParam,
    category: categoryParam,
    categories,
  };
 
}

export default function Home() {

const {
    products,
    categories,
    category,
    total,
    sort,
    // currentPage,
    // totalPages,
    // showingStart,
    // showingEnd,
  } = useLoaderData<typeof loader>();
  
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const handleSelectCategory = (selectedCategory: string) => {
    // Early return if selecting the same category
    if (selectedCategory === category) return;
    
    const newSearchParams = new URLSearchParams(searchParams);
    // Remove category param if "all" is selected (default state), otherwise set it
    if (selectedCategory === 'all') {
      newSearchParams.delete('category');
    } else {
      newSearchParams.set('category', selectedCategory);
    }
    // Reset to page 1 when changing category (remove page param to keep URL clean)
    newSearchParams.delete('page');
    navigate(`?${newSearchParams.toString()}`, { replace: true, preventScrollReset: true });
  };

  const handleSortChange = (newSort: string) => {
    // Early return if selecting the same sort option
    if (newSort === sort) return;
    
    const newSearchParams = new URLSearchParams(searchParams);
    // Reset sort to default if "relevance" is selected
    if (newSort === "relevance") {
      newSearchParams.delete("sort");
    } else {
      newSearchParams.set("sort", newSort);
    }
    // Reset to page 1 when changing sort (remove page param to keep URL clean)
    newSearchParams.delete("page");
    navigate(`?${newSearchParams.toString()}`, { replace: true, preventScrollReset: true });
  };

  return (
    <div className="w-full mt-24 flex flex-col gap-8 items-center">
      {/* Hero Section */}
      <HeroSection />

      {/* Products Filters*/}
      <div id="shop" className="max-w-6xl w-[100%] px-4 flex flex-col gap-6">
        <div className="flex flex-col gap-4">
          <h2 className="text-2xl font-bold text-brand">Featured Products</h2>

          <ProductFilters
            category={category}
            sort={sort}
            categories={categories}
            onCategoryChange={handleSelectCategory}
            onSortChange={handleSortChange}
          />

        </div>
      </div>


      {/* Showing x of y products */}
      <div
        id="shop"
        className="flex max-w-6xl container px-4 items-center justify-between text-sm text-slate-500"
      >
        <span>
          {/* Showing {showingStart}-{showingEnd} of {total} products */}
          Showing <span className="font-semibold text-brand">
            Fix This
          </span> of <span className="font-semibold text-brand">{total}</span>{" "}
          products
        </span>
        <span className="hidden sm:inline">
          Tip: click a product card to view more details and add it to your
          cart.
        </span>
      </div>

      {/* Product List */}
      {products.length === 0 ? (
        <EmptyState
          title="No products found"
          description="Try adjusting your filters to find what you're looking for."
        />
      ) : (
        <motion.div
          key={`${category}-${sort}`}
          className="max-w-6xl px-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.1,
              },
            },
          }}
        >
          {products.map((product) => (
            <motion.div
              key={product.id}
              variants={{
                hidden: { opacity: 0, scale: 0.9, y: 20 },
                visible: { opacity: 1, scale: 1, y: 0 },
              }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Pagination Controls */}
    </div>
  );
}

