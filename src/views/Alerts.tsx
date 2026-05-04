"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { 
  Bell, 
  Plus, 
  Trash2, 
  TrendingUp, 
  TrendingDown, 
  ArrowUpDown, 
  Target,
  Newspaper,
  Brain,
  ToggleLeft,
  ToggleRight,
  Search
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
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

type AlertType = "price_above" | "price_below" | "percent_change" | "recommendation_change" | "news_sentiment";

interface Alert {
  id: string;
  symbol: string;
  name: string;
  type: AlertType;
  value?: number;
  enabled: boolean;
  createdAt: string;
}

const alertTypeLabels: Record<AlertType, string> = {
  price_above: "Price Above",
  price_below: "Price Below",
  percent_change: "% Change",
  recommendation_change: "Recommendation Change",
  news_sentiment: "News Sentiment Alert",
};

const alertTypeIcons: Record<AlertType, React.ReactNode> = {
  price_above: <TrendingUp className="h-4 w-4" />,
  price_below: <TrendingDown className="h-4 w-4" />,
  percent_change: <ArrowUpDown className="h-4 w-4" />,
  recommendation_change: <Brain className="h-4 w-4" />,
  news_sentiment: <Newspaper className="h-4 w-4" />,
};

const mockAlerts: Alert[] = [
  { id: "1", symbol: "AAPL", name: "Apple Inc.", type: "price_above", value: 200, enabled: true, createdAt: "2024-01-15" },
  { id: "2", symbol: "AAPL", name: "Apple Inc.", type: "price_below", value: 170, enabled: true, createdAt: "2024-01-15" },
  { id: "3", symbol: "TSLA", name: "Tesla, Inc.", type: "percent_change", value: 5, enabled: false, createdAt: "2024-01-10" },
  { id: "4", symbol: "NVDA", name: "NVIDIA Corporation", type: "recommendation_change", enabled: true, createdAt: "2024-01-08" },
  { id: "5", symbol: "MSFT", name: "Microsoft Corporation", type: "news_sentiment", enabled: true, createdAt: "2024-01-05" },
];

const stocks = [
  { symbol: "AAPL", name: "Apple Inc." },
  { symbol: "NVDA", name: "NVIDIA Corporation" },
  { symbol: "TSLA", name: "Tesla, Inc." },
  { symbol: "MSFT", name: "Microsoft Corporation" },
  { symbol: "META", name: "Meta Platforms, Inc." },
  { symbol: "GOOGL", name: "Alphabet Inc." },
];

