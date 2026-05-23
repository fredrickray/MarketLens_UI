"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Bell,
  Plus,
  Trash2,
  TrendingUp,
  TrendingDown,
  Brain,
  ArrowUpDown,
  Loader2,
  Lock,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth/auth-context";
import {
  useAlerts,
  useCreateAlert,
  useSetAlertActive,
  useDeleteAlert,
} from "@/hooks/api";
import type { Alert, AlertType, CreateAlertInput } from "@/lib/api/types";
import { ApiError } from "@/lib/api/client";

const typeIcons: Record<AlertType, React.ComponentType<{ className?: string }>> = {
  price_above: TrendingUp,
  price_below: TrendingDown,
  price_change_percent: ArrowUpDown,
  recommendation_change: Brain,
};

const typeLabels: Record<AlertType, string> = {
  price_above: "Price Above",
  price_below: "Price Below",
  price_change_percent: "% Change",
  recommendation_change: "AI Recommendation",
};

function describe(alert: Alert): string {
  switch (alert.type) {
    case "price_above":
      return `Above $${alert.targetPrice}`;
    case "price_below":
      return `Below $${alert.targetPrice}`;
    case "price_change_percent":
      return `${alert.thresholdPercent}%+ daily change`;
    case "recommendation_change":
      return alert.targetAction ? `Changes to ${alert.targetAction}` : "Recommendation changes";
    default:
      return "";
  }
}

const needsPrice = (t: AlertType) => t === "price_above" || t === "price_below";
const needsPercent = (t: AlertType) => t === "price_change_percent";

export default function DashboardAlerts() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { data: alerts, isLoading } = useAlerts();
  const createAlert = useCreateAlert();
  const setActive = useSetAlertActive();
  const deleteAlert = useDeleteAlert();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newAlert, setNewAlert] = useState<{ symbol: string; type: AlertType; value: string }>({
    symbol: "",
    type: "price_above",
    value: "",
  });

  const all = alerts ?? [];

  const handleToggle = async (alert: Alert) => {
    try {
      await setActive.mutateAsync({ id: alert.id, isActive: !alert.isActive });
    } catch (error) {
      toast.error(error instanceof ApiError ? error.message : "Could not update alert");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteAlert.mutateAsync(id);
      toast.success("Alert deleted");
    } catch (error) {
      toast.error(error instanceof ApiError ? error.message : "Could not delete alert");
    }
  };

  const handleAdd = async () => {
    const symbol = newAlert.symbol.trim().toUpperCase();
    if (!symbol) return;
    const input: CreateAlertInput = { symbol, type: newAlert.type };
    if (needsPrice(newAlert.type)) input.targetPrice = parseFloat(newAlert.value);
    if (needsPercent(newAlert.type)) input.thresholdPercent = parseFloat(newAlert.value);
    try {
      await createAlert.mutateAsync(input);
      toast.success(`Alert created for ${symbol}`);
      setNewAlert({ symbol: "", type: "price_above", value: "" });
      setIsDialogOpen(false);
    } catch (error) {
      toast.error(error instanceof ApiError ? error.message : "Could not create alert");
    }
  };

  if (!authLoading && !isAuthenticated) {
    return (
      <Card className="mx-auto max-w-md py-12">
        <CardContent className="flex flex-col items-center justify-center text-center">
          <Lock className="mb-4 h-12 w-12 text-muted-foreground" />
          <h3 className="text-xl font-semibold mb-2">Sign in to manage alerts</h3>
          <Button asChild>
            <Link href="/login">Sign In</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Bell className="h-8 w-8 text-primary" />
            Alerts
          </h1>
          <p className="text-muted-foreground">Get notified when stocks hit your targets.</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Alert
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Alert</DialogTitle>
              <DialogDescription>Set up a new alert for a stock.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label>Stock Symbol</Label>
                <Input
                  placeholder="e.g., AAPL"
                  value={newAlert.symbol}
                  onChange={(e) =>
                    setNewAlert({ ...newAlert, symbol: e.target.value.toUpperCase() })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Alert Type</Label>
                <Select
                  value={newAlert.type}
                  onValueChange={(value: AlertType) => setNewAlert({ ...newAlert, type: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="price_above">Price Above</SelectItem>
                    <SelectItem value="price_below">Price Below</SelectItem>
                    <SelectItem value="price_change_percent">% Change</SelectItem>
                    <SelectItem value="recommendation_change">AI Recommendation</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {(needsPrice(newAlert.type) || needsPercent(newAlert.type)) && (
                <div className="space-y-2">
                  <Label>{needsPercent(newAlert.type) ? "Percentage (%)" : "Price ($)"}</Label>
                  <Input
                    type="number"
                    placeholder={needsPercent(newAlert.type) ? "e.g., 5" : "e.g., 180"}
                    value={newAlert.value}
                    onChange={(e) => setNewAlert({ ...newAlert, value: e.target.value })}
                  />
                </div>
              )}
              <Button
                className="w-full"
                onClick={handleAdd}
                disabled={
                  createAlert.isPending ||
                  !newAlert.symbol ||
                  ((needsPrice(newAlert.type) || needsPercent(newAlert.type)) && !newAlert.value)
                }
              >
                {createAlert.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Create Alert"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Alerts ({all.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
            </div>
          ) : all.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No alerts set up yet. Create one to get started!
            </div>
          ) : (
            <div className="space-y-3">
              {all.map((alert) => {
                const Icon = typeIcons[alert.type];
                return (
                  <div
                    key={alert.id}
                    className={`flex items-center justify-between p-4 rounded-lg transition-colors ${
                      alert.isActive ? "bg-muted/50" : "bg-muted/20 opacity-60"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                          alert.isActive ? "bg-primary/10" : "bg-muted"
                        }`}
                      >
                        <Icon
                          className={`h-5 w-5 ${
                            alert.isActive ? "text-primary" : "text-muted-foreground"
                          }`}
                        />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/stock/${alert.symbol}`}
                            className="font-semibold hover:text-primary"
                          >
                            {alert.symbol}
                          </Link>
                          <Badge variant="outline">{typeLabels[alert.type]}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{describe(alert)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Switch
                        checked={alert.isActive}
                        onCheckedChange={() => handleToggle(alert)}
                        disabled={setActive.isPending}
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(alert.id)}
                        disabled={deleteAlert.isPending}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
