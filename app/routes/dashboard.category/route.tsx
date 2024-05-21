import { MetaFunction } from "@remix-run/node";

import AddCategory from "~/components/sheets/add-category";
import { Button } from "~/components/ui/button";

import { columns } from "./columns";
import { DataTable } from "./data-table";

const data = [
  {
    id: "728ed52f",
    amount: 100,
    status: "pending",
    email: "m@example.com",
  },
]

export const meta: MetaFunction = () => [{ title: "Kategori Barang | Challange" }];

export default function IndexPage() {
  return (
    <div className="min-h-screen w-full flex flex-col gap-6">
      <h1 className="text-2xl font-bold">Kategori Barang</h1>
      <div className="bg-white rounded-2xl p-4 flex flex-col gap-4">
        <div className="flex justify-end">
          <AddCategory>
            <Button size="sm">Buat kategori baru</Button>
          </AddCategory>
        </div>
        <DataTable columns={columns} data={data} />
      </div>
    </div>
  )
}