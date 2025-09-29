import type { Route } from "./+types/home";
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
<Manageevent/>

    </>
  );
}
