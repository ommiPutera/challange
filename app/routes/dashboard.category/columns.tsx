import { Category } from "@prisma/client";
import { ColumnDef, Row } from "@tanstack/react-table";
import { format } from "date-fns";
import { id as localeID } from "date-fns/locale";
import { Trash2 } from "lucide-react";
import React from "react";

import { Button } from "~/components/ui/button";

import { RemoveCategory } from "./remove-category";
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
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-2">
          <Detail row={row} />
          <Remove row={row} />
        </div>
      )
    },
  },
];

function Detail({ row }: { row: Row<Category> }) {
  const [isOpen, setIsOpen] = React.useState<boolean>(false);

  const data: Category = row.original;
  return (
    <UpdateCategory row={data} isOpen={isOpen} setIsOpen={setIsOpen}>
      <Button size="sm" variant="outline">Lihat Detail</Button>
    </UpdateCategory>
  );
}

function Remove({ row }: { row: Row<Category> }) {
  const [isOpen, setIsOpen] = React.useState<boolean>(false);

  const data: Category = row.original;
  return (
    <RemoveCategory row={data} isOpen={isOpen} setIsOpen={setIsOpen}>
      <Button size="sm" variant="ghost" className="px-2">
        <Trash2 className="h-4 w-4 text-red-700" />
      </Button>
    </RemoveCategory>
  );
}

