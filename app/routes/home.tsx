import { useLoaderData, useSubmit, Form, Link, useSearchParams, useNavigate } from "react-router";
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
import { useRef } from "react";


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
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const handleSelectCategory = (selectedCategory: string) => {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set('category', selectedCategory);
    // Reset to page 1 when changing category
    newSearchParams.set('page', '1');
    navigate(`?${newSearchParams.toString()}`, { replace: true, preventScrollReset: true });
  };

  const handleSortChange = (newSort: string) => {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set('sort', newSort);
    // Reset to page 1 when changing sort
    newSearchParams.set('page', '1');
    navigate(`?${newSearchParams.toString()}`, { replace: true, preventScrollReset: true });
  };

  // Handle drag to scroll
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    const container = scrollContainerRef.current;
    if (!container) return;
    
    const startX = e.pageX - container.offsetLeft;
    const scrollLeft = container.scrollLeft;
    let isDragging = false;

    const handleMouseMove = (e: MouseEvent) => {
      isDragging = true;
      const x = e.pageX - container.offsetLeft;
      const walk = (x - startX) * 2; // Scroll speed multiplier
      container.scrollLeft = scrollLeft - walk;
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
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

      {/* Featured Products */}
      <div id="shop" className="max-w-6xl w-[100%] px-4 flex flex-col gap-6">
      <div className="flex flex-col gap-4">
          <h2 className="text-2xl font-bold text-brand">Featured Products</h2>
          <Form method="get" className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8">
            
            {/* Category Filter - Horizontal Scrollable Pills */}
            <div className="relative flex flex-col gap-2 w-full sm:flex-1 sm:min-w-0">
              <label className=" text-slate-700 text-xl font-bold text-brand">Categories:</label>
              <div className="relative w-full rounded-full overflow-hidden">
                <div 
                  ref={scrollContainerRef}
                  onMouseDown={handleMouseDown}
                  className="flex gap-2 overflow-x-auto scrollbar-hide py-3 cursor-grab active:cursor-grabbing select-none"
                >
                  {/* All Categories Button */}
                  <button
                    type="button"
                    onClick={() => handleSelectCategory('all')}
                    className={`cursor-pointer whitespace-nowrap px-4 py-2 rounded-full font-medium text-sm transition-all duration-200 flex-shrink-0 ${
                      category === 'all'
                        ? 'bg-brand text-white shadow-md'
                        : 'bg-white text-slate-700 border border-slate-300 hover:border-brand hover:text-brand'
                    }`}
                  >
                    All
                  </button>
                  {/* Individual Category Pills */}
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => handleSelectCategory(cat)}
                      className={`cursor-pointer whitespace-nowrap px-4 py-2 rounded-full font-medium text-sm transition-all duration-200 flex-shrink-0 ${
                        category === cat
                          ? 'bg-brand text-white shadow-md'
                          : 'bg-white text-slate-700 border border-slate-300 hover:border-brand hover:text-brand'
                      }`}
                    >
                      {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </button>
                  ))}
                </div>

              </div>
              
              {/* Drag icon hint */}
              <div className="absolute top-23 left-1/3 flex items-center gap-2 text-sm text-slate-400 mt-1 select-none">
                <svg className=" h-8 w-8" enable-background="new 0 0 99.176 99.176" height="99.176px" id="Layer_1" version="1.1" viewBox="0 0 99.176 99.176" width="99.176px"  xmlns="http://www.w3.org/2000/svg"><g><path d="M68.438,44.101   c-2.299,0-4.178,1.879-4.178,4.178v7.223c0,0.756-0.622,1.385-1.384,1.385c-0.779,0-1.405-0.629-1.405-1.385V39.927   c0-2.312-1.864-4.178-4.178-4.178c-2.299,0-4.174,1.865-4.174,4.178v12.781c0,0.766-0.629,1.385-1.388,1.385   c-0.776,0-1.405-0.619-1.405-1.385V11.566c0-2.301-1.864-4.176-4.18-4.176c-2.311,0-4.176,1.875-4.176,4.176v41.142   c0,0.766-0.625,1.385-1.402,1.385c-0.759,0-1.387-0.619-1.387-1.385v-35.56c0-2.314-1.877-4.178-4.178-4.178   c-2.311,0-4.176,1.863-4.176,4.178v49.496l-5.65-7.732c-1.672-2.568-4.939-3.439-7.332-1.953c-2.383,1.504-2.969,4.799-1.32,7.371   c0,0,9.102,13.771,12.983,19.664c3.876,5.904,10.165,10.518,21.923,10.518c19.459,0,21.201-15.023,21.201-19.514V48.278   C72.633,45.979,70.751,44.101,68.438,44.101z" fill="#FFFFFF" stroke="#58595B" stroke-miterlimit="10" stroke-width="3.4835"/><path d="M68.438,44.101   c-2.299,0-4.178,1.879-4.178,4.178v7.223c0,0.756-0.622,1.385-1.384,1.385c-0.779,0-1.405-0.629-1.405-1.385V39.927   c0-2.312-1.864-4.178-4.178-4.178c-2.299,0-4.174,1.865-4.174,4.178v12.781c0,0.766-0.629,1.385-1.388,1.385   c-0.776,0-1.405-0.619-1.405-1.385V11.566c0-2.301-1.864-4.176-4.18-4.176c-2.311,0-4.176,1.875-4.176,4.176v41.142   c0,0.766-0.625,1.385-1.402,1.385c-0.759,0-1.387-0.619-1.387-1.385v-35.56c0-2.314-1.877-4.178-4.178-4.178   c-2.311,0-4.176,1.863-4.176,4.178v49.496l-5.65-7.732c-1.672-2.568-4.939-3.439-7.332-1.953c-2.383,1.504-2.969,4.799-1.32,7.371   c0,0,9.102,13.771,12.983,19.664c3.876,5.904,10.165,10.518,21.923,10.518c19.459,0,21.201-15.023,21.201-19.514V48.278   C72.633,45.979,70.751,44.101,68.438,44.101z" fill="#FFFFFF" stroke="#58595B" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10"/><path clip-rule="evenodd" d="M55.537,12.13c-0.609,0.861-0.01,2.156,1.205,1.324   c4.562,1.613,9.336,1.887,13.963,3.062c0.801-0.439,0.463-1.059,0.539-1.615c-3.689-0.842-7.447-1.268-11.125-2.186   c6.299-1.449,12.832-1.789,19.049-0.877c0.902,0.133,2.133,0.434,2.705,0.357c0.193,0.273,0.312,0.191,0.727,0.328   c0.832-0.256,1.137-1.117,0.918-1.766c-1.465-0.307-2.957-0.422-4.443-0.564c-1.477-0.139-2.977-0.381-4.488-0.287   c-0.451-0.281-1.006,0.096-1.463-0.16c-0.156,0.211-0.594-0.047-0.537,0.27c-3.756-0.514-8.299,0.471-12.344,1.016   c2.574-1.357,6.301-2.918,9.096-4.648c0.488-0.396,0.393-1.568-0.014-1.701c-0.494-0.16-2.27,0.768-3.084,1.141   C62.535,7.521,58.096,9.425,55.537,12.13L55.537,12.13z" fill="#939598" fill-rule="evenodd"/></g></svg>
                <span>Drag to scroll</span>
              </div>

            </div>
            
            
            {/* Sort Options */}
            <div className="flex flex-col gap-2 flex-shrink-0">
              <label htmlFor="sort" className="text-xl font-bold text-brand">Sort by:</label>
              <select
                id="sort"
                name="sort"
                value={sort}
                onChange={(e) => handleSortChange(e.target.value)}
                className="rounded-lg border border-slate-300 bg-white py-1.5 px-2 text-sm focus:border-brand focus:ring-1 focus:ring-brand outline-none"
              >
                <option value="relevance">Relevance</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating-asc">Rating: Low to High</option>
                <option value="rating-desc">Rating: High to Low</option>
              </select>
            </div>

            {/* Preserve page param on filter/sort change */}
            {searchParams.get("page") && (
              <input
                type="hidden"
                name="page"
                value={searchParams.get("page") || "1"}
              />
            )}
          </Form>
        </div>
        </div>

      {/* Product Filters */}

      {/* Showing x of y products */}
      <div id="shop" className="flex max-w-6xl container px-4 items-center justify-between text-sm text-slate-500">
        <span>
          {/* Showing {showingStart}-{showingEnd} of {total} products */}
          Showing Fix this of {total} products

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

