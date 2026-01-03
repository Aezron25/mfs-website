
'use client';

import { useUser } from '@/firebase/auth/use-user';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, where, limit, orderBy } from 'firebase/firestore';
import type { Appointment, ServiceRequest } from '@/lib/types';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { PlusCircle, Upload, CalendarPlus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

function ServiceRequestsWidget({
  requests,
  loading,
}: {
  requests: ServiceRequest[];
  loading: boolean;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Service Requests</CardTitle>
        <CardDescription>
          Here's the latest status of your service requests.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        ) : requests.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Service</TableHead>
                <TableHead className="text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requests.map((req) => (
                <TableRow key={req.id}>
                  <TableCell className="font-medium">
                    {req.serviceType}
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge variant={req.status === 'completed' ? 'default' : 'secondary'}>{req.status}</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <p className="text-sm text-muted-foreground">
            You haven't made any service requests yet.
          </p>
        )}
      </CardContent>
      <CardFooter>
        <Button asChild variant="outline" className="w-full">
            <Link href="/service-requests">View All Requests</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

function AppointmentsWidget({
  appointments,
  loading,
}: {
  appointments: Appointment[];
  loading: boolean;
}) {
    const getServiceTypeForAppointment = (appointment: Appointment) => {
        return appointment.notes?.split(' ')[0] || 'Consultation';
    }

    return (
    <Card>
      <CardHeader>
        <CardTitle>Upcoming Appointments</CardTitle>
        <CardDescription>
          Your next scheduled meetings.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
           <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        ) : appointments.length > 0 ? (
             <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Time</TableHead>
                        <TableHead>Service</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {appointments.map((appt) => (
                        <TableRow key={appt.id}>
                            <TableCell>{new Date(appt.date).toLocaleDateString()}</TableCell>
                            <TableCell>{appt.time}</TableCell>
                            <TableCell>{getServiceTypeForAppointment(appt)}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
             </Table>
        ) : (
            <p className="text-sm text-muted-foreground">You have no upcoming appointments.</p>
        )}
      </CardContent>
      <CardFooter>
         <Button asChild variant="outline" className="w-full">
            <Link href="#">Book Appointment</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

function AuthenticatedDashboard({ user }: { user: NonNullable<ReturnType<typeof useUser>['user']>}) {
  const firestore = useFirestore();

  const serviceRequestsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(
      collection(firestore, 'serviceRequests'),
      where('clientId', '==', user.uid),
      orderBy('createdAt', 'desc'),
      limit(3)
    );
  }, [firestore, user.uid]);

  const appointmentsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    const today = new Date().toISOString().split('T')[0];
    return query(
      collection(firestore, 'appointments'),
      where('clientId', '==', user.uid),
      where('date', '>=', today),
      orderBy('date', 'asc'),
      limit(2)
    );
  }, [firestore, user.uid]);
  
  const { data: serviceRequests, loading: requestsLoading } = useCollection<ServiceRequest>(serviceRequestsQuery);
  const { data: appointments, loading: appointmentsLoading } = useCollection<Appointment>(appointmentsQuery);

  return (
     <div className="container py-12">
      <div className="space-y-2 mb-10">
        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl font-headline">
          Client Dashboard
        </h1>
        <p className="text-muted-foreground md:text-xl">
          Welcome back, {user.displayName || 'User'}. Here's your financial overview.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-10">
          <Button asChild size="lg" variant="outline" className="p-6 flex justify-start items-center gap-4">
              <Link href="/service-requests">
                  <PlusCircle className="h-6 w-6 text-primary" />
                  <span className="text-base font-semibold">Request a Service</span>
              </Link>
          </Button>
           <Button asChild size="lg" variant="outline" className="p-6 flex justify-start items-center gap-4">
              <Link href="#">
                  <Upload className="h-6 w-6 text-primary" />
                  <span className="text-base font-semibold">Upload Document</span>
              </Link>
          </Button>
           <Button asChild size="lg" variant="outline" className="p-6 flex justify-start items-center gap-4">
              <Link href="#">
                  <CalendarPlus className="h-6 w-6 text-primary" />
                  <span className="text-base font-semibold">Book Appointment</span>
              </Link>
          </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <ServiceRequestsWidget requests={serviceRequests} loading={requestsLoading} />
        <AppointmentsWidget appointments={appointments} loading={appointmentsLoading} />
      </div>
    </div>
  )
}


export default function DashboardPage() {
  const { user, isLoading: userLoading } = useUser();
  const router = useRouter();
  
  useEffect(() => {
    if (!userLoading && !user) {
      router.push('/login');
    }
  }, [user, userLoading, router]);

  if (userLoading) {
    return (
      <div className="container py-12">
        <div className="grid gap-8">
            <div className="space-y-2">
                <Skeleton className="h-10 w-1/3" />
                <Skeleton className="h-6 w-1/2" />
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
            </div>
            <div className="grid md:grid-cols-2 gap-8">
                <Skeleton className="h-96 w-full" />
                <Skeleton className="h-96 w-full" />
            </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; 
  }

  return <AuthenticatedDashboard user={user} />;
}
