"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ThemeProvider } from "next-themes";
import Header from "@/components/dashboard/header";
import Sidebar from "@/components/dashboard/sidebar";
import DashboardWidgets from "@/components/dashboard/dashboard-widgets";
import DataTable from "@/components/dashboard/data-table";
import EditModal from "@/components/data-management/edit-modal";
import AddModal from "@/components/data-management/add-modal";
import { Toaster } from "@/components/ui/toaster";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";

export default function DashboardPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState("");
  const [activeItem, setActiveItem] = useState("dashboard");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [currentData, setCurrentData] = useState<any[]>([]);
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [pendingDeleteItem, setPendingDeleteItem] = useState<any>(null);
  const PASSWORD = "admin123"; // Replace with your logic

  console.log("DashboardPage rendered", { isAuthenticated, userName, activeItem });

  useEffect(() => {
    const checkAuth = () => {
      const auth = localStorage.getItem("isAuthenticated");
      const name = localStorage.getItem("userName");

      console.log("Auth check:", { auth, name });

      if (auth === "true" && name) {
        setIsAuthenticated(true);
        setUserName(name);
      } else {
        router.push("/auth/login");
      }
    };

    checkAuth();
  }, [router]);

  useEffect(() => {
    const data = getDataForScreen(activeItem);
    setCurrentData(data);
  }, [activeItem]);

  const getDataForScreen = (screen: string) => {
    const storageKey = `erp_data_${screen}`;
    const stored = localStorage.getItem(storageKey);

    if (stored) {
      return JSON.parse(stored);
    }

    // Default data
    const defaultData: Record<string, any[]> = {
      dashboard: [
        { id: 1, code: "ORD-001", description: "Premium Grain Order", status: "Active", value: "$1,249.00", date: "2024-01-15" },
        { id: 2, code: "ORD-002", description: "Organic Food Products", status: "Pending", value: "$892.50", date: "2024-01-14" },
        { id: 3, code: "ORD-003", description: "Energy Equipment", status: "Completed", value: "$3,450.00", date: "2024-01-13" },
      ],
      "admin-products": [
        { id: 1, code: "PRD-001", name: "Premium Wheat", category: "Grains", price: 25.50, stock: 1250, status: "Active" },
        { id: 2, code: "PRD-002", name: "Organic Corn", category: "Grains", price: 18.75, stock: 890, status: "Active" },
        { id: 3, code: "PRD-003", name: "Solar Panel 200W", category: "Energy", price: 299.99, stock: 45, status: "Low Stock" },
      ],
      "admin-users": [
        { id: 1, code: "USR-001", name: "John Doe", email: "john@company.com", role: "Admin", department: "IT", status: "Active" },
        { id: 2, code: "USR-002", name: "Jane Smith", email: "jane@company.com", role: "Manager", department: "Sales", status: "Active" },
        { id: 3, code: "USR-003", name: "Mike Johnson", email: "mike@company.com", role: "User", department: "Operations", status: "Inactive" },
      ],
      "admin-customers": [
        { id: 1, code: "CUS-001", name: "ABC Corp", contact: "John Smith", email: "contact@abccorp.com", phone: "+1-555-0123", country: "USA" },
        { id: 2, code: "CUS-002", name: "XYZ Ltd", contact: "Jane Doe", email: "info@xyzltd.com", phone: "+1-555-0456", country: "Canada" },
      ],
      "admin-vendors": [
        { id: 1, code: "VEN-001", name: "Farm Supply Co", contact: "Tom Anderson", email: "vendor@farmsupply.com", phone: "+1-555-0789", category: "Agriculture" },
        { id: 2, code: "VEN-002", name: "Tech Solutions Inc", contact: "Sarah Wilson", email: "sales@techsol.com", phone: "+1-555-0321", category: "Technology" },
      ],
      "admin-dimensions": [
        { id: 1, code: "DIM-001", name: "Weight", unit: "kg", description: "Product weight measurement" },
        { id: 2, code: "DIM-002", name: "Volume", unit: "L", description: "Product volume measurement" },
      ],
      "admin-company": [
        { id: 1, code: "COM-001", property: "Company Name", value: "Enterprise Corp", category: "Basic Info" },
        { id: 2, code: "COM-002", property: "Tax ID", value: "123-456-789", category: "Legal" },
        { id: 3, code: "COM-003", property: "Address", value: "123 Business St, City, ST 12345", category: "Contact" },
      ],
      agronomy: [
        { id: 1, code: "AGR-001", field: "North Field A", crop: "Wheat", area: "25.5 ha", plantingDate: "2024-03-15", expectedHarvest: "2024-08-20" },
        { id: 2, code: "AGR-002", field: "South Field B", crop: "Corn", area: "18.2 ha", plantingDate: "2024-04-01", expectedHarvest: "2024-09-15" },
      ],
      energy: [
        { id: 1, code: "ENR-001", source: "Solar Panel Array A", capacity: "500 kW", efficiency: "92%", status: "Operational", maintenance: "2024-06-15" },
        { id: 2, code: "ENR-002", source: "Wind Turbine B", capacity: "750 kW", efficiency: "88%", status: "Operational", maintenance: "2024-07-20" },
      ],
      "food-products": [
        { id: 1, code: "FPR-001", product: "Whole Wheat Flour", batch: "WF240601", quantity: "2500 kg", productionDate: "2024-06-01", expiryDate: "2024-12-01" },
        { id: 2, code: "FPR-002", product: "Corn Meal", batch: "CM240515", quantity: "1800 kg", productionDate: "2024-05-15", expiryDate: "2024-11-15" },
      ],
      grains: [
        { id: 1, code: "GRN-001", type: "Hard Red Wheat", quality: "Premium", moisture: "12.5%", protein: "14.2%", storage: "Silo A", quantity: "5000 tons" },
        { id: 2, code: "GRN-002", type: "Yellow Corn", quality: "Standard", moisture: "15.0%", protein: "8.8%", storage: "Silo B", quantity: "3200 tons" },
      ],
      operations: [
        { id: 1, code: "OPR-001", operation: "Field Irrigation", location: "North Field A", startTime: "06:00", duration: "3 hours", status: "Completed", operator: "John Doe" },
        { id: 2, code: "OPR-002", operation: "Equipment Maintenance", location: "Workshop", startTime: "08:00", duration: "5 hours", status: "In Progress", operator: "Mike Smith" },
      ],
    };

    const data = defaultData[screen] || [];
    localStorage.setItem(storageKey, JSON.stringify(data));
    return data;
  };

  const saveDataForScreen = (screen: string, data: any[]) => {
    const storageKey = `erp_data_${screen}`;
    localStorage.setItem(storageKey, JSON.stringify(data));
    setCurrentData(data);
  };

  const getColumns = (activeItem: string) => {
    const commonColumns = {
      dashboard: [
        { key: "code", label: "Code" },
        { key: "description", label: "Description" },
        {
          key: "status",
          label: "Status",
          render: (value: string) => (
            <Badge variant={value === "Active" ? "default" : value === "Pending" ? "secondary" : "outline"}>
              {value}
            </Badge>
          )
        },
        {
          key: "value",
          label: "Value",
          render: (value: string | number) => {
            // Remove any existing $ and commas, parse as float
            const num = typeof value === "string"
              ? parseFloat(value.replace(/[^0-9.]/g, ""))
              : value;
            // Only format if it's a valid number
            return typeof num === "number" && !isNaN(num)
              ? `$${num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
              : value;
          }
        },
        { key: "date", label: "Date" },
      ],
      "admin-products": [
        { key: "code", label: "Code" },
        { key: "name", label: "Product Name" },
        { key: "category", label: "Category" },
        {
          key: "price",
          label: "Price",
          render: (value: string | number) => formatValueWithDollar(value)
        }, { key: "stock", label: "Stock" },
        {
          key: "status",
          label: "Status",
          render: (value: string) => (
            <Badge variant={value === "Active" ? "default" : "destructive"}>
              {value}
            </Badge>
          )
        },
      ],
      "admin-users": [
        { key: "code", label: "Code" },
        { key: "name", label: "Name" },
        { key: "email", label: "Email" },
        { key: "role", label: "Role" },
        { key: "department", label: "Department" },
        {
          key: "status",
          label: "Status",
          render: (value: string) => (
            <Badge variant={value === "Active" ? "default" : "secondary"}>
              {value}
            </Badge>
          )
        },
      ],
      "admin-customers": [
        { key: "code", label: "Code" },
        { key: "name", label: "Company Name" },
        { key: "contact", label: "Contact" },
        { key: "email", label: "Email" },
        { key: "phone", label: "Phone" },
        { key: "country", label: "Country" },
      ],
      "admin-vendors": [
        { key: "code", label: "Code" },
        { key: "name", label: "Vendor Name" },
        { key: "contact", label: "Contact" },
        { key: "email", label: "Email" },
        { key: "phone", label: "Phone" },
        { key: "category", label: "Category" },
      ],
      "admin-dimensions": [
        { key: "code", label: "Code" },
        { key: "name", label: "Name" },
        { key: "unit", label: "Unit" },
        { key: "description", label: "Description" },
      ],
      "admin-company": [
        { key: "code", label: "Code" },
        { key: "property", label: "Property" },
        { key: "value", label: "Value" },
        { key: "category", label: "Category" },
      ],
      agronomy: [
        { key: "code", label: "Code" },
        { key: "field", label: "Field" },
        { key: "crop", label: "Crop" },
        { key: "area", label: "Area" },
        { key: "plantingDate", label: "Planting Date" },
        { key: "expectedHarvest", label: "Expected Harvest" },
      ],
      energy: [
        { key: "code", label: "Code" },
        { key: "source", label: "Source" },
        { key: "capacity", label: "Capacity" },
        { key: "efficiency", label: "Efficiency" },
        { key: "status", label: "Status" },
        { key: "maintenance", label: "Next Maintenance" },
      ],
      "food-products": [
        { key: "code", label: "Code" },
        { key: "product", label: "Product" },
        { key: "batch", label: "Batch" },
        { key: "quantity", label: "Quantity" },
        { key: "productionDate", label: "Production Date" },
        { key: "expiryDate", label: "Expiry Date" },
      ],
      grains: [
        { key: "code", label: "Code" },
        { key: "type", label: "Type" },
        { key: "quality", label: "Quality" },
        { key: "moisture", label: "Moisture" },
        { key: "protein", label: "Protein" },
        { key: "storage", label: "Storage" },
        { key: "quantity", label: "Quantity" },
      ],
      operations: [
        { key: "code", label: "Code" },
        { key: "operation", label: "Operation" },
        { key: "location", label: "Location" },
        { key: "startTime", label: "Start Time" },
        { key: "duration", label: "Duration" },
        { key: "status", label: "Status" },
        { key: "operator", label: "Operator" },
      ],
    };

    return commonColumns[activeItem as keyof typeof commonColumns] || [
      { key: "code", label: "Code" },
      { key: "name", label: "Name" },
      { key: "status", label: "Status" },
    ];
  };

  const getFieldsForScreen = (screen: string) => {
    const fieldsMap: Record<string, any[]> = {
      dashboard: [
        { key: "code", label: "Order Code", type: "text", required: true },
        { key: "description", label: "Description", type: "text", required: true },
        { key: "status", label: "Status", type: "select", options: ["Active", "Pending", "Completed"], required: true },
        { key: "value", label: "Value", type: "text", required: true },
        { key: "date", label: "Date", type: "date", required: true },
      ],
      "admin-products": [
        { key: "code", label: "Code", type: "text", required: true },
        { key: "name", label: "Product Name", type: "text", required: true },
        { key: "category", label: "Category", type: "select", options: ["Grains", "Energy", "Equipment", "Seeds"], required: true },
        { key: "price", label: "Price", type: "number", required: true },
        { key: "stock", label: "Stock", type: "number", required: true },
        { key: "status", label: "Status", type: "select", options: ["Active", "Inactive", "Low Stock"], required: true },
      ],
      "admin-users": [
        { key: "code", label: "Code", type: "text", required: true },
        { key: "name", label: "Full Name", type: "text", required: true },
        { key: "email", label: "Email", type: "email", required: true },
        { key: "role", label: "Role", type: "select", options: ["Admin", "Manager", "User", "Supervisor"], required: true },
        { key: "department", label: "Department", type: "select", options: ["IT", "Sales", "Operations", "Finance", "HR"], required: true },
        { key: "status", label: "Status", type: "select", options: ["Active", "Inactive"], required: true },
      ],
      "admin-customers": [
        { key: "code", label: "Code", type: "text", required: true },
        { key: "name", label: "Company Name", type: "text", required: true },
        { key: "contact", label: "Contact Person", type: "text", required: true },
        { key: "email", label: "Email", type: "email", required: true },
        { key: "phone", label: "Phone", type: "text", required: true },
        { key: "country", label: "Country", type: "text", required: true },
      ],
      "admin-vendors": [
        { key: "code", label: "Code", type: "text", required: true },
        { key: "name", label: "Vendor Name", type: "text", required: true },
        { key: "contact", label: "Contact Person", type: "text", required: true },
        { key: "email", label: "Email", type: "email", required: true },
        { key: "phone", label: "Phone", type: "text", required: true },
        { key: "category", label: "Category", type: "select", options: ["Agriculture", "Technology", "Equipment", "Services"], required: true },
      ],
      "admin-dimensions": [
        { key: "code", label: "Code", type: "text", required: true },
        { key: "name", label: "Dimension Name", type: "text", required: true },
        { key: "unit", label: "Unit", type: "text", required: true },
        { key: "description", label: "Description", type: "textarea", required: false },
      ],
      "admin-company": [
        { key: "code", label: "Code", type: "text", required: true },
        { key: "property", label: "Property", type: "text", required: true },
        { key: "value", label: "Value", type: "text", required: true },
        { key: "category", label: "Category", type: "select", options: ["Basic Info", "Contact", "Legal", "Financial"], required: true },
      ],
    };

    return fieldsMap[screen] || [];
  };

  const handleSidebarToggle = () => {
    console.log("Sidebar toggle");
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const handleItemSelect = (item: string) => {
    console.log("Item selected:", item);
    setActiveItem(item);
  };

  const handleEdit = (item: any) => {
    console.log("Edit item:", item);
    setSelectedItem(item);
    setEditModalOpen(true);
  };

  const handleDelete = (item: any) => {
    setPendingDeleteItem(item);
    setPasswordModalOpen(true);
  };

  const confirmDelete = () => {
    if (passwordInput === PASSWORD) {
      const updatedData = currentData.filter(d => d.id !== pendingDeleteItem.id);
      saveDataForScreen(activeItem, updatedData);
      setPasswordModalOpen(false);
      setPasswordInput("");
      setPendingDeleteItem(null);
    } else {
      alert("Incorrect password");
    }
  };

  const handleAdd = () => {
    console.log("Add new item");
    setAddModalOpen(true);
  };

  const formatValueWithDollar = (value: string | number) => {
    const num = typeof value === "string"
      ? parseFloat(value.replace(/[^0-9.]/g, ""))
      : value;
    return typeof num === "number" && !isNaN(num)
      ? `$${num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
      : value;
  };

  const handleSaveAdd = (newItem: any) => {
    // Format monetary fields for each module
    if (activeItem === "dashboard" && newItem.value) {
      newItem.value = formatValueWithDollar(newItem.value);
    }
    if (activeItem === "admin-products" && newItem.price) {
      newItem.price = formatValueWithDollar(newItem.price);
    }
    // Repeat for other modules/fields as needed...
    const updatedData = [...currentData, newItem];
    saveDataForScreen(activeItem, updatedData);
  };

  const handleSaveEdit = (updatedItem: any) => {
    if (activeItem === "dashboard" && updatedItem.value) {
      updatedItem.value = formatValueWithDollar(updatedItem.value);
    }
    if (activeItem === "admin-products" && updatedItem.price) {
      updatedItem.price = formatValueWithDollar(updatedItem.price);
    }
    // Repeat for other modules/fields as needed...
    const updatedData = currentData.map(item =>
      item.id === updatedItem.id ? updatedItem : item
    );
    saveDataForScreen(activeItem, updatedData);
  };

  const getTableTitle = (item: string) => {
    const titles: Record<string, string> = {
      dashboard: "Recent Orders",
      "admin-products": "Products Management",
      "admin-users": "Users Management",
      "admin-customers": "Customers Management",
      "admin-vendors": "Vendors Management",
      "admin-dimensions": "Dimensions Management",
      "admin-company": "Company Information",
      agronomy: "Agronomy Data",
      energy: "Energy Systems",
      "food-products": "Food Products",
      grains: "Grains Inventory",
      operations: "Operations Management",
    };
    return titles[item] || "Data Management";
  };

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-erp-primary"></div>
      </div>
    );
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <div className="flex h-screen pt-14 bg-background">
        <Sidebar
          isCollapsed={isSidebarCollapsed}
          activeItem={activeItem}
          onItemSelect={handleItemSelect}
        />

        <div className="flex-1 flex flex-col">
          <Header
            onToggleSidebar={handleSidebarToggle}
            currentScreen={activeItem}
            userName={userName}
          />

          <main className="flex-1 overflow-auto p-6 erp-dashboard">
            {activeItem === "dashboard" && (
              <div className="space-y-6">
                <DashboardWidgets />
                <DataTable
                  title={getTableTitle(activeItem)}
                  data={currentData}
                  columns={getColumns(activeItem)}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onAdd={handleAdd}
                />
              </div>
            )}

            {activeItem !== "dashboard" && (
              <DataTable
                title={getTableTitle(activeItem)}
                data={currentData}
                columns={getColumns(activeItem)}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onAdd={handleAdd}
              />
            )}
          </main>
        </div>

        <AlertDialog open={passwordModalOpen} onOpenChange={setPasswordModalOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
              <AlertDialogDescription>
                Enter your password to confirm deletion:
              </AlertDialogDescription>
            </AlertDialogHeader>
            <Input
              type="password"
              value={passwordInput}
              onChange={e => setPasswordInput(e.target.value)}
              placeholder="Password"
              className="mt-2"
              autoFocus
            />
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setPasswordModalOpen(false)}>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                className="bg-destructive text-white hover:bg-destructive/90"
                onClick={confirmDelete}
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <EditModal
          isOpen={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          item={selectedItem}
          fields={getFieldsForScreen(activeItem)}
          onSave={handleSaveEdit}
          title={getTableTitle(activeItem)}
        />

        <AddModal
          isOpen={addModalOpen}
          onClose={() => setAddModalOpen(false)}
          fields={getFieldsForScreen(activeItem)}
          onAdd={handleSaveAdd}
          title={getTableTitle(activeItem)}
        />

        <Toaster />
      </div>
    </ThemeProvider>
  );
}