'use client';

import { Button } from '@agenticindiedev/ui';
import { UserButton, useUser } from '@clerk/nextjs';
import { Calendar, GanttChart, History, Inbox, LayoutDashboard, Target } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import SidebarProjects from './sidebar-projects';

const navigation = [
  { name: 'Today', href: '/today', icon: LayoutDashboard },
  { name: 'Inbox', href: '/inbox', icon: Inbox },
  { name: 'Upcoming', href: '/upcoming', icon: Calendar },
  { name: 'Timeline', href: '/timeline', icon: GanttChart },
  { name: 'Goals', href: '/goals', icon: Target },
  { name: 'History', href: '/history', icon: History },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { isSignedIn } = useUser();

  if (!isSignedIn) {
    return <>{children}</>;
  }

  return (
    <div className="flex h-screen bg-background">
      <aside className="w-64 border-r border-border bg-card flex flex-col">
        <div className="flex h-16 items-center justify-between border-b border-border px-6">
          <h1 className="text-xl font-semibold">TaskFlow</h1>
          <UserButton />
        </div>
        <nav className="p-4 space-y-1 flex-1 overflow-auto">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link key={item.name} href={item.href}>
                <Button
                  variant={isActive ? 'default' : 'ghost'}
                  className="w-full justify-start"
                >
                  <Icon className="mr-2 h-4 w-4" />
                  {item.name}
                </Button>
              </Link>
            );
          })}

          <SidebarProjects />
        </nav>
      </aside>
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}

