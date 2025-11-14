import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface AttendanceRecord {
  id: string;
  studentName: string;
  date: string;
  time: string;
  status: "present" | "absent" | "late";
  subject?: string;
}

interface AttendanceTableProps {
  records: AttendanceRecord[];
}

export function AttendanceTable({ records }: AttendanceTableProps) {
  const getStatusBadge = (status: AttendanceRecord["status"]) => {
    const variants = {
      present: "default",
      absent: "destructive",
      late: "secondary",
    } as const;

    return (
      <Badge
        variant={variants[status]}
        className={
          status === "present"
            ? "bg-success text-success-foreground hover:bg-success/90"
            : status === "late"
            ? "bg-warning text-warning-foreground hover:bg-warning/90"
            : ""
        }
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  return (
    <div className="rounded-lg border border-border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="font-semibold">Student Name</TableHead>
            <TableHead className="font-semibold">Date</TableHead>
            <TableHead className="font-semibold">Time</TableHead>
            {records[0]?.subject && <TableHead className="font-semibold">Subject</TableHead>}
            <TableHead className="font-semibold">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {records.map((record) => (
            <TableRow key={record.id} className="hover:bg-muted/30">
              <TableCell className="font-medium">{record.studentName}</TableCell>
              <TableCell>{record.date}</TableCell>
              <TableCell>{record.time}</TableCell>
              {record.subject && <TableCell>{record.subject}</TableCell>}
              <TableCell>{getStatusBadge(record.status)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
