import { Category } from "@prisma/client";
import { ActionFunctionArgs, MetaFunction, json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { jsonWithError } from "remix-toast";

import { Button } from "~/components/ui/button";
import { checkCategory, createCategory, deleteCategory, getAllCategory, updateCategory } from "~/models/category.server";

import AddCategory from "./add-category";
import { columns } from "./columns";
import { DataTable } from "./data-table";



export enum EnumAction {
  UPDATE = "UPDATE",
  CREATE = "CREATE",
  DELETE = "DELETE",
}

export const loader = async () => {
  const categories = await getAllCategory();
  return json(
    { categories },
    { status: 200 }
  );
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const categoryName = formData.get("category-name");
  const categoryId = formData.get("category-id");

  const _action = formData.get("_action");

  switch (_action) {
    case EnumAction.CREATE: {
      if (typeof categoryName !== 'string') throw new Error('Terjadi Kesalaan')
      await createCategory(categoryName)

      return json(
        { errors: { message: "" } },
        { status: 200 },
      );
    }
    case EnumAction.UPDATE: {
      if (!categoryId || typeof categoryName !== 'string') throw new Error('Terjadi Kesalaan')
      await updateCategory(String(categoryId), categoryName)

      return json(
        { errors: { message: "" } },
        { status: 200 },
      );
    }
    case EnumAction.DELETE: {
      if (!categoryId) throw new Error('Terjadi Kesalaan')
      const category = await checkCategory(String(categoryId))
      if (category?.Item.length) {
        return jsonWithError(null, `Kategori ${category.name} masih memiliki keterkaitan dengan data Daftar Barang!`);
      }

      await deleteCategory(String(categoryId))
      return json(
        { errors: { message: "" }, toast: { message: "woi" } },
        { status: 200 },
      );
    }
  }
}

export const meta: MetaFunction = () => [{ title: "Kategori Barang | Challange" }];

export default function IndexPage() {
  const { categories } = useLoaderData<typeof loader>();

  return (
    <div className="min-h-screen w-full flex flex-col gap-6">
      <h1 className="text-2xl font-bold">Kategori Barang</h1>
      <div className="bg-white rounded-2xl p-4 flex flex-col gap-4">
        <div className="flex justify-end">
          <AddCategory>
            <Button size="sm">Buat kategori baru</Button>
          </AddCategory>
        </div>
        <DataTable columns={columns} data={categories as unknown as Category[]} />
      </div>
    </div>
  )
}