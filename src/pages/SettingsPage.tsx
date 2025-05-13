
import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

const SettingsPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: user, error } = await supabase.auth.getUser();
      if (error || !user.user) {
        console.error('Error fetching user:', error);
        return;
      }

      const { id } = user.user;
      setUserId(id);

      // Use the "profiles" table which exists in Supabase by default for Auth
      const { data, error: profileError } = await supabase
        .from('profiles')
        .select('username, id')
        .eq('id', id)
        .single();

      if (profileError) {
        console.error('Error loading profile:', profileError.message);
      } else {
        setName(data?.username || '');
        setEmail(user.user.email || '');
      }

      setLoading(false);
    };

    fetchProfile();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;

    setLoading(true);

    const { error } = await supabase
      .from('profiles')
      .update({ username: name })
      .eq('id', userId);

    if (error) {
      console.error('Update error:', error.message);
      toast({
        title: "Failed to update settings",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Settings updated successfully",
        description: "Your profile settings have been saved.",
      });
    }

    setLoading(false);
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Settings</h1>
      
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Profile Settings</CardTitle>
          <CardDescription>
            Update your profile information
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center p-4">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Display Name</label>
                <Input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full"
                  placeholder="Your name"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Email</label>
                <Input
                  type="email"
                  value={email}
                  readOnly
                  className="w-full bg-muted/50"
                />
                <p className="text-xs text-muted-foreground">Email cannot be changed</p>
              </div>
            </form>
          )}
        </CardContent>
        
        <CardFooter>
          <Button 
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="ml-auto"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SettingsPage;
