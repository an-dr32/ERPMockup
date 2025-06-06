"use client";

import { useState } from "react";
import { 
  RiDashboardLine, 
  RiSettingsLine, 
  RiPlantLine, 
  RiFlaskLine, 
  RiRestaurantLine,
  RiSeedlingLine,
  RiToolsLine,
  RiArrowDownSLine,
  RiArrowRightSLine,
  RiUserLine,
  RiGroupLine,
  RiShoppingCartLine,
  RiTruckLine,
  RiRulerLine,
  RiBuildingLine
} from "react-icons/ri";
import { cn } from "@/lib/utils";

interface SidebarProps {
  isCollapsed: boolean;
  activeItem: string;
  onItemSelect: (item: string) => void;
}

const menuItems = [
  { id: "dashboard", label: "Dashboard", icon: RiDashboardLine, href: "/dashboard" },
  { 
    id: "admin", 
    label: "Admin", 
    icon: RiSettingsLine, 
    hasSubmenu: true,
    submenu: [
      { id: "admin-products", label: "Products", icon: RiRestaurantLine },
      { id: "admin-users", label: "Users", icon: RiUserLine },
      { id: "admin-customers", label: "Customers", icon: RiGroupLine },
      { id: "admin-vendors", label: "Vendors", icon: RiTruckLine },
      { id: "admin-dimensions", label: "Dimensions", icon: RiRulerLine },
      { id: "admin-company", label: "Company Info", icon: RiBuildingLine },
    ]
  },
  { id: "agronomy", label: "Agronomy", icon: RiPlantLine },
  { id: "energy", label: "Energy", icon: RiFlaskLine },
  { id: "food-products", label: "Food Products", icon: RiRestaurantLine },
  { id: "grains", label: "Grains", icon: RiSeedlingLine },
  { id: "operations", label: "Operations", icon: RiToolsLine },
];

export default function Sidebar({ isCollapsed, activeItem, onItemSelect }: SidebarProps) {
  const [expandedSubmenu, setExpandedSubmenu] = useState<string | null>("admin");

  console.log("Sidebar rendered", { isCollapsed, activeItem, expandedSubmenu });

  const handleItemClick = (item: any) => {
    console.log("Sidebar item clicked:", item.id);
    
    if (item.hasSubmenu) {
      setExpandedSubmenu(expandedSubmenu === item.id ? null : item.id);
    } else {
      onItemSelect(item.id);
    }
  };

  const handleSubmenuClick = (submenuItem: any) => {
    console.log("Submenu item clicked:", submenuItem.id);
    onItemSelect(submenuItem.id);
  };

  return (
    <div className={cn(
      "erp-sidebar transition-all duration-300 flex flex-col border-r border-border",
      isCollapsed ? "w-16" : "w-64"
    )}>
      <div className="flex-1 py-4">
        <nav className="space-y-1 px-2">
          {menuItems.map((item) => (
            <div key={item.id}>
              <button
                onClick={() => handleItemClick(item)}
                className={cn(
                  "w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                  activeItem === item.id || activeItem.startsWith(item.id)
                    ? "bg-[hsl(var(--sidebar-active))] text-white"
                    : "text-[hsl(var(--sidebar-text))] hover:bg-muted hover:text-foreground"
                )}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                {!isCollapsed && (
                  <>
                    <span className="ml-3 flex-1 text-left">{item.label}</span>
                    {item.hasSubmenu && (
                      <div className="ml-2">
                        {expandedSubmenu === item.id ? (
                          <RiArrowDownSLine className="w-4 h-4" />
                        ) : (
                          <RiArrowRightSLine className="w-4 h-4" />
                        )}
                      </div>
                    )}
                  </>
                )}
              </button>

              {/* Submenu */}
              {item.hasSubmenu && expandedSubmenu === item.id && !isCollapsed && (
                <div className="mt-1 ml-4 space-y-1">
                  {item.submenu?.map((submenuItem) => (
                    <button
                      key={submenuItem.id}
                      onClick={() => handleSubmenuClick(submenuItem)}
                      className={cn(
                        "w-full flex items-center px-3 py-2 text-sm rounded-lg transition-colors",
                        activeItem === submenuItem.id
                          ? "bg-[hsl(var(--sidebar-active))] text-white"
                          : "text-[hsl(var(--sidebar-text))] hover:bg-muted hover:text-foreground"
                      )}
                    >
                      <submenuItem.icon className="w-4 h-4 flex-shrink-0" />
                      <span className="ml-3">{submenuItem.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
      </div>
    </div>
  );
}