import { MetaFunction } from "@remix-run/node";
import { MailCheck } from "lucide-react";

export const meta: MetaFunction = () => [{ title: "Periksa email | Challange" }];

export default function SuccessSendEmail() {

  return (
    <div className="flex min-h-full flex-col justify-center">
      <div className="mx-auto w-full max-w-md px-8 space-y-4">
        <div className="flex justify-center">
          <MailCheck className="h-12 w-12" />
        </div>
        <h3 className="scroll-m-20 text-xl font-bold text-center">
          Email konfirmasi telah dikirim ke alamat email Anda
        </h3>
      </div>
    </div>
  )
}