'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { mlAnalysisService } from '@/services';
import { BarChart, PieChart, LineChart, ResponsiveContainer, Bar, XAxis, YAxis, Tooltip, Pie, Cell, Legend } from 'recharts';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import { Loader2, BrainCircuit, CheckCircle, XCircle } from 'lucide-react';

type AnalysisData = {
  correctDecisions: string[];
  wrongDecisions: string[];
  riskBehavior: {
    highRiskPercentage: number;
    mediumRiskPercentage: number;
    lowRiskPercentage: number;
  };
  improvementSuggestions: string[];
};

const COLORS = {
    high: 'hsl(var(--loss))',
    medium: 'hsl(var(--chart-4))',
    low: 'hsl(var(--profit))',
};

const chartConfig = {
    risk: {
        label: "Risk"
    },
    high: {
        label: "High Risk",
        color: COLORS.high
    },
    medium: {
        label: "Medium Risk",
        color: COLORS.medium
    },
    low: {
        label: "Low Risk",
        color: COLORS.low
    }
}

export default function AnalysisPage() {
  const [analysis, setAnalysis] = useState<AnalysisData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getAnalysis = async () => {
      setIsLoading(true);
      const mockGameData = { investments: [], totalProfit: 0 }; // In a real app, get this from context/API
      const result = await mlAnalysisService.analyzeGamePerformance(mockGameData);
      setAnalysis(result);
      setIsLoading(false);
    };
    getAnalysis();
  }, []);

  const renderLegend = () => (
    <p className="text-center mt-2 text-sm text-muted-foreground">Investment by Risk</p>
  );

  if (isLoading) {
    return (
      <div className="flex h-full flex-col items-center justify-center">
        <BrainCircuit className="h-12 w-12 mb-4 text-primary animate-pulse" />
        <h2 className="text-2xl font-semibold mb-2">Analyzing Your Performance...</h2>
        <p className="text-muted-foreground">Our AI is crunching the numbers from your last match.</p>
        <Loader2 className="mt-4 h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!analysis) {
    return <div>Error loading analysis.</div>;
  }
  
  const riskData = [
    { name: 'High Risk', value: analysis.riskBehavior.highRiskPercentage, fill: COLORS.high },
    { name: 'Medium Risk', value: analysis.riskBehavior.mediumRiskPercentage, fill: COLORS.medium },
    { name: 'Low Risk', value: analysis.riskBehavior.lowRiskPercentage, fill: COLORS.low },
  ];

  return (
    <div className="flex-1 p-6 md:p-8 space-y-8">
      <header>
        <h2 className="text-3xl font-bold tracking-tight">Post-Match Analysis</h2>
        <p className="text-muted-foreground">Insights powered by our ML engine to help you improve.</p>
      </header>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><CheckCircle className="text-profit" /> Correct Decisions</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm list-disc list-inside">
              {analysis.correctDecisions.map(d => <li key={d}>{d}</li>)}
            </ul>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><XCircle className="text-loss" /> Wrong Decisions</CardTitle>
          </CardHeader>
          <CardContent>
             <ul className="space-y-2 text-sm list-disc list-inside">
              {analysis.wrongDecisions.map(d => <li key={d}>{d}</li>)}
            </ul>
          </CardContent>
        </Card>
        <Card className="lg:row-span-2">
          <CardHeader>
            <CardTitle>Improvement Suggestions</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4 text-sm list-decimal list-inside">
                {analysis.improvementSuggestions.map((suggestion, index) => (
                    <li key={index}>{suggestion}</li>
                ))}
            </ul>
          </CardContent>
        </Card>
        <Card className="md:col-span-2">
            <CardHeader>
                <CardTitle>Risk Behavior Analysis</CardTitle>
                <CardDescription>Distribution of your investments by asset risk level.</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[250px]">
                    <PieChart>
                         <Tooltip content={<ChartTooltipContent nameKey="name" hideLabel />} />
                        <Pie data={riskData} dataKey="value" nameKey="name" innerRadius={60} outerRadius={80} paddingAngle={5}>
                             {riskData.map((entry) => (
                                <Cell key={`cell-${entry.name}`} fill={entry.fill} />
                            ))}
                        </Pie>
                        <Legend content={renderLegend} />
                    </PieChart>
                </ChartContainer>
            </CardContent>
        </Card>
      </div>

       <div className="text-center">
            <Button asChild size="lg">
                <Link href="/dashboard">Back to Dashboard</Link>
            </Button>
        </div>
    </div>
  );
}
