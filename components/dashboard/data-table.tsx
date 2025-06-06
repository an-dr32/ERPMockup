"use client";

import { useState } from "react";
import { RiEditLine, RiDeleteBinLine, RiAddLine } from "react-icons/ri";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";

interface DataTableProps {
  title: string;
  data: any[];
  columns: Array<{
    key: string;
    label: string;
    render?: (value: any, row: any) => React.ReactNode;
  }>;
  onAdd?: () => void;
  onEdit?: (item: any) => void;
  onDelete?: (item: any) => void;
}

export default function DataTable({
  title,
  data,
  columns,
  onAdd,
  onEdit,
  onDelete
}: DataTableProps) {
  const { toast } = useToast();
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [search, setSearch] = useState("");

  // Filter data based on search
  const filteredData = data.filter((item) =>
    columns.some((column) =>
      String(item[column.key] ?? "")
        .toLowerCase()
        .includes(search.toLowerCase())
    )
  );

  console.log("DataTable rendered", { title, dataCount: data.length });

  const handleEdit = (item: any) => {
    console.log("Edit item:", item);
    if (onEdit) {
      onEdit(item);
    } else {
      toast({
        title: "Edit",
        description: `Edit functionality for ${item.code || item.id} will be implemented`,
      });
    }
  };

  const handleDelete = (item: any) => {
    console.log("Delete item:", item);
    if (onDelete) {
      onDelete(item);
    } else {
      toast({
        title: "Deleted",
        description: `Item ${item.code || item.id} has been deleted`,
      });
    }
    setSelectedItem(null);
  };

  const handleAdd = () => {
    console.log("Add new item");
    if (onAdd) {
      onAdd();
    } else {
      toast({
        title: "Add New",
        description: "Add new item functionality will be implemented",
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="border rounded px-3 py-1 text-sm"
          />
          <Button onClick={handleAdd} className="bg-erp-primary hover:bg-erp-primary-dark">
            <RiAddLine className="mr-2 h-4 w-4" />
            Add New
          </Button>
        </div>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead key={column.key} className="font-semibold">
                  {column.label}
                </TableHead>
              ))}
              <TableHead className="w-24 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length + 1}
                  className="text-center py-8 text-muted-foreground"
                >
                  No data available
                </TableCell>
              </TableRow>
            ) : (
              filteredData.map((item, index) => (

                <TableRow key={item.id || index} className="hover:bg-muted/50">
                  {columns.map((column) => (
                    <TableCell key={column.key}>
                      {column.render
                        ? column.render(item[column.key], item)
                        : item[column.key]
                      }
                    </TableCell>
                  ))}
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(item)}
                        className="h-8 w-8 p-0"
                      >
                        <RiEditLine className="h-4 w-4" />
                      </Button>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={() => setSelectedItem(item)}
                          >
                            <RiDeleteBinLine className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will permanently delete the
                              item with code "{selectedItem?.code || selectedItem?.id}".
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(selectedItem)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {data.length > 0 && (
        <div className="text-sm text-muted-foreground">
          Showing {data.length} items
        </div>
      )}
    </div>
  );
}