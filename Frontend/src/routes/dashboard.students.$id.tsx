import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { ArrowLeft, Mail, GraduationCap, TrendingUp, Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { students, subjectAverages } from "@/lib/mock-data";

export const Route = createFileRoute("/dashboard/students/$id")({
  component: StudentDetail,
  loader: ({ params }) => {
    const student = students.find((s) => s.id === params.id);
    if (!student) throw notFound();
    return { student };
  },
});

const history = [
  { test: "T1", score: 72 },
  { test: "T2", score: 78 },
  { test: "T3", score: 75 },
  { test: "T4", score: 82 },
  { test: "T5", score: 86 },
  { test: "T6", score: 89 },
];

const strengths = ["Algebra", "Linked lists", "Essay structure"];
const weaknesses = ["Trigonometry", "Tense usage", "WWI chronology"];
const suggestions = [
  "Daily 15-min trig practice — focus on identities.",
  "Read one short essay/day and mark tense shifts.",
  "Use a chronology timeline for modern history.",
];

function StudentDetail() {
  const { student } = Route.useLoaderData();

  return (
    <div className="space-y-6">
      <Button variant="ghost" asChild className="-ml-2">
        <Link to="/dashboard/students"><ArrowLeft className="h-4 w-4 mr-1.5" /> All students</Link>
      </Button>

      <Card className="glass shadow-elegant overflow-hidden">
        <div className="absolute inset-0 gradient-hero opacity-50 pointer-events-none" />
        <CardContent className="relative p-6 flex flex-wrap items-center gap-5">
          <div className="h-16 w-16 rounded-full gradient-primary flex items-center justify-center text-primary-foreground text-xl font-semibold shadow-glow">
            {student.name.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-bold tracking-tight">{student.name}</h1>
            <div className="mt-1 flex flex-wrap gap-3 text-sm text-muted-foreground">
              <span className="flex items-center gap-1"><GraduationCap className="h-3.5 w-3.5" /> {student.rollNo} · {student.class}</span>
              <span className="flex items-center gap-1"><Mail className="h-3.5 w-3.5" /> {student.email}</span>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="glass rounded-lg p-3 text-center min-w-[90px]">
              <p className="text-[11px] text-muted-foreground">Avg</p>
              <p className="text-xl font-semibold">{student.avgScore}%</p>
            </div>
            <div className="glass rounded-lg p-3 text-center min-w-[90px]">
              <p className="text-[11px] text-muted-foreground">Scripts</p>
              <p className="text-xl font-semibold">{student.scriptsEvaluated}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="glass shadow-elegant lg:col-span-2">
          <CardHeader><CardTitle className="flex items-center gap-2"><TrendingUp className="h-4 w-4" /> Historical performance</CardTitle></CardHeader>
          <CardContent className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={history}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="test" stroke="var(--color-muted-foreground)" fontSize={12} />
                <YAxis stroke="var(--color-muted-foreground)" fontSize={12} />
                <Tooltip contentStyle={{ background: "var(--color-popover)", border: "1px solid var(--color-border)", borderRadius: 12 }} />
                <Line type="monotone" dataKey="score" stroke="var(--color-primary)" strokeWidth={3} dot={{ r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="glass shadow-elegant">
          <CardHeader><CardTitle>Subject-wise scores</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {subjectAverages.map((s) => (
              <div key={s.subject}>
                <div className="flex justify-between text-sm mb-1">
                  <span>{s.subject}</span>
                  <span className="font-semibold">{s.score}%</span>
                </div>
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <div className="h-full gradient-primary" style={{ width: `${s.score}%` }} />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="glass shadow-elegant">
          <CardHeader><CardTitle className="text-base">Strengths</CardTitle></CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {strengths.map((s) => (
              <Badge key={s} variant="outline" className="bg-success/10 text-success border-success/20">{s}</Badge>
            ))}
          </CardContent>
        </Card>
        <Card className="glass shadow-elegant">
          <CardHeader><CardTitle className="text-base">Weaknesses</CardTitle></CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {weaknesses.map((s) => (
              <Badge key={s} variant="outline" className="bg-destructive/10 text-destructive border-destructive/20">{s}</Badge>
            ))}
          </CardContent>
        </Card>
        <Card className="glass shadow-elegant">
          <CardHeader><CardTitle className="text-base flex items-center gap-2"><Sparkles className="h-4 w-4 text-primary" /> AI suggestions</CardTitle></CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              {suggestions.map((s, i) => (
                <li key={i} className="flex gap-2"><span className="text-primary">•</span><span>{s}</span></li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
