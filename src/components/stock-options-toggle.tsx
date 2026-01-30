'use client';

import { useAppContext, TradingMode } from '@/context/AppContext';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

export function StockOptionsToggle() {
  const { tradingMode, setTradingMode } = useAppContext();

  return (
    <Tabs 
      defaultValue={tradingMode} 
      onValueChange={(value) => setTradingMode(value as TradingMode)} 
      className="w-full"
    >
      <TabsList className="grid w-full grid-cols-2 h-auto p-1 bg-background">
        <TabsTrigger value="Stock" className="text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
          Stock Mode
        </TabsTrigger>
        <TabsTrigger value="Options" className="text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
          Options Mode
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
