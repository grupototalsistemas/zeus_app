import SignInForm from "@/components/auth/SignInForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Faça Login | Zeus",
  description: "Página de login do sistema Zeus",
};

export default function SignIn() {
  return <SignInForm />;
}
