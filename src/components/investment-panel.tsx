'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useAppContext } from '@/context/AppContext';
import { Trash2 } from 'lucide-react';
import type { Asset } from '@/data/mock-data';
import type { Investment } from '@/context/AppContext';

type InvestmentPanelProps = {
  selectedAssets: Asset[];
  investments: Investment[];
  onInvestmentChange: (assetId: string, amount: number) => void;
  onRemoveAsset: (assetId: string) => void;
  onSubmit: () => void;
};

export function InvestmentPanel({ 
  selectedAssets, 
  investments,
  onInvestmentChange, 
  onRemoveAsset,
  onSubmit
}: InvestmentPanelProps) {
  const { balance } = useAppContext();
  
  const totalInvested = investments.reduce((sum, inv) => sum + inv.amount, 0);
  const remainingBalance = balance - totalInvested;

  const getInvestmentAmount = (assetId: string) => {
    return investments.find(inv => inv.assetId === assetId)?.amount || 0;
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>Investment Portfolio</CardTitle>
        <CardDescription>Select assets from the grid to add them here.</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col gap-4 p-0">
        <ScrollArea className="flex-1 px-6">
          {selectedAssets.length === 0 ? (
            <div className="text-center text-muted-foreground py-10">
              Click on an asset to start building your portfolio.
            </div>
          ) : (
            <div className="space-y-4">
              {selectedAssets.map(asset => (
                <div key={asset.id} className="flex items-center gap-4">
                  <span className="font-semibold flex-1">{asset.name}</span>
                  <div className="flex items-center gap-2 w-48">
                    <span className="text-muted-foreground">₹</span>
                    <Input
                      type="number"
                      placeholder="Amount"
                      className="text-right"
                      value={getInvestmentAmount(asset.id) || ''}
                      onChange={(e) => onInvestmentChange(asset.id, Number(e.target.value))}
                      min="0"
                      max={balance}
                      step="100"
                    />
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => onRemoveAsset(asset.id)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
        <div className='px-6'>
          <Separator className="my-4" />
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total Invested</span>
              <span className="font-mono font-semibold">{new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(totalInvested)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Remaining Balance</span>
              <span className={`font-mono font-semibold ${remainingBalance < 0 ? 'text-loss' : ''}`}>
                {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(remainingBalance)}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-6">
        <Button 
          className="w-full" 
          onClick={onSubmit}
          disabled={investments.length === 0 || remainingBalance < 0}
        >
          Submit Investments
        </Button>
      </CardFooter>
    </Card>
  );
}
