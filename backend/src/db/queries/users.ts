import { eq } from "drizzle-orm";
import { db } from "../index.js";
import { users } from "../schema.js";

export async function createUser(
  email: string,
  username: string,
  hashedPassword: string,
  authority: string[] = ["USER"],
) {
  const [result] = await db
    .insert(users)
    .values({ email, username, hashedPassword, authority })
    .onConflictDoNothing()
    .returning();
  return result;
}

export async function deleteAllUsers() {
  await db.delete(users);
}

export async function getUserByEmail(email: string) {
  const result = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  return result[0];
}

export async function getUserByUsername(username: string) {
  const result = await db
    .select()
    .from(users)
    .where(eq(users.username, username))
    .limit(1);

  return result[0];
}

export async function updateUsers(
  email: string,
  username: string,
  hashedPassword: string,
  userID: string,
) {
  const [updatedUser] = await db
    .update(users)
    .set({
      email,
      username,
      hashedPassword,
      updatedAt: new Date(),
    })
    .where(eq(users.id, userID))
    .returning({
      id: users.id,
      username: users.username,
      createdAt: users.createdAt,
      updatedAt: users.updatedAt,
      email: users.email,
    });

  return updatedUser;
}
