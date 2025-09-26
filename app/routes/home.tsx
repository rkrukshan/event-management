import UserLogin from "~/components/UserLogin";
import type { Route } from "./+types/home";
import AdminLogin from "~/components/AdminLogin";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  return (<>
  <AdminLogin />
  <UserLogin />
  </>);
}
