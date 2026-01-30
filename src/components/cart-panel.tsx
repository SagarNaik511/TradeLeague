'use client';

import { useAppContext } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Trash2, ShoppingCart } from 'lucide-react';
import Link from 'next/link';

export function CartPanel() {
  const { assets, cart, setCart } = useAppContext();

  const cartAssets = cart.map(id => assets.find(a => a.id === id)).filter(Boolean);

  const handleRemove = (assetId: string) => {
    setCart(cart.filter(id => id !== assetId));
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
            <ShoppingCart />
            Your Cart
        </CardTitle>
        <CardDescription>Assets you've selected for your portfolio.</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 p-0">
        <ScrollArea className="h-full px-6">
          {cartAssets.length === 0 ? (
            <div className="text-center text-muted-foreground py-10">
              Your cart is empty. Click on an asset to view details and add it.
            </div>
          ) : (
            <div className="space-y-2">
              {cartAssets.map(asset => (
                <div key={asset!.id} className="flex items-center justify-between p-2 rounded-md hover:bg-muted/50">
                  <span className="font-medium text-sm">{asset!.name}</span>
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleRemove(asset!.id)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
      <CardFooter className="p-6">
        <Button 
          className="w-full" 
          disabled={cart.length === 0}
          asChild
        >
            <Link href="/dashboard/game/invest">
                Proceed to Invest ({cart.length})
            </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
