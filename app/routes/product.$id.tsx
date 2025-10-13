import { useLoaderData, useNavigate, useFetcher } from "react-router";
import type { Route } from "./+types/product.$id";
import type { Product } from "~/utils/api.server";
import { formatter, toDisplayName } from "~/utils/formatters";
import { motion, AnimatePresence } from "motion/react";
import { useState, useRef, useEffect } from "react";
import { fetchProduct } from "~/utils/api.server";
import {
  commitCartSession,
  getCartFromSession,
  getCartSession,
  setCartOnSession,
  upsertCartItem,
} from "../utils/cart.server";
import { ReviewCard } from "~/components/ReviewCard";

export async function loader({ params }: Route.LoaderArgs) {
  const productId = params.id;
  const product = await fetchProduct(productId);

  if (!product) {
    throw new Response("Product not found", { status: 404 });
  }
  
  return { product };
}

type ActionData = {
  status: "success" | "error";
  message: string;
};

export async function action({ request, params}: Route.ActionArgs) {
  const formData = await request.formData();
  const intent = formData.get("intent");


  if (intent !== "add-to-cart") {
    return Response.json(
      { status: "error", message: "Unsupported action" },
      { status: 400 }
    );
  }

  const productId = params.id;
  if (!productId) {
    return Response.json(
      { status: "error", message: "Product id is required" },
      { status: 400 }
    );
  }

  const requestedQuantity = Number(formData.get("quantity"));
  const normalizedQuantity = Number.isFinite(requestedQuantity)
    ? Math.floor(requestedQuantity)
    : 1;

  const product = await fetchProduct(productId);

  if (product.stock && product.stock <= 0) {
    return Response.json(
      { status: "error", message: "This product is currently out of stock." },
      { status: 409 }
    );
  }

  // Clamp on the server (authoritative)
  const safeQuantity = Math.max(
    1,
    Math.min(normalizedQuantity || 1, product.stock || 99, 99)
  );

  const session = await getCartSession(request);
  const cart = getCartFromSession(session);

  const updatedCart = upsertCartItem(cart, {
    id: product.id,
    title: product.title,
    price: product.price,
    thumbnail: product.thumbnail,
    quantity: safeQuantity,
  });

  setCartOnSession(session, updatedCart);

  return Response.json(
    {
      status: "success",
      message: `${product.title} was added to your cart.`,
    },
    {
      headers: {
        "Set-Cookie": await commitCartSession(session),
      },
    }
  );
}


export function meta({ data }: Route.MetaArgs) {
  if (!data?.product) {
    return [{ title: "Product Not Found" }];
  }
  
  return [
    { title: `${data.product.title} - LTP Labs Store` },
    { name: "description", content: data.product.description },
  ];
}


