import Link from "next/link";
import {auth} from '@/auth'
import { signOutUser } from "@/lib/actions/user.actions";
import { Button } from "@/components/ui/button";
import { 
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger
 } from "@/components/ui/dropdown-menu";
import { UserIcon } from "lucide-react";

const UserMenu = async () => {
  const session = await auth();
  console.log("SESSION IN USER MENU", session?.user.role);
  if (!session) {
    return (
      <Button className="space-x-2">
          <Link href="/sign-in" className="inline-flex items-center gap-2">
            <UserIcon />
            <span>Sign In</span>
          </Link>
      </Button>
    );
  }

  const firstInitial = session?.user?.name?.charAt(0).toUpperCase() ?? "U";

  return (
    <div className="flex gap-2 items-center">
      <DropdownMenu>
        <DropdownMenuTrigger className="relative w-8 h-8 rounded-full ml-2 flex items-center justify-center bg-gray-200">
          {firstInitial}
        </DropdownMenuTrigger>
        <DropdownMenuContent className='w-56' align="end">
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium loading-none">{session?.user?.name}</p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuItem>
            <Link href="/profile">Profile</Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link href="/settings">Settings</Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link href="/user/profile">User Profile</Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link href="/user/orders">Orders history</Link>
          </DropdownMenuItem>
          {session?.user?.role === 'admin' && (
            <DropdownMenuItem>
              <Link href="/admin/overview">Admin Dashboard</Link>
            </DropdownMenuItem>
          )}
          <DropdownMenuItem>
            <form action={signOutUser} className="w-full">
              <Button type="submit" className="w-full py-4 px-2 h-4 justify-start">
                Sign Out
              </Button>
            </form>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default UserMenu;