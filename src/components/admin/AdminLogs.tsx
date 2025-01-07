import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface AdminLog {
  id: string;
  admin_id: string;
  table_name: string;
  action: string;
  target_id: string;
  timestamp: string;
}

interface AdminLogsProps {
  logs: AdminLog[];
}

export const AdminLogs = ({ logs }: AdminLogsProps) => {
  return (
    <div className="bg-white rounded-lg shadow">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Action</TableHead>
            <TableHead>Table</TableHead>
            <TableHead>Target ID</TableHead>
            <TableHead>Timestamp</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {logs.map((log) => (
            <TableRow key={log.id}>
              <TableCell className="capitalize">{log.action.toLowerCase()}</TableCell>
              <TableCell>{log.table_name}</TableCell>
              <TableCell className="font-mono text-sm">{log.target_id}</TableCell>
              <TableCell>
                {format(new Date(log.timestamp), 'MMM d, yyyy HH:mm:ss')}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};