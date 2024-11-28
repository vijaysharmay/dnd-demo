import {
  CurrentUserResponse,
  CurrentUserZResponse,
  UserSchema,
  UserZSchema,
} from "@/types/api/user";
import { z } from "zod";

export const getUser = async (): Promise<CurrentUserResponse> => {
  // for showcasing loading icon
  // await new Promise((resolve) => setTimeout(resolve, 2000));
  const accessToken = sessionStorage.getItem("accessToken");

  if (!accessToken) {
    throw new Error("Couldnt find access token");
  }

  const url = `http://localhost:3000/me`;
  const response = await fetch(url, {
    headers: new Headers({
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${accessToken}`,
    }),
  });

  if (response.status !== 200) {
    throw new Error(`Server Error: ${JSON.stringify(response.text())}`);
  }

  const data = await response.json();
  const result = CurrentUserZResponse.safeParse(data);

  // console.log(result.error, data);
  if (!result.success) {
    throw new Error("Error fetching current user details");
  }

  return result.data;
};

export const getUsers = async (searchValue: string): Promise<UserSchema[]> => {
  // for showcasing loading icon
  // await new Promise((resolve) => setTimeout(resolve, 2000));
  const accessToken = sessionStorage.getItem("accessToken");

  if (!accessToken) {
    throw new Error("Couldnt find access token");
  }
  const url = `http://localhost:3000/user?search=${encodeURIComponent(searchValue)}`;
  const response = await fetch(url, {
    headers: new Headers({
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${accessToken}`,
    }),
  });

  if (response.status !== 200) {
    throw new Error(`Server Error: ${JSON.stringify(response.text())}`);
  }

  const data = await response.json();
  const result = z.array(UserZSchema).safeParse(data);

  if (!result.success) {
    throw new Error("Error fetching current user details");
  }

  return result.data;
};
