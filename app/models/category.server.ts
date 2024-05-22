import { Category } from "@prisma/client";

import { prisma } from "~/db.server";

export async function getAllCategory() {
  return prisma.category.findMany();
}

export async function createCategory(name: Category["name"]) {
  return prisma.category.create({
    data: {
      name: name
    }
  });
}

export async function updateCategory(id: string, name: Category["name"]) {
  return prisma.category.update({
    where: {
      id: id
    },
    data: {
      name: name
    }
  });
}