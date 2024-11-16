import { z } from "zod";

export const LOGIN_URL = "";

export const LoginFormZSchema = z
  .object({
    email: z.string().email(),
    passwd: z.string().min(6, "Password needs to be atleast 6 characters"),
  })
  .required();

export type LoginFormSchema = z.infer<typeof LoginFormZSchema>;

const AuthZResponse = z.object({
  accessToken: z.string().min(1),
});

export type AuthResponse = z.infer<typeof AuthZResponse>;

export const loginUser = async (
  values: LoginFormSchema
): Promise<AuthResponse> => {
  const url = "http://localhost:3000/auth/login";
  const response = await fetch(url, {
    method: "POST",
    body: JSON.stringify(values),
    headers: new Headers({
      "Content-Type": "application/json",
      Accept: "application/json",
    }),
  });

  if (response.status !== 201) {
    throw new Error(`Server Error: ${JSON.stringify(response.text())}`);
  }

  const data = await response.json();
  const result = AuthZResponse.safeParse(data);

  if (!result.success) {
    throw new Error("Invalid details");
  }

  return result.data;
};
