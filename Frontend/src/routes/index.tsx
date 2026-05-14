import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Sparkles,
  Brain,
  ShieldCheck,
  Gauge,
  FileText,
  BarChart3,
  Upload,
  Check,
  ArrowRight,
  Star,
  Users,
  Clock,
  Award,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/theme-toggle";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "EvalAI — AI Answer Script Evaluation for Teachers" },
      {
        name: "description",
        content:
          "Save 80% of grading time. EvalAI evaluates handwritten and digital answer scripts with explainable AI, rubric matching and class-wide analytics.",
      },
    ],
  }),
  component: Landing,
});

const features = [
  { icon: Brain, title: "Context-Aware AI", desc: "Understands handwriting, diagrams, and equations — not just keywords." },
  { icon: ShieldCheck, title: "Rubric Matching", desc: "Upload your rubric. We score against your criteria, transparently." },
  { icon: Gauge, title: "Confidence Scores", desc: "Every mark comes with a confidence rating so you stay in control." },
  { icon: FileText, title: "Detailed Feedback", desc: "Per-question feedback students can actually learn from." },
  { icon: BarChart3, title: "Class Analytics", desc: "Spot weak topics, track trends, and compare classes instantly." },
  { icon: Upload, title: "Bulk Upload", desc: "Drag & drop entire batches of PDFs or scans at once." },
];

const testimonials = [
  { name: "Priya Menon", role: "Math Teacher, DPS", quote: "I graded 120 scripts in under an hour. The rubric matching is uncanny." },
  { name: "David Okafor", role: "Head of Science, Greenwood", quote: "Confidence scores changed how I review. I trust the AI but stay in the loop." },
  { name: "Sara Lin", role: "Principal, Riverside Academy", quote: "Our teachers have their evenings back. Analytics finally tell us what to fix." },
];

const pricing = [
  { name: "Starter", price: "$0", period: "/mo", desc: "For individual teachers trying things out.", features: ["50 scripts / month", "1 class", "Basic analytics", "Email support"], cta: "Start free", highlight: false },
  { name: "Pro", price: "$29", period: "/mo", desc: "For active teachers grading every week.", features: ["1,000 scripts / month", "Unlimited classes", "Advanced analytics", "Custom rubrics", "Priority support"], cta: "Start 14-day trial", highlight: true },
  { name: "Institution", price: "Custom", period: "", desc: "For schools and districts.", features: ["Unlimited scripts", "SSO & roles", "API access", "Dedicated CSM", "On-prem option"], cta: "Contact sales", highlight: false },
];

