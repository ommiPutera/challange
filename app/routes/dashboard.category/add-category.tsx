import { Form } from "@remix-run/react";
import React from "react";

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "~/components/ui/sheet";

import { EnumAction } from "./route";

export default function AddCategory({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = React.useState(false)

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle> Buat Kategori Baru</SheetTitle>
        </SheetHeader>
        <Form method="post" className="space-y-6 mt-4" onSubmit={() => setIsOpen(false)}>
          <div className="space-y-4">
            <div>
              <Label htmlFor="category-name">Nama Kategori</Label>
              <div className="mt-1">
                <Input
                  id="category-name"
                  required
                  // eslint-disable-next-line jsx-a11y/no-autofocus
                  autoFocus={true}
                  name="category-name"
                  placeholder="Masukan nama kategori"
                  type="text"
                  autoComplete="category-name"
                  aria-describedby="category-name-error"
                />
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