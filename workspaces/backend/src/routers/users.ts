import { userService } from "../services";
import { t } from "../trpc";
import { z } from "zod";

const userProcedure = t.procedure

export const userRouter = t.router({
  getAll: userProcedure
    .query(async () => {
      const users = await userService.getAll();
      return users
    }),

  saveUser: userProcedure
    .input(z.object({
      fullName: z.string(),
      lastName: z.string(),
    }))
    .query(async (opts) => {
      const newUser = {
        fullName: opts.input.fullName,
        lastName: opts.input.lastName,
      };
      return await userService.saveUser(newUser);
    }),

  editUser: userProcedure
    .input(z.object({
      id: z.number(),
      fullName: z.string(),
      lastName: z.string(),
    }))
    .query(async (opts) => {
      const user = {
        id: opts.input.id,
        fullName: opts.input.fullName,
        lastName: opts.input.lastName,
      };
      return await userService.editUser(user);
    }),

  deleteUser: userProcedure
    .input(z.object({
      id: z.number(),
    }))
    .query(async (opts) => {
      return await userService.deleteUser(opts.input.id);
    }),
})