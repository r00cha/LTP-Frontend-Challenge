import { Link, useFetcher } from "react-router";
import { motion } from "motion/react";
import { formatter } from "~/utils/formatters";
import type { CartItem } from "~/utils/cart.server";

type ActionData = {
  status: "success" | "error";
  message: string;
};

interface CartItemCardProps {
  item: CartItem;
  index: number;
}

export function CartItemCard({ item, index }: CartItemCardProps) {
  const fetcher = useFetcher<ActionData>();
  const isUpdating = fetcher.state !== "idle";

  const handleQuantityChange = (newQuantity: number) => {
    // If quantity would be 0 or less, remove the item instead
    if (newQuantity <= 0) {
      handleRemove();
      return;
    }
    
    const formData = new FormData();
    formData.set("intent", "update-quantity");
    formData.set("itemId", String(item.id));
    formData.set("quantity", String(newQuantity));
    fetcher.submit(formData, { method: "post", action: "/cart" });
  };

  const handleRemove = () => {
    const formData = new FormData();
    formData.set("intent", "remove-item");
    formData.set("itemId", String(item.id));
    fetcher.submit(formData, { method: "post", action: "/cart" });
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -200 }}
      transition={{ 
        duration: 0.4, 
        delay: index * 0.05,
        layout: { duration: 0.3, ease: "easeOut" }
      }}
      className="bg-white rounded-2xl shadow-lg overflow-hidden"
    >
      <div className="p-4 md:p-6 flex flex-col sm:flex-row gap-4">
        {/* Product Image */}
        <Link 
          to={`/products/${item.id}`}
          className="shrink-0"
        >
          <motion.div 
            className="w-full sm:w-32 h-32 rounded-xl overflow-hidden bg-slate-100"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <img
              src={item.thumbnail}
              alt={item.title}
              className="aspect-square w-full h-full object-contain"
            />
          </motion.div>
        </Link>

        {/* Product Info */}
        <div className="flex-1 flex flex-col justify-between min-w-0">
          <div>
            <Link 
              to={`/products/${item.id}`}
              className="hover:text-brand transition-colors"
            >
              <h3 className="text-lg font-semibold text-slate-900 line-clamp-2">
                {item.title}
              </h3>
            </Link>
            <p className="text-xl font-bold text-brand mt-1">
              {formatter.format(item.price)}
            </p>
          </div>

          <div className="flex items-center justify-between mt-4">
            {/* Quantity Selector */}
            <div className="flex items-center gap-2">
              <motion.button
                onClick={() => handleQuantityChange(item.quantity - 1)}
                disabled={isUpdating}
                className="flex items-center justify-center w-8 h-8 rounded-lg border border-slate-300 hover:border-brand hover:bg-brand/5 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                whileTap={{ scale: 0.9 }}
                title={item.quantity === 1 ? "Remove item" : "Decrease quantity"}
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                </svg>
              </motion.button>
              
              <span className="text-lg font-semibold min-w-[2rem] text-center">
                {item.quantity}
              </span>
              
              <motion.button
                onClick={() => handleQuantityChange(item.quantity + 1)}
                disabled={isUpdating}
                className="flex items-center justify-center w-8 h-8 rounded-lg border border-slate-300 hover:border-brand hover:bg-brand/5 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                whileTap={{ scale: 0.9 }}
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </motion.button>
            </div>

            {/* Remove Button */}
            <motion.button
              onClick={handleRemove}
              disabled={isUpdating}
              className="flex items-center gap-1 text-red-600 hover:text-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              <span className="text-sm font-medium hidden sm:inline">Remove</span>
            </motion.button>
          </div>
        </div>

        {/* Item Total */}
        <div className=" md:flex items-start justify-end">
          <p className="flex flex- gap-1 items-center text-xl font-bold text-brand">
            <span className="text-lg font-semibold text-slate-950">Total:</span> {formatter.format(item.price * item.quantity)}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
