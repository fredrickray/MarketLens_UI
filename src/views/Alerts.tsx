"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import {
  Bell,
  Plus,
  Trash2,
  TrendingUp,
  TrendingDown,
  ArrowUpDown,
  Brain,
  ToggleLeft,
  ToggleRight,
  Search,
  Loader2,
  Lock,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/lib/auth/auth-context";
import {
  useAlerts,
  useCreateAlert,
  useSetAlertActive,
  useDeleteAlert,
} from "@/hooks/api";
import type { Alert, AlertType, CreateAlertInput } from "@/lib/api/types";
import { ApiError } from "@/lib/api/client";

const alertTypeLabels: Record<AlertType, string> = {
  price_above: "Price Above",
  price_below: "Price Below",
  price_change_percent: "% Change",
  recommendation_change: "Recommendation Change",
};

const alertTypeIcons: Record<AlertType, React.ReactNode> = {
  price_above: <TrendingUp className="h-4 w-4" />,
  price_below: <TrendingDown className="h-4 w-4" />,
  price_change_percent: <ArrowUpDown className="h-4 w-4" />,
  recommendation_change: <Brain className="h-4 w-4" />,
};

function describeAlert(alert: Alert): string {
  switch (alert.type) {
    case "price_above":
      return `Notify when price exceeds $${alert.targetPrice}`;
    case "price_below":
      return `Notify when price drops below $${alert.targetPrice}`;
    case "price_change_percent":
      return `Notify on ${alert.thresholdPercent}%+ daily change`;
    case "recommendation_change":
      return alert.targetAction
        ? `Notify when AI recommendation becomes ${alert.targetAction}`
        : "Notify when AI recommendation changes";
    default:
      return "";
  }
}

const needsPrice = (type: AlertType) =>
  type === "price_above" || type === "price_below";
const needsPercent = (type: AlertType) => type === "price_change_percent";

