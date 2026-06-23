import { Skeleton } from '@/components/ui/skeleton';

export default function UsersPageSkeleton() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Skeleton className="h-9 w-64 mb-2" />
          <Skeleton className="h-4 w-80" />
        </div>
        <Skeleton className="h-10 w-full sm:w-32" />
      </div>
      <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
        <div className="flex flex-col gap-5 p-5 border-b border-border bg-muted/10">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
             <Skeleton className="h-10 w-full sm:max-w-sm" />
             <div className="flex flex-wrap items-center gap-3">
                <Skeleton className="h-10 w-32" />
                <Skeleton className="h-10 w-[140px]" />
                <Skeleton className="h-10 w-[140px]" />
             </div>
          </div>
        </div>
        <div className="p-4 space-y-4">
           {Array.from({ length: 5 }).map((_, i) => (
             <Skeleton key={i} className="h-12 w-full" />
           ))}
        </div>
      </div>
    </div>
  );
}
