import { memo, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchAnalytics } from '../../store/analyticsSlice';
import { fetchUsers } from '../../store/usersSlice';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AnalyticsCards from './AnalyticsCards';
import AnalyticsChart from './AnalyticsChart';
import UsersTable from '../users/UsersTable';

const DashboardPage = memo(function DashboardPage() {
  const dispatch = useAppDispatch();
  const { error } = useAppSelector((state) => state.analytics);
  const { list } = useAppSelector((state) => state.users);

  const loadAnalytics = useCallback(() => {
    dispatch(fetchAnalytics());
  }, [dispatch]);
  const loadUsers = useCallback(() => {
    dispatch(fetchUsers({}));
  }, [dispatch]);

  useEffect(() => {
    loadAnalytics();
    loadUsers();
  }, [loadAnalytics, loadUsers]);

  return (
    <div className="space-y-8">
      <div className="animate-in fade-in slide-in-from-top-4 duration-500 ease-out fill-mode-both">
        <h2 className="text-2xl font-semibold tracking-tight">Dashboard</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Key metrics and recent activity
        </p>
      </div>

      {error ? (
        <Alert variant="destructive">
          <AlertDescription className="flex flex-wrap items-center justify-between gap-3">
            <span>{error}</span>
            <Button type="button" variant="outline" size="sm" onClick={loadAnalytics}>
              Try again
            </Button>
          </AlertDescription>
        </Alert>
      ) : null}

      <AnalyticsCards />

      <div className="grid gap-4 xl:grid-cols-7">
        <div className="xl:col-span-4">
          <AnalyticsChart />
        </div>

        <Card className="xl:col-span-3 shadow-sm animate-in fade-in slide-in-from-bottom-6 duration-700 delay-300 ease-out fill-mode-both flex flex-col h-full border-border/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-medium">Recent users</CardTitle>
            {list && list.total > 5 ? (
              <Button asChild variant="ghost" size="sm" className="h-8 hover:bg-primary/10 hover:text-primary transition-colors">
                <Link to="/users">View all</Link>
              </Button>
            ) : null}
          </CardHeader>
          <CardContent className="flex-1 p-0 px-6 pb-6">
            <UsersTable compact />
          </CardContent>
        </Card>
      </div>
    </div>
  );
});

export default DashboardPage;
