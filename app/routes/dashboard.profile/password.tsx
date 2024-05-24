import { Form, useActionData } from "@remix-run/react"
import React from "react"

import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import { useUser } from "~/utils"

import { EnumAction, action } from "./route"

export default function PasswordPage() {
  const user = useUser()

  const [isEditing, setIsEditing] = React.useState(false)
  const actionData = useActionData<typeof action>();

  const currentPasswordRef = React.useRef<HTMLInputElement>(null);
  const newPasswordRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (actionData?.errors?.currentPassword) {
      currentPasswordRef.current?.focus();
    } else if (actionData?.errors?.newPassword) {
      newPasswordRef.current?.focus();
    }
  }, [actionData]);

  return (
    <div>
      <div className="w-full flex flex-col gap-6">
        <h1 className="text-2xl font-bold">Kata Sandi</h1>
        <div className="bg-white p-8 rounded-2xl border flex flex-col">
          <Form
            method="post"
            className="space-y-10"
            onSubmit={() => {
              setIsEditing(false)
            }}
          >
            <div className="space-y-6">
              <div>
                <Label htmlFor="currentPassword">Kata Sandi Saat Ini</Label>
                <div className="mt-1">
                  <Input
                    required
                    id="currentPassword"
                    ref={currentPasswordRef}
                    name="currentPassword"
                    disabled={!isEditing}
                    placeholder="Kata Sandi (Minimal 8 karakter)"
                    type="password"
                    aria-invalid={actionData?.errors?.currentPassword ? true : undefined}
                    aria-describedby="current-password-error"
                  />
                  {actionData?.errors?.currentPassword ? (
                    <div className="pt-2 text-sm text-red-500" id="current-password-error">
                      {actionData.errors.currentPassword}
                    </div>
                  ) : null}
                </div>
              </div>
              <div>
                <Label htmlFor="newPassword">Kata Sandi Baru</Label>
                <div className="mt-1">
                  <Input
                    required
                    id="newPassword"
                    ref={newPasswordRef}
                    name="newPassword"
                    disabled={!isEditing}
                    placeholder="Kata Sandi (Minimal 8 karakter)"
                    type="password"
                    aria-invalid={actionData?.errors?.newPassword ? true : undefined}
                    aria-describedby="new-password-error"
                  />
                  {actionData?.errors?.newPassword ? (
                    <div className="pt-2 text-sm text-red-500" id="new-password-error">
                      {actionData.errors.newPassword}
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
            <input type="hidden" className="hidden" name="userId" value={user.id} />
            <input type="hidden" className="hidden" name="_action" value={EnumAction.PASSWORD} />
            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsEditing(!isEditing)
                  if (isEditing) {
                    console.log('back')
                  }
                }}
              >
                {isEditing ? "Batalkan" : "Ubah Kata Sandi"}
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