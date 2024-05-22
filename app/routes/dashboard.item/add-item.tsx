import { Form, useLoaderData } from "@remix-run/react";
import React from "react";

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "~/components/ui/sheet";
import { cn } from "~/lib/utils";

import { EnumAction, loader } from "./route";

export default function AddItem({ children }: { children: React.ReactNode }) {
  const { categories } = useLoaderData<typeof loader>();

  const [isOpen, setIsOpen] = React.useState(false)
  const [itemCategory, setItemCategory] = React.useState("")

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Buat Barang</SheetTitle>
        </SheetHeader>
        <Form method="post" className="space-y-6 mt-8" onSubmit={() => setIsOpen(false)}>
          <div className="space-y-4">
            <div>
              <Label htmlFor="item-name">Nama Barang</Label>
              <div className="mt-1">
                <Input
                  id="item-name"
                  required
                  // eslint-disable-next-line jsx-a11y/no-autofocus
                  autoFocus={true}
                  name="item-name"
                  placeholder="Masukan nama barang"
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
            <input type="hidden" className="hidden" name="_action" value={EnumAction.CREATE} />
            <div className="flex flex-col gap-2">
              <Button
                size="lg"
                type="submit"
                variant="default"
                className="w-full"
              >
                Buat
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
  )
}