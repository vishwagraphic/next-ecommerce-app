import Link from "next/link";
import { EllipsisVertical, ShoppingCart, UserIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import ModeToggle from './ModeToggle'

const Menu = () => {
  return (
    <div className="flex justify-end gap-3">
      <nav className="hidden md:flex w-full max-w-xs gap-1">
        <ModeToggle />

        <Button variant="ghost">
          <Link href="/cart" className="inline-flex items-center gap-2">
            <ShoppingCart />
            <span>Cart</span>
          </Link>
        </Button>

        <Button className="space-x-2">
          <Link href="/sign-in" className="inline-flex items-center gap-2">
            <UserIcon />
            <span>Sign In</span>
          </Link>
        </Button>
      </nav>

      <nav className="md:hidden">
        <Sheet>
          <SheetTrigger className="align-middle">
            <EllipsisVertical />
          </SheetTrigger>
          <SheetContent className="flex flex-col item-start">
            <SheetHeader>
              <SheetTitle>Menu</SheetTitle>
            </SheetHeader>
            <ModeToggle />
            <Link
              href="/cart"
              className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <ShoppingCart />
              <span>Cart</span>
            </Link>
             <Link
              href="/cart"
              className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
            <UserIcon />
            <span>Sign In</span>
            </Link>
            <SheetDescription />
          </SheetContent>
        </Sheet>
      </nav>
    </div>
  );
};

export default Menu;