import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthLayout } from "@/components/auth-layout";

export const Route = createFileRoute("/login")({ component: Login });

function Login() {
  const navigate = useNavigate();
  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to continue grading"
      footer={
        <>
          New here?{" "}
          <Link to="/signup" className="text-primary font-medium hover:underline">Create an account</Link>
        </>
      }
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          navigate({ to: "/dashboard" });
        }}
        className="space-y-4"
      >
        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="teacher@school.edu" defaultValue="teacher@school.edu" required />
        </div>
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <Link to="/forgot-password" className="text-xs text-primary hover:underline">Forgot?</Link>
          </div>
          <Input id="password" type="password" placeholder="••••••••" defaultValue="demopass" required />
        </div>
        <Button type="submit" className="w-full gradient-primary border-0 shadow-glow">
          Sign in
        </Button>
        <Button type="button" variant="outline" className="w-full glass">Continue with Google</Button>
      </form>
    </AuthLayout>
  );
}
