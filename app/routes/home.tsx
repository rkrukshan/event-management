import type { Route } from "./+types/home";
import "react-toastify/dist/ReactToastify.css";
import { Bounce, ToastContainer } from "react-toastify";
import UserSignup from "~/routes/userSignup";
import { Link } from "react-router-dom";
import UserLogin from "./UserLogin";
import AdminLogin from "./AdminLogin";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Tech Events App" },
    { name: "description", content: "Welcome to Tech Events!" },
  ];
}

export default function Home() {
  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        transition={Bounce}
      />
      <UserLogin />
    </>
  );
}
