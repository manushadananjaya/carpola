import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ["query"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

// Helper functions for interacting with Prisma

/**
 * Get a user by email from the database
 * @param email - The email of the user
 * @returns The user object if found, null otherwise
 */
export const getUserByEmail = async (userEmail: string) => {
  return await prisma.user.findUnique({
    where: {
      userEmail, // Since userEmail is unique
    },
  });
};


/**
 * Update user data in the database
 * @param email - The email of the user
 * @param data - The new data to update
 * @returns The updated user object
 */
export const updateUser = async (
  userEmail: string,
  data: Record<string, any>
) => {
  return await prisma.user.update({
    where: {
      userEmail,
    },
    data,
  });
};

/**
 * Delete a user from the database by email
 * @param email - The email of the user to delete
 * @returns The deleted user object
 */
export const deleteUserByEmail = async (userEmail: string) => {
  return await prisma.user.delete({
    where: {
      userEmail,
    },
  });
};
