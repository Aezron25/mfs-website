
'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Users, Briefcase, Calendar, FileText } from 'lucide-react';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, where } from 'firebase/firestore';
import type { UserProfile, ServiceRequest } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

export default function AdminDashboardPage() {
  const firestore = useFirestore();

  const clientsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'users'), where('role', '==', 'user'));
  }, [firestore]);

  const pendingRequestsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(
      collection(firestore, 'serviceRequests'),
      where('status', '==', 'pending')
    );
  }, [firestore]);

  const { data: clients, loading: clientsLoading } =
    useCollection<UserProfile>(clientsQuery);
  const { data: pendingRequests, loading: requestsLoading } =
    useCollection<ServiceRequest>(pendingRequestsQuery);

  const kpiData = [
    {
      title: 'Total Clients',
      value:
        clientsLoading ? (
          <Skeleton className="h-8 w-12" />
        ) : (
          clients?.length.toString() || '0'
        ),
      icon: <Users className="h-6 w-6 text-muted-foreground" />,
      description: 'Number of registered clients',
    },
    {
      title: 'Pending Requests',
      value:
        requestsLoading ? (
          <Skeleton className="h-8 w-12" />
        ) : (
          pendingRequests?.length.toString() || '0'
        ),
      icon: <Briefcase className="h-6 w-6 text-muted-foreground" />,
      description: 'New service requests to be reviewed',
    },
    {
      title: 'Upcoming Appointments',
      value: '0',
      icon: <Calendar className="h-6 w-6 text-muted-foreground" />,
      description: 'Meetings scheduled for this week',
    },
    {
      title: 'Documents Uploaded',
      value: '0',
      icon: <FileText className="h-6 w-6 text-muted-foreground" />,
      description: 'Files uploaded by clients this month',
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
          Dashboard Overview
        </h1>
        <p className="text-muted-foreground">
          Here's a quick look at the activity across the platform.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {kpiData.map((kpi) => (
          <Card key={kpi.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{kpi.title}</CardTitle>
              {kpi.icon}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{kpi.value}</div>
              <p className="text-xs text-muted-foreground">
                {kpi.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              A log of recent client and system events.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center text-muted-foreground py-12">
              <p>Recent activity will be shown here.</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Overdue Requests</CardTitle>
            <CardDescription>
              Service requests that require immediate attention.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center text-muted-foreground py-12">
              <p>Alerts for overdue tasks will appear here.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
