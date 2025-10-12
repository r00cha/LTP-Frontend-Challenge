import { useLoaderData, useSubmit, Form, Link, useSearchParams } from "react-router";
import type { Route } from "./+types/home";
import { ProductCard } from "~/components/ProductCard";
import { PAGE_SIZE } from "~/utils/pagination";
import { getSortConfig, isSortValue } from "~/utils/sorting";
import { EmptyState } from "~/components/EmptyState";
import { fetchCategories, fetchProducts } from "~/utils/api.server";
import LottieComponent from "~/components/LottieComponent";
import blobData from "../../lotties/blob.json";
import { DrawCircleText } from "~/components/DrawCircleText";
import { motion, stagger } from "motion/react";


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
    sort: isSortValue(sortParam) ? sortParam : "relevance",
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
  
  // This is to later force a submit on handle select change das categories
  const submit = useSubmit(); 
  const [searchParams] = useSearchParams();

  const handleSelectCategory: React.ChangeEventHandler<HTMLSelectElement> = (event) => {
    const form = event.currentTarget.form;
    if (form) {
      submit(form);
    } 
  };

  return (
    <div className="w-full mt-24 flex flex-col gap-8 items-center">
      {/* Introduction Section */}
      <section className="bg-brand mt-4 rounded-2xl w-[95vw] max-w-7xl shadow-lg overflow-hidden">
        <div className="p-4 flex flex-col sm:flex-row gap-8 sm:gap-12 md:gap-16 lg:gap-24 items-center justify-start mx-auto w-[90%]">
          
          <div className="flex flex-col items-start gap-4 sm:gap-8 md:gap-10">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-grotesk text-[#FAF5E0]">You need it, <br/> We <DrawCircleText text={"have"} /> it!</h1>
            <p className="max-w-sm sm:max-w-md lg:max-w-lg text-[#FAF5E0] text-sm sm:text-base ">Here you'll find a variety of products to suit your needs. Browse through our categories and discover amazing deals!</p>
            <motion.a 
              href="#shop" 
              className="flex items-center gap-1 bg-primary text-[#043027] font-semibold py-2 px-4 rounded overflow-hidden"
              whileHover="hover"
              initial="initial"
            >
              <div className="relative overflow-hidden">
                <motion.span
                  variants={{
                    initial: { y: 0 },
                    hover: { y: "-100%" },
                  }}
                  transition={{ duration: 0.25, ease: "easeInOut" }}
                  className="block"
                >
                  Shop now
                </motion.span>
                <motion.span
                  variants={{
                    initial: { y: "100%" },
                    hover: { y: 0 }
                  }}
                  transition={{ duration: 0.25, ease: "easeInOut" }}
                  className="block absolute inset-0"
                >
                  Shop now
                </motion.span>
              </div>
              
              <svg 
                className="h-4 w-4" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </motion.a>
          </div>

          {/* Illustration */}
          <div className="relative">
            <LottieComponent animationData={blobData} className="absolute w-[110%] inset-y-4 sm:inset-y-8 sm:w-[120%] sm:-inset-x-4" />
            <img src="/bag-2.png" alt="Shopping Illustration" className="w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 translate-y-22 drop-shadow-2xl drop-shadow-neutral-800 relative z-10 hover:scale-105 hover:rotate-3 transition-transform duration-300" />
          </div>
          
        </div>
      </section>

      {/* Product Filters */}

      {/* Showing x of y products */}
      <div id="shop" className="flex max-w-6xl container px-4 items-center justify-between text-sm text-slate-500">
        <span>
          fix this
          {/* Showing {showingStart}-{showingEnd} of {total} products */}
        </span>
        <span className="hidden sm:inline">
          Tip: click a product card to view more details and add it to your cart.
        </span>
      </div>

      {/* Product List */}
      {products.length === 0 ? (
        <EmptyState
          title="No products found"
          description="Try adjusting your filters to find what you're looking for."
        />
      ): (
        <div className="max-w-6xl px-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      
    </div>
  );
}

