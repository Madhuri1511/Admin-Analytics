import { memo, useCallback, useState } from 'react';
import { Menu, LogOut } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { NAV_ITEMS } from '../../constants/navItems';
import AppNavLink from './AppNavLink';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';

const Header = memo(function Header() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);

  const handleLogout = useCallback(() => {
    logout();
  }, [logout]);

  const closeMenu = useCallback(() => {
    setOpen(false);
  }, []);

  return (
    <header className="sticky top-0 z-30 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="flex h-16 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="lg:hidden">
                <Menu className="size-4" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 p-0">
              <SheetHeader className="border-b px-5 py-4 text-left">
                <SheetTitle>Admin Analytics</SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-1 p-3">
                {NAV_ITEMS.map((item) => (
                  <AppNavLink key={item.to} {...item} onClick={closeMenu} />
                ))}
              </nav>
            </SheetContent>
          </Sheet>

          <div>
            <h1 className="text-base font-semibold sm:text-lg">Admin Analytics</h1>
            <p className="hidden text-xs text-muted-foreground sm:block">
              Admin dashboard
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-2">
            {user?.profileImage ? (
              <img
                src={user?.profileImage}
                alt=""
                className="size-7 rounded-full object-cover border"
              />
            ) : (
              <div className="flex size-7 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-semibold">
                {user?.name ? user.name.substring(0, 2).toUpperCase() : 'U'}
              </div>
            )}
            <span className="hidden max-w-[140px] truncate text-sm font-medium text-muted-foreground sm:inline md:max-w-[200px]">
              {user?.name ?? user?.email}
            </span>
          </div>
          <Separator orientation="vertical" className="hidden h-6 sm:block" />
          <Button className="cursor-pointer" variant="ghost" size="sm" onClick={handleLogout}>
            <LogOut className="size-4 sm:mr-2" />
            <span className="hidden sm:inline">Logout</span>
          </Button>
        </div>
      </div>
    </header>
  );
});

export default Header;
