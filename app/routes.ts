import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("userlogin", "routes/userLogin.tsx"),
  route("adminlogin", "routes/AdminLogin.tsx"),
  route("userCreate", "routes/userSignup.tsx"),
] satisfies RouteConfig;
