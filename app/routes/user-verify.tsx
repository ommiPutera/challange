import { MetaFunction } from "@remix-run/node";

import { Button } from "~/components/ui/button";

export const meta: MetaFunction = () => [{ title: "Verifikasi | Challange" }];

export default function UserVerifyPage() {
  return (
    <div className="flex min-h-full flex-col justify-center">
      <div className="mx-auto w-full max-w-md px-8">
        <h3 className="scroll-m-20 text-2xl font-bold text-center">
          Verifikasi alamat email Anda
        </h3>
        <p className="leading-snug text-sm text-gray-500 mt-2 text-center">
          Mohon konfirmasi alamat email Anda untuk melanjutkan proses registrasi
        </p>
        <br />
        <Button
          size="lg"
          type="submit"
          variant="default"
          className="w-full"
        >
          Verifikasi
        </Button>
      </div>
    </div>
  )
}