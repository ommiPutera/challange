import { MetaFunction } from "@remix-run/node";

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
    <div className="min-h-screen w-full">
      <DataTable columns={columns} data={data} />
    </div>
  )
}