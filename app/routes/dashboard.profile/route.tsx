import { ActionFunctionArgs, MetaFunction, json } from "@remix-run/node";

import { updateUserProfile } from "~/models/user.server";
import { validateEmail } from "~/utils";

import ProfilePage from "./profile";

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

export default function IndexPage() {
  return (
    <div>
      <ProfilePage />
    </div>
  )
}