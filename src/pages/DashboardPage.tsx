
import React from 'react';
import Header from '@/components/layout/Header';
import DashboardStats from '@/components/dashboard/DashboardStats';
import CampaignCard from '@/components/campaigns/CampaignCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const recentCampaigns = [
  {
    id: '1',
    name: 'Welcome Series',
    status: 'active' as const,
    audience: 3420,
    delivered: 3245,
    opened: 1842,
    createdAt: '2023-05-12T10:30:00Z',
  },
  {
    id: '2',
    name: 'Loyal Customer Rewards',
    status: 'scheduled' as const,
    audience: 1250,
    delivered: 0,
    opened: 0,
    createdAt: '2023-05-15T14:45:00Z',
  },
  {
    id: '3',
    name: 'Product Launch Announcement',
    status: 'draft' as const,
    audience: 8700,
    delivered: 0,
    opened: 0,
    createdAt: '2023-05-10T09:15:00Z',
  },
  {
    id: '4',
    name: 'Re-engagement Campaign',
    status: 'completed' as const,
    audience: 5280,
    delivered: 5120,
    opened: 2245,
    createdAt: '2023-05-05T11:20:00Z',
  },
];

const DashboardPage: React.FC = () => {
  return (
    <div className="flex-1 h-screen overflow-auto">
      <Header title="Dashboard" />
      
      <main className="p-6 max-w-7xl mx-auto">
        <DashboardStats />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
          <Card className="lg:col-span-2 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Recent Campaigns</CardTitle>
              <Link to="/campaigns">
                <Button variant="ghost" className="text-sm">
                  View All <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                {recentCampaigns.slice(0, 4).map(campaign => (
                  <CampaignCard key={campaign.id} campaign={campaign} />
                ))}
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Audience Growth</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-center h-80">
              <div className="text-center text-muted-foreground">
                <p>Chart will be displayed here</p>
                <p className="text-sm mt-2">Showing customer acquisition data for the last 30 days</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
