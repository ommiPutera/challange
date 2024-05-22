import { Category } from "@prisma/client";
import { ActionFunctionArgs, MetaFunction, json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import { Button } from "~/components/ui/button";
import { createCategory, getAllCategory, updateCategory } from "~/models/category.server";

import AddCategory from "./add-category";
import { columns } from "./columns";
import { DataTable } from "./data-table";

export enum EnumAction {
  UPDATE = "UPDATE",
  CREATE = "CREATE"
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

  if (typeof categoryName !== 'string') throw new Error('Terjadi Kesalaan')

  switch (_action) {
    case EnumAction.CREATE: {
      return await createCategory(categoryName)
    }
    case EnumAction.UPDATE: {
      if (!categoryId) throw new Error('Terjadi Kesalaan')
      return await updateCategory(String(categoryId), categoryName)
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