import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, Download, Eye, Filter } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { scripts, subjects, classes, type Script } from "@/lib/mock-data";

export const Route = createFileRoute("/dashboard/results")({ component: Results });

function Results() {
  const [q, setQ] = useState("");
  const [subj, setSubj] = useState<string>("all");
  const [cls, setCls] = useState<string>("all");

  const filtered = useMemo(
    () =>
      scripts.filter(
        (s) =>
          (subj === "all" || s.subject === subj) &&
          (cls === "all" || s.class === cls) &&
          (q === "" || s.studentName.toLowerCase().includes(q.toLowerCase())),
      ),
    [q, subj, cls],
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Evaluation results</h1>
          <p className="text-sm text-muted-foreground mt-1">{filtered.length} scripts</p>
        </div>
        <Button variant="outline" className="glass">
          <Download className="h-4 w-4 mr-1.5" /> Export CSV
        </Button>
      </div>

      <Card className="glass shadow-elegant">
        <CardContent className="p-4 flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search students…" className="pl-9" />
          </div>
          <Select value={subj} onValueChange={setSubj}>
            <SelectTrigger className="w-[180px]">
              <Filter className="h-4 w-4 mr-1.5" />
              <SelectValue placeholder="Subject" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All subjects</SelectItem>
              {subjects.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={cls} onValueChange={setCls}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Class" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All classes</SelectItem>
              {classes.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <Card className="glass shadow-elegant overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Student</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead>Class</TableHead>
              <TableHead>Marks</TableHead>
              <TableHead>Confidence</TableHead>
              <TableHead>Rubric match</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((s) => (
              <TableRow key={s.id}>
                <TableCell className="font-medium">{s.studentName}</TableCell>
                <TableCell className="text-muted-foreground">{s.subject}</TableCell>
                <TableCell className="text-muted-foreground">{s.class}</TableCell>
                <TableCell><span className="font-semibold">{s.marks}</span><span className="text-muted-foreground">/{s.maxMarks}</span></TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Progress value={s.confidence} className="h-1.5 w-20" />
                    <span className="text-xs text-muted-foreground">{s.confidence}%</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Progress value={s.rubricMatch} className="h-1.5 w-20" />
                    <span className="text-xs text-muted-foreground">{s.rubricMatch}%</span>
                  </div>
                </TableCell>
                <TableCell>
                  <StatusBadge status={s.status} />
                </TableCell>
                <TableCell className="text-right">
                  <ResultDialog script={s} />
                </TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-12 text-muted-foreground">
                  No scripts match your filters.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}

function StatusBadge({ status }: { status: Script["status"] }) {
  const map: Record<Script["status"], { label: string; cls: string }> = {
    evaluated: { label: "Evaluated", cls: "bg-success/15 text-success border-success/20" },
    pending: { label: "Pending", cls: "bg-warning/15 text-warning border-warning/20" },
    review: { label: "Needs review", cls: "bg-destructive/15 text-destructive border-destructive/20" },
  };
  const { label, cls } = map[status];
  return <Badge variant="outline" className={cls}>{label}</Badge>;
}

function ResultDialog({ script: s }: { script: Script }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm" variant="ghost"><Eye className="h-4 w-4 mr-1.5" /> View</Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl glass-strong">
        <DialogHeader>
          <DialogTitle>{s.studentName} — {s.subject}</DialogTitle>
        </DialogHeader>
        <div className="space-y-5">
          <div className="grid grid-cols-3 gap-3">
            <div className="glass rounded-lg p-3 text-center">
              <p className="text-xs text-muted-foreground">Marks</p>
              <p className="mt-1 text-xl font-semibold">{s.marks}<span className="text-sm text-muted-foreground">/{s.maxMarks}</span></p>
            </div>
            <div className="glass rounded-lg p-3 text-center">
              <p className="text-xs text-muted-foreground">Confidence</p>
              <p className="mt-1 text-xl font-semibold">{s.confidence}%</p>
            </div>
            <div className="glass rounded-lg p-3 text-center">
              <p className="text-xs text-muted-foreground">Rubric match</p>
              <p className="mt-1 text-xl font-semibold">{s.rubricMatch}%</p>
            </div>
          </div>
          <div>
            <p className="text-xs uppercase text-muted-foreground tracking-wide mb-2">Extracted text</p>
            <div className="glass rounded-lg p-4 text-sm leading-relaxed">{s.extractedText}</div>
          </div>
          <div>
            <p className="text-xs uppercase text-muted-foreground tracking-wide mb-2">AI feedback</p>
            <div className="rounded-lg p-4 text-sm leading-relaxed gradient-hero">{s.feedback}</div>
          </div>
          <Button className="w-full gradient-primary border-0 shadow-glow">
            <Download className="h-4 w-4 mr-1.5" /> Download report
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
