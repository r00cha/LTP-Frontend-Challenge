import { useLoaderData, useNavigate } from "react-router";
import type { Route } from "./+types/cart";
import { motion, AnimatePresence } from "motion/react";
import {
  getCartSession,
  getCartFromSession,
  setCartOnSession,
  commitCartSession,
  updateCartItemQuantity,
  clearCart,
} from "~/utils/cart.server";
import { CartItemCard } from "~/components/cart/CartItemCard";
import { OrderSummary } from "~/components/cart/OrderSummary";
import { EmptyCart } from "~/components/cart/EmptyCart";

export async function loader({ request }: Route.LoaderArgs) {
  const session = await getCartSession(request);
  const cart = getCartFromSession(session);
  
  const subtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);
  const tax = subtotal * 0.1; // 10% tax
  const shipping = cart.length > 0 ? 9.99 : 0;
  const total = subtotal + tax + shipping;
  
  return { 
    cart,
    subtotal,
    tax,
    shipping,
    total,
  };
}

type ActionData = {
  status: "success" | "error";
  message: string;
};

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const intent = formData.get("intent");
  const session = await getCartSession(request);
  const cart = getCartFromSession(session);

  if (intent === "update-quantity") {
    const itemId = Number(formData.get("itemId"));
    const quantity = Number(formData.get("quantity"));

    if (!Number.isFinite(itemId) || !Number.isFinite(quantity)) {
      return Response.json(
        { status: "error", message: "Invalid item or quantity" },
        { status: 400 }
      );
    }

    const updatedCart = updateCartItemQuantity(cart, itemId, quantity);
    setCartOnSession(session, updatedCart);

    return Response.json(
      { status: "success", message: "Cart updated" },
      {
        headers: {
          "Set-Cookie": await commitCartSession(session),
        },
      }
    );
  }

  if (intent === "remove-item") {
    const itemId = Number(formData.get("itemId"));
    
    if (!Number.isFinite(itemId)) {
      return Response.json(
        { status: "error", message: "Invalid item" },
        { status: 400 }
      );
    }

    const updatedCart = cart.filter((item) => item.id !== itemId);
    setCartOnSession(session, updatedCart);

    return Response.json(
      { status: "success", message: "Item removed from cart" },
      {
        headers: {
          "Set-Cookie": await commitCartSession(session),
        },
      }
    );
  }

  if (intent === "clear-cart") {
    clearCart(session);

    return Response.json(
      { status: "success", message: "Cart cleared" },
      {
        headers: {
          "Set-Cookie": await commitCartSession(session),
        },
      }
    );
  }

  return Response.json(
    { status: "error", message: "Invalid action" },
    { status: 400 }
  );
}

export function meta() {
  return [
    { title: "Shopping Cart - LTP Labs Store" },
    { name: "description", content: "View and manage your shopping cart" },
  ];
}

export default function Cart() {
  const { cart, subtotal, tax, shipping, total } = useLoaderData<typeof loader>();
  const navigate = useNavigate();

  return (
    <div className="w-full mt-28 flex flex-col gap-6 items-center pb-12">
      {/* Back Button */}
      <div className="w-[95vw] max-w-7xl -mb-2">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1 text-slate-600 hover:text-brand transition-colors duration-200 group"
        >
          <svg
            className="h-5 w-5 transition-transform duration-200 group-hover:-translate-x-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="font-medium">Continue shopping</span>
        </button>
      </div>

      {/* Page Title */}
      <div className="w-[95vw] max-w-7xl px-2">
        <h1 className="text-4xl md:text-5xl font-bold text-brand font-grotesk">Shopping Cart </h1>
        
        <p className="text-slate-600 mt-2">
          {cart.length === 0 
            ? "Your cart is empty" 
            : `${cart.length} ${cart.length === 1 ? 'item' : 'items'} in your cart`
          }
        </p>
      </div>

      {cart.length === 0 ? (
        <EmptyCart />
      ) : (
        <div className="w-[95vw] max-w-7xl grid lg:grid-cols-3 gap-6">
          {/* Cart Items */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <AnimatePresence mode="popLayout">
              {cart.map((item, index) => (
                <CartItemCard key={item.id} item={item} index={index} />
              ))}
            </AnimatePresence>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <OrderSummary 
              subtotal={subtotal}
              tax={tax}
              shipping={shipping}
              total={total}
            />
          </div>
        </div>
      )}
    </div>
  );
}
