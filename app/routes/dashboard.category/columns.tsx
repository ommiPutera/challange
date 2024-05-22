import { Category } from "@prisma/client";
import { ColumnDef, Row } from "@tanstack/react-table";
import { format } from "date-fns";
import { id as localeID } from "date-fns/locale";
import React from "react";

import { Button } from "~/components/ui/button";

import UpdateCategory from "./update-category";


export const columns: ColumnDef<Category>[] = [
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
    header: "Nama Kategori",
  },
  {
    id: "actions",
    cell: ({ row }) => <Detail row={row} />,
  }
];

function Detail({ row }: { row: Row<Category> }) {
  const [isOpen, setIsOpen] = React.useState<boolean>(false);

  const data: Category = row.original;
  return (
    <div className="flex items-center">
      <UpdateCategory row={data} isOpen={isOpen} setIsOpen={setIsOpen}>
        <Button size="sm" variant="outline">Lihat Detail</Button>
      </UpdateCategory>
    </div>
  );
}

