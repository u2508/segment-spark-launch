
import React from 'react';
import { ArrowUp, ArrowDown, Users, MessageSquare, Bell, ThumbsUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const DashboardStats: React.FC = () => {
  const stats = [
    {
      title: 'Total Customers',
      value: '12,458',
      change: '+12%',
      isPositive: true,
      icon: Users,
      color: 'bg-blue-50 text-blue-600',
      iconClass: 'text-blue-500',
    },
    {
      title: 'Campaigns Sent',
      value: '254',
      change: '+18%',
      isPositive: true,
      icon: MessageSquare,
      color: 'bg-purple-50 text-purple-600',
      iconClass: 'text-purple-500',
    },
    {
      title: 'Message Delivery',
      value: '98.3%',
      change: '+2.1%',
      isPositive: true,
      icon: Bell,
      color: 'bg-green-50 text-green-600',
      iconClass: 'text-green-500',
    },
    {
      title: 'Engagement Rate',
      value: '24.8%',
      change: '-1.2%',
      isPositive: false,
      icon: ThumbsUp,
      color: 'bg-amber-50 text-amber-600',
      iconClass: 'text-amber-500',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in">
      {stats.map((stat, index) => (
        <Card key={index} className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {stat.title}
            </CardTitle>
            <div className={`p-2 rounded-md ${stat.color}`}>
              <stat.icon className={`h-4 w-4 ${stat.iconClass}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <div className="flex items-center pt-1">
              {stat.isPositive ? (
                <ArrowUp className="h-4 w-4 text-green-500 mr-1" />
              ) : (
                <ArrowDown className="h-4 w-4 text-red-500 mr-1" />
              )}
              <p className={stat.isPositive ? 'text-green-500' : 'text-red-500'}>
                {stat.change} <span className="text-muted-foreground text-xs">vs last month</span>
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default DashboardStats;
