import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client'; // adjust the path based on your project

interface Report {
  id: string;
  campaign_name: string;
  sent_count: number;
  failed_count: number;
  created_at: string;
}

const ReportsPage: React.FC = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      setLoading(true);
      const {
        data: { user },
        error: userError
      } = await supabase.auth.getUser();

      if (userError || !user) {
        console.error('User fetch error:', userError);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('campaign_reports')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching reports:', error.message);
      } else {
        setReports(data || []);
      }

      setLoading(false);
    };

    fetchReports();
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Reports</h1>
      {loading ? (
        <p>Loading reports...</p>
      ) : reports.length === 0 ? (
        <p className="text-gray-500">No reports found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full table-auto border border-gray-300">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-2 border">Campaign</th>
                <th className="p-2 border">Sent</th>
                <th className="p-2 border">Failed</th>
                <th className="p-2 border">Date</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((report) => (
                <tr key={report.id} className="hover:bg-gray-50">
                  <td className="p-2 border">{report.campaign_name}</td>
                  <td className="p-2 border text-green-700">{report.sent_count}</td>
                  <td className="p-2 border text-red-700">{report.failed_count}</td>
                  <td className="p-2 border">
                    {new Date(report.created_at).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ReportsPage;
