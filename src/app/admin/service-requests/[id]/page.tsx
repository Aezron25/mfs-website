
'use client';

import { useParams, useRouter } from 'next/navigation';
import { useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import type { ServiceRequest, UserProfile } from '@/lib/types';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, User, Calendar, Type } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

function DetailRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-4">
      <div className="text-muted-foreground">{icon}</div>
      <div>
        <p className="font-semibold">{label}</p>
        <div className="text-muted-foreground">{value}</div>
      </div>
    </div>
  );
}

export default function ServiceRequestDetailPage() {
  const params = useParams();
  const router = useRouter();
  const firestore = useFirestore();
  const id = params.id as string;

  const requestRef = useMemoFirebase(() => {
    if (!firestore || !id) return null;
    return doc(firestore, 'serviceRequests', id);
  }, [firestore, id]);

  const { data: request, loading: requestLoading } =
    useDoc<ServiceRequest>(requestRef);

  const clientRef = useMemoFirebase(() => {
    if (!firestore || !request?.clientId) return null;
    return doc(firestore, 'users', request.clientId);
  }, [firestore, request?.clientId]);

  const { data: client, loading: clientLoading } =
    useDoc<UserProfile>(clientRef);

  const loading = requestLoading || clientLoading;

  if (loading) {
    return (
      <div className="space-y-8">
        <Skeleton className="h-8 w-48" />
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-1/2" />
            <Skeleton className="h-4 w-1/3" />
          </CardHeader>
          <CardContent className="space-y-6">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-16 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!request) {
    return (
      <div className="text-center">
        <h1 className="text-2xl font-bold">Request not found</h1>
        <p className="text-muted-foreground">
          The service request you are looking for does not exist.
        </p>
        <Button onClick={() => router.back()} className="mt-4">
          <ArrowLeft className="mr-2 h-4 w-4" /> Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Button variant="outline" onClick={() => router.back()}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Requests
      </Button>

      <Card>
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span>Service Request Details</span>
            <Badge
              variant={request.status === 'completed' ? 'default' : 'secondary'}
            >
              {request.status}
            </Badge>
          </CardTitle>
          <CardDescription>
            Full details for the request from {client?.name || 'a client'}.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {client && (
            <Card>
              <CardHeader>
                <CardTitle>Client Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <DetailRow
                  icon={<User className="h-5 w-5" />}
                  label="Client Name"
                  value={client.name}
                />
                <DetailRow
                  icon={<User className="h-5 w-5" />}
                  label="Client Email"
                  value={<a href={`mailto:${client.email}`} className="text-primary hover:underline">{client.email}</a>}
                />
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Request Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <DetailRow
                icon={<Type className="h-5 w-5" />}
                label="Service Type"
                value={request.serviceType}
              />
              <DetailRow
                icon={<Calendar className="h-5 w-5" />}
                label="Date Requested"
                value={
                  request.createdAt
                    ? new Date(
                        request.createdAt.seconds * 1000
                      ).toLocaleString()
                    : 'N/A'
                }
              />
              <div>
                <p className="font-semibold mb-2">Description</p>
                <p className="text-muted-foreground whitespace-pre-wrap">
                  {request.description}
                </p>
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
}
