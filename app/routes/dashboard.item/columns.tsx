import { Category, Item } from "@prisma/client";
import { ColumnDef, Row } from "@tanstack/react-table";
import { format } from "date-fns";
import { id as localeID } from "date-fns/locale";
import React from "react";

import { Button } from "~/components/ui/button";

import UpdateCategory from "./update-item";


export const columns: ColumnDef<Item & { category: Category }>[] = [
  {
    accessorKey: "createdAt",
    header: "Dibuat pada",
    cell: ({ row }) => {
      const date = format(new Date(row.original.createdAt), "MM/dd/yyyy", {
        locale: localeID,
      });
      const time = format(new Date(row.original.createdAt), "hh:mm:ss", {
        locale: localeID,
      });
      return (
        <div className="font-medium">
          {date}
          <br />
          {time}
        </div>
      );
    },
  },
  {
    accessorKey: "updatedAt",
    header: "Diupdate pada",
    cell: ({ row }) => {
      const date = format(new Date(row.original.updatedAt), "MM/dd/yyyy", {
        locale: localeID,
      });
      const time = format(new Date(row.original.updatedAt), "hh:mm:ss", {
        locale: localeID,
      });
      return (
        <div className="font-medium">
          {date}
          <br />
          {time}
        </div>
      );
    },
  },
  {
    accessorKey: "name",
    header: "Nama Barang",
  },
  {
    accessorKey: "brand",
    header: "Nama Brand",
  },
  {
    header: "Kategori Barang",
    cell: ({ row }) => {
      if (!row.original.category.name) return <span>-</span>
      return <span>{row.original.category.name}</span>
    }
  },
  {
    id: "actions",
    cell: ({ row }) => <Detail row={row} />,
  }
];

function Detail({ row }: { row: Row<Item & { category: Category }> }) {
  const [isOpen, setIsOpen] = React.useState<boolean>(false);

  const data: Item & { category: Category } = row.original;
  return (
    <div className="flex items-center">
      <UpdateCategory row={data} isOpen={isOpen} setIsOpen={setIsOpen}>
        <Button size="sm" variant="outline">Lihat Detail</Button>
      </UpdateCategory>
    </div>
  );
}

