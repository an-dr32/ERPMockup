"use client";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import {
  RiPaletteLine,
  RiSaveLine,
  RiDownloadLine,
  RiUploadLine,
  RiRefreshLine
} from "react-icons/ri";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

interface ThemeModalProps {
  isOpen: boolean;
  onClose: () => void;
}


const presetThemes = {
  corporate: {
    name: "Corporate Blue",
    light: {
      primary: "#2563eb",
      secondary: "#64748b",
      background: "#ffffff",
      text: "#000000",
      card: "#f8fafc"
    },
    dark: {
      primary: "#2563eb",
      secondary: "#64748b",
      background: "#0f172a",
      text: "#f1f5f9",
      card: "#1e293b"
    }
  },
  nature: {
    name: "Nature Green",
    light: {
      primary: "#059669",
      secondary: "#64748b",
      background: "#ffffff",
      text: "#000000",
      card: "#f8fafc"
    },
    dark: {
      primary: "#059669",
      secondary: "#64748b",
      background: "#0f172a",
      text: "#f1f5f9",
      card: "#1e293b"
    }
  },
  sunset: {
    name: "Sunset Orange",
    light: {
      primary: "#ea580c",
      secondary: "#78716c",
      background: "#ffffff",
      text: "#000000",
      card: "#fff7ed"
    },
    dark: {
      primary: "#ea580c",
      secondary: "#64748b",
      background: "#0f172a",
      text: "#f1f5f9",
      card: "#1e293b"
    }
  },
  ocean: {
    name: "Ocean Teal",
    light: {
      primary: "#0891b2",
      secondary: "#6b7280",
      background: "#ffffff",
      text: "#000000",
      card: "#ecfeff"
    },
    dark: {
      primary: "#0891b2",
      secondary: "#6b7280",
      background: "#0f172a",
      text: "#f1f5f9",
      card: "#1e293b"
    }
  },
  royal: {
    name: "Royal Purple",
    light: {
      primary: "#7c3aed",
      secondary: "#6b7280",
      background: "#ffffff",
      text: "#000000",
      card: "#faf5ff"
    },
    dark: {
      primary: "#7c3aed",
      secondary: "#6b7280",
      background: "#0f172a",
      text: "#f1f5f9",
      card: "#1e293b"
    }
  },
};



