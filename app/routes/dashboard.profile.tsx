import { ActionFunctionArgs, MetaFunction, json } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
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
import { updateUserProfile } from "~/models/user.server";
import { useUser, validateEmail } from "~/utils";

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const email = formData.get("email");
  const fullName = formData.get("fullName");
  const address = formData.get("address");
  const occupation = formData.get("occupation");
  const phoneNumber = formData.get("phoneNumber");
  const bod = formData.get("bod");
  const userId = formData.get("userId");

  const errors = {
    email: null,
    password: null,
    fullName: null,
    occupation: null,
    address: null,
    phoneNumber: null,
    bod: null,
  }

  if (typeof userId !== 'string') throw new Error('Terjadi Kesalaan')

  if (typeof address !== "string" || address.length === 0) {
    return json(
      { errors: { ...errors, address: "Alamat tidak boleh kosong!" } },
      { status: 400 },
    );
  }

  if (typeof occupation !== "string" || occupation.length === 0) {
    return json(
      { errors: { ...errors, occupation: "Pekerjaan tidak boleh kosong!" } },
      { status: 400 },
    );
  }

  if (!validateEmail(email)) {
    return json(
      { errors: { ...errors, email: "Email tidak valid" } },
      { status: 400 },
    );
  }

  if (typeof fullName !== "string" || fullName.length === 0) {
    return json(
      { errors: { ...errors, fullName: "Nama Lengkap tidak boleh kosong!" } },
      { status: 400 },
    );
  }

  if (typeof phoneNumber !== "string" || phoneNumber.length === 0) {
    return json(
      { errors: { ...errors, phoneNumber: "No Telp tidak boleh kosong!" } },
      { status: 400 },
    );
  }

  if (typeof bod !== "string" || bod.length === 0) {
    return json(
      { errors: { ...errors, bod: "Tanggal Lahir tidak boleh kosong!" } },
      { status: 400 },
    );
  }


  await updateUserProfile({
    fullName,
    email,
    userId,
    occupation,
    address,
    bod,
    phoneNumber,
  })

  return json(
    { errors: { ...errors } },
    { status: 200 },
  )
};

export const meta: MetaFunction = () => [{ title: "Profile | Challange" }];

export default function ProfilePage() {
  const user = useUser()

  const actionData = useActionData<typeof action>();
  const addressRef = React.useRef<HTMLInputElement>(null);
  const occupationRef = React.useRef<HTMLInputElement>(null);
  const fullNameRef = React.useRef<HTMLInputElement>(null);
  const emailRef = React.useRef<HTMLInputElement>(null);
  const passwordRef = React.useRef<HTMLInputElement>(null);
  const phoneNumberRef = React.useRef<HTMLInputElement>(null);

  const [isEditing, setIsEditing] = React.useState(false)
  const [address, setAddress] = React.useState(user.address ?? "")
  const [occupation, setOccupation] = React.useState(user.occupation ?? "")
  const [phoneNumber, setPhoneNumber] = React.useState(user.phoneNumber ?? "")
  const [date, setDate] = React.useState<Date | undefined>(user.bod ? new Date(user.bod) : undefined)

  React.useEffect(() => {
    if (actionData?.errors?.address) {
      addressRef.current?.focus();
    } else if (actionData?.errors?.occupation) {
      occupationRef.current?.focus()
    } else if (actionData?.errors?.fullName) {
      fullNameRef.current?.focus();
    } else if (actionData?.errors?.email) {
      emailRef.current?.focus();
    } else if (actionData?.errors?.password) {
      passwordRef.current?.focus();
    } else if (actionData?.errors?.phoneNumber) {
      phoneNumberRef.current?.focus()
    }
  }, [actionData]);

  return (
    <div className="min-h-screen">
      <div className="w-full flex flex-col gap-6 max-w-screen-sm">
        <h1 className="text-2xl font-bold">Profil Anda</h1>
        <div className="bg-white p-8 rounded-2xl border flex flex-col">
          <Form method="post" className="space-y-10" onSubmit={() => setIsEditing(false)}>
            <div className="space-y-6">
              <div className="flex gap-5 items-center justify-between">
                <div className="w-full">
                  <Label htmlFor="profile-fullName">Nama Lengkap</Label>
                  <div className="mt-1">
                    <Input
                      ref={fullNameRef}
                      id="profile-fullName"
                      disabled={!isEditing}
                      required
                      defaultValue={user.fullName}
                      name="fullName"
                      placeholder="Nama lengkap Anda"
                      type="text"
                      autoComplete="fullName"
                      aria-invalid={actionData?.errors?.fullName ? true : undefined}
                      aria-describedby="fullName-error"
                    />
                    {actionData?.errors?.fullName ? (
                      <div className="pt-2 text-sm text-red-500" id="profile-fullName-error">
                        {actionData.errors.fullName}
                      </div>
                    ) : null}
                  </div>
                </div>
                <div className="w-full">
                  <Label htmlFor="profile-email">Email</Label>
                  <div className="mt-1">
                    <Input
                      ref={emailRef}
                      id="profile-email"
                      disabled={!isEditing}
                      required
                      name="email"
                      defaultValue={user.email}
                      placeholder="Masukan email anda"
                      type="email"
                      autoComplete="email"
                      aria-invalid={actionData?.errors?.email ? true : undefined}
                      aria-describedby="email-error"
                    />
                    {actionData?.errors?.email ? (
                      <div className="pt-2 text-sm text-red-500" id="profile-email-error">
                        {actionData.errors.email}
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
              <div className="w-full">
                <Label htmlFor="profil-address">Alamat</Label>
                <div className="mt-1">
                  <Input
                    ref={addressRef}
                    required
                    id="profil-address"
                    disabled={!isEditing}
                    name="address"
                    placeholder="Masukan alamat anda"
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
                  <Select value={occupation} disabled={!isEditing} onValueChange={(v) => setOccupation(v)}>
                    <SelectTrigger id="occupation" className={cn("text-gray-500", occupation && "text-primary")}>
                      <SelectValue placeholder="Pilih pekerjaan anda" />
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
                    disabled={!isEditing}
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
                        disabled={!isEditing}
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
                    <PopoverContent className="w-full p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        locale={localID}
                        fromYear={1900}
                        toYear={new Date().getFullYear()}
                        captionLayout="dropdown-buttons"
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
            <input type="hidden" className="hidden" name="userId" value={user.id} />
            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsEditing(!isEditing)
                  if (isEditing) {
                    setAddress(user.address)
                    setOccupation(user.occupation)
                    setPhoneNumber(user.phoneNumber)
                  }
                }}
              >
                {isEditing ? "Batalkan" : "Edit Profil"}
              </Button>
              {isEditing ? <Button
                type="submit"
                variant="default"
              >
                Simpan
              </Button> : null}
            </div>
          </Form>
        </div>
      </div>
    </div>
  )
}