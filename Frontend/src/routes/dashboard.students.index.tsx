import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Search, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { students } from "@/lib/mock-data";

export const Route = createFileRoute("/dashboard/students/")({ component: Students });

function Students() {
  const [q, setQ] = useState("");
  const list = students.filter(
    (s) => s.name.toLowerCase().includes(q.toLowerCase()) || s.rollNo.toLowerCase().includes(q.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Students</h1>
        <p className="text-sm text-muted-foreground mt-1">View per-student performance and reports.</p>
      </div>

      <Card className="glass shadow-elegant">
        <CardContent className="p-4">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by name or roll no…" className="pl-9" />
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((s) => (
          <Card key={s.id} className="glass shadow-elegant hover:-translate-y-1 transition-transform group">
            <CardContent className="p-5">
              <div className="flex items-start gap-3">
                <div className="h-12 w-12 rounded-full gradient-primary flex items-center justify-center text-primary-foreground font-semibold shadow-glow">
                  {s.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold truncate">{s.name}</p>
                  <p className="text-xs text-muted-foreground">{s.rollNo} · {s.class}</p>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2">
                <div className="glass rounded-lg p-2.5 text-center">
                  <p className="text-[11px] text-muted-foreground">Avg score</p>
                  <p className="text-lg font-semibold">{s.avgScore}%</p>
                </div>
                <div className="glass rounded-lg p-2.5 text-center">
                  <p className="text-[11px] text-muted-foreground">Scripts</p>
                  <p className="text-lg font-semibold">{s.scriptsEvaluated}</p>
                </div>
              </div>
              <Button asChild variant="ghost" className="mt-4 w-full justify-between">
                <Link to="/dashboard/students/$id" params={{ id: s.id }}>
                  View report <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
