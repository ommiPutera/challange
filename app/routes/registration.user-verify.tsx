import { LoaderFunctionArgs, MetaFunction, json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { MailCheck, MailX } from "lucide-react";

import { Button } from "~/components/ui/button";
import { setUserAcitve } from "~/models/user.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("id")

  if (userId) {
    await setUserAcitve({ userId })

    return json({
      userActive: true,
      userId: userId
    })
  }
  return json({
    userActive: false,
    userId: null
  });
};

export const meta: MetaFunction = () => [{ title: "Verifikasi | Challange" }];

export default function UserVerifyPage() {
  const { userActive, userId } = useLoaderData<typeof loader>();

  if (!userActive) return (
    <div className="flex min-h-full flex-col justify-center">
      <div className="mx-auto w-full max-w-md px-8 space-y-4">
        <div className="flex justify-center">
          <MailX className="h-12 w-12" />
        </div>
        <div>
          <h3 className="scroll-m-20 text-2xl font-bold text-center">
            Verifikasi Gagal
          </h3>
          <p className="leading-snug text-sm text-gray-500 mt-2 text-center">
            Mohon maaf terjadi kesalahan
          </p>
        </div>
      </div>
    </div>
  )

  return (
    <div className="flex min-h-full flex-col justify-center">
      <div className="mx-auto w-full max-w-md px-8 space-y-4">
        <div className="flex justify-center">
          <MailCheck className="h-12 w-12" />
        </div>
        <div>
          <h3 className="scroll-m-20 text-2xl font-bold text-center">
            Verifikasi Berhasil
          </h3>
          <p className="leading-snug text-sm text-gray-500 mt-2 text-center">
            Mohon lengkapi profil Anda terlebih dahulu
          </p>
        </div>
        <br />
        <div className="w-full flex flex-col justify-center">
          <Button
            size="lg"
            type="submit"
            variant="default"
            asChild
            className="w-fit mx-auto"
          >
            <Link to={`/registration/user-profile?id=${userId}`}>
              Lengkapi Profil
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}