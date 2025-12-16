
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

export default function AdminDocumentsPage() {
  return (
    <div className="space-y-8">
       <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
          Documents
        </h1>
        <p className="text-muted-foreground">
          Access and manage all client-uploaded documents.
        </p>
      </div>

       <Card>
        <CardHeader>
            <CardTitle>All Documents</CardTitle>
            <CardDescription>Review documents uploaded by clients.</CardDescription>
        </CardHeader>
        <CardContent>
           <Table>
            <TableHeader>
              <TableRow>
                <TableHead>File Name</TableHead>
                <TableHead>Client Name</TableHead>
                <TableHead>Upload Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
                <TableRow>
                    <TableCell colSpan={4} className="text-center h-24">
                        No documents found.
                    </TableCell>
                </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
