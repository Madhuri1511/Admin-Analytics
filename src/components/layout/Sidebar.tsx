import { memo } from 'react';
import { BarChart2 } from 'lucide-react';
import { NAV_ITEMS } from '../../constants/navItems';
import AppNavLink from './AppNavLink';
import { Separator } from '@/components/ui/separator';

const Sidebar = memo(function Sidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r bg-background lg:flex">
      <div className="flex h-16 items-center gap-3 px-5">
        <div className="flex size-9 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground">
          <BarChart2 className="size-5" />
        </div>
        <div>
          <p className="text-sm font-semibold leading-none">Admin Analytics</p>
          <p className="mt-1 text-xs text-muted-foreground">Analytics panel</p>
        </div>
      </div>

      <Separator />

      <nav className="flex flex-1 flex-col gap-1 p-3">
        {NAV_ITEMS.map((item) => (
          <AppNavLink key={item.to} {...item} />
        ))}
      </nav>
    </aside>
  );
});

export default Sidebar;
