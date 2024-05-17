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
import { verifyLogin } from "~/models/user.server";
import { createUserSession, getUserId } from "~/session.server";
import { safeRedirect, validateEmail } from "~/utils";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const userId = await getUserId(request);
  if (userId) return redirect("/dashboard");
  return json({});
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const email = formData.get("email");
  const password = formData.get("password");
  const redirectTo = safeRedirect(formData.get("redirectTo"), "/dashboard");
  const remember = formData.get("remember");

  if (!validateEmail(email)) {
    return json(
      { errors: { email: "Email tidak valid", password: null } },
      { status: 400 },
    );
  }

  if (typeof password !== "string" || password.length === 0) {
    return json(
      { errors: { email: null, password: "Kata Sandi tidak boleh kosong!" } },
      { status: 400 },
    );
  }

  if (password.length < 8) {
    return json(
      { errors: { email: null, password: "Kata Sandi terlalu pendek" } },
      { status: 400 },
    );
  }

  const user = await verifyLogin(email, password);

  if (!user) {
    return json(
      { errors: { email: "Akun tidak ditemukan!", password: null } },
      { status: 400 },
    );
  }

  return createUserSession({
    redirectTo,
    remember: remember === "on" ? true : false,
    request,
    userId: user.id,
  });
};

export const meta: MetaFunction = () => [{ title: "Masuk | Chanllange" }];

export default function LoginPage() {
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") || "/";
  const actionData = useActionData<typeof action>();
  const emailRef = React.useRef<HTMLInputElement>(null);
  const passwordRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (actionData?.errors?.email) {
      emailRef.current?.focus();
    } else if (actionData?.errors?.password) {
      passwordRef.current?.focus();
    }
  }, [actionData]);

  return (
    <div className="flex min-h-full flex-col justify-center">
      <div className="mx-auto w-full max-w-md px-8">
        <h3 className="scroll-m-20 text-2xl font-bold">
          Selamat Datang
        </h3>
        <p className="leading-snug text-sm text-gray-500 mt-2">
          Aplikasi ini bertujuan untuk proses Technical Challenge Fullstack &#40;FS&#41; kandidat Ommi Putera
        </p>
        <br />
        <Form method="post" className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="email">
                Email
              </Label>
              <div className="mt-1">
                <Input
                  ref={emailRef}
                  id="email"
                  required
                  // eslint-disable-next-line jsx-a11y/no-autofocus
                  autoFocus={true}
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
              <Label htmlFor="password">
                Kata Sandi
              </Label>
              <div className="mt-1">
                <Input
                  id="password"
                  ref={passwordRef}
                  name="password"
                  placeholder="Masukan kata sandi anda"
                  type="password"
                  autoComplete="current-password"
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
              type="submit"
              variant="default"
              className="w-full"
            >
              Masuk
            </Button>
          </div>
          <input type="hidden" name="redirectTo" value={redirectTo} />

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember"
                name="remember"
                type="checkbox"
                className="h-3 w-3 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <label
                htmlFor="remember"
                className="ml-1 block text-xs text-gray-900"
              >
                Ingat Saya
              </label>
            </div>
            <div className="text-center text-xs text-gray-500">
              Belum memiliki akun?{" "}
              <Link
                className="font-semibold text-primary underline"
                to={{
                  pathname: "/registration",
                  search: searchParams.toString(),
                }}
              >
                Daftar di sini
              </Link>
            </div>
          </div>
        </Form>
      </div>
    </div>
  );
}
