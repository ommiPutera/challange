import type { Password, User } from "@prisma/client";
import bcrypt from "bcryptjs";

import { prisma } from "~/db.server";

export type { User } from "@prisma/client";

export async function getUserById(id: User["id"]) {
  return prisma.user.findUnique({ where: { id } });
}

export async function getUserByEmail(email: User["email"]) {
  return prisma.user.findUnique({ where: { email } });
}

export async function createUser(email: User["email"], password: string, fullName: string) {
  const hashedPassword = await bcrypt.hash(password, 10);

  return prisma.user.create({
    data: {
      email,
      fullName,
      password: {
        create: {
          hash: hashedPassword,
        },
      },
    },
  });
}

export async function updateUserProfile({
  userId,
  address,
  phoneNumber,
  bod,
  occupation,
  ...rest
}: {
  userId: string
  occupation: string
  bod: string
  address: string
  phoneNumber: string
  email?: string
  fullName?: string
}) {
  return prisma.user.update({
    where: { id: userId },
    data: {
      ...rest,
      address: address,
      phoneNumber: phoneNumber,
      bod: bod,
      occupation: occupation
    }
  }); 
}

export async function setUserAcitve({userId}: { userId: string }) {
  return prisma.user.update({
    where: { id: userId },
    data: {
      isActive: true,
    }
  });
}

export async function deleteUserByEmail(email: User["email"]) {
  return prisma.user.delete({ where: { email } });
}

export async function verifyLogin(
  email: User["email"],
  password: Password["hash"],
) {
  const userWithPassword = await prisma.user.findUnique({
    where: { email },
    include: {
      password: true,
    },
  });

  if (!userWithPassword || !userWithPassword.password) {
    return null;
  }

  const isValid = await bcrypt.compare(
    password,
    userWithPassword.password.hash,
  );

  if (!isValid) {
    return null;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password: _password, ...userWithoutPassword } = userWithPassword;

  return userWithoutPassword;
}

export async function updatePassword(
  userId: User["id"],
  currentPassword: Password['hash'],
  newPassword: string,
) {
  const userWithPassword = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      password: true,
    },
  });

  if (!userWithPassword || !userWithPassword.password) {
    return null;
  }
  
  const isValid = await bcrypt.compare(
    currentPassword,
    userWithPassword.password.hash,
  );

  if (!isValid) {
    return null;
  }

  console.log('isValid', isValid);

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  return prisma.password.update({
    where: { userId },
    data: {
      hash: hashedPassword
    }
  }); 
}