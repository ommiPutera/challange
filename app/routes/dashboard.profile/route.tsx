import { ActionFunctionArgs, MetaFunction, json } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import { CircleAlert } from "lucide-react";
import React from "react";

import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { cn } from "~/lib/utils";
import { useUser } from "~/utils";

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const address = formData.get("address");
  const occupation = formData.get("occupation");

  console.log("occupation: ", occupation)

  if (typeof address !== "string" || address.length === 0) {
    return json(
      { errors: { occupation: null, address: "Alamat tidak boleh kosong!" } },
      { status: 400 },
    );
  }

  if (typeof occupation !== "string" || occupation.length === 0) {
    return json(
      { errors: { occupation: "Pekerjaan tidak boleh kosong!", address: null, } },
      { status: 400 },
    );
  }
};

export const meta: MetaFunction = () => [{ title: "Profile | Chanllange" }];

export default function ProfilePage() {
  const user = useUser()

  const actionData = useActionData<typeof action>();
  const addressRef = React.useRef<HTMLInputElement>(null);
  const occupationRef = React.useRef<HTMLInputElement>(null);

  const [isEditing, setIsEditing] = React.useState(false)
  const [address, setAddress] = React.useState("")
  const [occupation, setOccupation] = React.useState("")

  React.useEffect(() => {
    if (actionData?.errors?.address) {
      addressRef.current?.focus();
    } else if (actionData?.errors?.occupation) {
      occupationRef.current?.focus()
    }
  }, [actionData]);

  return (
    <div className="min-h-screen">
      <div className="w-full flex flex-col gap-8 max-w-screen-sm">
        <h1 className="text-2xl font-bold">Profil</h1>
        <Alert variant="warning">
          <CircleAlert className="h-4 w-4" />
          <AlertTitle>Lengkapi profil</AlertTitle>
          <AlertDescription>
            Untuk mengaktifkan semua fitur, mohon terlebih dahulu lengkapi profil anda
          </AlertDescription>
        </Alert>
        <div className="bg-white p-6 rounded-xl border flex flex-col">
          <Form method="post" className="space-y-10">
            <div className="space-y-4">
              <div className="flex gap-5 items-center justify-between">
                <div className="w-full">
                  <Label>
                    Nama Lengkap
                  </Label>
                  <div className="mt-1">
                    <Input
                      disabled
                      value={user.fullName}
                      required
                      type="text"
                    />
                  </div>
                </div>
                <div className="w-full">
                  <Label>
                    Email
                  </Label>
                  <div className="mt-1">
                    <Input
                      disabled
                      value={user.email}
                      required
                      type="email"
                    />
                  </div>
                </div>
              </div>
              <div className="w-full">
                <Label htmlFor="address">Alamat</Label>
                <div className="mt-1">
                  <Input
                    ref={addressRef}
                    required
                    id="address"
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
                    <div className="pt-2 text-sm text-red-500" id="address-error">
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