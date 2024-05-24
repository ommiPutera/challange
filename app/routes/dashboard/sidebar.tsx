import { Form, Link, useLocation } from "@remix-run/react";
import { DoorOpen, icons } from "lucide-react";

import { Icon } from "~/components/icons";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";
import { useUser } from "~/utils";

export default function DashboardSidebar() {
  const user = useUser()
  return (
    <div className="hidden md:block min-h-screen bg-white border-r">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex items-center px-7 pt-4 pb-2">
          <Link to="/dashboard/profile" className="border w-full px-4 py-6 bg-muted/50 rounded-lg hover:border-gray-300">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src="/no-profile.jpg" />
                <AvatarFallback className="uppercase">
                  {user?.fullName?.[0]}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col overflow-hidden">
                <h3 className="text-sm font-medium leading-tight text-primary">{user.fullName}</h3>
                <p className="text-xs text-gray-500 leading-tight">{user.email}</p>
              </div>
            </div>
          </Link>
        </div>
        <div className="flex-1">
          <nav className="flex flex-col gap-1 items-start px-7 text-sm font-medium">
            <NavItem iconName="PanelsLeftBottom" title="Beranda" href="/dashboard" />
            <NavItem iconName="Package" title="Daftar Barang" href="/dashboard/item" />
            <NavItem iconName="ListTodo" title="Kategori Barang" href="/dashboard/category" />
            <div className="w-full h-[1px] bg-gray-100 my-3"></div>
            <NavItem iconName="User" title="Profil" href="/dashboard/profile" />
          </nav>
          <div className="absolute bottom-8 w-full px-7">
            <Form action="/logout" method="post" className="w-full">
              <Button
                variant="plain"
                type="submit"
                className="w-full justify-start"
              >
                <DoorOpen className="mr-2 h-5 w-5" />
                <span>Keluar</span>
              </Button>
            </Form>
          </div>
        </div>
      </div>
    </div>
  )
}

function NavItem({
  href,
  iconName,
  title
}: {
  href: string
  iconName: keyof typeof icons
  title: string
}) {
  const location = useLocation()

  return (
    <Link
      to={href}
      className={cn(
        'w-full flex items-center rounded-lg p-4 text-gray-500',
        location.pathname === href && 'bg-muted/50 text-primary font-bold',
      )}
    >
      <Icon
        name={iconName}
        className={cn(
          "mr-2 h-5 w-5",
          location.pathname === href && "stroke-[2.5px]"
        )}
      />
      <span>{title}</span>
    </Link>
  )
}