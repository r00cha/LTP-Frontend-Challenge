import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
    index("routes/home.tsx"),
    route("/products/:id", "routes/product.$id.tsx"),
] satisfies RouteConfig;
