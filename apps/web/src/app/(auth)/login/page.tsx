import { CarouselQuotes } from "./components/carousel-quotes";
import { LoginForm } from "./components/login-form";

export default function LoginPage() {
  return (
    <div className="h-screen flex p-4">
      <LoginForm />

      <CarouselQuotes />
    </div>
  );
}
