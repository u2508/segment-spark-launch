import React, { useEffect, useState } from 'react';
import { supabase } from 'src/integrations/supabase/client';

interface AudienceMember {
  id: string;
  name: string;
  email: string;
  tag: string;
  created_at: string;
}

const ITEMS_PER_PAGE = 5;

const AudiencePage: React.FC = () => {
  const [audience, setAudience] = useState<AudienceMember[]>([]);
  const [search, setSearch] = useState('');
  const [tagFilter, setTagFilter] = useState('');
  const [allTags, setAllTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [userId, setUserId] = useState<string | null>(null);

  const offset = (page - 1) * ITEMS_PER_PAGE;

  useEffect(() => {
    const fetchUserAndAudience = async () => {
      setLoading(true);

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) return;

      setUserId(user.id);

      const { data, error } = await supabase
        .from('audience')
        .select('*')
        .eq('user_id', user.id);

      if (error) {
        console.error('Error fetching audience:', error.message);
        return;
      }

      const filtered = data || [];

      const uniqueTags = [...new Set(filtered.map((item) => item.tag))].filter(Boolean);

      setAllTags(uniqueTags);
      setAudience(filtered);
      setLoading(false);
    };

    fetchUserAndAudience();
  }, []);

  const handleTagUpdate = async (id: string, newTag: string) => {
    const { error } = await supabase
      .from('audience')
      .update({ tag: newTag })
      .eq('id', id);

    if (!error) {
      setAudience((prev) =>
        prev.map((person) =>
          person.id === id ? { ...person, tag: newTag } : person
        )
      );
    }
  };

  const filteredAudience = audience
    .filter(
      (person) =>
        person.name.toLowerCase().includes(search.toLowerCase()) ||
        person.email.toLowerCase().includes(search.toLowerCase())
    )
    .filter((person) => (tagFilter ? person.tag === tagFilter : true));

  const paginated = filteredAudience.slice(offset, offset + ITEMS_PER_PAGE);
  const totalPages = Math.ceil(filteredAudience.length / ITEMS_PER_PAGE);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Audience</h1>

      <div className="flex flex-wrap items-center gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by name or email"
          className="border p-2 rounded w-full sm:w-64"
          value={search}
          onChange={(e) => {
            setPage(1);
            setSearch(e.target.value);
          }}
        />
        <select
          className="border p-2 rounded"
          value={tagFilter}
          onChange={(e) => {
            setPage(1);
            setTagFilter(e.target.value);
          }}
        >
          <option value="">All Tags</option>
          {allTags.map((tag) => (
            <option key={tag} value={tag}>
              {tag}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : paginated.length === 0 ? (
        <p>No results found.</p>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full table-auto border border-gray-300">
              <thead className="bg-gray-100 text-left">
                <tr>
                  <th className="p-2 border">Name</th>
                  <th className="p-2 border">Email</th>
                  <th className="p-2 border">Tag</th>
                  <th className="p-2 border">Joined</th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((person) => (
                  <tr key={person.id} className="hover:bg-gray-50">
                    <td className="p-2 border">{person.name}</td>
                    <td className="p-2 border">{person.email}</td>
                    <td className="p-2 border">
                      <input
                        type="text"
                        value={person.tag}
                        className="border p-1 rounded w-full"
                        onChange={(e) => handleTagUpdate(person.id, e.target.value)}
                      />
                    </td>
                    <td className="p-2 border">
                      {new Date(person.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="mt-4 flex justify-center gap-2">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => setPage(i + 1)}
                className={`px-3 py-1 rounded border ${
                  page === i + 1 ? 'bg-blue-600 text-white' : 'bg-white text-blue-600'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default AudiencePage;