function Landing() {
  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <header className="sticky top-0 z-40 glass-strong border-b">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg gradient-primary shadow-glow">
              <Sparkles className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-semibold tracking-tight">EvalAI</span>
          </Link>
          <nav className="hidden md:flex items-center gap-7 text-sm text-muted-foreground">
            <a href="#features" className="hover:text-foreground transition-colors">Features</a>
            <a href="#testimonials" className="hover:text-foreground transition-colors">Testimonials</a>
            <a href="#pricing" className="hover:text-foreground transition-colors">Pricing</a>
          </nav>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button variant="ghost" asChild className="hidden sm:inline-flex">
              <Link to="/login">Sign in</Link>
            </Button>
            <Button asChild className="gradient-primary border-0 shadow-glow">
              <Link to="/signup">
                Get started <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 gradient-mesh opacity-70" />
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-primary/20 blur-3xl animate-blob" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-primary-glow/20 blur-3xl animate-blob" />
        <div className="container relative mx-auto px-4 py-24 md:py-32 text-center">
          <Badge variant="secondary" className="glass mb-6 animate-fade-in">
            <Sparkles className="mr-1.5 h-3 w-3" /> Now with handwriting OCR v3
          </Badge>
          <h1 className="mx-auto max-w-4xl text-4xl md:text-6xl font-bold tracking-tight animate-fade-up">
            Grade answer scripts <span className="text-gradient">10× faster</span> with explainable AI
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground animate-fade-up">
            EvalAI reads handwritten and digital scripts, scores them against your rubric, and gives every student personalized feedback — while keeping teachers in control.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3 animate-fade-up">
            <Button size="lg" asChild className="gradient-primary border-0 shadow-glow">
              <Link to="/signup">Start free <ArrowRight className="ml-1 h-4 w-4" /></Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="glass">
              <Link to="/dashboard">View live demo</Link>
            </Button>
          </div>

          <div className="mt-14 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {[
              { icon: Clock, label: "80% faster grading" },
              { icon: Award, label: "97% rubric accuracy" },
              { icon: Users, label: "12,000+ teachers" },
              { icon: FileText, label: "4M scripts graded" },
            ].map((s) => (
              <div key={s.label} className="glass rounded-xl p-4 animate-scale-in">
                <s.icon className="h-5 w-5 mx-auto text-primary" />
                <p className="mt-2 text-xs sm:text-sm font-medium">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="container mx-auto px-4 py-24">
        <div className="text-center max-w-2xl mx-auto">
          <Badge variant="secondary">Features</Badge>
          <h2 className="mt-4 text-3xl md:text-4xl font-bold tracking-tight">
            Built for teachers, trusted by institutions
          </h2>
          <p className="mt-4 text-muted-foreground">
            Everything you need to evaluate, analyze, and improve learning outcomes.
          </p>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <Card
              key={f.title}
              className="glass shadow-elegant group hover:-translate-y-1 transition-transform"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <CardContent className="p-6">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl gradient-primary text-primary-foreground shadow-glow group-hover:scale-110 transition-transform">
                  <f.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 text-lg font-semibold">{f.title}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">{f.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="relative py-24">
        <div className="absolute inset-0 gradient-hero" />
        <div className="container relative mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto">
            <Badge variant="secondary">Loved by educators</Badge>
            <h2 className="mt-4 text-3xl md:text-4xl font-bold tracking-tight">
              Real teachers. Real time saved.
            </h2>
          </div>
          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {testimonials.map((t) => (
              <Card key={t.name} className="glass shadow-elegant">
                <CardContent className="p-6">
                  <div className="flex gap-0.5 text-warning">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                  <p className="mt-4 text-sm leading-relaxed">"{t.quote}"</p>
                  <div className="mt-5 flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full gradient-primary flex items-center justify-center text-primary-foreground font-semibold">
                      {t.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{t.name}</p>
                      <p className="text-xs text-muted-foreground">{t.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="container mx-auto px-4 py-24">
        <div className="text-center max-w-2xl mx-auto">
          <Badge variant="secondary">Pricing</Badge>
          <h2 className="mt-4 text-3xl md:text-4xl font-bold tracking-tight">
            Simple plans that grow with you
          </h2>
          <p className="mt-4 text-muted-foreground">Cancel anytime. No credit card required to start.</p>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-3 max-w-5xl mx-auto">
          {pricing.map((p) => (
            <Card
              key={p.name}
              className={`relative ${p.highlight ? "border-primary shadow-glow scale-[1.02]" : "glass"} shadow-elegant`}
            >
              {p.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className="gradient-primary border-0">Most popular</Badge>
                </div>
              )}
              <CardContent className="p-7">
                <h3 className="text-lg font-semibold">{p.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{p.desc}</p>
                <div className="mt-5 flex items-baseline gap-1">
                  <span className="text-4xl font-bold tracking-tight">{p.price}</span>
                  <span className="text-muted-foreground">{p.period}</span>
                </div>
                <Button
                  asChild
                  className={`mt-6 w-full ${p.highlight ? "gradient-primary border-0 shadow-glow" : ""}`}
                  variant={p.highlight ? "default" : "outline"}
                >
                  <Link to="/signup">{p.cta}</Link>
                </Button>
                <ul className="mt-6 space-y-3">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm">
                      <Check className="h-4 w-4 mt-0.5 text-success shrink-0" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t mt-12">
        <div className="container mx-auto px-4 py-10 grid gap-8 md:grid-cols-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-primary">
                <Sparkles className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="font-semibold">EvalAI</span>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">
              AI-powered answer script evaluation for modern classrooms.
            </p>
          </div>
          {[
            { title: "Product", links: ["Features", "Pricing", "Changelog", "Roadmap"] },
            { title: "Company", links: ["About", "Customers", "Careers", "Contact"] },
            { title: "Legal", links: ["Privacy", "Terms", "Security", "DPA"] },
          ].map((col) => (
            <div key={col.title}>
              <h4 className="text-sm font-semibold">{col.title}</h4>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                {col.links.map((l) => (
                  <li key={l}><a href="#" className="hover:text-foreground">{l}</a></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t">
          <div className="container mx-auto px-4 py-5 text-xs text-muted-foreground flex justify-between">
            <span>© {new Date().getFullYear()} EvalAI. All rights reserved.</span>
            <span>Made for educators.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
