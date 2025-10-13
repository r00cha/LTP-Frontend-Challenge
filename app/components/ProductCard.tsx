import { Link } from "react-router";
import { toDisplayName, formatter } from "~/utils/formatters";
import type { Product } from "~/utils/api.server";


export function ProductCard({ product }: { product: Product }) {
  const { id, title, description, price, rating, category, thumbnail } = product;
  return (
    <article
      key={id}
      className="group flex h-full flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
    >
      <Link
        to={`/products/${id}`}
        prefetch="intent"
        className="flex flex-1 flex-col"
      >
        <div className="relative">
          <div className="aspect-square overflow-hidden  bg-slate-100">
            <img
              src={thumbnail}
              alt={title}
              loading="lazy"
              className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
            />
          </div>
          <span className="absolute left-4 top-4 inline-flex items-center rounded-full bg-white/90 px-3 py-1 text-xs font-medium uppercase tracking-wide text-slate-600 shadow-sm">
            {toDisplayName(category)}
          </span>
        </div>
        <div className="flex flex-1 flex-col gap-3 p-5">
          <div className="flex items-start justify-between gap-3">
            <h2 className="text-lg font-semibold text-brand">{title}</h2>
            <span className="rounded-full bg-[#103531] px-3 py-1 text-sm font-semibold text-[#c7ff6c]">
              {formatter.format(price)}
            </span>
          </div>
          <p className="line-clamp-2 text-sm text-slate-600">{description}</p>
          <div className="mt-auto flex items-center justify-between text-xs font-medium uppercase tracking-wide text-slate-500">
            <div className="flex items-center gap-1">
              <span className="inline-flex items-center font-semibold text-yellow-500 gap-1 text-sm">
                {Math.round(rating * 10) / 10}{" "}
              </span>

              <svg
                className="h-4 w-4 text-yellow-400 group-hover:rotate-[215deg] transition-transform duration-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              
              <span>
                rating
              </span>
            </div>

            <span className="inline-flex items-center gap-1 group-hover:text-[#103531] transition-colors">
              View details
              <svg
                className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}