const Alerts = () => {
  const searchParams = useSearchParams();
  const preselectedSymbol = searchParams?.get("symbol") || "";
  
  const [alerts, setAlerts] = useState<Alert[]>(mockAlerts);
  const [searchQuery, setSearchQuery] = useState("");
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [newAlert, setNewAlert] = useState({
    symbol: preselectedSymbol,
    type: "price_above" as AlertType,
    value: "",
  });

  const filteredAlerts = alerts.filter(
    alert =>
      alert.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alert.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeAlerts = filteredAlerts.filter(a => a.enabled);
  const inactiveAlerts = filteredAlerts.filter(a => !a.enabled);

  const handleToggleAlert = (id: string) => {
    setAlerts(alerts.map(alert => 
      alert.id === id ? { ...alert, enabled: !alert.enabled } : alert
    ));
  };

  const handleDeleteAlert = (id: string) => {
    setAlerts(alerts.filter(alert => alert.id !== id));
  };

  const handleCreateAlert = () => {
    const stock = stocks.find(s => s.symbol === newAlert.symbol);
    if (!stock) return;

    const alert: Alert = {
      id: Date.now().toString(),
      symbol: newAlert.symbol,
      name: stock.name,
      type: newAlert.type,
      value: newAlert.value ? parseFloat(newAlert.value) : undefined,
      enabled: true,
      createdAt: new Date().toISOString().split("T")[0],
    };

    setAlerts([alert, ...alerts]);
    setCreateDialogOpen(false);
    setNewAlert({ symbol: "", type: "price_above", value: "" });
  };

  const needsValue = (type: AlertType) => 
    ["price_above", "price_below", "percent_change"].includes(type);

  const AlertCard = ({ alert }: { alert: Alert }) => (
    <Card className={`transition-opacity ${!alert.enabled ? "opacity-60" : ""}`}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${
              alert.enabled ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
            }`}>
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
              <p className="text-sm text-muted-foreground">
                {alert.type === "price_above" && `Notify when price exceeds $${alert.value}`}
                {alert.type === "price_below" && `Notify when price drops below $${alert.value}`}
                {alert.type === "percent_change" && `Notify on ${alert.value}%+ daily change`}
                {alert.type === "recommendation_change" && "Notify when AI recommendation changes"}
                {alert.type === "news_sentiment" && "Notify on significant news sentiment shifts"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Switch
              checked={alert.enabled}
              onCheckedChange={() => handleToggleAlert(alert.id)}
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleDeleteAlert(alert.id)}
              className="text-muted-foreground hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Price Alerts</h1>
          <p className="text-muted-foreground">
            Get notified about price changes, AI recommendations, and market news
          </p>
        </div>

        {/* Actions Bar */}
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
                <DialogDescription>
                  Set up a new price or event alert for a stock
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Stock</Label>
                  <Select 
                    value={newAlert.symbol} 
                    onValueChange={(value) => setNewAlert({ ...newAlert, symbol: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a stock" />
                    </SelectTrigger>
                    <SelectContent>
                      {stocks.map(stock => (
                        <SelectItem key={stock.symbol} value={stock.symbol}>
                          {stock.symbol} - {stock.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
                      <SelectItem value="price_above">
                        <div className="flex items-center gap-2">
                          <TrendingUp className="h-4 w-4" />
                          Price Above
                        </div>
                      </SelectItem>
                      <SelectItem value="price_below">
                        <div className="flex items-center gap-2">
                          <TrendingDown className="h-4 w-4" />
                          Price Below
                        </div>
                      </SelectItem>
                      <SelectItem value="percent_change">
                        <div className="flex items-center gap-2">
                          <ArrowUpDown className="h-4 w-4" />
                          Percent Change
                        </div>
                      </SelectItem>
                      <SelectItem value="recommendation_change">
                        <div className="flex items-center gap-2">
                          <Brain className="h-4 w-4" />
                          Recommendation Change
                        </div>
                      </SelectItem>
                      <SelectItem value="news_sentiment">
                        <div className="flex items-center gap-2">
                          <Newspaper className="h-4 w-4" />
                          News Sentiment
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {needsValue(newAlert.type) && (
                  <div className="space-y-2">
                    <Label>
                      {newAlert.type === "percent_change" ? "Percentage (%)" : "Price ($)"}
                    </Label>
                    <Input
                      type="number"
                      placeholder={newAlert.type === "percent_change" ? "e.g., 5" : "e.g., 200"}
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
                  onClick={handleCreateAlert}
                  disabled={!newAlert.symbol || (needsValue(newAlert.type) && !newAlert.value)}
                >
                  Create Alert
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-3 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Bell className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{alerts.length}</p>
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

        {/* Alerts List */}
        <Tabs defaultValue="active" className="space-y-4">
          <TabsList>
            <TabsTrigger value="active">Active ({activeAlerts.length})</TabsTrigger>
            <TabsTrigger value="paused">Paused ({inactiveAlerts.length})</TabsTrigger>
            <TabsTrigger value="all">All ({filteredAlerts.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="space-y-3">
            {activeAlerts.length > 0 ? (
              activeAlerts.map(alert => <AlertCard key={alert.id} alert={alert} />)
            ) : (
              <Card className="py-12">
                <CardContent className="flex flex-col items-center justify-center text-center">
                  <Bell className="mb-4 h-12 w-12 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">No active alerts</h3>
                  <p className="text-muted-foreground mb-4">
                    Create an alert to get notified about price changes
                  </p>
                  <Button onClick={() => setCreateDialogOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Alert
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="paused" className="space-y-3">
            {inactiveAlerts.length > 0 ? (
              inactiveAlerts.map(alert => <AlertCard key={alert.id} alert={alert} />)
            ) : (
              <Card className="py-12">
                <CardContent className="flex flex-col items-center justify-center text-center">
                  <ToggleLeft className="mb-4 h-12 w-12 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">No paused alerts</h3>
                  <p className="text-muted-foreground">
                    All your alerts are currently active
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="all" className="space-y-3">
            {filteredAlerts.length > 0 ? (
              filteredAlerts.map(alert => <AlertCard key={alert.id} alert={alert} />)
            ) : (
              <Card className="py-12">
                <CardContent className="flex flex-col items-center justify-center text-center">
                  <Bell className="mb-4 h-12 w-12 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">No alerts found</h3>
                  <p className="text-muted-foreground mb-4">
                    {searchQuery ? "Try a different search term" : "Create your first alert"}
                  </p>
                  {!searchQuery && (
                    <Button onClick={() => setCreateDialogOpen(true)}>
                      <Plus className="mr-2 h-4 w-4" />
                      Create Alert
                    </Button>
                  )}
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  );
};

export default Alerts;
