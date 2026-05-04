"use client";

import { useState } from "react";
import { Bell, Plus, Trash2, TrendingUp, TrendingDown, Brain, Newspaper } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
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

interface Alert {
  id: string;
  symbol: string;
  type: "price" | "change" | "ai" | "news";
  condition: string;
  value: string;
  enabled: boolean;
  triggered?: boolean;
}

const initialAlerts: Alert[] = [
  { id: "1", symbol: "AAPL", type: "price", condition: "above", value: "$180.00", enabled: true },
  { id: "2", symbol: "NVDA", type: "change", condition: "drops", value: "5%", enabled: true, triggered: true },
  { id: "3", symbol: "TSLA", type: "ai", condition: "changes to", value: "Buy", enabled: true },
  { id: "4", symbol: "MSFT", type: "news", condition: "sentiment", value: "Negative", enabled: false },
  { id: "5", symbol: "GOOGL", type: "price", condition: "below", value: "$150.00", enabled: true },
];

const alertTypeIcons = {
  price: TrendingUp,
  change: TrendingDown,
  ai: Brain,
  news: Newspaper,
};

const alertTypeLabels = {
  price: "Price Alert",
  change: "% Change Alert",
  ai: "AI Recommendation",
  news: "News Sentiment",
};

export default function DashboardAlerts() {
  const [alerts, setAlerts] = useState<Alert[]>(initialAlerts);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newAlert, setNewAlert] = useState({
    symbol: "",
    type: "price" as Alert["type"],
    condition: "",
    value: "",
  });

  const toggleAlert = (id: string) => {
    setAlerts(
      alerts.map((alert) =>
        alert.id === id ? { ...alert, enabled: !alert.enabled } : alert
      )
    );
  };

  const deleteAlert = (id: string) => {
    setAlerts(alerts.filter((alert) => alert.id !== id));
    toast.success("Alert deleted");
  };

  const handleAddAlert = () => {
    if (newAlert.symbol && newAlert.condition && newAlert.value) {
      const alert: Alert = {
        id: Date.now().toString(),
        symbol: newAlert.symbol.toUpperCase(),
        type: newAlert.type,
        condition: newAlert.condition,
        value: newAlert.value,
        enabled: true,
      };
      setAlerts([...alerts, alert]);
      setNewAlert({ symbol: "", type: "price", condition: "", value: "" });
      setIsDialogOpen(false);
      toast.success(`Alert created for ${alert.symbol}`);
    }
  };

  const triggeredAlerts = alerts.filter((a) => a.triggered);
  const activeAlerts = alerts.filter((a) => a.enabled && !a.triggered);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Bell className="h-8 w-8 text-primary" />
            Alerts
          </h1>
          <p className="text-muted-foreground">
            Get notified when stocks hit your targets.
          </p>
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
              <DialogDescription>
                Set up a new alert to get notified about stock movements.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label>Stock Symbol</Label>
                <Input
                  placeholder="e.g., AAPL"
                  value={newAlert.symbol}
                  onChange={(e) =>
                    setNewAlert({ ...newAlert, symbol: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Alert Type</Label>
                <Select
                  value={newAlert.type}
                  onValueChange={(value: Alert["type"]) =>
                    setNewAlert({ ...newAlert, type: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="price">Price Alert</SelectItem>
                    <SelectItem value="change">% Change Alert</SelectItem>
                    <SelectItem value="ai">AI Recommendation</SelectItem>
                    <SelectItem value="news">News Sentiment</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Condition</Label>
                <Input
                  placeholder="e.g., above, below, changes to"
                  value={newAlert.condition}
                  onChange={(e) =>
                    setNewAlert({ ...newAlert, condition: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Value</Label>
                <Input
                  placeholder="e.g., $180.00, 5%, Buy"
                  value={newAlert.value}
                  onChange={(e) =>
                    setNewAlert({ ...newAlert, value: e.target.value })
                  }
                />
              </div>
              <Button className="w-full" onClick={handleAddAlert}>
                Create Alert
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {triggeredAlerts.length > 0 && (
        <Card className="border-warning/50 bg-warning/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-warning">
              <Bell className="h-5 w-5" />
              Triggered Alerts ({triggeredAlerts.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {triggeredAlerts.map((alert) => {
                const Icon = alertTypeIcons[alert.type];
                return (
                  <div
                    key={alert.id}
                    className="flex items-center justify-between p-4 rounded-lg bg-background border border-warning/30"
                  >
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-lg bg-warning/10 flex items-center justify-center">
                        <Icon className="h-5 w-5 text-warning" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">{alert.symbol}</span>
                          <Badge variant="outline">{alertTypeLabels[alert.type]}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {alert.condition} {alert.value}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteAlert(alert.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>All Alerts ({alerts.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {alerts.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No alerts set up yet. Create one to get started!
            </div>
          ) : (
            <div className="space-y-3">
              {alerts.map((alert) => {
                const Icon = alertTypeIcons[alert.type];
                return (
                  <div
                    key={alert.id}
                    className={`flex items-center justify-between p-4 rounded-lg transition-colors ${
                      alert.enabled ? "bg-muted/50" : "bg-muted/20 opacity-60"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                          alert.enabled ? "bg-primary/10" : "bg-muted"
                        }`}
                      >
                        <Icon
                          className={`h-5 w-5 ${
                            alert.enabled ? "text-primary" : "text-muted-foreground"
                          }`}
                        />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">{alert.symbol}</span>
                          <Badge variant="outline">{alertTypeLabels[alert.type]}</Badge>
                          {alert.triggered && (
                            <Badge className="bg-warning text-warning-foreground">
                              Triggered
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {alert.condition} {alert.value}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Switch
                        checked={alert.enabled}
                        onCheckedChange={() => toggleAlert(alert.id)}
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteAlert(alert.id)}
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
