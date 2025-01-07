import { format } from "date-fns";
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

interface MerchantProfile {
  id: string;
  business_name: string;
  contact_email: string;
  profiles: {
    verification_status: 'pending' | 'approved' | 'rejected';
  };
  created_at: string;
}

interface MerchantListProps {
  merchants: MerchantProfile[];
  onUpdateStatus: (merchantId: string, status: 'approved' | 'rejected') => void;
}

const getStatusBadge = (status: string) => {
  const statusStyles = {
    pending: "bg-yellow-100 text-yellow-800",
    approved: "bg-green-100 text-green-800",
    rejected: "bg-red-100 text-red-800",
  };

  return (
    <Badge className={statusStyles[status as keyof typeof statusStyles]}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
};

export const MerchantList = ({ merchants, onUpdateStatus }: MerchantListProps) => {
  return (
    <div className="bg-white rounded-lg shadow">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Business Name</TableHead>
            <TableHead>Contact Email</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {merchants.map((merchant) => (
            <TableRow key={merchant.id}>
              <TableCell>{merchant.business_name}</TableCell>
              <TableCell>{merchant.contact_email}</TableCell>
              <TableCell>{getStatusBadge(merchant.profiles.verification_status)}</TableCell>
              <TableCell>
                {format(new Date(merchant.created_at), 'MMM d, yyyy')}
              </TableCell>
              <TableCell>
                {merchant.profiles.verification_status === 'pending' && (
                  <div className="space-x-2">
                    <Button
                      size="sm"
                      onClick={() => onUpdateStatus(merchant.id, 'approved')}
                    >
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => onUpdateStatus(merchant.id, 'rejected')}
                    >
                      Reject
                    </Button>
                  </div>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};