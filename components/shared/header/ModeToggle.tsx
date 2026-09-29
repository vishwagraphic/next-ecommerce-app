'use client'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
  DropdownMenuGroup,
} from '@/components/ui/dropdown-menu';
import { Moon, Sun, SunMoon } from "lucide-react";
import { useTheme } from 'next-themes'
import { useState, useEffect } from 'react'

const ModeToggle = () => {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        openOnHover
        className="inline-flex size-8 items-center justify-center rounded-lg text-sm transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-0 focus-visible:ring-offset-0"
        aria-label="Toggle color mode"
      >
        {theme === 'system' && <SunMoon className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />}
        {theme === 'light' && <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />}
        {theme === 'dark' && <Moon className="h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />}
      </DropdownMenuTrigger>

      <DropdownMenuContent>
        <DropdownMenuGroup>
          <DropdownMenuLabel>Appearance</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuCheckboxItem
            checked={theme === 'light'}
            onCheckedChange={() => setTheme('light')}
          >
            Light
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={theme === 'dark'}
            onCheckedChange={() => setTheme('dark')}
          >
            Dark
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={theme === 'system'}
            onCheckedChange={() => setTheme('system')}
          >
            System
          </DropdownMenuCheckboxItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ModeToggle;