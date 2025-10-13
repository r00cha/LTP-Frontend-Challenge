import { createCookieSessionStorage } from "react-router";

export type CartItem = {
  id: number;
  title: string;
  price: number;
  thumbnail: string;
  quantity: number;
};

const CART_KEY = "cart";

const sessionSecret = process.env.SESSION_SECRET ?? "development-session-secret";

const cartSessionStorage = createCookieSessionStorage({
  cookie: {
    name: "rr-cart",
    sameSite: "lax",
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 7, // 1 week
    secrets: [sessionSecret],
    path: "/",
    secure: process.env.NODE_ENV === "production",
  },
});

export async function getCartSession(request: Request) {
  const cookie = request.headers.get("cookie");
  return cartSessionStorage.getSession(cookie);
}

type CartSession = Awaited<ReturnType<typeof getCartSession>>;

export function getCartFromSession(session: CartSession) {
  const cart = session.get(CART_KEY) as CartItem[] | undefined;
  return cart ?? [];
}

export function setCartOnSession(
  session: CartSession,
  cart: CartItem[],
) {
  session.set(CART_KEY, cart);
}

export function clearCart(session: CartSession) {
  session.unset(CART_KEY);
}

export function commitCartSession(session: CartSession) {
  return cartSessionStorage.commitSession(session);
}

export function destroyCartSession(session: CartSession) {
  return cartSessionStorage.destroySession(session);
}

export function getCartCount(cart: CartItem[]) {
  return cart.reduce((total, item) => total + item.quantity, 0);
}

export function upsertCartItem(cart: CartItem[], incomingItem: CartItem) {
  const existing = cart.find((item) => item.id === incomingItem.id);
  if (existing) {
    return cart.map((item) =>
      item.id === incomingItem.id
        ? { ...item, quantity: item.quantity + incomingItem.quantity }
        : item,
    );
  }
  return [...cart, incomingItem];
}

export function updateCartItemQuantity(cart: CartItem[], id: number, quantity: number) {
  if (quantity <= 0) {
    return cart.filter((item) => item.id !== id);
  }
  return cart.map((item) => (item.id === id ? { ...item, quantity } : item));
}
