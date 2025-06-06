"use client";

import { useState, useEffect } from "react";
import { RiEditLine, RiSaveLine } from "react-icons/ri";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import { useToast } from "@/hooks/use-toast";

interface EditModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: any;
  fields: Array<{
    key: string;
    label: string;
    type: "text" | "number" | "email" | "select" | "textarea";
    options?: string[];
    required?: boolean;
  }>;
  onSave: (updatedItem: any) => void;
  title: string;
}

export default function EditModal({
  isOpen,
  onClose,
  item,
  fields,
  onSave,
  title
}: EditModalProps) {
  const [formData, setFormData] = useState<any>({});
  const { toast } = useToast();

  console.log("EditModal rendered", { isOpen, item, title });

  useEffect(() => {
    if (isOpen && item) {
      setFormData({ ...item });
    }
  }, [isOpen, item]);

  const handleChange = (key: string, value: any) => {
    setFormData((prev: any) => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSave = () => {
    console.log("Saving item", formData);

    // Validate required fields
    const missingFields = fields
      .filter(field => field.required && !formData[field.key])
      .map(field => field.label);

    if (missingFields.length > 0) {
      toast({
        title: "Validation Error",
        description: `Please fill in: ${missingFields.join(", ")}`,
        variant: "destructive",
      });
      return;
    }

    onSave(formData);
    
    toast({
      title: "Item Updated",
      description: `${title} has been successfully updated`,
    });
    
    onClose();
  };

  const renderField = (field: any) => {
    const value = formData[field.key] || "";

    switch (field.type) {
      case "select":
        return (
          <Select value={value} onValueChange={(val) => handleChange(field.key, val)}>
            <SelectTrigger>
              <SelectValue placeholder={`Select ${field.label.toLowerCase()}`} />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((option: string) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      
      case "textarea":
        return (
          <Textarea
            value={value}
            onChange={(e) => handleChange(field.key, e.target.value)}
            placeholder={`Enter ${field.label.toLowerCase()}`}
            rows={3}
          />
        );
      
      default:
        return (
          <Input
            type={field.type}
            value={value}
            onChange={(e) => handleChange(field.key, 
              field.type === "number" ? Number(e.target.value) : e.target.value
            )}
            placeholder={`Enter ${field.label.toLowerCase()}`}
          />
        );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <RiEditLine className="mr-2 h-5 w-5" />
            Edit {title}
          </DialogTitle>
          <DialogDescription>
            Update the information for this {title.toLowerCase()}.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          {fields.map((field) => (
            <div key={field.key} className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor={field.key} className="text-right">
                {field.label}
                {field.required && <span className="text-red-500 ml-1">*</span>}
              </Label>
              <div className="col-span-3">
                {renderField(field)}
              </div>
            </div>
          ))}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} className="bg-erp-primary hover:bg-erp-primary-dark">
            <RiSaveLine className="mr-2 h-4 w-4" />
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}