export default function Product() {
  const { product } = useLoaderData<typeof loader>();
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const imageRef = useRef<HTMLDivElement>(null);
  
  const fetcher = useFetcher<ActionData>();
  const [quantity, setQuantity] = useState(1);

  const images = product.images || [product.thumbnail];
  const discount = product.discountPercentage || 0;
  const originalPrice = discount > 0 ? product.price / (1 - discount / 100) : product.price;
  const stock = product.stock ?? 0;
  const maxQuantity = stock !== undefined && stock > 0 ? Math.min(stock, 99) : 1;


  const handleAddToCart = () => { 
    // Add to cart logic here
    console.log(`Added ${quantity} of ${product.title} to cart`); 
    
    // Trigger animation
    setIsAnimating(true);
    
    // Reset animation after it completes
    setTimeout(() => {
      setIsAnimating(false);
    }, 1000);
  };

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
          <span className="font-medium">Back to products</span>
        </button>
      </div>

      {/* Product Detail Section */}
      <div className="w-[95vw] max-w-7xl bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="grid md:grid-cols-2 gap-8 p-6 md:p-10">
          
          {/* Image Gallery */}
          <div className="flex flex-col gap-4">
            {/* Main Image */}
            <motion.div
              ref={imageRef}
              key={selectedImage}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="aspect-square rounded-2xl overflow-hidden bg-slate-100"
            >
              <img
                src={images[selectedImage]}
                alt={product.title}
                className="w-full h-full object-cover"
              />
            </motion.div>

            {/* Thumbnail Gallery */}
            {images.length > 1 ? (
              <div className="flex gap-3 overflow-x-auto scrollbar-hide">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-400 ${
                    selectedImage === index
                      ? 'border-brand'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.title} - ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
            ) : null}
          
          </div>

          {/* Product Info */}
          <div className="flex flex-col gap-4">
            {/* Category Badge */}
            <span className="inline-flex items-center w-fit rounded-full bg-brand/10 text-sm font-medium text-brand uppercase tracking-wide">
              {toDisplayName(product.category)}
            </span>

            {/* Title & Brand */}
            <div className="overflow-hidden">
              <motion.h1 className="text-3xl md:text-4xl font-bold text-slate-900 font-grotesk">
                {product.title.split(' ').map((word, index) => (
                  <motion.span
                    key={index}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ 
                      duration: 0.4, 
                      delay: index * 0.05,
                      ease: "easeOut" 
                    }}
                    className="inline-block mr-[0.25em]"
                  >
                    {word}
                  </motion.span>
                ))}
              </motion.h1>
            </div>
            <div className="overflow-hidden">  
              {product.brand && (
                <motion.p 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
                  className="text-lg text-slate-500"
                >
                  by <span className="font-semibold mb-2">{product.brand}</span>
                </motion.p>
              )}
            </div>

            {/* Rating */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`h-5 w-5 ${
                      i < product.rating ? 'text-yellow-400' : 'text-slate-300'
                    }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-slate-600 font-medium">
                {Math.round(product.rating * 10) / 10} out of 5
              </span>
            </div>

            {/* Price */}
            <div className="flex gap-3 items-center">
              <span className="text-4xl font-bold text-brand">
                {formatter.format(product.price)}
              </span>
              {discount > 0 && (
                <>
                  <span className="text-2xl text-slate-400 line-through">
                    {formatter.format(originalPrice)}
                  </span>
                  <motion.span 
                    className="rounded-full bg-rose-500 px-3 py-1 text-sm font-semibold text-white inline-block"
                    animate={{ 
                      rotate: [0, -8, 8, -8, 8, -4, 4, 0],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      repeatDelay: 2,
                      ease: "easeInOut"
                    }}
                  >
                    -{Math.round(discount)}%
                  </motion.span>
                </>
              )}
            </div>

            {/* Stock Status */}
            {stock !== undefined && (
              <div className="flex items-center gap-2">
                <div className={`h-2 w-2 rounded-full ${stock > 0 ? 'bg-green-500' : 'bg-red-500'}`} />
                <span className={`text-sm font-medium ${stock > 0 ? 'text-green-700' : 'text-red-700'}`}>
                  {stock > 0 ? `${stock} in stock` : 'Out of stock'}
                </span>
              </div>
            )}

            {/* Description */}
            <div>
              <motion.h3 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
                className="text-lg font-semibold text-slate-900 mb-2"
              >
                Description
              </motion.h3>
              <div className="overflow-hidden">
                <motion.p className="text-slate-600 leading-relaxed">
                  {product.description.split(' ').map((word, index) => (
                    <motion.span
                      key={index}
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ 
                        duration: 0.4, 
                        delay: 0.3 + (index * 0.02),
                        ease: "easeOut" 
                      }}
                      className="inline-block mr-[0.25em]"
                    >
                      {word}
                    </motion.span>
                  ))}
                </motion.p>
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-slate-700">Quantity</label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="flex items-center justify-center w-10 h-10 rounded-lg border border-slate-300 hover:border-brand hover:bg-brand/5 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={quantity <= 1}
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                  </svg>
                </button>
                <span className="text-xl font-semibold min-w-[3rem] text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(maxQuantity, quantity + 1))}
                  className="flex items-center justify-center w-10 h-10 rounded-lg border border-slate-300 hover:border-brand hover:bg-brand/5 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={quantity >= maxQuantity}
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </button>
              </div>
              {stock !== undefined && quantity >= stock && (
                <p className="text-xs text-amber-600">Maximum available quantity reached</p>
              )}
            </div>

            {/* Add to Cart Button */}
            <motion.button
              onClick={handleAddToCart}
              disabled={stock === 0 }
              className="relative flex items-center justify-center gap-2 bg-primary text-brand font-semibold py-4 px-6 rounded-lg overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={stock !== 0 ? "hover" : undefined}
              whileTap={stock !== 0 ? { scale: 0.98 } : undefined}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              <div className="relative text-xl overflow-hidden flex items-center gap-2">
                <motion.span
                  initial={{ y: 0 }}
                  variants={{
                    hover: { y: "-100%" },
                  }}
                  transition={{ duration: 0.25, ease: "easeInOut" }}
                  className="block"
                >
                  Add to Cart
                </motion.span>
                <motion.span
                  initial={{ y: "100%" }}
                  variants={{
                    hover: { y: 0 }
                  }}
                  transition={{ duration: 0.25, ease: "easeInOut" }}
                  className="block absolute inset-0"
                >
                  Add to Cart
                </motion.span>
              </div>
            
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 32 32">
                <path d="M10,20a1,1,0,0,1-1-.8L6.66,7.41A3,3,0,0,0,3.72,5H2A1,1,0,0,1,2,3H3.72a5,5,0,0,1,4.9,4L11,18.8A1,1,0,0,1,10.2,20Z"/>
                <path d="M11,27H9.14a4.14,4.14,0,0,1-.38-8.26l18.41-1.67L28.78,9H8A1,1,0,0,1,8,7H30a1,1,0,0,1,.77.37A1,1,0,0,1,31,8.2l-2,10a1,1,0,0,1-.89.8L8.94,20.74A2.13,2.13,0,0,0,9.14,25H11a1,1,0,0,1,0,2Z"/>
                <path d="M26,30a4,4,0,1,1,4-4A4,4,0,0,1,26,30Zm0-6a2,2,0,1,0,2,2A2,2,0,0,0,26,24Z"/>
                <path d="M14,30a4,4,0,1,1,4-4A4,4,0,0,1,14,30Zm0-6a2,2,0,1,0,2,2A2,2,0,0,0,14,24Z"/>
              </svg>
            </motion.button>              
          </div>
        </div>
      </div>

      {/* Flying Image Animation */}
      <AnimatePresence>
        {isAnimating && imageRef.current && (
          <motion.div
            initial={{
              position: 'fixed',
              left: imageRef.current.getBoundingClientRect().left,
              top: imageRef.current.getBoundingClientRect().top,
              width: imageRef.current.getBoundingClientRect().width,
              height: imageRef.current.getBoundingClientRect().height,
              opacity: 1,
              zIndex: 9999,
            }}
            animate={{
              left: window.innerWidth - 350,
              top: 0,
              width: 60,
              height: 60,
              opacity: 0,
              scale: 0,
            }}
            transition={{
              duration: 1.4,
              ease: [0.43, 0.13, 0.23, 0.96],
              opacity: { delay: 1, duration: 1 }
            }}
            className="pointer-events-none "
          >
            <img
              src={images[selectedImage]}
              alt={product.title}
              className="w-full h-full object-cover"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reviews Section */}
      {product.reviews && product.reviews.length > 0 && (
        <div className="w-[95vw] max-w-7xl px-4">
          <div className="mb-6">
            <h2 className="text-3xl font-bold text-slate-900 font-grotesk mb-2">Customer Reviews</h2>
            <p className="text-slate-600">See what our customers are saying about this product</p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {product.reviews.map((review, index) => (
              <ReviewCard key={index} review={review} index={index} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}