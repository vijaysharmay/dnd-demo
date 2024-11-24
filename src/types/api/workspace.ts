import { z } from "zod";
import { UserZSchema } from "./user";

export const WorkspaceMembersZSchema = z.object({
  members: z.array(z.object({
    user: UserZSchema,
    role: z.string()
  }))
})

export type WorkspaceMembersSchema = z.infer<typeof WorkspaceMembersZSchema>