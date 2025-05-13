
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  MessageSquare,
  Users,
  FileText,
  Settings,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  FileCode,
  LogOut,
} from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader,
  DialogTitle,
  DialogTrigger 
} from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from '@/hooks/use-toast';

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed, setCollapsed }) => {
  const location = useLocation();
  const { user, signOut } = useAuth();
  const [profileOpen, setProfileOpen] = useState(false);

  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Campaigns', path: '/campaigns', icon: MessageSquare },
    { name: 'Audience', path: '/audience', icon: Users },
    { name: 'Reports', path: '/reports', icon: FileText },
    { name: 'API Docs', path: '/api-docs', icon: FileCode },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  const displayName =
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    user?.email?.split('@')[0] ||
    'User';

  const initials = displayName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2); // Max 2 letters

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Signed out",
        description: "You have been signed out successfully",
      });
    } catch (error) {
      toast({
        title: "Sign out failed",
        description: "Failed to sign out. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <aside
      className={cn(
        'bg-sidebar h-screen transition-all duration-300 flex flex-col border-r border-sidebar-border',
        collapsed ? 'w-[70px]' : 'w-[250px]'
      )}
    >
      <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
        {!collapsed && (
          <h2 className="text-xl font-bold text-sidebar-foreground">MessageIQ</h2>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="text-sidebar-foreground hover:bg-sidebar-accent"
        >
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </Button>
      </div>

      <nav className="flex-1 p-2">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={cn(
                  'flex items-center p-3 rounded-md transition-colors text-sidebar-foreground hover:bg-sidebar-accent',
                  location.pathname === item.path && 'bg-sidebar-accent text-primary'
                )}
              >
                <item.icon size={20} className={cn(collapsed ? 'mx-auto' : 'mr-3')} />
                {!collapsed && <span>{item.name}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-4 border-t border-sidebar-border">
        <Dialog open={profileOpen} onOpenChange={setProfileOpen}>
          <DialogTrigger asChild>
            <button className={cn(
              "w-full flex items-center rounded-md p-2 hover:bg-sidebar-accent transition-colors",
              collapsed ? "justify-center" : "justify-start"
            )}>
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-primary text-white">{initials}</AvatarFallback>
                {user?.user_metadata?.avatar_url && (
                  <AvatarImage src={user.user_metadata.avatar_url} />
                )}
              </Avatar>
              {!collapsed && (
                <div className="ml-3 text-left text-sidebar-foreground">
                  <p className="text-sm font-medium truncate max-w-[150px]">{displayName}</p>
                </div>
              )}
            </button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Profile</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col items-center space-y-4 py-6">
              <Avatar className="h-20 w-20">
                <AvatarFallback className="bg-primary text-white text-2xl">{initials}</AvatarFallback>
                {user?.user_metadata?.avatar_url && (
                  <AvatarImage src={user.user_metadata.avatar_url} />
                )}
              </Avatar>
              <div className="text-center">
                <h3 className="text-lg font-medium">{displayName}</h3>
                <p className="text-sm text-muted-foreground">{user?.email}</p>
              </div>
              <div className="w-full pt-4">
                <Link 
                  to="/settings" 
                  className="w-full block text-center py-2 px-4 border rounded-md hover:bg-accent"
                  onClick={() => setProfileOpen(false)}
                >
                  Manage Account
                </Link>
              </div>
              <Button 
                variant="outline" 
                className="w-full mt-2" 
                onClick={handleSignOut}
              >
                <LogOut size={16} className="mr-2" />
                Sign Out
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {collapsed && (
          <Button 
            variant="ghost" 
            className="w-full flex justify-center mt-2" 
            onClick={handleSignOut}
          >
            <LogOut size={20} />
          </Button>
        )}

        {!collapsed && (
          <Button 
            variant="ghost" 
            className="w-full flex items-center justify-start mt-2" 
            onClick={handleSignOut}
          >
            <LogOut size={18} className="mr-2" />
            <span>Sign out</span>
          </Button>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
