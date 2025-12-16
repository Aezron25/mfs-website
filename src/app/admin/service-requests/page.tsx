
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

export default function AdminServiceRequestsPage() {
  return (
    <div className="space-y-8">
       <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
          Service Requests
        </h1>
        <p className="text-muted-foreground">
          Review and manage all incoming service requests from clients.
        </p>
      </div>

      <Card>
        <CardHeader>
            <CardTitle>All Requests</CardTitle>
            <CardDescription>Approve, assign, and track the status of requests.</CardDescription>
        </CardHeader>
        <CardContent>
           <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Client Name</TableHead>
                <TableHead>Service Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Assigned Staff</TableHead>
                <TableHead>Created Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
                <TableRow>
                    <TableCell colSpan={6} className="text-center h-24">
                        No service requests found.
                    </TableCell>
                </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
