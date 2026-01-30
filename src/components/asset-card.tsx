import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { Asset } from '@/data/mock-data';

type AssetCardProps = {
  asset: Asset;
  isSelected: boolean;
};

const riskVariantMap: Record<Asset['risk'], 'destructive' | 'secondary' | 'default'> = {
  High: 'destructive',
  Medium: 'secondary',
  Low: 'default',
};

export function AssetCard({ asset, isSelected }: AssetCardProps) {
  return (
    <Link href={`/dashboard/game/asset/${asset.id}`} className="block">
        <Card
          className={cn(
            "cursor-pointer transition-all hover:scale-105 hover:shadow-primary/20 hover:shadow-lg h-full",
            isSelected ? "ring-2 ring-primary" : "ring-0"
          )}
        >
          <CardHeader className="p-0">
            <Image
              src={asset.imageUrl}
              alt={asset.name}
              width={400}
              height={200}
              className="rounded-t-lg object-cover aspect-[2/1]"
              data-ai-hint={asset.imageHint}
            />
          </CardHeader>
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
                <CardTitle className="text-lg font-bold">{asset.name}</CardTitle>
                <Badge variant={riskVariantMap[asset.risk]}>{asset.risk} Risk</Badge>
            </div>
            <CardDescription className="mt-1 text-sm">{asset.description}</CardDescription>
          </CardContent>
        </Card>
    </Link>
  );
}
