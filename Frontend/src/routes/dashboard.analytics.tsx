import { createFileRoute } from "@tanstack/react-router";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatCard } from "@/components/stat-card";
import { TrendingUp, Target, AlertTriangle, BookOpen } from "lucide-react";
import {
  subjectAverages,
  performanceTrend,
  weakTopics,
  classComparison,
} from "@/lib/mock-data";

export const Route = createFileRoute("/dashboard/analytics")({ component: Analytics });

const tooltipStyle = {
  background: "var(--color-popover)",
  border: "1px solid var(--color-border)",
  borderRadius: 12,
  fontSize: 12,
};

function Analytics() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Analytics</h1>
        <p className="text-sm text-muted-foreground mt-1">Insights across subjects, classes, and students.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Average marks" value="82.4" icon={<TrendingUp className="h-5 w-5" />} delta="+3.1%" />
        <StatCard label="Top subject" value="CS" icon={<BookOpen className="h-5 w-5" />} delta="89% avg" trend="neutral" />
        <StatCard label="Weakest topic" value="Trigonometry" icon={<AlertTriangle className="h-5 w-5" />} delta="62% avg" trend="down" />
        <StatCard label="Accuracy" value="97.2%" icon={<Target className="h-5 w-5" />} delta="Stable" trend="neutral" />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="glass shadow-elegant">
          <CardHeader><CardTitle>Subject averages</CardTitle></CardHeader>
          <CardContent className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={subjectAverages}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="subject" stroke="var(--color-muted-foreground)" fontSize={12} />
                <YAxis stroke="var(--color-muted-foreground)" fontSize={12} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="score" fill="var(--color-primary)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="glass shadow-elegant">
          <CardHeader><CardTitle>Performance trend</CardTitle></CardHeader>
          <CardContent className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={performanceTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="month" stroke="var(--color-muted-foreground)" fontSize={12} />
                <YAxis stroke="var(--color-muted-foreground)" fontSize={12} />
                <Tooltip contentStyle={tooltipStyle} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Line type="monotone" dataKey="avg" stroke="var(--color-primary)" strokeWidth={2.5} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="accuracy" stroke="var(--color-chart-2)" strokeWidth={2.5} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="glass shadow-elegant">
          <CardHeader><CardTitle>Weak topics</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {weakTopics.map((t) => (
              <div key={t.topic}>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="font-medium">{t.topic}</span>
                  <span className="text-muted-foreground">{t.weakness}% avg</span>
                </div>
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <div className="h-full gradient-primary" style={{ width: `${t.weakness}%` }} />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="glass shadow-elegant">
          <CardHeader><CardTitle>Class comparison</CardTitle></CardHeader>
          <CardContent className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={classComparison}>
                <PolarGrid stroke="var(--color-border)" />
                <PolarAngleAxis dataKey="class" stroke="var(--color-muted-foreground)" fontSize={12} />
                <PolarRadiusAxis stroke="var(--color-muted-foreground)" fontSize={11} />
                <Radar dataKey="avg" stroke="var(--color-primary)" fill="var(--color-primary)" fillOpacity={0.35} />
                <Tooltip contentStyle={tooltipStyle} />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
