'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAppContext, Investment } from '@/context/AppContext';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ArrowLeft, Trash2 } from 'lucide-react';
import type { Asset } from '@/data/mock-data';


export default function InvestPage() {
    const { assets, balance, cart, setCart, setInvestments: setGlobalInvestments } = useAppContext();
    const router = useRouter();
    const { toast } = useToast();

    const [investments, setInvestments] = useState<Investment[]>(
        cart.map(assetId => ({ assetId, amount: 0 }))
    );

    const selectedAssetsData = cart.map(id => assets.find(a => a.id === id)).filter(Boolean) as Asset[];

    const handleInvestmentChange = (assetId: string, amount: number) => {
        const totalInvested = investments.reduce((sum, inv) => (inv.assetId === assetId ? sum : sum + inv.amount), 0);
        const newAmount = Math.max(0, amount);
        
        if (totalInvested + newAmount > balance) {
            toast({
                variant: "destructive",
                title: "Insufficient Balance",
                description: `You cannot invest more than your available balance.`,
            });
            // clamp the value
            const clampedAmount = balance - totalInvested;
            setInvestments(prev => prev.map(inv => inv.assetId === assetId ? { ...inv, amount: clampedAmount } : inv));
            return;
        }

        setInvestments(prev => {
          const existing = prev.find(inv => inv.assetId === assetId);
          if (existing) {
            return prev.map(inv => inv.assetId === assetId ? { ...inv, amount: newAmount } : inv);
          }
          return [...prev, { assetId, amount: newAmount }];
        });
    };

    const handleRemoveAsset = (assetId: string) => {
        setCart(cart.filter(id => id !== assetId));
        setInvestments(prev => prev.filter(inv => inv.assetId !== assetId));
    };

    const handleSubmit = () => {
        const totalInvested = investments.reduce((sum, inv) => sum + inv.amount, 0);
        if (totalInvested > balance) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Total investment exceeds your balance.",
            });
            return;
        }
        if (investments.some(inv => inv.amount <= 0)) {
            toast({
                variant: "destructive",
                title: "Invalid Amount",
                description: "Please enter a valid investment amount for all selected assets.",
            });
            return;
        }

        setGlobalInvestments(investments);
        // TODO: Send to multiplayer service
        console.log("Submitting investments:", investments);
        toast({
            title: "Portfolio Submitted",
            description: "Your investments are locked in. Good luck!",
        })
        router.push('/dashboard/result');
    };

    const getInvestmentAmount = (assetId: string) => {
        return investments.find(inv => inv.assetId === assetId)?.amount || 0;
    };
    
    const totalInvested = investments.reduce((sum, inv) => sum + inv.amount, 0);
    const remainingBalance = balance - totalInvested;

    if (cart.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                <h2 className="text-2xl font-semibold">Your cart is empty</h2>
                <p className="text-muted-foreground mt-2">Go back and select some assets to invest in.</p>
                <Button asChild className="mt-6">
                    <Link href="/dashboard/game">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Select Assets
                    </Link>
                </Button>
          </div>
        );
    }

    return (
        <div className="p-4 md:p-8 flex justify-center items-start">
            <Card className="w-full max-w-2xl">
                <CardHeader>
                    <CardTitle>Finalize Your Investments</CardTitle>
                    <CardDescription>Allocate your funds to the selected assets and submit your portfolio.</CardDescription>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col gap-4 p-0">
                    <ScrollArea className="flex-1 px-6 max-h-[400px]">
                        <div className="space-y-4">
                        {selectedAssetsData.map(asset => (
                            <div key={asset.id} className="flex items-center gap-4">
                            <span className="font-semibold flex-1">{asset.name}</span>
                            <div className="flex items-center gap-2 w-48">
                                <span className="text-muted-foreground">₹</span>
                                <Input
                                type="number"
                                placeholder="Amount"
                                className="text-right"
                                value={getInvestmentAmount(asset.id) || ''}
                                onChange={(e) => handleInvestmentChange(asset.id, Number(e.target.value))}
                                min="0"
                                max={balance}
                                step="100"
                                />
                            </div>
                            <Button variant="ghost" size="icon" onClick={() => handleRemoveAsset(asset.id)}>
                                <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                            </div>
                        ))}
                        </div>
                    </ScrollArea>
                    <div className='px-6'>
                        <Separator className="my-4" />
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                            <span className="text-muted-foreground">Available Balance</span>
                            <span className="font-mono font-semibold">{new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(balance)}</span>
                            </div>
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
                <CardFooter className="p-6 mt-4 flex flex-col sm:flex-row gap-2">
                    <Button variant="outline" className="w-full sm:w-auto" asChild>
                       <Link href="/dashboard/game"> <ArrowLeft className="mr-2 h-4 w-4" /> Back to Assets</Link>
                    </Button>
                    <Button 
                    className="w-full" 
                    onClick={handleSubmit}
                    disabled={investments.length === 0 || remainingBalance < 0 || investments.some(i => i.amount <= 0)}
                    >
                    Submit Investments
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}
