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
      <Link to={`/products/${id}`} prefetch="intent" className="flex flex-1 flex-col">
        <div className="relative">
          <div className="aspect-square overflow-hidden bg-slate-100">
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
            <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
            <span className="rounded-full bg-rose-50 px-3 py-1 text-sm font-semibold text-rose-600">
              {formatter.format(price)}
            </span>
          </div>
          <p className="line-clamp-2 text-sm text-slate-600">
            {description}
          </p>
          <div className="mt-auto flex items-center justify-between text-xs font-medium uppercase tracking-wide text-slate-500">
            <span>{Math.round(rating * 10) / 10} ★ rating</span>
            <span>View details</span>
          </div>
        </div>
      </Link>
    </article>
  );
}
