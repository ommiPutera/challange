import { Category, Item } from "@prisma/client";
import { Form, useLoaderData } from "@remix-run/react";
import React from "react";

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "~/components/ui/sheet";
import { cn } from "~/lib/utils";

import { EnumAction, loader } from "./route";

export default function UpdateItem({
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
  const { categories } = useLoaderData<typeof loader>();

  const { id, name, brand, category } = row;

  const [itemCategory, setItemCategory] = React.useState(category.id)

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Buat Kategori Baru</SheetTitle>
        </SheetHeader>
        <Form method="post" className="space-y-6 mt-4" onSubmit={() => setIsOpen(false)}>
          <div className="space-y-4">
            <div>
              <Label htmlFor="item-name">Nama Kategori</Label>
              <div className="mt-1">
                <Input
                  id="item-name"
                  required
                  // eslint-disable-next-line jsx-a11y/no-autofocus
                  autoFocus={true}
                  defaultValue={name}
                  name="item-name"
                  placeholder="Masukan nama lengkap Anda"
                  type="text"
                  autoComplete="item-name"
                  aria-describedby="item-name-error"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="item-brand">Nama Brand</Label>
              <div className="mt-1">
                <Input
                  id="item-brand"
                  required
                  name="item-brand"
                  defaultValue={brand}
                  placeholder="Masukan nama brand"
                  type="text"
                  autoComplete="item-brand"
                  aria-describedby="item-brand-error"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="item-category">Kategori Barang</Label>
              <div className="mt-1">
                <Select value={itemCategory} onValueChange={(v) => setItemCategory(v)}>
                  <SelectTrigger id="item-category" className={cn("text-gray-500", itemCategory && "text-primary")}>
                    <SelectValue placeholder="Pilih kategori barang" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(({ id, name }) => (
                      <SelectItem key={id} value={id}>{name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <input type="hidden" name="item-category" value={itemCategory} />
              </div>
            </div>
            <input type="hidden" className="hidden" name="item-id" value={id} />
            <input type="hidden" className="hidden" name="_action" value={EnumAction.UPDATE} />
            <div className="flex flex-col gap-2">
              <Button
                size="lg"
                type="submit"
                variant="default"
                className="w-full"
              >
                Perbarui
              </Button>
              <Button
                onClick={() => setIsOpen(false)}
                size="lg"
                type="button"
                variant="outline"
                className="w-full"
              >
                Tutup
              </Button>
            </div>
          </div>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
