
import React from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Calendar, Users, Check, Mail } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '../ui/button';

interface Campaign {
  id: string;
  name: string;
  status: 'active' | 'scheduled' | 'draft' | 'completed' | 'failed';
  audience: number;
  delivered: number;
  opened: number;
  createdAt: string;
}

interface CampaignHistoryTableProps {
  campaigns: Campaign[];
  onViewDetails: (id: string) => void;
}

const statusStyles = {
  active: 'bg-green-100 text-green-800',
  scheduled: 'bg-blue-100 text-blue-800',
  draft: 'bg-gray-100 text-gray-800',
  completed: 'bg-purple-100 text-purple-800',
  failed: 'bg-red-100 text-red-800',
};

const CampaignHistoryTable: React.FC<CampaignHistoryTableProps> = ({ campaigns, onViewDetails }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[250px]">Campaign Name</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Audience</TableHead>
            <TableHead>Delivery Rate</TableHead>
            <TableHead>Open Rate</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {campaigns.map((campaign) => {
            const deliveryRate = Math.round((campaign.delivered / campaign.audience) * 100);
            const openRate = campaign.delivered ? Math.round((campaign.opened / campaign.delivered) * 100) : 0;
            
            return (
              <TableRow key={campaign.id}>
                <TableCell className="font-medium">{campaign.name}</TableCell>
                <TableCell>
                  <Badge className={cn(statusStyles[campaign.status])}>
                    {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Users className="h-3.5 w-3.5 text-muted-foreground" />
                    {campaign.audience.toLocaleString()}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Progress value={deliveryRate} className="h-2" />
                    <span className="text-xs font-medium">{deliveryRate}%</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Progress value={openRate} className="h-2" />
                    <span className="text-xs font-medium">{openRate}%</span>
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>{formatDate(campaign.createdAt)}</span>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost" 
                    size="sm" 
                    onClick={() => onViewDetails(campaign.id)}
                  >
                    View Details
                  </Button>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default CampaignHistoryTable;
