import { navigate } from "wouter/use-browser-location";

import { LoginForm } from "./login-form";

export default function Auth() {
  const token = sessionStorage.getItem("accessToken");
  if (token) {
    navigate("/home");
  }

  return (
    <div className="flex h-screen bg-white">
      <div className="m-auto">
        <div className="text-5xl text-center font-pacifico">Concord</div>
        <div className="py-4 text-md text-center text-muted-foreground">
          A collaborative platform for building great user experiences
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
