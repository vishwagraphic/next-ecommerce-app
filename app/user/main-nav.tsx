'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {cn} from '@/lib/utils';
import React from 'react';

const Links = [
    { href: '/user/profile', title: 'Profile' },
    { href: '/user/orders', title: 'Orders' },
];


const MainNav = ({className, ...props}: React.HTMLAttributes<HTMLElement>) => {
    return ( <nav className={cn("flex items-center space-x-4 lg:space-x-6", className)} {...props}>
      {Links.map((link) => (
        <Link key={link.href} href={link.href} className={cn("text-sm font-medium transition-colors hover:text-primary", usePathname() === link.href ? "" : "text-muted-foreground")}>
          {link.title}
        </Link>
      ))}
    </nav> );
}
 
export default MainNav;