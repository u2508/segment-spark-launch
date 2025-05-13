import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { Badge } from '@/components/ui/badge';
import { BarChart2, FileText } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface Report {
  id: string;
  campaign_name: string;
  sent_count: number;
  failed_count: number;
  delivered_count?: number;
  open_rate?: number;
  click_rate?: number;
  created_at: string;
}

const ReportsPage: React.FC = () => {
  const [timeRange, setTimeRange] = useState('all');
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  const fetchReports = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('No authenticated user found');
    }
    
    let query = supabase
      .from('campaign_reports')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    
    if (timeRange === 'week') {
      const lastWeek = new Date();
      lastWeek.setDate(lastWeek.getDate() - 7);
      query = query.gte('created_at', lastWeek.toISOString());
    } else if (timeRange === 'month') {
      const lastMonth = new Date();
      lastMonth.setMonth(lastMonth.getMonth() - 1);
      query = query.gte('created_at', lastMonth.toISOString());
    }
    
    const { data, error } = await query;
    
    if (error) {
      toast({
        title: "Error fetching reports",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
    
    return data || [];
  };

  const { data: reports = [], isLoading, error, refetch } = useQuery({
    queryKey: ['reports', timeRange],
    queryFn: fetchReports,
  });

  // Calculate pagination
  const totalPages = Math.ceil(reports.length / itemsPerPage);
  const paginatedReports = reports.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  // Calculate delivery rate
  const calculateDeliveryRate = (sent: number, failed: number) => {
    if (sent === 0) return 0;
    const delivered = sent - failed;
    return Math.round((delivered / sent) * 100);
  };

  // Get status badge based on delivery rate
  const getStatusBadge = (deliveryRate: number) => {
    if (deliveryRate >= 95) {
      return <Badge className="bg-green-500">Excellent</Badge>;
    } else if (deliveryRate >= 80) {
      return <Badge className="bg-amber-500">Good</Badge>;
    } else {
      return <Badge className="bg-red-500">Poor</Badge>;
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div className="flex items-center gap-2 mb-4 md:mb-0">
          <BarChart2 className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold">Campaign Reports</h1>
        </div>
        
        <div className="flex items-center gap-4">
          <Select
            value={timeRange}
            onValueChange={(value) => {
              setTimeRange(value);
              setPage(1);
            }}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Time</SelectItem>
              <SelectItem value="week">Last Week</SelectItem>
              <SelectItem value="month">Last Month</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Campaign Performance</CardTitle>
          <CardDescription>
            View detailed reports of all your messaging campaigns
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : error ? (
            <div className="text-center py-8 text-red-500">
              <p>Error loading reports. Please try again.</p>
            </div>
          ) : paginatedReports.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-lg">
              <FileText className="w-12 h-12 mx-auto text-gray-400" />
              <p className="mt-4 text-lg font-medium text-gray-600">No reports found</p>
              <p className="text-sm text-gray-500 mt-1">
                Create and send campaigns to generate reports
              </p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Campaign</TableHead>
                      <TableHead className="text-center">Sent</TableHead>
                      <TableHead className="text-center">Failed</TableHead>
                      <TableHead className="text-center">Delivery Rate</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="text-center">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedReports.map((report) => {
                      const deliveryRate = calculateDeliveryRate(report.sent_count, report.failed_count);
                      return (
                        <TableRow key={report.id} className="hover:bg-muted/50">
                          <TableCell className="font-medium">{report.campaign_name}</TableCell>
                          <TableCell className="text-center">{report.sent_count}</TableCell>
                          <TableCell className="text-center text-red-600">{report.failed_count}</TableCell>
                          <TableCell className="text-center">{deliveryRate}%</TableCell>
                          <TableCell>{formatDate(report.created_at)}</TableCell>
                          <TableCell className="text-center">
                            {getStatusBadge(deliveryRate)}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <Pagination className="mt-6">
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious 
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        className={page === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>
                    
                    {Array.from({ length: totalPages }).map((_, i) => {
                      // Show first page, last page, and pages around current page
                      if (
                        i === 0 || 
                        i === totalPages - 1 || 
                        (i >= page - 2 && i <= page)
                      ) {
                        return (
                          <PaginationItem key={i}>
                            <PaginationLink
                              onClick={() => setPage(i + 1)}
                              isActive={page === i + 1}
                            >
                              {i + 1}
                            </PaginationLink>
                          </PaginationItem>
                        );
                      }
                      // Add ellipsis if there's a gap
                      if (i === 1 && page > 3) {
                        return (
                          <PaginationItem key={i}>
                            <PaginationEllipsis />
                          </PaginationItem>
                        );
                      }
                      return null;
                    })}
                    
                    <PaginationItem>
                      <PaginationNext 
                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                        className={page === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportsPage;
