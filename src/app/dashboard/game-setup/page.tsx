'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';
import { UserProfileCard } from '@/components/user-profile-card';

export default function GameSetupPage() {
  const router = useRouter();
  const { user, opponent } = useAppContext();
  const [isSearching, setIsSearching] = useState(false);
  const [matchFound, setMatchFound] = useState(false);

  const handleSearch = () => {
    setIsSearching(true);
    // Simulate finding a match
    setTimeout(() => {
      setMatchFound(true);
    }, 2500);
  };

  useEffect(() => {
    if (matchFound) {
      // Simulate countdown before starting
      setTimeout(() => {
        router.push('/dashboard/game');
      }, 2000);
    }
  }, [matchFound, router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-full p-8">
      <Card className="w-full max-w-4xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl">Game Setup</CardTitle>
          <CardDescription>Find an opponent to start a new trading match.</CardDescription>
        </CardHeader>
        <CardContent>
          {!isSearching ? (
            <div className="text-center">
              <p className="text-muted-foreground mb-6">You are ready to enter the arena. Good luck!</p>
              <Button size="lg" onClick={handleSearch} className="animate-button-glow">
                Find Match
              </Button>
            </div>
          ) : (
            <div className="text-center">
              <div className="flex justify-center items-center gap-8 mb-8">
                {user && <UserProfileCard user={user} />}
                <div className="text-4xl font-bold text-primary">VS</div>
                {opponent && matchFound ? (
                  <UserProfileCard user={opponent} isOpponent />
                ) : (
                  <Card className="w-[350px] h-[146px] flex items-center justify-center bg-card/70 backdrop-blur-sm">
                    <div className="flex items-center text-muted-foreground">
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Searching...
                    </div>
                  </Card>
                )}
              </div>

              {matchFound ? (
                 <p className="text-lg text-profit font-bold animate-pulse">Match Found! Starting game...</p>
              ) : (
                <p className="text-lg text-muted-foreground">Searching for a worthy opponent...</p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
