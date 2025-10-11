import type { Route } from "./+types/home";
import { Header } from "~/components/Header";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "LTP Online Store" },
    { name: "description", content: "Online Store Frontend Challenge!" },
  ];
}

export default function Home() {
  return (
    <>
      <Header />
      <main className="min-h-screen w-full pt-24">
        {/* Your page content goes here */}
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-center mt-8">Welcome to LTP Store</h1>
          <p className="text-center mt-4 text-gray-600">Your content goes here</p>
        </div>
      </main>
    </>
  );
}
