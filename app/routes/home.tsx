import { useLoaderData, useSubmit, Form, Link } from "react-router";
import type { Route } from "./+types/home";
import { ProductCard } from "~/components/ProductCard";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "LTP Online Store" },
    { name: "description", content: "Online Store Frontend Challenge!" },
  ];
}

export type Product = {
  id: number;
  title: string;
  description: string;
  price: number;
  rating: number;
  category: string;
  thumbnail: string;
};

type ProductsResponse = {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
};

const baseUrl = "https://dummyjson.com";

export async function loader({ request }: Route.LoaderArgs) {
  //Fetch every product from the API
  const productsResponse = await fetch(`${baseUrl}/products`);
  const productsData = await productsResponse.json() as ProductsResponse;
  
  return { 
    products: productsData.products, 
    total: productsData.total 
  };
 
}

export default function Home() {

  const {products, total } = useLoaderData<typeof loader>();

  // This is to later force a submit on handle select change das categories
  const submit = useSubmit(); 

  return (
    <div className="w-full pt-24 flex flex-col gap-8 items-center">
      {/* Your page content goes here */}
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mt-8 font-grotesk">Welcome to LTP Store</h1>
        <p className="text-center mt-4 text-gray-600">Your content goes here</p>
      </div>

      {/* Product List */}
      {products.length === 0 ? (
        <p className="text-center text-gray-500">No products available.</p>

      ): (
        <div className="max-w-6xl grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}

