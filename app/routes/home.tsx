import { useLoaderData, useSubmit, Form, Link, useSearchParams } from "react-router";
import type { Route } from "./+types/home";
import { ProductCard } from "~/components/ProductCard";
import { PAGE_SIZE } from "~/utils/pagination";
import { getSortConfig, isSortValue } from "~/utils/sorting";
import { EmptyState } from "~/components/EmptyState";
import { fetchCategories, fetchProducts } from "~/utils/api.server";

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
    <div className="w-full pt-24 flex flex-col gap-8 items-center">
      {/* Introduction Section */}
      <section className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mt-8 font-grotesk">Welcome to LTP Store</h1>
        <p className="text-center mt-4 text-gray-600">Your content goes here</p>
      </section>

      {/* Product Filters */}

      {/* Showing x of y products */}
      <div className="flex w-full max-w-6xl items-center justify-between text-sm text-slate-500">
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
        <div className="max-w-6xl grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      
    </div>
  );
}

