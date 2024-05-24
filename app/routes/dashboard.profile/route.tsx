import { ActionFunctionArgs, MetaFunction, json } from "@remix-run/node";
import { jsonWithError, jsonWithSuccess } from "remix-toast";

import { updatePassword, updateUserProfile } from "~/models/user.server";
import { validateEmail } from "~/utils";

import PasswordPage from "./password";
import ProfilePage from "./profile";


export enum EnumAction {
  PROFILE = "PROFILE",
  PASSWORD = "PASSWORD"
}

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const email = formData.get("email");
  const fullName = formData.get("fullName");
  const address = formData.get("address");
  const occupation = formData.get("occupation");
  const phoneNumber = formData.get("phoneNumber");
  const bod = formData.get("bod");
  const userId = formData.get("userId");

  const currentPassword = formData.get("currentPassword");
  const newPassword = formData.get("newPassword");

  const _action = formData.get("_action");

  const errors = {
    email: null,
    password: null,
    fullName: null,
    occupation: null,
    address: null,
    phoneNumber: null,
    bod: null,
    currentPassword: null,
    newPassword: null
  }

  if (typeof userId !== 'string') throw new Error('Terjadi Kesalaan')

  switch (_action) {
    case EnumAction.PROFILE: {
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
      return json({ errors: { ...errors } }, { status: 200 })
    }
    case EnumAction.PASSWORD: {
      if (typeof currentPassword !== "string" || currentPassword.length === 0) {
        return json(
          { errors: { ...errors, currentPassword: "Kata Sandi tidak boleh kosong!" } },
          { status: 400 },
        );
      }
      if (currentPassword.length < 8) {
        return json(
          { errors: { ...errors, currentPassword: "Kata Sandi terlalu pendek!" } },
          { status: 400 },
        );
      }
      if (typeof newPassword !== "string" || newPassword.length === 0) {
        return json(
          { errors: { ...errors, newPassword: "Kata Sandi tidak boleh kosong!" } },
          { status: 400 },
        );
      }
      if (newPassword.length < 8) {
        return json(
          { errors: { ...errors, newPassword: "Kata Sandi terlalu pendek!" } },
          { status: 400 },
        );
      }

      const password = await updatePassword(userId, currentPassword, newPassword)
      if (!password) {
        return jsonWithError(null, "Kata Sandi Salah!");
      }

      return jsonWithSuccess(null, `Kata Sandi berhasil diubah!`);
    }
  }
};

export const meta: MetaFunction = () => [{ title: "Profile | Challange" }];

export default function IndexPage() {
  return (
    <div className="lg:min-h-screen flex flex-col gap-6 lg:flex-row w-full">
      <div className="flex-1">
        <ProfilePage />
      </div>
      <div className="flex-1">
        <PasswordPage />
      </div>
    </div>
  )
}