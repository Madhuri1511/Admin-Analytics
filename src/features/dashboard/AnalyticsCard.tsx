import { memo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import type { LucideIcon } from 'lucide-react';

interface AnalyticsCardProps {
  title: string;
  value: string;
  icon?: LucideIcon;
  trend?: string;
  loading?: boolean;
}

const AnalyticsCard = memo(function AnalyticsCard({
  title,
  value,
  icon: Icon,
  trend,
  loading,
}: AnalyticsCardProps) {
  return (
    <Card className="group cursor-pointer border-border/50 shadow-sm transition-all duration-300 ease-out hover:-translate-y-1 hover:border-primary/20 hover:shadow-md dark:hover:shadow-primary/5">
      <CardContent className="pt-6">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 space-y-2">
            <p className="text-sm text-muted-foreground transition-colors group-hover:text-foreground">
              {title}
            </p>
            {loading ? (
              <Skeleton className="h-8 w-24" data-testid="analytics-skeleton" />
            ) : (
              <p className="text-2xl font-semibold tabular-nums">{value}</p>
            )}
            {trend && !loading ? (
              <p className="text-xs text-emerald-600 transition-transform duration-300 origin-left group-hover:scale-105 group-hover:text-emerald-500">
                {trend}
              </p>
            ) : null}
          </div>
          {Icon ? (
            <div className="rounded-lg bg-primary/10 p-2.5 text-primary transition-all duration-300 group-hover:bg-primary group-hover:text-primary-foreground group-hover:shadow-sm group-hover:scale-110">
              <Icon className="size-5" />
            </div>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
});

export default AnalyticsCard;
