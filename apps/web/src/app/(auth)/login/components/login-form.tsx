"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { TrendingUp } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth";

const loginSchema = z.object({
  email: z.email("E-mail invalido"),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
});

type LoginFormType = z.infer<typeof loginSchema>;

export function LoginForm() {
  const router = useRouter();

  const form = useForm<LoginFormType>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function handleSubmit(data: LoginFormType) {
    await authClient.signIn.email(
      {
        email: data.email,
        password: data.password,
      },
      {
        credentials: "include",
        onSuccess() {
          router.push("/dashboard");
        },
      }
    );
  }

  return (
    <div className="size-full flex flex-col items-center justify-center p-6 md:p-12 bg-[#131313] lg:rounded-l-2xl lg:rounded-none rounded-2xl">
      <div className="w-full max-w-md space-y-8">
        <div className="space-y-4">
          <div className="w-12 h-12 rounded-xl bg-[#2A2A2A] flex items-center justify-center">
            <TrendingUp className="w-6 h-6 text-green-600" />
          </div>

          <div>
            <h2 className="text-3xl font-bold tracking-tight">
              Bem-vindo de volta!
            </h2>

            <span>Acesse sua conta para continuar</span>
          </div>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>E-mail</FormLabel>
                  <FormControl>
                    <Input placeholder="E-mail" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Senha</FormLabel>
                  <FormControl>
                    <Input placeholder="••••••••" type="password" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <Button className="w-full" type="submit">
              Entrar
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
