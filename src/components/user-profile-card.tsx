import Image from 'next/image';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User } from 'lucide-react';
import type { UserProfile } from '@/data/mock-data';

type UserProfileCardProps = {
    user: UserProfile;
    isOpponent?: boolean;
};

export function UserProfileCard({ user, isOpponent = false }: UserProfileCardProps) {
    const avatarInitial = user.name.charAt(0).toUpperCase();

    return (
        <Card className="bg-card/70 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center gap-4 pb-2">
                <Avatar className="h-12 w-12">
                    <AvatarImage src={user.avatarUrl} alt={user.name} data-ai-hint={user.avatarHint} />
                    <AvatarFallback>{avatarInitial}</AvatarFallback>
                </Avatar>
                <div>
                    <CardTitle className="text-lg">{user.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">{isOpponent ? 'Opponent' : user.leagueName}</p>
                </div>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-3 gap-2 text-center text-sm">
                    <div>
                        <p className="font-bold text-base">{user.winRate}%</p>
                        <p className="text-xs text-muted-foreground">Win Rate</p>
                    </div>
                    <div>
                        <p className="font-bold text-base">{user.winStreak}</p>
                        <p className="text-xs text-muted-foreground">Win Streak</p>
                    </div>
                    <div>
                        <p className="font-bold text-base">{user.totalMatches}</p>
                        <p className="text-xs text-muted-foreground">Matches</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
