import { createFileRoute } from "@tanstack/react-router";
import { FileText, CheckCircle2, Target, Sparkles, TrendingUp } from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  AreaChart,
  Area,
} from "recharts";
import { StatCard } from "@/components/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { marksDistribution, performanceTrend, recentActivity } from "@/lib/mock-data";

export const Route = createFileRoute("/dashboard/")({ component: DashboardHome });

function DashboardHome() {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Welcome back, Asha</h1>
          <p className="text-sm text-muted-foreground mt-1">Here's what's happening in your classes today.</p>
        </div>
        <Badge variant="secondary" className="glass">
          <Sparkles className="h-3 w-3 mr-1.5" /> AI grading active
        </Badge>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Scripts Uploaded" value="1,284" icon={<FileText className="h-5 w-5" />} delta="+128 this week" />
        <StatCard label="Scripts Evaluated" value="1,176" icon={<CheckCircle2 className="h-5 w-5" />} delta="+112 this week" />
        <StatCard label="Average Score" value="82.4%" icon={<TrendingUp className="h-5 w-5" />} delta="+3.1% vs last month" />
        <StatCard label="Evaluation Accuracy" value="97.2%" icon={<Target className="h-5 w-5" />} delta="Stable" trend="neutral" />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="glass shadow-elegant lg:col-span-2">
          <CardHeader>
            <CardTitle>Marks distribution</CardTitle>
          </CardHeader>
          <CardContent className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={marksDistribution}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="range" stroke="var(--color-muted-foreground)" fontSize={12} />
                <YAxis stroke="var(--color-muted-foreground)" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    background: "var(--color-popover)",
                    border: "1px solid var(--color-border)",
                    borderRadius: 12,
                  }}
                />
                <Bar dataKey="count" fill="var(--color-primary)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="glass shadow-elegant">
          <CardHeader>
            <CardTitle>Recent activity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentActivity.map((a) => (
              <div key={a.id} className="flex items-start gap-3">
                <div className="h-2 w-2 rounded-full bg-primary mt-2" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{a.action}</p>
                  <p className="text-xs text-muted-foreground truncate">{a.subject}</p>
                </div>
                <span className="text-xs text-muted-foreground whitespace-nowrap">{a.time}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card className="glass shadow-elegant">
        <CardHeader>
          <CardTitle>Performance & accuracy trend</CardTitle>
        </CardHeader>
        <CardContent className="h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={performanceTrend}>
              <defs>
                <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--color-primary)" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="var(--color-primary)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="g2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--color-chart-2)" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="var(--color-chart-2)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="month" stroke="var(--color-muted-foreground)" fontSize={12} />
              <YAxis stroke="var(--color-muted-foreground)" fontSize={12} />
              <Tooltip
                contentStyle={{
                  background: "var(--color-popover)",
                  border: "1px solid var(--color-border)",
                  borderRadius: 12,
                }}
              />
              <Area type="monotone" dataKey="avg" stroke="var(--color-primary)" strokeWidth={2.5} fill="url(#g1)" />
              <Area type="monotone" dataKey="accuracy" stroke="var(--color-chart-2)" strokeWidth={2.5} fill="url(#g2)" />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
