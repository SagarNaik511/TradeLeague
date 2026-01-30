'use client';

import { useAppContext } from '@/context/AppContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { UserProfileCard } from '@/components/user-profile-card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Trophy, TrendingUp, TrendingDown } from 'lucide-react';

// Mock performance data
const mockPerformance = [
  { assetId: 'skyforge-tech', profit: 3500.50 },
  { assetId: 'gold', profit: 1200.00 },
  { assetId: 'crude-oil', profit: -2400.75 },
];

export default function ResultPage() {
  const { user, opponent, investments, assets } = useAppContext();
  
  const userTotalProfit = mockPerformance.reduce((sum, p) => sum + p.profit, 0);
  const opponentTotalProfit = 1850.25; // Mock opponent profit

  const isWinner = userTotalProfit > opponentTotalProfit;

  const performanceData = investments.map(inv => {
    const asset = assets.find(a => a.id === inv.assetId);
    const perf = mockPerformance.find(p => p.assetId === inv.assetId);
    return {
      name: asset?.name || 'Unknown Asset',
      invested: inv.amount,
      profit: perf?.profit || 0,
    };
  });

  return (
    <div className="flex-1 p-6 md:p-8 space-y-8">
      <header className="text-center">
        <Trophy className={`mx-auto h-16 w-16 mb-4 ${isWinner ? 'text-yellow-400' : 'text-muted-foreground'}`} />
        <h2 className="text-4xl font-bold tracking-tight">{isWinner ? 'Congratulations, You Won!' : 'Better Luck Next Time'}</h2>
        <p className="text-muted-foreground text-lg mt-2">
            You made a total profit of {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(userTotalProfit)}.
        </p>
      </header>

      <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {user && <UserProfileCard user={{...user, totalProfit: userTotalProfit}} />}
        {opponent && <UserProfileCard user={{...opponent, totalProfit: opponentTotalProfit}} isOpponent />}
      </div>

      <Card className="max-w-5xl mx-auto">
        <CardHeader>
          <CardTitle>Match Performance</CardTitle>
          <CardDescription>Here's a breakdown of your investment performance this match.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Asset</TableHead>
                <TableHead className="text-right">Invested</TableHead>
                <TableHead className="text-right">Profit / Loss</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {performanceData.map((item, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell className="text-right font-mono">{new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(item.invested)}</TableCell>
                  <TableCell className={`text-right font-mono ${item.profit >= 0 ? 'text-profit' : 'text-loss'}`}>
                    <div className="flex items-center justify-end">
                      {item.profit >= 0 ? <TrendingUp className="h-4 w-4 mr-2" /> : <TrendingDown className="h-4 w-4 mr-2" />}
                      {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(item.profit)}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      <div className="text-center space-x-4">
        <Button size="lg" asChild>
          <Link href="/dashboard/game-setup">Play Again</Link>
        </Button>
        <Button size="lg" variant="outline" asChild>
          <Link href="/dashboard/analysis">View Analysis</Link>
        </Button>
      </div>
    </div>
  );
}