export default function ThemeModal({ isOpen, onClose }: ThemeModalProps) {
  const { resolvedTheme } = useTheme();
  const [selectedMode, setSelectedMode] = useState<"light" | "dark">("light");
  const [customTheme, setCustomTheme] = useState({
    primary: "#F99D2A",
    secondary: "#64748b",
    background: "#ffffff",
    text: "#000000",
    card: "#ffffff"
  });
  const [darkTheme, setDarkTheme] = useState({
    primary: "#F99D2A",
    secondary: "#475569",
    background: "#0f172a",
    text: "#f1f5f9",
    card: "#1e293b"
  });
  const [savedThemes, setSavedThemes] = useState<any[]>([]);
  const { toast } = useToast();

  console.log("ThemeModal rendered", { isOpen, selectedMode });

  useEffect(() => {
    if (!isOpen) return;

    if (typeof window !== "undefined") {
      // Safe to use localStorage here
      const themes = localStorage.getItem("savedThemes");
      if (themes) setSavedThemes(JSON.parse(themes));

      const currentLight = localStorage.getItem("customLightTheme");
      const currentDark = localStorage.getItem("customDarkTheme");
      if (currentLight) setCustomTheme(JSON.parse(currentLight));
      if (currentDark) setDarkTheme(JSON.parse(currentDark));
    }
  }, [isOpen]);

  useEffect(() => {
    // Always apply light theme to :root
    const root = document.documentElement;
    root.style.setProperty("--primary", hexToHSL(customTheme.primary));
    root.style.setProperty("--secondary", hexToHSL(customTheme.secondary));
    root.style.setProperty("--background", hexToHSL(customTheme.background));
    root.style.setProperty("--foreground", hexToHSL(customTheme.text));
    root.style.setProperty("--card", hexToHSL(customTheme.card));

    // Always apply dark theme to .dark
    const darkRoot = document.querySelector("html.dark") as HTMLElement;
    if (darkRoot) {
      darkRoot.style.setProperty("--primary", hexToHSL(darkTheme.primary));
      darkRoot.style.setProperty("--secondary", hexToHSL(darkTheme.secondary));
      darkRoot.style.setProperty("--background", hexToHSL(darkTheme.background));
      darkRoot.style.setProperty("--foreground", hexToHSL(darkTheme.text));
      darkRoot.style.setProperty("--card", hexToHSL(darkTheme.card));
    }

    // When switching themes, also reset the unused variables to prevent "ghost" values
    if (resolvedTheme === "dark") {
      // Optionally, set light variables to match dark (or to blank/default)
      root.style.setProperty("--primary", hexToHSL(darkTheme.primary));
      root.style.setProperty("--secondary", hexToHSL(darkTheme.secondary));
      root.style.setProperty("--background", hexToHSL(darkTheme.background));
      root.style.setProperty("--foreground", hexToHSL(darkTheme.text));
      root.style.setProperty("--card", hexToHSL(darkTheme.card));
    } else {
      // Optionally, set dark variables to match light (or to blank/default)
      if (darkRoot) {
        darkRoot.style.setProperty("--primary", hexToHSL(customTheme.primary));
        darkRoot.style.setProperty("--secondary", hexToHSL(customTheme.secondary));
        darkRoot.style.setProperty("--background", hexToHSL(customTheme.background));
        darkRoot.style.setProperty("--foreground", hexToHSL(customTheme.text));
        darkRoot.style.setProperty("--card", hexToHSL(customTheme.card));
      }
    }
  }, [customTheme, darkTheme, resolvedTheme]);


  const currentTheme = selectedMode === "light" ? customTheme : darkTheme;
  const setCurrentTheme = selectedMode === "light" ? setCustomTheme : setDarkTheme;

  const handleColorChange = (colorKey: string, value: string) => {
    setCurrentTheme(prev => ({
      ...prev,
      [colorKey]: value
    }));
  };

  const applyPreset = (preset: any) => {
    if (preset.light && preset.dark) {
      setCustomTheme(preset.light);
      setDarkTheme(preset.dark);
    } else {
      // fallback: apply to both
      setCustomTheme(preset);
      setDarkTheme(preset);
    }

    toast({
      title: "Preset Applied",
      description: `${preset.name} theme has been applied to both modes`,
    });
  };

  // Place this in your theme-modal.tsx or a shared util file

  function applyThemeVars(theme: Record<string, string>, selector: HTMLElement = document.documentElement) {
    Object.entries(theme).forEach(([key, value]) => {
      // Only update keys that exist in your CSS
      selector.style.setProperty(`--${key}`, value);
    });
  }
  function hexToHSL(hex: string): string {
    let r = 0, g = 0, b = 0;
    if (hex.length === 4) {
      r = parseInt(hex[1] + hex[1], 16);
      g = parseInt(hex[2] + hex[2], 16);
      b = parseInt(hex[3] + hex[3], 16);
    } else if (hex.length === 7) {
      r = parseInt(hex[1] + hex[2], 16);
      g = parseInt(hex[3] + hex[4], 16);
      b = parseInt(hex[5] + hex[6], 16);
    }
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;
    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }
    return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
  }

  // Example usage in your modal when applying a theme:
  const handleApplyTheme = () => {
    // Save to localStorage if needed
    localStorage.setItem("customLightTheme", JSON.stringify(customTheme));
    localStorage.setItem("customDarkTheme", JSON.stringify(darkTheme));

    // Apply to :root (light mode)
    applyThemeVars(customTheme);

    // Apply to .dark (dark mode)
    const darkRoot = document.querySelector("html.dark") as HTMLElement;
    if (darkRoot) {
      applyThemeVars(darkTheme, darkRoot);
    }

    toast({
      title: "Theme Applied",
      description: "Your custom theme has been applied successfully",
    });

    onClose();
  };

  const saveCustomTheme = () => {
    const themeName = prompt("Enter a name for this theme:");
    if (!themeName) return;

    const newTheme = {
      id: Date.now(),
      name: themeName,
      light: customTheme,
      dark: darkTheme
    };

    const updated = [...savedThemes, newTheme];
    setSavedThemes(updated);
    localStorage.setItem("savedThemes", JSON.stringify(updated));

    toast({
      title: "Theme Saved",
      description: `"${themeName}" has been saved to your custom themes`,
    });
  };

  const exportTheme = () => {
    const themeData = {
      name: "Custom Theme",
      light: customTheme,
      dark: darkTheme,
      exported: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(themeData, null, 2)], {
      type: "application/json"
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "custom-theme.json";
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: "Theme Exported",
      description: "Theme has been downloaded as JSON file",
    });
  };

  const importTheme = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const themeData = JSON.parse(e.target?.result as string);
        if (themeData.light && themeData.dark) {
          setCustomTheme(themeData.light);
          setDarkTheme(themeData.dark);
          toast({
            title: "Theme Imported",
            description: "Theme has been successfully imported",
          });
        }
      } catch (error) {
        toast({
          title: "Import Error",
          description: "Invalid theme file format",
          variant: "destructive",
        });
      }
    };
    reader.readAsText(file);
  };

  const resetToDefault = () => {
    setCustomTheme({
      primary: "#F99D2A",
      secondary: "#64748b",
      background: "#ffffff",
      text: "#000000",
      card: "#ffffff"
    });
    setDarkTheme({
      primary: "#F99D2A",
      secondary: "#475569",
      background: "#0f172a",
      text: "#f1f5f9",
      card: "#1e293b"
    });

    toast({
      title: "Reset Complete",
      description: "Theme has been reset to default",
    });
  };

  const handleSave = () => {
    localStorage.setItem("customLightTheme", JSON.stringify(customTheme));
    localStorage.setItem("customDarkTheme", JSON.stringify(darkTheme));

    // Apply both themes
    const root = document.documentElement;
    root.style.setProperty("--primary", hexToHSL(customTheme.primary));
    root.style.setProperty("--secondary", hexToHSL(customTheme.secondary));
    root.style.setProperty("--background", hexToHSL(customTheme.background));
    root.style.setProperty("--foreground", hexToHSL(customTheme.text));
    root.style.setProperty("--card", hexToHSL(customTheme.card));

    const darkRoot = document.querySelector("html.dark") as HTMLElement;
    if (darkRoot) {
      darkRoot.style.setProperty("--primary", hexToHSL(darkTheme.primary));
      darkRoot.style.setProperty("--secondary", hexToHSL(darkTheme.secondary));
      darkRoot.style.setProperty("--background", hexToHSL(darkTheme.background));
      darkRoot.style.setProperty("--foreground", hexToHSL(darkTheme.text));
      darkRoot.style.setProperty("--card", hexToHSL(darkTheme.card));
    }

    toast({
      title: "Theme Applied",
      description: "Your custom theme has been applied successfully",
    });

    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <RiPaletteLine className="mr-2 h-5 w-5" />
            Theme Customization
          </DialogTitle>
          <DialogDescription>
            Customize your theme colors and save your own presets.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="customize" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="customize">Customize</TabsTrigger>
            <TabsTrigger value="presets">Presets</TabsTrigger>
            <TabsTrigger value="manage">Manage</TabsTrigger>
          </TabsList>

          <TabsContent value="customize" className="space-y-4">
            <div className="flex items-center space-x-4 mb-4">
              <Label>Theme Mode:</Label>
              <Select value={selectedMode} onValueChange={(value: "light" | "dark") => setSelectedMode(value)}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-3">
                <div>
                  <Label htmlFor="primary">Primary Color</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="primary"
                      type="color"
                      value={currentTheme.primary}
                      onChange={(e) => handleColorChange("primary", e.target.value)}
                      className="w-16 h-10 p-0 border-0"
                    />
                    <Input
                      value={currentTheme.primary}
                      onChange={(e) => handleColorChange("primary", e.target.value)}
                      placeholder="#F99D2A"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="secondary">Secondary Color</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="secondary"
                      type="color"
                      value={currentTheme.secondary}
                      onChange={(e) => handleColorChange("secondary", e.target.value)}
                      className="w-16 h-10 p-0 border-0"
                    />
                    <Input
                      value={currentTheme.secondary}
                      onChange={(e) => handleColorChange("secondary", e.target.value)}
                      placeholder="#64748b"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="background">Background Color</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="background"
                      type="color"
                      value={currentTheme.background}
                      onChange={(e) => handleColorChange("background", e.target.value)}
                      className="w-16 h-10 p-0 border-0"
                    />
                    <Input
                      value={currentTheme.background}
                      onChange={(e) => handleColorChange("background", e.target.value)}
                      placeholder="#ffffff"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <Label htmlFor="text">Text Color</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="text"
                      type="color"
                      value={currentTheme.text}
                      onChange={(e) => handleColorChange("text", e.target.value)}
                      className="w-16 h-10 p-0 border-0"
                    />
                    <Input
                      value={currentTheme.text}
                      onChange={(e) => handleColorChange("text", e.target.value)}
                      placeholder="#000000"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="card">Card Color</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="card"
                      type="color"
                      value={currentTheme.card}
                      onChange={(e) => handleColorChange("card", e.target.value)}
                      className="w-16 h-10 p-0 border-0"
                    />
                    <Input
                      value={currentTheme.card}
                      onChange={(e) => handleColorChange("card", e.target.value)}
                      placeholder="#ffffff"
                    />
                  </div>
                </div>

                <div className="pt-4">
                  <Label>Preview</Label>
                  <div
                    className="mt-2 p-4 rounded border"
                    style={{
                      backgroundColor: currentTheme.background,
                      color: currentTheme.text,
                      border: `1px solid ${currentTheme.secondary}`
                    }}
                  >
                    <div
                      className="p-3 rounded mb-2"
                      style={{ backgroundColor: currentTheme.card }}
                    >
                      <span style={{ color: currentTheme.primary }}>■</span> Sample Card
                    </div>
                    <Button
                      style={{
                        backgroundColor: currentTheme.primary,
                        color: "#ffffff"
                      }}
                      size="sm"
                    >
                      Sample Button
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="presets" className="space-y-4">
            <div className="grid grid-cols-1 gap-3">
              {Object.entries(presetThemes).map(([key, preset]) => (
                <div
                  key={key}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 cursor-pointer"
                  onClick={() => applyPreset(preset)}
                >
                  <div className="flex items-center space-x-3">
                    <div className="flex space-x-1">
                      <div
                        className="w-4 h-4 rounded-full border"
                        style={{ backgroundColor: preset.light.primary }}
                      />
                      <div
                        className="w-4 h-4 rounded-full border"
                        style={{ backgroundColor: preset.light.secondary }}
                      />
                      <div
                        className="w-4 h-4 rounded-full border"
                        style={{ backgroundColor: preset.light.background }}
                      />
                    </div>
                    <span className="font-medium">{preset.name}</span>
                  </div>
                  <Badge variant="outline">Apply</Badge>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="manage" className="space-y-4">
            <div className="space-y-4">
              <div className="flex space-x-2">
                <Button onClick={saveCustomTheme} variant="outline" size="sm">
                  <RiSaveLine className="mr-2 h-4 w-4" />
                  Save Current
                </Button>
                <Button onClick={exportTheme} variant="outline" size="sm">
                  <RiDownloadLine className="mr-2 h-4 w-4" />
                  Export
                </Button>
                <label className="inline-block">
                  <Button variant="outline" size="sm" asChild>
                    <span>
                      <RiUploadLine className="mr-2 h-4 w-4" />
                      Import
                    </span>
                  </Button>
                  <input
                    type="file"
                    accept=".json"
                    onChange={importTheme}
                    className="hidden"
                  />
                </label>
                <Button onClick={resetToDefault} variant="outline" size="sm">
                  <RiRefreshLine className="mr-2 h-4 w-4" />
                  Reset
                </Button>
              </div>

              <Separator />

              <div>
                <Label className="text-base">Saved Themes</Label>
                <div className="mt-2 space-y-2">
                  {savedThemes.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No saved themes</p>
                  ) : (
                    savedThemes.map((theme) => (
                      <div
                        key={theme.id}
                        className="flex items-center justify-between p-2 border rounded"
                      >
                        <span>{theme.name}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setCustomTheme(theme.light);
                            setDarkTheme(theme.dark);
                            toast({
                              title: "Theme Loaded",
                              description: `"${theme.name}" has been loaded`,
                            });
                          }}
                        >
                          Load
                        </Button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} className="bg-erp-primary hover:bg-erp-primary-dark">
            <RiSaveLine className="mr-2 h-4 w-4" />
            Apply Theme
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}