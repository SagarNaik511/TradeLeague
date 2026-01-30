'use client';

import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useAppContext } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { ArrowLeft, ShoppingCart } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import type { Asset } from '@/data/mock-data';

// Mock historical data for the chart
const generateMockHistory = (basePrice: number) => {
  const data = [];
  let price = basePrice;
  for (let i = 30; i > 0; i--) {
    const change = (Math.random() - 0.48) * (basePrice / 20);
    price += change;
    price = Math.max(price, basePrice / 2); // ensure price doesn't go too low
    data.push({
      day: `T-${i}`,
      price: parseFloat(price.toFixed(2)),
    });
  }
  data.push({ day: 'Today', price: parseFloat(basePrice.toFixed(2)) });
  return data;
};

const riskVariantMap: Record<Asset['risk'], 'destructive' | 'secondary' | 'default'> = {
  High: 'destructive',
  Medium: 'secondary',
  Low: 'default',
};

const chartConfig = {
    price: {
        label: "Price",
        color: "hsl(var(--chart-1))"
    }
}

export default function AssetDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { assets, cart, setCart } = useAppContext();
  const { toast } = useToast();

  const assetId = params.assetId as string;
  const asset = assets.find(a => a.id === assetId);

  if (!asset) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <h2 className="text-2xl font-semibold">Asset not found</h2>
        <Button asChild variant="link" className="mt-4">
            <Link href="/dashboard/game">Back to Assets</Link>
        </Button>
      </div>
    );
  }
  
  const mockPrice = Math.random() * 1000 + 500;
  const history = generateMockHistory(mockPrice);

  const isInCart = cart.includes(asset.id);

  const handleCartToggle = () => {
    let updatedCart;
    if (isInCart) {
      updatedCart = cart.filter(id => id !== asset.id);
      toast({ title: `${asset.name} removed from cart.` });
    } else {
      updatedCart = [...cart, asset.id];
      toast({ title: `${asset.name} added to cart!` });
    }
    setCart(updatedCart);
  };

  return (
    <div className="p-4 md:p-8 space-y-6">
      <div>
        <Button variant="ghost" onClick={() => router.back()} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Assets
        </Button>
        <div className="relative h-64 w-full rounded-lg overflow-hidden">
            <Image
              src={asset.imageUrl}
              alt={asset.name}
              fill
              className="object-cover"
              data-ai-hint={asset.imageHint}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
            <div className="absolute bottom-4 left-4">
                <h1 className="text-4xl font-bold text-white shadow-lg">{asset.name}</h1>
                <Badge variant={riskVariantMap[asset.risk]} className="mt-2">{asset.risk} Risk</Badge>
            </div>
        </div>
      </div>
      
      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
            <Card>
                <CardHeader><CardTitle>Description</CardTitle></CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">{asset.description}</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>30-Day Performance</CardTitle>
                    <CardDescription>Mock price history for the last 30 days.</CardDescription>
                </CardHeader>
                <CardContent className="h-[300px]">
                    <ChartContainer config={chartConfig} className="w-full h-full">
                        <LineChart data={history}>
                            <CartesianGrid vertical={false} />
                            <XAxis dataKey="day" tickLine={false} axisLine={false} tickMargin={8} />
                            <YAxis domain={['dataMin - 100', 'dataMax + 100']} hide />
                            <Tooltip content={<ChartTooltipContent indicator="line" />} />
                            <Line type="monotone" dataKey="price" stroke="hsl(var(--chart-1))" strokeWidth={2} dot={false} />
                        </LineChart>
                    </ChartContainer>
                </CardContent>
            </Card>
        </div>
        <div className="md:col-span-1">
            <Card className="sticky top-20">
                <CardHeader>
                    <CardTitle>Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                     <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Current Price</span>
                        <span className="font-bold text-lg">{new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(mockPrice)}</span>
                    </div>
                    <Button size="lg" className="w-full" onClick={handleCartToggle}>
                        <ShoppingCart className="mr-2 h-5 w-5" />
                        {isInCart ? 'Remove from Cart' : 'Add to Cart'}
                    </Button>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
