import { Item, Category } from "@prisma/client";

import { prisma } from "~/db.server";

export async function getAllItem() {
  return prisma.item.findMany({
    include: {
      category: true
    }
  });
}

export async function getCategory(id: Category['id']) {
  return prisma.category.findUnique({
    where: {
      id
    }
  });
}

export async function createItem(name: Item["name"], brand: Item["brand"], categoryId: Category["id"]) {
  return prisma.item.create({
    data: {
      categoryId,
      name,
      brand
    }
  });
}

export async function updateItem(id: string, name: Item["name"], brand: Item["brand"], categoryId: Category["id"]) {
  return prisma.item.update({
    where: {
      id: id
    },
    data: {
      categoryId,
      name,
      brand
    }
  });
}

export async function deleteItem(id: string) {
  return prisma.item.delete({
    where: {
      id: id
    }
  });
}