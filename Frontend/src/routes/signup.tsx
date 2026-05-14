import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthLayout } from "@/components/auth-layout";

export const Route = createFileRoute("/signup")({ component: Signup });

function Signup() {
  const navigate = useNavigate();
  return (
    <AuthLayout
      title="Create your account"
      subtitle="Start grading smarter in minutes"
      footer={
        <>
          Already have an account?{" "}
          <Link to="/login" className="text-primary font-medium hover:underline">Sign in</Link>
        </>
      }
    >
      <form
        onSubmit={(e) => { e.preventDefault(); navigate({ to: "/dashboard" }); }}
        className="space-y-4"
      >
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label htmlFor="first">First name</Label>
            <Input id="first" placeholder="Asha" required />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="last">Last name</Label>
            <Input id="last" placeholder="Verma" required />
          </div>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="email">Work email</Label>
          <Input id="email" type="email" placeholder="you@school.edu" required />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="school">School / Institution</Label>
          <Input id="school" placeholder="Greenwood High" required />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" placeholder="At least 8 characters" required />
        </div>
        <Button type="submit" className="w-full gradient-primary border-0 shadow-glow">
          Create account
        </Button>
      </form>
    </AuthLayout>
  );
}
