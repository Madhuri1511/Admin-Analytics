import { memo, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, IndianRupee, ShoppingBag, TrendingUp } from 'lucide-react';
import { useAppSelector } from '../../store/hooks';
import { formatCurrency, formatNumber, formatPercent } from '../../utils/formatters';
import AnalyticsCard from './AnalyticsCard';

const AnalyticsCards = memo(function AnalyticsCards() {
  const navigate = useNavigate();
  const { data, loading } = useAppSelector((state) => state.analytics);
  const usersTotal = useAppSelector((state) => state.users.list?.total);

  const cards = useMemo(
    () => [
      {
        title: 'Total Users',
value: usersTotal !== undefined ? formatNumber(usersTotal) : data ? formatNumber(data.totalUsers) : '—',
icon: Users,
trend: '+12.4% from last month',
      },
      {
        title: 'Revenue',
        value: data ? formatCurrency(data.revenue) : '—',
        icon: IndianRupee,
        trend: '+8.7% from last month',
      },
      {
        title: 'Orders',
        value: data ? formatNumber(data.orders) : '—',
        icon: ShoppingBag,
        trend: '+5.9% from last month',
      },
      {
        title: 'Conversion Rate',
        value: data ? formatPercent(data.conversionRate) : '—',
        icon: TrendingUp,
        trend: '+0.4% from last month',
      },
    ],
    [data],
  );

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4 animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out fill-mode-both">
      {cards.map((card, index) => (
        <div key={card.title} style={{ animationDelay: `${index * 150}ms` }} className="animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both">
          <AnalyticsCard 
            {...card} 
            loading={loading && !data} 
            onClick={card.title === 'Total Users' ? () => navigate('/users') : undefined}
          />
        </div>
      ))}
    </div>
  );
});

export default AnalyticsCards;
