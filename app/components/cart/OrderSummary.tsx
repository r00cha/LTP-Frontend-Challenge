import { useFetcher } from "react-router";
import { motion } from "motion/react";
import { formatter } from "~/utils/formatters";

interface OrderSummaryProps {
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
}

export function OrderSummary({ subtotal, tax, shipping, total }: OrderSummaryProps) {
  const fetcher = useFetcher();

  const handleClearCart = () => {
    if (confirm("Are you sure you want to clear your cart?")) {
      const formData = new FormData();
      formData.set("intent", "clear-cart");
      fetcher.submit(formData, { method: "post", action: "/cart" });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="bg-white rounded-2xl shadow-lg p-6 sticky top-32"
    >
      <h2 className="text-2xl font-bold text-brand font-grotesk mb-6">
        Order Summary
      </h2>

      <div className="space-y-4">
        <div className="flex justify-between text-slate-600">
          <span>Subtotal</span>
          <span className="font-semibold">{formatter.format(subtotal)}</span>
        </div>
        
        <div className="flex justify-between text-slate-600">
          <span>Tax (10%)</span>
          <span className="font-semibold">{formatter.format(tax)}</span>
        </div>
        
        <div className="flex justify-between text-slate-600">
          <span>Shipping</span>
          <span className="font-semibold">{formatter.format(shipping)}</span>
        </div>

        <div className="border-t border-slate-200 pt-4">
          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold text-slate-900">Total</span>
            <span className="text-2xl font-bold text-brand">
              {formatter.format(total)}
            </span>
          </div>
        </div>
      </div>

      <motion.button
        className="w-full mt-6 bg-brand text-primary font-semibold py-4 px-6 rounded-lg overflow-hidden"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.2 }}
      >
        Proceed to Checkout
      </motion.button>

      <motion.button
        onClick={handleClearCart}
        disabled={fetcher.state !== "idle"}
        className="w-full mt-3 bg-slate-100 text-slate-700 font-medium py-3 px-6 rounded-lg hover:bg-slate-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.2 }}
      >
        Clear Cart
      </motion.button>

      <div className="mt-6 p-4 bg-green-50 rounded-lg">
        <div className="flex items-start gap-2">
          <svg className="h-5 w-5 text-green-600 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <div>
            <p className="text-sm font-semibold text-green-900">Free returns</p>
            <p className="text-xs text-green-700 mt-1">
              30-day return policy on all items
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
