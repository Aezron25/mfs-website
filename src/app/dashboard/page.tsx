
'use client';

import { useUser } from '@/firebase/auth/use-user';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo } from 'react';
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
import { PlusCircle, Upload, CalendarPlus, LogOut } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { getAuth, signOut } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { Pie, PieChart, Cell } from 'recharts';

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
                    <Badge
                      variant={
                        req.status === 'completed' ? 'default' : 'secondary'
                      }
                    >
                      {req.status}
                    </Badge>
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
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upcoming Appointments</CardTitle>
        <CardDescription>Your next scheduled meetings.</CardDescription>
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
                  <TableCell>
                    {new Date(appt.date).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{appt.time}</TableCell>
                  <TableCell>
                    {getServiceTypeForAppointment(appt)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <p className="text-sm text-muted-foreground">
            You have no upcoming appointments.
          </p>
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

function ServiceStatusChart({
  requests,
  loading,
}: {
  requests: ServiceRequest[];
  loading: boolean;
}) {
  const chartData = useMemo(() => {
    if (loading || !requests.length) return [];
    const statusCounts = requests.reduce((acc, req) => {
      acc[req.status] = (acc[req.status] || 0) + 1;
      return acc;
    }, {} as Record<ServiceRequest['status'], number>);
    
    return Object.entries(statusCounts).map(([status, count]) => ({
      status,
      count,
      fill: `hsl(var(--chart-${Object.keys(statusCounts).indexOf(status) + 1}))`,
    }));
  }, [requests, loading]);

  const chartConfig = useMemo(() => {
    return chartData.reduce((acc, item) => {
        acc[item.status] = { label: item.status.charAt(0).toUpperCase() + item.status.slice(1), color: item.fill };
        return acc;
    }, {} as any)
  }, [chartData]);


  return (
    <Card>
      <CardHeader>
        <CardTitle>Request Status Overview</CardTitle>
        <CardDescription>A summary of all your service requests.</CardDescription>
      </CardHeader>
      <CardContent>
         {loading ? (
            <Skeleton className="h-48 w-full" />
        ) : requests.length > 0 ? (
        <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[250px]">
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent nameKey="count" hideLabel />} />
            <Pie data={chartData} dataKey="count" nameKey="status" innerRadius={60} strokeWidth={5}>
                {chartData.map((entry) => (
                    <Cell key={`cell-${entry.status}`} fill={entry.fill} />
                ))}
            </Pie>
          </PieChart>
        </ChartContainer>
         ) : (
            <div className="flex items-center justify-center h-48">
                <p className="text-sm text-muted-foreground">No data to display.</p>
            </div>
         )}
      </CardContent>
    </Card>
  );
}

function AuthenticatedDashboard({
  user,
}: {
  user: NonNullable<ReturnType<typeof useUser>['user']>;
}) {
  const firestore = useFirestore();
  const router = useRouter();
  const { toast } = useToast();

  const handleLogout = async () => {
    const auth = getAuth();
    try {
      await signOut(auth);
      toast({
        title: 'Logged Out',
        description: 'You have been successfully logged out.',
      });
      router.push('/');
    } catch (error) {
      console.error('Logout Error:', error);
      toast({
        variant: 'destructive',
        title: 'Logout Failed',
        description: 'There was a problem logging you out. Please try again.',
      });
    }
  };

  const allServiceRequestsQuery = useMemoFirebase(() => {
    if (!firestore || !user?.uid) return null;
    return query(
      collection(firestore, 'serviceRequests'),
      where('clientId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );
  }, [firestore, user?.uid]);

  const recentServiceRequestsQuery = useMemoFirebase(() => {
     if (!allServiceRequestsQuery) return null;
     return query(allServiceRequestsQuery, limit(3));
  }, [allServiceRequestsQuery]);


  const appointmentsQuery = useMemoFirebase(() => {
    if (!firestore || !user?.uid) return null;
    const today = new Date().toISOString().split('T')[0];
    return query(
      collection(firestore, 'appointments'),
      where('clientId', '==', user.uid),
      where('date', '>=', today),
      orderBy('date', 'asc'),
      limit(2)
    );
  }, [firestore, user?.uid]);

  const { data: allServiceRequests, loading: allRequestsLoading } = useCollection<ServiceRequest>(allServiceRequestsQuery);
  const { data: recentServiceRequests, loading: recentRequestsLoading } = useCollection<ServiceRequest>(recentServiceRequestsQuery);
  const { data: appointments, loading: appointmentsLoading } =
    useCollection<Appointment>(appointmentsQuery);

  return (
    <div className="container py-12">
      <div className="space-y-2 mb-10">
        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl font-headline">
          Client Dashboard
        </h1>
        <p className="text-muted-foreground md:text-xl">
          Welcome back, {user.displayName?.split(' ')[0] || 'User'}. Here's your financial overview.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-10">
        <Button
          asChild
          size="lg"
          variant="outline"
          className="p-6 flex justify-start items-center gap-4"
        >
          <Link href="/service-requests">
            <PlusCircle className="h-6 w-6 text-primary" />
            <span className="text-base font-semibold">Request a Service</span>
          </Link>
        </Button>
        <Button
          asChild
          size="lg"
          variant="outline"
          className="p-6 flex justify-start items-center gap-4"
        >
          <Link href="#">
            <Upload className="h-6 w-6 text-primary" />
            <span className="text-base font-semibold">Upload Document</span>
          </Link>
        </Button>
        <Button
          asChild
          size="lg"
          variant="outline"
          className="p-6 flex justify-start items-center gap-4"
        >
          <Link href="#">
            <CalendarPlus className="h-6 w-6 text-primary" />
            <span className="text-base font-semibold">Book Appointment</span>
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <div className="space-y-8">
            <ServiceRequestsWidget requests={recentServiceRequests || []} loading={recentRequestsLoading} />
            <AppointmentsWidget appointments={appointments || []} loading={appointmentsLoading} />
        </div>
        <ServiceStatusChart requests={allServiceRequests || []} loading={allRequestsLoading} />
      </div>

      <div className="mt-12 text-center">
        <Button variant="outline" onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          Log Out
        </Button>
      </div>
    </div>
  );
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
