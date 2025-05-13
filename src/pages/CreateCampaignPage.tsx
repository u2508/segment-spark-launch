
import React, { useState } from 'react';
import Header from '@/components/layout/Header';
import SegmentBuilder from '@/components/campaigns/SegmentBuilder';
import MessageGenerator from '@/components/campaigns/MessageGenerator';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { CheckCircle2, Loader2, ArrowRight, Calendar } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface RuleGroup {
  id: string;
  combinator: 'AND' | 'OR';
  rules: {
    id: string;
    field: string;
    operator: string;
    value: string;
  }[];
}

const CreateCampaignPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('details');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [segmentData, setSegmentData] = useState<{
    ruleGroups: RuleGroup[];
    audienceSize: number | null;
  }>({
    ruleGroups: [],
    audienceSize: null
  });
  
  const [campaignData, setCampaignData] = useState({
    name: '',
    description: '',
    subject: '',
    message: '',
    scheduledDate: '',
    scheduledTime: '',
    isValid: false,
  });

  const updateCampaignData = (field: string, value: string) => {
    setCampaignData({
      ...campaignData,
      [field]: value,
      isValid: field === 'name' ? value.trim() !== '' : campaignData.name.trim() !== ''
    });
  };

  const handleSubmit = async () => {
    if (!campaignData.name.trim()) {
      toast({
        title: "Campaign name required",
        description: "Please provide a name for your campaign.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Get the authenticated user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please log in to create campaigns.",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

      // Store campaign in database
      const { data: campaign, error: campaignError } = await supabase
        .from('campaigns')
        .insert([
          {
            name: campaignData.name,
            description: campaignData.description,
            status: 'active',
            audience: segmentData.audienceSize || 0,
            delivered: 0,
            opened: 0,
            rules: segmentData.ruleGroups
          }
        ])
        .select()
        .single();

      if (campaignError) {
        throw new Error(campaignError.message);
      }

      // Simulate message delivery (90% success rate in this simulation)
      const audienceSize = segmentData.audienceSize || 0;
      const failureRate = 0.1; // 10% failure rate
      const failedCount = Math.floor(audienceSize * failureRate);
      const sentCount = audienceSize - failedCount;
      
      // Create a campaign report
      const { error: reportError } = await supabase
        .from('campaign_reports')
        .insert([
          {
            user_id: user.id,
            campaign_name: campaignData.name,
            sent_count: sentCount,
            failed_count: failedCount
          }
        ]);

      if (reportError) {
        console.error("Error creating campaign report:", reportError);
      }

      // Update the delivered count in the campaigns table
      await supabase
        .from('campaigns')
        .update({ delivered: sentCount })
        .eq('id', campaign.id);

      toast({
        title: "Campaign created and sent!",
        description: `Your campaign has been successfully created and sent to ${sentCount.toLocaleString()} recipients.`,
      });

      navigate('/campaigns');
    } catch (error) {
      console.error("Error creating campaign:", error);
      toast({
        title: "Campaign creation failed",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSegmentChange = (ruleGroups: RuleGroup[], audienceSize: number | null) => {
    setSegmentData({
      ruleGroups,
      audienceSize
    });
  };

  const handleSelectMessage = (message: string) => {
    updateCampaignData('message', message);
  };

  return (
    <div className="flex-1 h-screen overflow-auto">
      <Header title="Create Campaign" />
      
      <main className="p-6 max-w-7xl mx-auto pb-20">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Create New Campaign</h1>
          <p className="text-muted-foreground mt-2">
            Set up your campaign details, define your audience, and compose your message.
          </p>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="details">Campaign Details</TabsTrigger>
            <TabsTrigger value="audience">Define Audience</TabsTrigger>
            <TabsTrigger value="message">Compose Message</TabsTrigger>
          </TabsList>
          
          <TabsContent value="details" className="animate-fade-in">
            <Card>
              <CardHeader>
                <CardTitle>Campaign Details</CardTitle>
                <CardDescription>
                  Provide basic information about your campaign
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Campaign Name *</label>
                  <Input 
                    placeholder="Enter campaign name" 
                    value={campaignData.name}
                    onChange={(e) => updateCampaignData('name', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Description</label>
                  <Textarea 
                    placeholder="Enter a description for your campaign" 
                    rows={4}
                    value={campaignData.description}
                    onChange={(e) => updateCampaignData('description', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Scheduled Date</label>
                  <div className="flex gap-2">
                    <Input 
                      type="date"
                      className="max-w-[200px]"
                      value={campaignData.scheduledDate}
                      onChange={(e) => updateCampaignData('scheduledDate', e.target.value)}
                    />
                    <Input 
                      type="time"
                      className="max-w-[150px]"
                      value={campaignData.scheduledTime}
                      onChange={(e) => updateCampaignData('scheduledTime', e.target.value)}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">Leave blank to send immediately after creation</p>
                </div>
              </CardContent>
              <CardFooter className="justify-end">
                <Button 
                  onClick={() => setActiveTab('audience')} 
                  disabled={!campaignData.name.trim()}
                  className="flex items-center gap-1"
                >
                  Continue <ArrowRight className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="audience" className="animate-fade-in">
            <SegmentBuilder onSegmentChange={handleSegmentChange} />
            <div className="flex justify-end mt-6 space-x-4">
              <Button variant="outline" onClick={() => setActiveTab('details')}>
                Back
              </Button>
              <Button 
                onClick={() => setActiveTab('message')}
                className="flex items-center gap-1"
              >
                Continue <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="message" className="animate-fade-in">
            <Card>
              <CardHeader>
                <CardTitle>Compose Message</CardTitle>
                <CardDescription>
                  Create the message you want to send to your audience
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Subject Line</label>
                  <Input 
                    placeholder="Enter subject line" 
                    value={campaignData.subject}
                    onChange={(e) => updateCampaignData('subject', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Message Content</label>
                  <Textarea 
                    placeholder="Enter your message content" 
                    rows={8}
                    value={campaignData.message}
                    onChange={(e) => updateCampaignData('message', e.target.value)}
                  />
                </div>
                
                <div className="bg-muted/40 rounded-md p-5 border">
                  <MessageGenerator
                    campaignName={campaignData.name}
                    audience={segmentData.audienceSize ? `${segmentData.audienceSize.toLocaleString()} customers` : "targeted customers"}
                    onSelectMessage={handleSelectMessage}
                  />
                </div>
              </CardContent>
              <CardFooter className="justify-between">
                <Button variant="outline" onClick={() => setActiveTab('audience')}>
                  Back
                </Button>
                <Button 
                  onClick={handleSubmit} 
                  disabled={isSubmitting || !campaignData.name || !campaignData.message}
                  className="min-w-[140px]"
                >
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {isSubmitting ? 'Creating...' : 'Create & Send'}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default CreateCampaignPage;
