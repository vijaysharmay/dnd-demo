import {
  AuthResponse,
  LoginFormSchema,
  LoginFormZSchema,
  loginUser,
} from "@/api";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import useAuthStore from "@/store/auth-store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { navigate } from "wouter/use-browser-location";

export function LoginForm() {
  const form = useForm<LoginFormSchema>({
    resolver: zodResolver(LoginFormZSchema),
    values: {
      email: "",
      passwd: "",
    },
  });

  const authStore = useAuthStore();

  const loginMutation = useMutation({
    mutationFn: loginUser,
    onSuccess: (data: AuthResponse) => {
      authStore.login(data.accessToken);
      navigate("/home");
    },
    onError: (error: Error) => {
      alert(error.message);
    },
  });

  const onSubmit = (values: LoginFormSchema) => {
    loginMutation.mutate(values);
  };

  return (
    <Card className="mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">Login</CardTitle>
        <CardDescription>
          Enter your email & password below to login to the concord platform
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your microsoft email address"
                      className={cn(
                        form.formState.errors["email"] && "bg-red-50"
                      )}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="passwd"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Enter your password"
                      className={cn(
                        form.formState.errors["password"] && "bg-red-50"
                      )}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="text-center">
              <Button className="mt-2" type="submit">
                Login
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
