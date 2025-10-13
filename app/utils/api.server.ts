const BASE_URL = "https://dummyjson.com";

export type Review = {
  rating: number;
  comment: string;
  date: string;
  reviewerName: string;
  reviewerEmail: string;
};

export type Product = {
  id: number;
  title: string;
  description: string;
  price: number;
  rating: number;
  category: string;
  thumbnail: string;
  brand?: string;
  stock?: number;
  images?: string[];
  discountPercentage?: number;
  reviews?: Review[];
};

type ProductsResponse = {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
};

export type FetchProductsOptions = {
  category?: string;
  limit?: number;
  skip?: number;
  sortBy?: string;
  order?: "asc" | "desc";
};

export async function fetchProducts(
    options: FetchProductsOptions = {}
): Promise<ProductsResponse> {
    const { category, limit, skip, sortBy, order } = options;

    const endpoint = 
      category && category !== "all"
        ? new URL(`${BASE_URL}/products/category/${encodeURIComponent(category)}`)
        : new URL(`${BASE_URL}/products`);

    //Add possible query params to the URL
    if (limit && limit > 0) endpoint.searchParams.set("limit", String(limit));
    if (skip && skip > 0) endpoint.searchParams.set("skip", String(skip));
    if (sortBy) endpoint.searchParams.set("sortBy", sortBy);
    if (order) endpoint.searchParams.set("order", order);


    const response = await fetch(endpoint);

    if (!response.ok) {
      throw new Response("Unable to load products", { status: response.status });
    }

    return response.json();
}

export async function fetchProduct(productId: string): Promise<Product> {
  const response = await fetch(`${BASE_URL}/products/${productId}`);

  if (!response.ok) {
    throw new Response("Product not found", { status: response.status });
  }

  return response.json();
}


type CategoryResponse = {
    slug: string;
    name: string;
    url: string;
};

export async function fetchCategories(): Promise<string[]> {
    const response = await fetch(`${BASE_URL}/products/categories`);
    
    if (!response.ok) {
      throw new Response("Unable to load categories", { status: response.status });
    }

    const data = (await response.json()) as CategoryResponse[];

    const categories = data.map((category) => category.slug).sort((a, b) => a.localeCompare(b));

    return categories;
}