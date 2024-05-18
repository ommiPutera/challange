import { ActionFunctionArgs, MetaFunction, json } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import React from "react";

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { cn } from "~/lib/utils";
import { useUser, validateEmail } from "~/utils";

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const email = formData.get("email");
  const password = formData.get("password");
  const fullName = formData.get("fullName");
  const address = formData.get("address");
  const occupation = formData.get("occupation");

  if (typeof address !== "string" || address.length === 0) {
    return json(
      {
        errors: {
          email: null,
          password: null,
          fullName: null,
          occupation: null,
          address: "Alamat tidak boleh kosong!"
        }
      },
      { status: 400 },
    );
  }

  if (typeof occupation !== "string" || occupation.length === 0) {
    return json(
      {
        errors: {
          email: null,
          password: null,
          fullName: null,
          occupation: "Pekerjaan tidak boleh kosong!",
          address: null,
        }
      },
      { status: 400 },
    );
  }

  if (!validateEmail(email)) {
    return json(
      {
        errors: {
          email: "Email tidak valid",
          password: null,
          fullName: null,
          occupation: null,
          address: null,
        }
      },
      { status: 400 },
    );
  }

  if (typeof fullName !== "string" || fullName.length === 0) {
    return json(
      {
        errors: {
          email: null,
          password: null,
          fullName: "Nama Lengkap tidak boleh kosong!",
          occupation: null,
          address: null,
        }
      },
      { status: 400 },
    );
  }

  if (typeof password !== "string" || password.length === 0) {
    return json(
      {
        errors: {
          email: null,
          password: "Kata Sandi tidak boleh kosong!",
          fullName: null,
          occupation: null,
          address: null,
        }
      },
      { status: 400 },
    );
  }

  if (password.length < 8) {
    return json(
      {
        errors: {
          email: null,
          password: "Kata Sandi terlalu pendek",
          fullName: null,
          occupation: null,
          address: null,
        }
      },
      { status: 400 },
    );
  }

  return json(
    {
      errors: {
        email: null,
        password: null,
        fullName: null,
        occupation: null,
        address: null,
      }
    },
    { status: 200 },
  )
};

export const meta: MetaFunction = () => [{ title: "Profile | Chanllange" }];

export default function ProfilePage() {
  const user = useUser()

  const actionData = useActionData<typeof action>();
  const addressRef = React.useRef<HTMLInputElement>(null);
  const occupationRef = React.useRef<HTMLInputElement>(null);
  const fullNameRef = React.useRef<HTMLInputElement>(null);
  const emailRef = React.useRef<HTMLInputElement>(null);
  const passwordRef = React.useRef<HTMLInputElement>(null);

  const [isEditing, setIsEditing] = React.useState(false)
  const [address, setAddress] = React.useState("")
  const [occupation, setOccupation] = React.useState("")

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
    }
  }, [actionData]);

  return (
    <div className="min-h-screen">
      <div className="w-full flex flex-col gap-6 max-w-screen-sm">
        <h1 className="text-2xl font-bold">Profil</h1>
        <div className="bg-white p-6 rounded-xl border flex flex-col">
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
                <Label htmlFor="phoneNumber">No. HP</Label>
              </div>
            </div>
            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsEditing(!isEditing)
                  if (isEditing) {
                    setAddress("")
                    setOccupation("")
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