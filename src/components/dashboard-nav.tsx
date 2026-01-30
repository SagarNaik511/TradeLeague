'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  BarChart2,
  Trophy,
  History,
  LogOut,
  Users
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/logo';
import { StockOptionsToggle } from '@/components/stock-options-toggle';
import { useAppContext } from '@/context/AppContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import AnimatedCounter from './animated-counter';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: Home },
  { href: '/dashboard/game', label: 'New Game', icon: BarChart2 },
  { href: '/dashboard/leaderboard', label: 'Leaderboard', icon: Trophy },
  { href: '/dashboard/history', label: 'Match History', icon: History },
  { href: '/dashboard/social', label: 'Social', icon: Users },
];

export function DashboardNav() {
  const pathname = usePathname();
  const { user } = useAppContext();

  return (
    <div className="flex h-full flex-col">
      <div className="p-4 border-b border-sidebar-border">
        <Link href="/dashboard" className="flex items-center gap-2">
          <Logo />
          <h1 className="text-lg font-bold">FinTrade League</h1>
        </Link>
      </div>

      <div className="p-4">
        <div className="flex items-center gap-3 mb-4">
            <Avatar className="h-10 w-10">
                <AvatarImage src={user.avatarUrl} alt={user.name} data-ai-hint={user.avatarHint} />
                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
                <p className="font-semibold">{user.name}</p>
                <p className="text-sm text-muted-foreground">{user.leagueName}</p>
            </div>
        </div>
        <div className='p-3 bg-background rounded-lg'>
            <p className='text-sm text-muted-foreground mb-1'>Total Profit</p>
            <AnimatedCounter value={user.totalProfit} className="text-2xl font-bold text-profit" />
        </div>
      </div>
      
      <div className="px-4 mb-4">
        <StockOptionsToggle />
      </div>

      <nav className="flex-1 space-y-1 px-4">
        {navItems.map((item) => (
          <Button
            key={item.href}
            variant={pathname === item.href ? 'secondary' : 'ghost'}
            className="w-full justify-start"
            asChild
          >
            <Link href={item.href}>
              <item.icon className="mr-2 h-4 w-4" />
              {item.label}
            </Link>
          </Button>
        ))}
      </nav>

      <div className="mt-auto p-4 border-t border-sidebar-border">
        <Button variant="ghost" className="w-full justify-start" asChild>
          <Link href="/">
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Link>
        </Button>
      </div>
    </div>
  );
}
