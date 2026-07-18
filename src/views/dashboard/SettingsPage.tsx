"use client";

import { useEffect, useState } from "react";
import { User, Shield, Palette, LogOut, SlidersHorizontal, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { useTheme } from "next-themes";
import { useAuth } from "@/lib/auth/auth-context";
import { preferencesApi } from "@/lib/api/endpoints";
import type { Preferences, RiskTolerance, TimeHorizon } from "@/lib/api/types";

export default function SettingsPage() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const { setTheme } = useTheme();
  const qc = useQueryClient();

  const initials =
    `${user?.firstName?.[0] ?? ""}${user?.lastName?.[0] ?? ""}`.toUpperCase() ||
    user?.email.slice(0, 2).toUpperCase() ||
    "U";

  const prefsQuery = useQuery({
    queryKey: ["preferences"],
    queryFn: () => preferencesApi.getUser(),
    enabled: !!user,
  });

  const [horizon, setHorizon] = useState<TimeHorizon>("medium");
  const [risk, setRisk] = useState<RiskTolerance>("medium");

  useEffect(() => {
    if (prefsQuery.data) {
      setHorizon(prefsQuery.data.time_horizon);
      setRisk(prefsQuery.data.risk_tolerance);
    }
  }, [prefsQuery.data]);

  const updatePrefs = useMutation({
    mutationFn: (input: Partial<Preferences>) => preferencesApi.updateUser(input),
    onSuccess: (data) => {
      qc.setQueryData(["preferences"], data);
      toast.success("Preferences saved");
    },
    onError: () => toast.error("Could not save preferences"),
  });

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Manage your account and preferences.</p>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-3 max-w-md">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Profile Information
              </CardTitle>
              <CardDescription>Your account details.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-6">
                <Avatar className="h-20 w-20">
                  <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                    {initials}
                  </AvatarFallback>
                </Avatar>
              </div>
              <Separator />
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>First Name</Label>
                  <Input value={user?.firstName ?? ""} readOnly />
                </div>
                <div className="space-y-2">
                  <Label>Last Name</Label>
                  <Input value={user?.lastName ?? ""} readOnly />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input type="email" value={user?.email ?? ""} readOnly />
                </div>
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Input value={user?.isVerified ? "Verified" : "Unverified"} readOnly />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Account
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Button variant="destructive" className="gap-2" onClick={handleLogout}>
                <LogOut className="h-4 w-4" />
                Sign Out
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preferences" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <SlidersHorizontal className="h-5 w-5" />
                Analysis Preferences
              </CardTitle>
              <CardDescription>
                These tune how AI recommendations are mapped for you.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {prefsQuery.isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
              ) : (
                <div className="grid md:grid-cols-2 gap-4 max-w-lg">
                  <div className="space-y-2">
                    <Label>Time Horizon</Label>
                    <Select value={horizon} onValueChange={(v: TimeHorizon) => setHorizon(v)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="short">Short term</SelectItem>
                        <SelectItem value="medium">Medium term</SelectItem>
                        <SelectItem value="long">Long term</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Risk Tolerance</Label>
                    <Select value={risk} onValueChange={(v: RiskTolerance) => setRisk(v)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}
              <Button
                onClick={() =>
                  updatePrefs.mutate({ time_horizon: horizon, risk_tolerance: risk })
                }
                disabled={updatePrefs.isPending}
              >
                {updatePrefs.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save Preferences"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Appearance
              </CardTitle>
              <CardDescription>Customize how the app looks.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <p className="font-medium mb-3">Theme</p>
                <div className="grid grid-cols-3 gap-4 max-w-md">
                  <Button variant="outline" className="h-20 flex-col gap-2" onClick={() => setTheme("light")}>
                    <div className="h-6 w-6 rounded-full bg-background border" />
                    Light
                  </Button>
                  <Button variant="outline" className="h-20 flex-col gap-2" onClick={() => setTheme("dark")}>
                    <div className="h-6 w-6 rounded-full bg-foreground" />
                    Dark
                  </Button>
                  <Button variant="outline" className="h-20 flex-col gap-2" onClick={() => setTheme("system")}>
                    <div className="h-6 w-6 rounded-full bg-gradient-to-br from-background to-foreground" />
                    System
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
