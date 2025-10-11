
'use client';

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
import { Button } from '@/components/ui/button';
import { FileText, Download } from 'lucide-react';

const invoices = [
    // This is sample data. In a real application, you would fetch this from your database.
    {
        invoice: 'INV001',
        service: 'Tax Consultation Q1',
        amount: 'ZMW 2,500.00',
        status: 'Paid',
        date: '2023-03-15',
    },
    {
        invoice: 'INV002',
        service: 'Annual Audit Service',
        amount: 'ZMW 15,000.00',
        status: 'Pending',
        date: '2023-05-20',
    },
    {
        invoice: 'INV003',
        service: 'SME Business Advisory',
        amount: 'ZMW 5,000.00',
        status: 'Overdue',
        date: '2023-04-30',
    },
];

export function BillingTab() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>My Invoices</CardTitle>
        <CardDescription>
          View your billing history and download your invoices.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {invoices.length > 0 ? (
            <div className="rounded-md border">
            <Table>
                <TableHeader>
                <TableRow>
                    <TableHead>Invoice ID</TableHead>
                    <TableHead>Service</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                </TableRow>
                </TableHeader>
                <TableBody>
                {invoices.map((invoice) => (
                    <TableRow key={invoice.invoice}>
                    <TableCell className="font-medium">{invoice.invoice}</TableCell>
                    <TableCell>{invoice.service}</TableCell>
                    <TableCell>{invoice.amount}</TableCell>
                    <TableCell>{invoice.date}</TableCell>
                    <TableCell>
                        <Badge
                        variant={
                            invoice.status === 'Paid'
                            ? 'secondary'
                            : invoice.status === 'Pending'
                            ? 'outline'
                            : 'destructive'
                        }
                        >
                        {invoice.status}
                        </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                        <Button variant="outline" size="sm">
                            <Download className="mr-2 h-4 w-4" />
                            Download
                        </Button>
                    </TableCell>
                    </TableRow>
                ))}
                </TableBody>
            </Table>
            </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center p-8 border-2 border-dashed rounded-lg h-full">
            <FileText className="h-12 w-12 text-muted-foreground" />
            <p className="mt-4 text-lg font-semibold">No Invoices Found</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Your invoices and billing information will appear here.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
