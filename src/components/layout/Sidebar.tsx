
import React from 'react';
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
} from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed, setCollapsed }) => {
  const location = useLocation();
  const { user } = useAuth();

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
        {!collapsed && (
          <div className="flex items-center">
            <div className="h-8 w-8 rounded-full bg-primary text-white flex items-center justify-center font-semibold">
              {initials}
            </div>
            <div className="ml-3 text-sidebar-foreground">
              <p className="text-sm font-medium">{displayName}</p>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
