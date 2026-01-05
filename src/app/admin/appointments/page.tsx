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
import type { Appointment, UserProfile } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { useState, useMemo } from 'react';

type AppointmentWithClient = Appointment & { clientName: string };

export default function AdminAppointmentsPage() {
  const firestore = useFirestore();
  const [searchTerm, setSearchTerm] = useState('');

  const appointmentsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'appointments'), orderBy('date', 'desc'));
  }, [firestore]);

  const usersQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return collection(firestore, 'users');
  }, [firestore]);

  const { data: appointments, loading: appointmentsLoading } =
    useCollection<Appointment>(appointmentsQuery);
  const { data: users, loading: usersLoading } =
    useCollection<UserProfile>(usersQuery);

  const usersMap = useMemo(() => {
    if (!users) return new Map<string, string>();
    return new Map(users.map((user) => [user.id, user.name]));
  }, [users]);

  const combinedData: AppointmentWithClient[] = useMemo(() => {
    if (!appointments) return [];
    return appointments.map((appt) => ({
      ...appt,
      clientName: usersMap.get(appt.clientId) || 'Unknown Client',
    }));
  }, [appointments, usersMap]);

  const filteredAppointments = useMemo(() => {
    return combinedData.filter((appt) =>
      appt.clientName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [combinedData, searchTerm]);

  const loading = appointmentsLoading || usersLoading;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
          Appointments
        </h1>
        <p className="text-muted-foreground">
          Manage all scheduled appointments.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>
            All Appointments ({loading ? '...' : filteredAppointments.length})
          </CardTitle>
          <CardDescription>
            <Input
              placeholder="Search by client name..."
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
                <TableHead>Date</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Status</TableHead>
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
              ) : filteredAppointments.length > 0 ? (
                filteredAppointments.map((appt) => (
                  <TableRow key={appt.id}>
                    <TableCell className="font-medium">
                      {appt.clientName}
                    </TableCell>
                    <TableCell>
                      {new Date(appt.date).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{appt.time}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          appt.status === 'confirmed' ? 'default' : 'secondary'
                        }
                      >
                        {appt.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {/* Actions can be added here */}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center h-24">
                    No appointments found.
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
