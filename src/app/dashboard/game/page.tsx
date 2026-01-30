'use client';

import { useAppContext } from '@/context/AppContext';
import { UserProfileCard } from '@/components/user-profile-card';
import { AssetCard } from '@/components/asset-card';
import { CartPanel } from '@/components/cart-panel';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';

export default function GamePage() {
  const { assets, balance, opponent, cart } = useAppContext();
  
  return (
    <div className="h-screen flex flex-col p-4 gap-4">
      <header className="flex justify-between items-center">
        {opponent && <UserProfileCard user={opponent} isOpponent />}
        <div className="text-right">
          <p className="text-sm text-muted-foreground">Remaining Time</p>
          <Progress value={33} className="w-48 my-1" />
          <p className="text-sm text-muted-foreground">Match Ends: 02:45</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-muted-foreground">Available Balance</p>
          <p className="text-2xl font-bold">{new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(balance)}</p>
        </div>
      </header>
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-4 min-h-0">
        <div className="lg:col-span-2 min-h-0">
          <ScrollArea className="h-full pr-4">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {assets.map(asset => (
                <AssetCard
                  key={asset.id}
                  asset={asset}
                  isSelected={cart.includes(asset.id)}
                />
              ))}
            </div>
          </ScrollArea>
        </div>
        <div className="min-h-0">
            <CartPanel />
        </div>
      </div>
    </div>
  );
}
