import { eq, ne } from "drizzle-orm";
import { usersTable } from "../../drizzle/schema";
import { db } from "../config/dbConnection";
import { CreateUser, UpdateUser } from "../types/user";
import { date } from "joi";

export const create = async (data: CreateUser) => {
  try {
    return await db.insert(usersTable).values(data);
  } catch (error) {
    throw error;
  }
};

export const update = async (data: UpdateUser) => {
  try {
    return await db
      .update(usersTable)
      .set(data)
      .where(eq(usersTable.user_id, data.user_id));
  } catch (error) {
    throw error;
  }
};

export const updateRole = async (
  role: "HOSTER" | "RENTER",
  user_id: string
) => {
  try {
    return await db
      .update(usersTable)
      .set({ role })
      .where(eq(usersTable.user_id, user_id));
  } catch (error) {
    throw error;
  }
};
export const updateEmail = async (newEmail: string, user_id: string) => {
  try {
    return await db
      .update(usersTable)
      .set({ email: newEmail })
      .where(eq(usersTable.user_id, user_id));
  } catch (error) {
    throw error;
  }
};

export const deleteAccount = async (user_id: string) => {
  try {
    return await db
      .update(usersTable)
      .set({ deleted_at: new Date(), status: "DELETED" })
      .where(eq(usersTable.user_id, user_id));
  } catch (error) {
    throw error;
  }
};

export const findByEmail = async (email: string) => {
  try {
    return await db.query.usersTable.findFirst({
      where: eq(usersTable.email, email),
    });
  } catch (error) {
    throw error;
  }
};

export const findMany = async () => {
  try {
    return await db.query.usersTable.findMany({
      where: ne(usersTable.status, "DELETED"),
    });
  } catch (error) {
    throw error;
  }
};

export const findById = async (user_id: string) => {
  try {
    return await db.query.usersTable.findFirst({
      where: eq(usersTable.user_id, user_id),
    });
  } catch (error) {
    throw error;
  }
};

export const forgetPassword = async (
  data: {
    password_changed_at: Date;
    password_reset_experis_in: Date;
    password_reset_token: string;
  },
  user_id: string
) => {
  try {
    return await db
      .update(usersTable)
      .set(data)
      .where(eq(usersTable.user_id, user_id));
  } catch (error) {
    throw error;
  }
};

export const updatePassword = async (password: string, user_id: string) => {
  try {
    return await db
      .update(usersTable)
      .set({
        password,
        password_reset_token: null,
        password_changed_at: new Date(),
      })
      .where(eq(usersTable.user_id, user_id));
  } catch (error) {
    throw error;
  }
};
export default {
  create,
  update,
  updateEmail,
  updatePassword,
  updateRole,
  deleteAccount,
  findByEmail,
  findById,
  findMany,
  forgetPassword,
};
