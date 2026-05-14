import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthLayout } from "@/components/auth-layout";
import { CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/forgot-password")({ component: Forgot });

function Forgot() {
  const [sent, setSent] = useState(false);
  return (
    <AuthLayout
      title={sent ? "Check your inbox" : "Forgot your password?"}
      subtitle={sent ? "We sent a reset link to your email." : "Enter your email and we'll send a reset link."}
      footer={<Link to="/login" className="text-primary hover:underline">Back to sign in</Link>}
    >
      {sent ? (
        <div className="flex flex-col items-center text-center gap-3 py-2">
          <CheckCircle2 className="h-12 w-12 text-success" />
          <p className="text-sm text-muted-foreground">Didn't get it? Check your spam folder.</p>
        </div>
      ) : (
        <form
          onSubmit={(e) => { e.preventDefault(); setSent(true); }}
          className="space-y-4"
        >
          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="you@school.edu" required />
          </div>
          <Button type="submit" className="w-full gradient-primary border-0 shadow-glow">
            Send reset link
          </Button>
        </form>
      )}
    </AuthLayout>
  );
}
