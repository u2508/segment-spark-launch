
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Calendar, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CampaignCardProps {
  campaign: {
    id: string;
    name: string;
    status: 'active' | 'scheduled' | 'draft' | 'completed' | 'failed';
    audience: number;
    delivered: number;
    opened: number;
    createdAt: string;
  };
}

const statusStyles = {
  active: 'bg-green-100 text-green-800',
  scheduled: 'bg-blue-100 text-blue-800',
  draft: 'bg-gray-100 text-gray-800',
  completed: 'bg-purple-100 text-purple-800',
  failed: 'bg-red-100 text-red-800',
};

const CampaignCard: React.FC<CampaignCardProps> = ({ campaign }) => {
  const deliveryRate = Math.round((campaign.delivered / campaign.audience) * 100);
  const openRate = campaign.delivered ? Math.round((campaign.opened / campaign.delivered) * 100) : 0;
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <Card className="hover:shadow-md transition-shadow animate-fade-in">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-medium">{campaign.name}</CardTitle>
          <Badge className={cn(statusStyles[campaign.status])}>
            {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between mb-4 text-sm text-muted-foreground">
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-1" />
            <span>{formatDate(campaign.createdAt)}</span>
          </div>
          <div className="flex items-center">
            <Users className="h-4 w-4 mr-1" />
            <span>{campaign.audience.toLocaleString()} audience</span>
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium">Delivery Rate</span>
              <span className="text-sm font-semibold">{deliveryRate}%</span>
            </div>
            <Progress value={deliveryRate} className="h-2" />
          </div>
          
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium">Open Rate</span>
              <span className="text-sm font-semibold">{openRate}%</span>
            </div>
            <Progress value={openRate} className="h-2" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CampaignCard;
