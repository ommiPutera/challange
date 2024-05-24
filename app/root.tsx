import { cssBundleHref } from "@remix-run/css-bundle";
import type { LinksFunction, LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";
import React from "react";
import { getToast } from "remix-toast";
import 'react-day-picker/dist/style.css';

import { getUser } from "~/session.server";
import stylesheet from "~/tailwind.css";

import { Toaster } from "./components/ui/toaster";
import { useToast } from "./components/ui/use-toast";


export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesheet },
  ...(cssBundleHref ? [{ rel: "stylesheet", href: cssBundleHref }] : []),
];

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { toast, headers } = await getToast(request);
  return json({ toast, user: await getUser(request) }, { headers });
}

export default function App() {
  const { toast: notify } = useToast()

  const { toast } = useLoaderData<typeof loader>();


  React.useEffect(() => {
    const getVariant = () => {
      switch (toast?.type) {
        case "error":
          return "destructive"
        case "success":
          return "success"
        default:
          return "default"
      }
    }

    if (toast) {
      notify({
        title: toast?.description,
        description: toast?.message,
        variant: getVariant(),
      })
    }
  }, [notify, toast]);

  return (
    <html lang="en" className="h-full">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="h-full">
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <Toaster />
        <LiveReload />
      </body>
    </html>
  );
}
