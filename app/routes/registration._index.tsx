import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
} from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, Link, useActionData, useSearchParams } from "@remix-run/react";
import React from "react";

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { createUser, getUserByEmail } from "~/models/user.server";
import { getUserId } from "~/session.server";
import { safeRedirect, validateEmail } from "~/utils";
import { sendEmailVerif } from "~/utils/sendEmail.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const userId = await getUserId(request);
  if (userId) return redirect("/");
  return json({});
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const email = formData.get("email");
  const password = formData.get("password");
  const fullName = formData.get("fullName");
  const redirectTo = safeRedirect(formData.get("redirectTo"), "/registration/success-send-email");

  if (!validateEmail(email)) {
    return json(
      {
        errors: {
          email: "Email tidak valid",
          password: null,
          fullName: null
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
          fullName: "Nama Lengkap tidak boleh kosong!"
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
          fullName: null
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
          fullName: null
        }
      },
      { status: 400 },
    );
  }

  const existingUser = await getUserByEmail(email);
  if (existingUser) {
    return json(
      {
        errors: {
          email: "Pengguna dengan email tersebut telah terdaftar",
          password: null,
          fullName: null
        },
      },
      { status: 400 },
    );
  }

  const user = await createUser(email, password, fullName);

  await sendEmailVerif({
    to: email,
    fullName: fullName,
    userId: user.id
  })
  return redirect(redirectTo)

  // return createUserSession({
  //   redirectTo,
  //   remember: false,
  //   request,
  //   userId: user.id,
  // });
};

export const meta: MetaFunction = () => [{ title: "Daftar | Challange" }];

export default function Registration() {
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") ?? undefined;
  const actionData = useActionData<typeof action>();
  const fullNameRef = React.useRef<HTMLInputElement>(null);
  const emailRef = React.useRef<HTMLInputElement>(null);
  const passwordRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (actionData?.errors?.fullName) {
      fullNameRef.current?.focus();
    } else if (actionData?.errors?.email) {
      emailRef.current?.focus();
    } else if (actionData?.errors?.password) {
      passwordRef.current?.focus();
    }
  }, [actionData]);

  return (
    <div className="flex min-h-full flex-col justify-center">
      <div className="mx-auto w-full max-w-md px-8">
        <h3 className="scroll-m-20 text-2xl font-bold">
          Buat Akun
        </h3>
        <br />
        <Form method="post" className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="fullName">Nama Lengkap</Label>
              <div className="mt-1">
                <Input
                  ref={fullNameRef}
                  id="fullName"
                  required
                  // eslint-disable-next-line jsx-a11y/no-autofocus
                  autoFocus={true}
                  name="fullName"
                  placeholder="Masukan nama lengkap Anda"
                  type="text"
                  autoComplete="fullName"
                  aria-invalid={actionData?.errors?.fullName ? true : undefined}
                  aria-describedby="fullName-error"
                />
                {actionData?.errors?.fullName ? (
                  <div className="pt-2 text-sm text-red-500" id="fullName-error">
                    {actionData.errors.fullName}
                  </div>
                ) : null}
              </div>
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <div className="mt-1">
                <Input
                  ref={emailRef}
                  id="email"
                  required
                  name="email"
                  placeholder="Masukan email anda"
                  type="email"
                  autoComplete="email"
                  aria-invalid={actionData?.errors?.email ? true : undefined}
                  aria-describedby="email-error"
                />
                {actionData?.errors?.email ? (
                  <div className="pt-2 text-sm text-red-500" id="email-error">
                    {actionData.errors.email}
                  </div>
                ) : null}
              </div>
            </div>

            <div>
              <Label htmlFor="password">Kata Sandi</Label>
              <div className="mt-1">
                <Input
                  id="password"
                  ref={passwordRef}
                  name="password"
                  placeholder="Kata Sandi (Minimal 8 karakter)"
                  type="password"
                  autoComplete="new-password"
                  aria-invalid={actionData?.errors?.password ? true : undefined}
                  aria-describedby="password-error"
                />
                {actionData?.errors?.password ? (
                  <div className="pt-2 text-sm text-red-500" id="password-error">
                    {actionData.errors.password}
                  </div>
                ) : null}
              </div>
            </div>
            <Button
              size="lg"
              type="submit"
              variant="default"
              className="w-full"
            >
              Daftar Sekarang
            </Button>
          </div>
          <input type="hidden" name="redirectTo" value={redirectTo} />

          <div className="flex items-center justify-center">
            <div className="text-center text-xs text-gray-500">
              Sudah memiliki akun?{" "}
              <Link
                className="font-semibold text-primary underline"
                to={{
                  pathname: "/",
                  search: searchParams.toString(),
                }}
              >
                Masuk di sini
              </Link>
            </div>
          </div>
        </Form>
      </div>
    </div>
  );
}
