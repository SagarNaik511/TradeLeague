import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { BarChart, Users, Zap, CheckCircle } from 'lucide-react';
import { Logo } from '@/components/logo';

export default function Home() {
  const features = [
    {
      icon: <BarChart className="h-8 w-8 text-primary" />,
      title: 'Realistic Trading',
      description: 'Experience real-world market dynamics with virtual stocks and options.',
    },
    {
      icon: <Users className="h-8 w-8 text-primary" />,
      title: 'Compete & Climb',
      description: 'Challenge opponents in head-to-head matches and rise through the league leaderboards.',
    },
    {
      icon: <Zap className="h-8 w-8 text-primary" />,
      title: 'Gamified Experience',
      description: 'Unlock achievements, complete challenges, and prove your market mastery.',
    },
    {
      icon: <CheckCircle className="h-8 w-8 text-primary" />,
      title: 'Risk-Free Learning',
      description: 'Hone your trading strategies with a virtual balance, without any financial risk.',
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <header className="px-4 lg:px-6 h-16 flex items-center border-b border-border/40">
        <Link href="/" className="flex items-center justify-center gap-2" prefetch={false}>
          <Logo />
          <span className="text-lg font-bold font-headline">FinTrade League</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Button variant="ghost" asChild>
            <Link href="/login" prefetch={false}>
              Login
            </Link>
          </Button>
          <Button asChild>
            <Link href="/login">Get Started</Link>
          </Button>
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none font-headline">
                    The Ultimate Virtual Trading Playground
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Compete, learn, and conquer the markets. The next generation of gamified financial trading is here.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button size="lg" asChild className="animate-button-glow">
                    <Link href="/login">Join the League</Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild>
                    <Link href="#features">Learn More</Link>
                  </Button>
                </div>
              </div>
              <div className="hidden lg:block">
                <Card className="p-6 bg-card/50 shadow-2xl">
                  <h3 className="text-2xl font-bold mb-4 font-headline">Market Snapshot</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-bold">Nithin Limited</p>
                        <p className="text-sm text-muted-foreground">NTN</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg text-profit">₹2,450.75</p>
                        <p className="text-sm text-profit">+2.5%</p>
                      </div>
                    </div>
                     <div className="flex justify-between items-center">
                      <div>
                        <p className="font-bold">SkyForge Tech</p>
                        <p className="text-sm text-muted-foreground">SFT</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg text-loss">₹8,120.30</p>
                        <p className="text-sm text-loss">-1.2%</p>
                      </div>
                    </div>
                     <div className="flex justify-between items-center">
                      <div>
                        <p className="font-bold">QuantumNest AI</p>
                        <p className="text-sm text-muted-foreground">QNAI</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg text-profit">₹1,500.00</p>
                        <p className="text-sm text-profit">+5.8%</p>
                      </div>
                    </div>
                     <div className="flex justify-between items-center">
                      <div>
                        <p className="font-bold">GreenPulse Energy</p>
                        <p className="text-sm text-muted-foreground">GPE</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg text-profit">₹350.50</p>
                        <p className="text-sm text-profit">+0.9%</p>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </section>
        <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-card/50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">Key Features</div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">Become a Trading Pro</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  FinTrade League provides all the tools you need to master the art of trading in a competitive and engaging environment.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-2 md:gap-12 lg:grid-cols-2 mt-12">
              {features.map((feature, index) => (
                <div key={index} className="flex gap-4 p-4 rounded-lg hover:bg-muted/50 transition-colors">
                  {feature.icon}
                  <div className="grid gap-1 text-left">
                    <h3 className="text-lg font-bold">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-muted-foreground">&copy; 2024 FinTrade League. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link href="#" className="text-xs hover:underline underline-offset-4" prefetch={false}>
            Terms of Service
          </Link>
          <Link href="#" className="text-xs hover:underline underline-offset-4" prefetch={false}>
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  );
}
