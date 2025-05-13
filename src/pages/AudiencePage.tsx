
import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
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
import { Search, Users, Tags, CalendarClock, Plus, Loader2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';

interface AudienceMember {
  id: string;
  name: string;
  email: string;
  tag: string;
  created_at: string;
}

const AudiencePage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [tagFilter, setTagFilter] = useState('');
  const [newContact, setNewContact] = useState({ name: '', email: '', tag: '' });
  const [page, setPage] = useState(1);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const ITEMS_PER_PAGE = 10;

  const fetchAudience = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('No authenticated user');
    }

    const { data, error } = await supabase
      .from('audience')
      .select('*')
      .eq('user_id', user.id);

    if (error) {
      toast({
        title: "Error fetching audience data",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }

    return data || [];
  };

  const { 
    data: audience = [], 
    isLoading, 
    error, 
    refetch
  } = useQuery({
    queryKey: ['audience'],
    queryFn: fetchAudience
  });

  // Get unique tags from audience data
  const allTags = React.useMemo(() => {
    const uniqueTags = [...new Set(audience.map(person => person.tag))].filter(Boolean);
    return uniqueTags;
  }, [audience]);

  const handleTagUpdate = async (id: string, newTag: string) => {
    try {
      const { error } = await supabase
        .from('audience')
        .update({ tag: newTag })
        .eq('id', id);

      if (error) throw error;
      
      refetch();
      
      toast({
        title: "Tag updated",
        description: "Contact tag has been updated successfully",
      });
    } catch (error: any) {
      toast({
        title: "Failed to update tag",
        description: error.message,
        variant: "destructive", 
      });
    }
  };

  const handleAddContact = async () => {
    try {
      setIsSubmitting(true);
      
      // Validation
      if (!newContact.name || !newContact.email) {
        toast({
          title: "Missing information",
          description: "Please provide both name and email",
          variant: "destructive",
        });
        return;
      }
      
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(newContact.email)) {
        toast({
          title: "Invalid email",
          description: "Please provide a valid email address",
          variant: "destructive",
        });
        return;
      }
      
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('No authenticated user');
      }

      const { error } = await supabase
        .from('audience')
        .insert({
          name: newContact.name,
          email: newContact.email,
          tag: newContact.tag,
          user_id: user.id
        });

      if (error) throw error;
      
      // Reset form and close dialog
      setNewContact({ name: '', email: '', tag: '' });
      setIsAddDialogOpen(false);
      
      // Refresh data
      refetch();
      
      toast({
        title: "Contact added",
        description: "New contact has been added to your audience",
      });
    } catch (error: any) {
      toast({
        title: "Failed to add contact",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filter audience based on search and tag
  const filteredAudience = audience.filter(person => 
    (person.name.toLowerCase().includes(search.toLowerCase()) || 
     person.email.toLowerCase().includes(search.toLowerCase())) &&
    (tagFilter ? person.tag === tagFilter : true)
  );

  // Calculate pagination
  const totalPages = Math.ceil(filteredAudience.length / ITEMS_PER_PAGE);
  const paginatedAudience = filteredAudience.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div className="flex items-center gap-2 mb-4 sm:mb-0">
          <Users className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold">Audience</h1>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus size={16} />
              <span>Add Contact</span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Contact</DialogTitle>
              <DialogDescription>
                Add a new contact to your audience. Enter their details below.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  placeholder="Enter full name"
                  value={newContact.name}
                  onChange={(e) => setNewContact({...newContact, name: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="email@example.com"
                  value={newContact.email}
                  onChange={(e) => setNewContact({...newContact, email: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="tag">Tag (optional)</Label>
                <Input
                  id="tag"
                  placeholder="Enter a tag"
                  value={newContact.tag}
                  onChange={(e) => setNewContact({...newContact, tag: e.target.value})}
                />
              </div>
            </div>
            <DialogFooter>
              <Button 
                onClick={handleAddContact} 
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Adding...
                  </>
                ) : (
                  "Add Contact"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Contacts</CardTitle>
          <CardDescription>
            Manage and organize your contacts for messaging campaigns
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or email"
                className="pl-8"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
              />
            </div>
            <Select
              value={tagFilter}
              onValueChange={(value) => {
                setTagFilter(value);
                setPage(1);
              }}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by tag" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Tags</SelectItem>
                {allTags.map(tag => (
                  <SelectItem key={tag} value={tag}>{tag}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {isLoading ? (
            <div className="flex justify-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : error ? (
            <div className="text-center py-8 text-red-500">
              <p>Error loading audience data. Please try again.</p>
            </div>
          ) : paginatedAudience.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-lg">
              <Users className="w-12 h-12 mx-auto text-gray-400" />
              <p className="mt-4 text-lg font-medium text-gray-600">No contacts found</p>
              <p className="text-sm text-gray-500 mt-1">
                {search || tagFilter 
                  ? "Try changing your search or filter" 
                  : "Add contacts to start building your audience"}
              </p>
              <Button 
                className="mt-4"
                onClick={() => setIsAddDialogOpen(true)}
              >
                <Plus size={16} className="mr-2" />
                Add Your First Contact
              </Button>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Tag</TableHead>
                      <TableHead>Joined</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedAudience.map((person) => (
                      <TableRow key={person.id} className="hover:bg-muted/50">
                        <TableCell className="font-medium">{person.name}</TableCell>
                        <TableCell>{person.email}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Tags size={14} className="text-muted-foreground" />
                            <Input
                              type="text"
                              value={person.tag || ''}
                              className="h-8 w-full max-w-[180px]"
                              placeholder="Add tag..."
                              onChange={(e) => handleTagUpdate(person.id, e.target.value)}
                            />
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <CalendarClock size={14} className="text-muted-foreground" />
                            <span>{formatDate(person.created_at)}</span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
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

export default AudiencePage;
