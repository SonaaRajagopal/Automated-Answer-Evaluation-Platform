import { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type Props = {
  label: string;
  value: string | number;
  icon: ReactNode;
  delta?: string;
  trend?: "up" | "down" | "neutral";
  className?: string;
};

export function StatCard({ label, value, icon, delta, trend = "up", className }: Props) {
  return (
    <Card className={cn("glass shadow-elegant overflow-hidden relative group", className)}>
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity gradient-hero" />
      <CardContent className="relative p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="mt-2 text-3xl font-semibold tracking-tight">{value}</p>
            {delta && (
              <p
                className={cn(
                  "mt-2 text-xs font-medium",
                  trend === "up" && "text-success",
                  trend === "down" && "text-destructive",
                  trend === "neutral" && "text-muted-foreground",
                )}
              >
                {delta}
              </p>
            )}
          </div>
          <div className="flex h-11 w-11 items-center justify-center rounded-xl gradient-primary text-primary-foreground shadow-glow">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
