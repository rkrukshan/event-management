import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [index("routes/home.tsx"),
    route("create","routes/createform/createform.tsx"),
    route("manage","routes/Manageevent/manageevent.tsx"),
    route("book","routes/Userregisterevent/UserEvent.tsx"),

    route("userlogin","routes/userLogin.tsx"),
    route("adminlogin","routes/AdminLogin.tsx"),
    route("createuser","routes/userSignup.tsx")
] satisfies RouteConfig;
