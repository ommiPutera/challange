import { Category, Item } from "@prisma/client";
import { Form } from "@remix-run/react";

import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTrigger
} from "~/components/ui/dialog";

import { EnumAction } from "./route";

export function RemoveCategory({
  children,
  row,
  isOpen,
  setIsOpen,
}: {
  children: React.ReactNode
  row: Item & { category: Category };
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  return (
    <Dialog open={isOpen} onOpenChange={() => setIsOpen(!isOpen)}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="flex flex-col items-center gap-6">
        <div className="flex flex-col items-center gap-1">
          <h6 className="text-grey-950 text-center text-sm font-medium">
            Hapus Barang
          </h6>
          <p className="text-center text-sm text-black/60">
            Apakah Anda yakin ingin menghapus barang ini <b>{row.name}</b>?
          </p>
        </div>
        <DialogFooter className="w-full">
          <Form method="post" className="space-y-6 mt-8">
            <input type="hidden" className="hidden" name="_action" value={EnumAction.DELETE} />
            <input type="hidden" className="hidden" name="item-id" value={row.id} />
            <DialogClose className="w-full" asChild>
              <Button className="w-full" type="submit" size="sm">
                Ya, Hapus
              </Button>
            </DialogClose>
            <DialogClose className="w-full" asChild>
              <Button className="w-full" type="button" variant="secondary" size="sm">
                Batalkan
              </Button>
            </DialogClose>
          </Form>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
