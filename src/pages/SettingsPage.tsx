import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client'; // adjust the path based on your project

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

      const { data, error: profileError } = await supabase
        .from('user_profiles')
        .select('name, email')
        .eq('id', id)
        .single();

      if (profileError) {
        console.error('Error loading profile:', profileError.message);
      } else {
        setName(data?.name || '');
        setEmail(data?.email || '');
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
      .update({ name, email })
      .eq('id', userId);

    if (error) {
      console.error('Update error:', error.message);
      alert('Failed to update settings');
    } else {
      alert('Settings updated successfully');
    }

    setLoading(false);
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Settings</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-medium mb-1">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Update Settings
          </button>
        </form>
      )}
    </div>
  );
};

export default SettingsPage;

