import { Item } from "@prisma/client";
import { ActionFunctionArgs, MetaFunction, json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import { Button } from "~/components/ui/button";
import { getAllCategory } from "~/models/category.server";
import { createItem, getAllItem, updateItem } from "~/models/item.server";

import AddItem from "./add-item";
import { columns } from "./columns";
import { DataTable } from "./data-table";


export enum EnumAction {
  UPDATE = "UPDATE",
  CREATE = "CREATE"
}

export const loader = async () => {
  const categories = await getAllCategory();
  const items: Item[] = await getAllItem();

  return json(
    { items, categories },
    { status: 200 }
  );
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const itemName = formData.get("item-name");
  const itemBrand = formData.get("item-brand");
  const itemCategoryId = formData.get("item-category");

  const itemId = formData.get("item-id");

  const _action = formData.get("_action");

  switch (_action) {
    case EnumAction.CREATE: {
      if (
        typeof itemName !== 'string' ||
        typeof itemBrand !== 'string' ||
        typeof itemCategoryId !== 'string'
      ) throw new Error('Terjadi Kesalaan')

      return await createItem(
        itemName,
        itemBrand,
        itemCategoryId
      )
    }
    case EnumAction.UPDATE: {
      if (
        !itemId ||
        typeof itemName !== 'string' ||
        typeof itemBrand !== 'string' ||
        typeof itemCategoryId !== 'string'
      ) throw new Error('Terjadi Kesalaan')
      return await updateItem(
        String(itemId),
        itemName,
        itemBrand,
        itemCategoryId
      )
    }
  }
}

export const meta: MetaFunction = () => [{ title: "Daftar Barang | Challange" }];

export default function IndexPage() {
  const { items } = useLoaderData<typeof loader>();

  return (
    <div className="min-h-screen w-full flex flex-col gap-6">
      <h1 className="text-2xl font-bold">Daftar Barang</h1>
      <div className="bg-white rounded-2xl p-4 flex flex-col gap-4">
        <div className="flex justify-end">
          <AddItem>
            <Button size="sm">Buat barang baru</Button>
          </AddItem>
        </div>
        <DataTable
          columns={columns}
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          data={items}
        />
      </div>
    </div>
  )
}