import { Form } from "@remix-run/react"
import React from "react"

import { Button } from "~/components/ui/button"
// import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"

export default function PasswordPage() {
  const [isEditing, setIsEditing] = React.useState(false)

  return (
    <div>
      <div className="w-full flex flex-col gap-6 max-w-screen-sm">
        <h1 className="text-2xl font-bold">Kata Sandi</h1>
        <div className="bg-white p-8 rounded-2xl border flex flex-col">
          <Form method="post" className="space-y-10" onSubmit={() => setIsEditing(false)}>
            <div className="space-y-6">
              <div className="w-full">
                <Label htmlFor="profile-fullName">Nama Lengkap</Label>
                <div className="mt-1">
                  {/* Input */}
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