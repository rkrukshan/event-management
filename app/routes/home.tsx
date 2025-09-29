import type { Route } from "./+types/home";
import AdminLogin from "~/routes/AdminLogin";
import "react-toastify/dist/ReactToastify.css";
import { Bounce, ToastContainer } from "react-toastify";
import UserSignup from "~/routes/userSignup";
import UserLogin from "./userLogin";
import AdminLogin from "~/components/AdminLogin";
import { Link } from "react-router-dom";
import Manageevent from "./Manageevent/manageevent";
import UserEventBooking from "./Userregisterevent/UserEvent";


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
      <AdminLogin />
      <UserLogin />
      <UserSignup />
    </>
  );
}
