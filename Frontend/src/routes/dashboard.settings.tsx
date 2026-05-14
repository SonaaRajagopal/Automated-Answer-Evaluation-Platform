import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { ThemeToggle } from "@/components/theme-toggle";
import { Sparkles, KeyRound } from "lucide-react";

export const Route = createFileRoute("/dashboard/settings")({ component: Settings });

function Settings() {
  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage your profile, API keys, and preferences.</p>
      </div>

      <Card className="glass shadow-elegant">
        <CardHeader><CardTitle>Profile</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-full gradient-primary flex items-center justify-center text-primary-foreground text-xl font-semibold shadow-glow">
              AV
            </div>
            <div>
              <p className="font-medium">Asha Verma</p>
              <p className="text-sm text-muted-foreground">Greenwood High · Teacher</p>
            </div>
            <Button variant="outline" className="ml-auto glass">Change photo</Button>
          </div>
          <Separator />
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label>Full name</Label>
              <Input defaultValue="Asha Verma" />
            </div>
            <div className="space-y-1.5">
              <Label>Email</Label>
              <Input defaultValue="asha@greenwood.edu" />
            </div>
            <div className="space-y-1.5">
              <Label>School</Label>
              <Input defaultValue="Greenwood High" />
            </div>
            <div className="space-y-1.5">
              <Label>Role</Label>
              <Input defaultValue="Math Teacher" />
            </div>
          </div>
          <div className="flex justify-end">
            <Button className="gradient-primary border-0 shadow-glow">Save changes</Button>
          </div>
        </CardContent>
      </Card>

      <Card className="glass shadow-elegant">
        <CardHeader><CardTitle className="flex items-center gap-2"><Sparkles className="h-4 w-4 text-primary" /> AI configuration</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label className="flex items-center gap-1.5"><KeyRound className="h-3.5 w-3.5" /> API key</Label>
            <Input type="password" defaultValue="sk-eval-•••••••••••••••••••••" />
            <p className="text-xs text-muted-foreground">Used for advanced model overrides. Leave empty to use defaults.</p>
          </div>
          <div className="space-y-1.5">
            <Label>Default model</Label>
            <Input defaultValue="evalai-grading-pro-v3" />
          </div>
          <Separator />
          <SettingRow
            label="Strict rubric mode"
            desc="Penalize answers outside the rubric criteria."
            defaultChecked
          />
          <SettingRow
            label="Auto-flag low confidence"
            desc="Send scripts under 80% confidence for review."
            defaultChecked
          />
          <SettingRow
            label="Share anonymized data"
            desc="Help improve our models. No PII is shared."
          />
        </CardContent>
      </Card>

      <Card className="glass shadow-elegant">
        <CardHeader><CardTitle>Preferences</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Theme</p>
              <p className="text-xs text-muted-foreground">Toggle between light and dark mode.</p>
            </div>
            <ThemeToggle />
          </div>
          <Separator />
          <SettingRow label="Email notifications" desc="Daily evaluation summary at 6pm." defaultChecked />
          <SettingRow label="Browser notifications" desc="Get notified when batch evaluation finishes." />
        </CardContent>
      </Card>
    </div>
  );
}

function SettingRow({ label, desc, defaultChecked }: { label: string; desc: string; defaultChecked?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <p className="font-medium text-sm">{label}</p>
        <p className="text-xs text-muted-foreground">{desc}</p>
      </div>
      <Switch defaultChecked={defaultChecked} />
    </div>
  );
}