const Alerts = () => {
  const searchParams = useSearchParams();
  const preselectedSymbol = (searchParams?.get("symbol") || "").toUpperCase();
  const { isAuthenticated, isLoading: authLoading } = useAuth();

  const { data: alerts, isLoading } = useAlerts();
  const createAlert = useCreateAlert();
  const setActive = useSetAlertActive();
  const deleteAlert = useDeleteAlert();

  const [searchQuery, setSearchQuery] = useState("");
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [newAlert, setNewAlert] = useState<{
    symbol: string;
    type: AlertType;
    value: string;
  }>({ symbol: preselectedSymbol, type: "price_above", value: "" });

  const all = alerts ?? [];
  const filtered = all.filter((a) =>
    a.symbol.toLowerCase().includes(searchQuery.toLowerCase()),
  );
  const activeAlerts = filtered.filter((a) => a.isActive);
  const inactiveAlerts = filtered.filter((a) => !a.isActive);

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

  const handleCreate = async () => {
    const symbol = newAlert.symbol.trim().toUpperCase();
    if (!symbol) return;

    const input: CreateAlertInput = { symbol, type: newAlert.type };
    if (needsPrice(newAlert.type)) input.targetPrice = parseFloat(newAlert.value);
    if (needsPercent(newAlert.type)) input.thresholdPercent = parseFloat(newAlert.value);

    try {
      await createAlert.mutateAsync(input);
      toast.success("Alert created");
      setCreateDialogOpen(false);
      setNewAlert({ symbol: "", type: "price_above", value: "" });
    } catch (error) {
      toast.error(error instanceof ApiError ? error.message : "Could not create alert");
    }
  };

  const AlertCard = ({ alert }: { alert: Alert }) => (
    <Card className={`transition-opacity ${!alert.isActive ? "opacity-60" : ""}`}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                alert.isActive ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
              }`}
            >
              {alertTypeIcons[alert.type]}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <Link
                  href={`/stock/${alert.symbol}`}
                  className="font-semibold hover:text-primary transition-colors"
                >
                  {alert.symbol}
                </Link>
                <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded">
                  {alertTypeLabels[alert.type]}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">{describeAlert(alert)}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
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
              className="text-muted-foreground hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (!authLoading && !isAuthenticated) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-20">
          <Card className="mx-auto max-w-md py-12">
            <CardContent className="flex flex-col items-center justify-center text-center">
              <Lock className="mb-4 h-12 w-12 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2">Sign in to manage alerts</h3>
              <p className="text-muted-foreground mb-6">
                Price and recommendation alerts are tied to your account.
              </p>
              <Button asChild>
                <Link href="/login">Sign In</Link>
              </Button>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Price Alerts</h1>
          <p className="text-muted-foreground">
            Get notified about price changes and AI recommendation shifts
          </p>
        </div>

        <div className="flex flex-col gap-4 mb-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search alerts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create Alert
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Alert</DialogTitle>
                <DialogDescription>Set up a new price or event alert for a stock</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Stock symbol</Label>
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
                    onValueChange={(value: AlertType) =>
                      setNewAlert({ ...newAlert, type: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="price_above">Price Above</SelectItem>
                      <SelectItem value="price_below">Price Below</SelectItem>
                      <SelectItem value="price_change_percent">Percent Change</SelectItem>
                      <SelectItem value="recommendation_change">Recommendation Change</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {(needsPrice(newAlert.type) || needsPercent(newAlert.type)) && (
                  <div className="space-y-2">
                    <Label>{needsPercent(newAlert.type) ? "Percentage (%)" : "Price ($)"}</Label>
                    <Input
                      type="number"
                      placeholder={needsPercent(newAlert.type) ? "e.g., 5" : "e.g., 200"}
                      value={newAlert.value}
                      onChange={(e) => setNewAlert({ ...newAlert, value: e.target.value })}
                    />
                  </div>
                )}
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={handleCreate}
                  disabled={
                    createAlert.isPending ||
                    !newAlert.symbol ||
                    ((needsPrice(newAlert.type) || needsPercent(newAlert.type)) && !newAlert.value)
                  }
                >
                  {createAlert.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Create Alert"
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-4 md:grid-cols-3 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Bell className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{all.length}</p>
                  <p className="text-sm text-muted-foreground">Total Alerts</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-success/10">
                  <ToggleRight className="h-6 w-6 text-success" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{activeAlerts.length}</p>
                  <p className="text-sm text-muted-foreground">Active Alerts</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted">
                  <ToggleLeft className="h-6 w-6 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{inactiveAlerts.length}</p>
                  <p className="text-sm text-muted-foreground">Paused Alerts</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {isLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        ) : (
          <Tabs defaultValue="active" className="space-y-4">
            <TabsList>
              <TabsTrigger value="active">Active ({activeAlerts.length})</TabsTrigger>
              <TabsTrigger value="paused">Paused ({inactiveAlerts.length})</TabsTrigger>
              <TabsTrigger value="all">All ({filtered.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="active" className="space-y-3">
              {activeAlerts.length > 0 ? (
                activeAlerts.map((alert) => <AlertCard key={alert.id} alert={alert} />)
              ) : (
                <EmptyState onCreate={() => setCreateDialogOpen(true)} />
              )}
            </TabsContent>

            <TabsContent value="paused" className="space-y-3">
              {inactiveAlerts.length > 0 ? (
                inactiveAlerts.map((alert) => <AlertCard key={alert.id} alert={alert} />)
              ) : (
                <Card className="py-12">
                  <CardContent className="flex flex-col items-center justify-center text-center">
                    <ToggleLeft className="mb-4 h-12 w-12 text-muted-foreground" />
                    <h3 className="text-lg font-semibold mb-2">No paused alerts</h3>
                    <p className="text-muted-foreground">All your alerts are currently active</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="all" className="space-y-3">
              {filtered.length > 0 ? (
                filtered.map((alert) => <AlertCard key={alert.id} alert={alert} />)
              ) : (
                <EmptyState onCreate={() => setCreateDialogOpen(true)} />
              )}
            </TabsContent>
          </Tabs>
        )}
      </main>
      <Footer />
    </div>
  );
};

const EmptyState = ({ onCreate }: { onCreate: () => void }) => (
  <Card className="py-12">
    <CardContent className="flex flex-col items-center justify-center text-center">
      <Bell className="mb-4 h-12 w-12 text-muted-foreground" />
      <h3 className="text-lg font-semibold mb-2">No alerts yet</h3>
      <p className="text-muted-foreground mb-4">
        Create an alert to get notified about price changes
      </p>
      <Button onClick={onCreate}>
        <Plus className="mr-2 h-4 w-4" />
        Create Alert
      </Button>
    </CardContent>
  </Card>
);

export default Alerts;
