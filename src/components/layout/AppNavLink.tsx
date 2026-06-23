import * as React from 'react';
import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';

interface AppNavLinkProps {
  to: string;
  label: string;
  icon?: LucideIcon;
  onClick?: (event: React.MouseEvent<HTMLAnchorElement>) => void;
  end?: boolean;
}

export default function AppNavLink({ to, label, icon: Icon, onClick, end = false }: AppNavLinkProps) {
  return (
    <NavLink
      to={to}
      end={end}
      onClick={onClick}
      className={({ isActive }) =>
        cn(
          'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
          isActive
            ? 'bg-primary text-primary-foreground'
            : 'text-muted-foreground hover:bg-muted hover:text-foreground',
        )
      }
    >
      {Icon ? <Icon className="size-4 shrink-0" /> : null}
      {label}
    </NavLink>
  );
}
