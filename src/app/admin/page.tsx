
'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Users, Briefcase, Calendar, FileText } from 'lucide-react';
import { useFirestore, useCollection, useMemoFirebase, useStorage } from '@/firebase';
import { collection, query, where } from 'firebase/firestore';
import type { UserProfile, ServiceRequest } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { useEffect, useState, useMemo } from 'react';
import { ref, listAll } from 'firebase/storage';

export default function AdminDashboardPage() {
  const firestore = useFirestore();
  const storage = useStorage();
  const [documentCount, setDocumentCount] = useState<number | null>(null);
  const [docsLoading, setDocsLoading] = useState(true);

  const usersQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return collection(firestore, 'users');
  }, [firestore]);

  const pendingRequestsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(
      collection(firestore, 'serviceRequests'),
      where('status', '==', 'pending')
    );
  }, [firestore]);

  const { data: users, loading: usersLoading } =
    useCollection<UserProfile>(usersQuery);
  const { data: pendingRequests, loading: requestsLoading } =
    useCollection<ServiceRequest>(pendingRequestsQuery);
    
  const clients = useMemo(() => users?.filter(u => u.role === 'user'), [users]);

  useEffect(() => {
    if (!storage || usersLoading || !users) {
        if (!usersLoading) setDocsLoading(false);
        return;
    }

    setDocsLoading(true);
    let totalDocs = 0;
    const fetchPromises = users.map(user => {
        const userFolderRef = ref(storage, `documents/${user.id}`);
        return listAll(userFolderRef).then(res => {
            totalDocs += res.items.length;
        }).catch(err => {
            // This can happen if a folder doesn't exist, which is fine.
            if (err.code !== 'storage/object-not-found') {
                console.error(`Failed to list files for user ${user.id}:`, err);
            }
        });
    });

    Promise.all(fetchPromises).then(() => {
        setDocumentCount(totalDocs);
        setDocsLoading(false);
    });

  }, [storage, users, usersLoading]);

  const kpiData = [
    {
      title: 'Total Clients',
      value:
        usersLoading ? (
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
      value:
        docsLoading ? (
          <Skeleton className="h-8 w-12" />
        ) : (
          documentCount?.toString() || '0'
        ),
      icon: <FileText className="h-6 w-6 text-muted-foreground" />,
      description: 'Total files uploaded by clients',
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
