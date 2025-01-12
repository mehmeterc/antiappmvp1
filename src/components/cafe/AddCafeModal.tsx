import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AddCafeForm } from "./AddCafeForm";

interface AddCafeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AddCafeModal = ({ open, onOpenChange }: AddCafeModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Cafe</DialogTitle>
        </DialogHeader>
        <AddCafeForm onSuccess={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  );
};