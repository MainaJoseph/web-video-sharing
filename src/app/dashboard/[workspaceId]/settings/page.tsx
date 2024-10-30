"use client";

import { enableFirstView, getFirstView } from "@/actions/user";
import { DarkMode } from "@/components/theme/dark.mode";
import { LightMode } from "@/components/theme/light-mode";
import { SystemMode } from "@/components/theme/system-mode";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { Bell, CheckCircle2, Palette } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface ThemeOptionProps {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

const ThemeOption: React.FC<ThemeOptionProps> = ({
  active,
  onClick,
  children,
}) => (
  <div
    className={cn(
      "rounded-xl overflow-hidden cursor-pointer transition-all duration-200 hover:scale-105",
      "border-2 dark:bg-zinc-900",
      active
        ? "border-primary shadow-lg"
        : "border-border hover:border-primary/50"
    )}
    onClick={onClick}
  >
    {children}
  </div>
);

const SettingsPage: React.FC = () => {
  const [firstView, setFirstView] = useState<boolean | undefined>(undefined);
  const { setTheme, theme } = useTheme();

  useEffect(() => {
    if (firstView !== undefined) return;
    const fetchData = async () => {
      const response = await getFirstView();
      if (response.status === 200) setFirstView(response?.data);
    };
    fetchData();
  }, [firstView]);

  const switchState = async (checked: boolean) => {
    const view = await enableFirstView(checked);
    if (view) {
      toast(view.status === 200 ? "Success" : "Failed", {
        description: view.data,
      });
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 p-6 rounded-md dark:bg-zinc-800">
      <Card className="dark:bg-zinc-900 border dark:border-zinc-800">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Palette className="h-5 w-5 text-primary/80" />
            <CardTitle className="dark:text-zinc-200">
              Theme Preferences
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <ThemeOption
              active={theme === "system"}
              onClick={() => setTheme("system")}
            >
              <SystemMode />
              <div className="p-3 text-center font-medium dark:text-zinc-300">
                System
              </div>
            </ThemeOption>

            <ThemeOption
              active={theme === "light"}
              onClick={() => setTheme("light")}
            >
              <LightMode />
              <div className="p-3 text-center font-medium dark:text-zinc-300">
                Light
              </div>
            </ThemeOption>

            <ThemeOption
              active={theme === "dark"}
              onClick={() => setTheme("dark")}
            >
              <DarkMode />
              <div className="p-3 text-center font-medium dark:text-zinc-300">
                Dark
              </div>
            </ThemeOption>
          </div>
        </CardContent>
      </Card>

      <Card className="dark:bg-zinc-800 border dark:border-zinc-700">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-primary/80" />
            <CardTitle className="dark:text-zinc-200">
              Notification Preferences
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <h3 className="text-lg font-semibold dark:text-zinc-200">
              First View Notifications
            </h3>
            <p className="dark:text-zinc-400">
              Get notified when someone watches your video for the first time.
              Perfect for tracking client engagement.
            </p>
          </div>

          <div className="flex items-center justify-between">
            <Label className="cursor-pointer dark:text-zinc-300">
              Enable notifications
            </Label>
            <Switch
              onCheckedChange={switchState}
              disabled={firstView === undefined}
              checked={firstView}
              onClick={() => setFirstView(!firstView)}
              className="data-[state=checked]:bg-primary/80"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsPage;
