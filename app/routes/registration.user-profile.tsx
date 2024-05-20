import { ActionFunctionArgs, json, LoaderFunctionArgs, MetaFunction, redirect } from "@remix-run/node";
import { Form, Link, useActionData } from "@remix-run/react";
import { format } from "date-fns";
import { id as localID } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import React from "react";

import { Button } from "~/components/ui/button";
import { Calendar } from "~/components/ui/calendar";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "~/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { cn } from "~/lib/utils";
import { getUserById, updateUserProfile } from "~/models/user.server";
import { createUserSession } from "~/session.server";
import { safeRedirect } from "~/utils";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id")

  if (!id) return redirect("/")

  const user = await getUserById(id)

  if (user) {
    if (!user.isActive || user.bod) return redirect("/")

    return json({
      userActive: true,
      userId: user.id
    })
  }

  return redirect("/")
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id")

  if (!id) return redirect("/")

  const formData = await request.formData();
  const address = formData.get("address");
  const occupation = formData.get("occupation");
  const phoneNumber = formData.get("phoneNumber");
  const bod = formData.get("bod");

  const redirectTo = safeRedirect(formData.get("redirectTo"), "/dashboard/profile");

  if (typeof address !== "string" || address.length === 0) {
    return json(
      {
        errors: {
          occupation: null,
          address: "Alamat tidak boleh kosong!",
          phoneNumber: null,
          bod: null
        }
      },
      { status: 400 },
    );
  }

  if (typeof occupation !== "string" || occupation.length === 0) {
    return json(
      {
        errors: {
          occupation: "Pekerjaan tidak boleh kosong!",
          address: null,
          phoneNumber: null,
          bod: null
        }
      },
      { status: 400 },
    );
  }


  if (typeof phoneNumber !== "string" || phoneNumber.length === 0) {
    return json(
      {
        errors: {
          occupation: null,
          address: null,
          phoneNumber: "No Telp tidak boleh kosong!",
          bod: null
        }
      },
      { status: 400 },
    );
  }

  if (typeof bod !== "string" || bod.length === 0) {
    return json(
      {
        errors: {
          occupation: null,
          address: null,
          phoneNumber: null,
          bod: "Tanggal Lahir tidak boleh kosong!"
        }
      },
      { status: 400 },
    );
  }

  await updateUserProfile({
    userId: id,
    occupation,
    address,
    bod,
    phoneNumber,
  })

  return createUserSession({
    redirectTo,
    remember: false,
    request,
    userId: id,
  });
};

export const meta: MetaFunction = () => [{ title: "Lengkapi Profil | Challange" }];

export default function UserProfilePage() {
  const actionData = useActionData<typeof action>();
  const addressRef = React.useRef<HTMLInputElement>(null);
  const occupationRef = React.useRef<HTMLInputElement>(null);
  const phoneNumberRef = React.useRef<HTMLInputElement>(null);

  const [address, setAddress] = React.useState("")
  const [occupation, setOccupation] = React.useState("")
  const [phoneNumber, setPhoneNumber] = React.useState("")
  const [date, setDate] = React.useState<Date>()

  React.useEffect(() => {
    if (actionData?.errors?.address) {
      addressRef.current?.focus();
    } else if (actionData?.errors?.occupation) {
      occupationRef.current?.focus()
    } else if (actionData?.errors?.phoneNumber) {
      phoneNumberRef.current?.focus()
    } else if (actionData?.errors?.bod) {
      occupationRef.current?.focus()
    }
  }, [actionData]);

  return (
    <div className="flex min-h-full flex-col justify-center">
      <div className="mx-auto w-full max-w-md px-8">
        <h3 className="scroll-m-20 text-2xl font-bold">
          Lengkapi profil Anda
        </h3>
        <p className="leading-snug text-sm text-gray-500 mt-2">
          Mohon untuk melengkapi profil Anda untuk melanjutkan
        </p>
        <br />
        <Form method="post" className="space-y-10">
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <img
                src="/no-profile.jpg"
                alt=""
                width="70px"
                height="70px"
                className="rounded-full"
              />
              <Button
                type="button"
                variant="secondary"
                size="sm"
              >
                Unggah Foto
              </Button>
            </div>
            <div className="w-full">
              <Label htmlFor="profil-address">Alamat</Label>
              <div className="mt-1">
                <Input
                  ref={addressRef}
                  required
                  id="profil-address"
                  name="address"
                  placeholder="Masukan alamat Anda"
                  type="text"
                  autoComplete="address"
                  value={address}
                  onChange={(v) => setAddress(v.target.value)}
                  aria-invalid={actionData?.errors?.address ? true : undefined}
                  aria-describedby="address-error"
                />
                {actionData?.errors?.address ? (
                  <div className="pt-2 text-sm text-red-500" id="profile-address-error">
                    {actionData.errors.address}
                  </div>
                ) : null}
              </div>
            </div>
            <div className="w-full">
              <Label htmlFor="occupation">Pekerjaan</Label>
              <div className="mt-1">
                <Select value={occupation} onValueChange={(v) => setOccupation(v)}>
                  <SelectTrigger id="occupation" className={cn("text-gray-500", occupation && "text-primary")}>
                    <SelectValue placeholder="Pilih pekerjaan Anda" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="swasta">Swasta</SelectItem>
                    <SelectItem value="pns">PNS</SelectItem>
                    <SelectItem value="software_engineer">Software Engineer</SelectItem>
                    <SelectItem value="ceo">CEO</SelectItem>
                    <SelectItem value="manager">Manager</SelectItem>
                  </SelectContent>
                </Select>
                <input type="hidden" name="occupation" value={occupation} />
                {actionData?.errors?.occupation ? (
                  <div className="pt-2 text-sm text-red-500" id="occupation-error">
                    {actionData.errors.occupation}
                  </div>
                ) : null}
              </div>
            </div>
            <div className="w-full">
              <Label htmlFor="profile-phoneNumber">No. HP</Label>
              <div className="mt-1">
                <Input
                  ref={phoneNumberRef}
                  required
                  id="profil-phoneNumber"
                  name="phoneNumber"
                  placeholder="Masukan No. HP Anda"
                  type="tel"
                  autoComplete="phoneNumber"
                  value={phoneNumber}
                  onChange={(v) => setPhoneNumber(v.target.value)}
                  aria-invalid={actionData?.errors?.phoneNumber ? true : undefined}
                  aria-describedby="phoneNumber-error"
                />
                {actionData?.errors?.phoneNumber ? (
                  <div className="pt-2 text-sm text-red-500" id="profile-phoneNumber-error">
                    {actionData.errors.phoneNumber}
                  </div>
                ) : null}
              </div>
            </div>
            <div className="w-full">
              <Label>Tanggal Lahir</Label>
              <div className="mt-1">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP", { locale: localID }) : <span>Pilih tanggal lahir Anda</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      locale={localID}
                    />
                  </PopoverContent>
                </Popover>
                <input type="hidden" name="bod" value={String(date ?? "")} />
                {actionData?.errors?.bod ? (
                  <div className="pt-2 text-sm text-red-500" id="bod-error">
                    {actionData.errors.bod}
                  </div>
                ) : null}
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <Button
              type="submit"
              variant="default"
              className="w-full"
            >
              Lanjutkan
            </Button>
            <Button
              type="button"
              variant="secondary"
              className="w-full"
              asChild
            >
              <Link to="/">
                Nanti
              </Link>
            </Button>
          </div>
        </Form>
      </div>
    </div>
  )
}