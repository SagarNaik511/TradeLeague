'use client';

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Lightbulb, Trophy } from "lucide-react";
import { useAppContext } from "@/context/AppContext";
import { UserProfileCard } from "@/components/user-profile-card";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

const leaderboardData = [
  { rank: 1, name: 'CryptoKing', profit: 54200.50, avatar: 'https://picsum.photos/seed/leader1/40/40', hint: 'person portrait' },
  { rank: 2, name: 'Alex Pro', profit: 49870.75, avatar: 'https://picsum.photos/seed/useravatar/40/40', hint: 'person portrait' },
  { rank: 3, name: 'MarketMaven', profit: 45123.00, avatar: 'https://picsum.photos/seed/leader2/40/40', hint: 'person portrait' },
  { rank: 4, name: 'Trader Jane', profit: 38765.20, avatar: 'https://picsum.photos/seed/opponentavatar/40/40', hint: 'person portrait' },
  { rank: 5, name: 'BullRunBetty', profit: 35432.10, avatar: 'https://picsum.photos/seed/leader3/40/40', hint: 'person portrait' },
];

const tips = [
    "Diversification is key. Don't put all your virtual funds into one asset.",
    "Pay attention to the risk levels. High-risk assets can have high rewards, but also high losses.",
    "In Options mode, understanding implied volatility can give you an edge.",
    "Keep an eye on the countdown timer. Last-minute market shifts can be game-changers."
];

export default function DashboardPage() {
    const { user } = useAppContext();

    return (
        <div className="flex-1 p-6 md:p-8 space-y-8">
            <div className="flex items-center justify-between space-y-2">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Welcome back, {user.name.split(' ')[0]}!</h2>
                    <p className="text-muted-foreground">Here&apos;s your current league status.</p>
                </div>
                <div className="flex items-center space-x-2">
                    <Button asChild><Link href="/dashboard/game-setup">Start New Game</Link></Button>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <UserProfileCard user={user} />
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">League</CardTitle>
                        <Trophy className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{user.leagueName}</div>
                        <p className="text-xs text-muted-foreground">Top 2% of players</p>
                    </CardContent>
                </Card>
                 <Card className="col-span-1 lg:col-span-2">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Pro Tip</CardTitle>
                        <Lightbulb className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <Carousel
                          opts={{ loop: true }}
                          plugins={[Autoplay({ delay: 5000 })]}
                        >
                            <CarouselContent>
                                {tips.map((tip, index) => (
                                    <CarouselItem key={index}>
                                        <div className="text-2xl font-bold">
                                            {tip}
                                        </div>
                                    </CarouselItem>
                                ))}
                            </CarouselContent>
                        </Carousel>
                    </CardContent>
                </Card>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card>
                    <CardHeader>
                        <CardTitle>Start Your Next Match</CardTitle>
                        <CardDescription>Challenge an opponent and climb the ranks.</CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center justify-center text-center p-16">
                        <p className="text-muted-foreground mb-4">Ready to test your skills?</p>
                        <Button size="lg" className="animate-button-glow" asChild>
                            <Link href="/dashboard/game-setup">
                                Find Opponent
                            </Link>
                        </Button>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Diamond League Leaderboard</CardTitle>
                        <CardDescription>See how you stack up against the competition.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[50px]">Rank</TableHead>
                                    <TableHead>Player</TableHead>
                                    <TableHead className="text-right">Total Profit</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {leaderboardData.map((player) => (
                                    <TableRow key={player.rank} className={player.name === user.name ? 'bg-primary/10' : ''}>
                                        <TableCell className="font-medium">{player.rank}</TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <Avatar className="h-8 w-8">
                                                    <AvatarImage src={player.avatar} data-ai-hint={player.hint} />
                                                    <AvatarFallback>{player.name.charAt(0)}</AvatarFallback>
                                                </Avatar>
                                                <span>{player.name}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right font-mono text-profit">
                                            {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(player.profit)}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
