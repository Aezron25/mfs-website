
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
import { Input } from '@/components/ui/input';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';
import type { ServiceRequest, UserProfile } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal } from 'lucide-react';
import Link from 'next/link';

// A type that combines ServiceRequest with the client's name
type ServiceRequestWithClient = ServiceRequest & { clientName: string };

export default function AdminServiceRequestsPage() {
  const firestore = useFirestore();
  const [searchTerm, setSearchTerm] = useState('');

  const serviceRequestsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(
      collection(firestore, 'serviceRequests'),
      orderBy('createdAt', 'desc')
    );
  }, [firestore]);

  const usersQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return collection(firestore, 'users');
  }, [firestore]);

  const { data: requests, loading: requestsLoading } =
    useCollection<ServiceRequest>(serviceRequestsQuery);
  const { data: users, loading: usersLoading } =
    useCollection<UserProfile>(usersQuery);

  const usersMap = useMemo(() => {
    if (!users) return new Map<string, string>();
    return new Map(users.map((user) => [user.id, user.name]));
  }, [users]);

  const combinedData: ServiceRequestWithClient[] = useMemo(() => {
    if (!requests) return [];
    return requests.map((req) => ({
      ...req,
      clientName: usersMap.get(req.clientId) || 'Unknown Client',
    }));
  }, [requests, usersMap]);

  const filteredRequests = useMemo(() => {
    return combinedData.filter(
      (req) =>
        req.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        req.serviceType.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [combinedData, searchTerm]);

  const loading = requestsLoading || usersLoading;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
          Service Requests
        </h1>
        <p className="text-muted-foreground">
          View and manage all client service requests.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Requests ({loading ? '...' : filteredRequests.length})</CardTitle>
          <CardDescription>
            <Input
              placeholder="Search by client or service type..."
              className="max-w-sm mt-2"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Client Name</TableHead>
                <TableHead>Service Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Requested Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <>
                  <TableRow>
                    <TableCell colSpan={5}>
                      <Skeleton className="h-8" />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell colSpan={5}>
                      <Skeleton className="h-8" />
                    </TableCell>
                  </TableRow>
                </>
              ) : filteredRequests.length > 0 ? (
                filteredRequests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell className="font-medium">
                      {request.clientName}
                    </TableCell>
                    <TableCell>{request.serviceType}</TableCell>
                    <TableCell>
                      <Badge variant={request.status === 'completed' ? 'default' : 'secondary'}>
                        {request.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {request.createdAt
                        ? new Date(
                            request.createdAt.seconds * 1000
                          ).toLocaleDateString()
                        : 'N/A'}
                    </TableCell>
                    <TableCell className="text-right">
                       <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={`/admin/service-requests/${request.id}`}>View Details</Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem>Update Status</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center h-24">
                    No service requests found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
