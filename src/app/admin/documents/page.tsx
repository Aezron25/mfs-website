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
import { useStorage, useUser } from '@/firebase';
import {
  ref,
  listAll,
  getMetadata,
  getDownloadURL,
} from 'firebase/storage';
import { useEffect, useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Loader2 } from 'lucide-react';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';
import type { UserProfile, DocumentMetadata } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

type DocumentWithClient = DocumentMetadata & {
  clientName: string;
  clientId: string;
};

export default function AdminDocumentsPage() {
  const storage = useStorage();
  const firestore = useFirestore();
  const [documents, setDocuments] = useState<DocumentWithClient[]>([]);
  const [loading, setLoading] = useState(true);

  const usersQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return collection(firestore, 'users');
  }, [firestore]);

  const { data: users, loading: usersLoading } =
    useCollection<UserProfile>(usersQuery);

  const usersMap = useMemo(() => {
    if (!users) return new Map<string, string>();
    return new Map(users.map((user) => [user.id, user.name]));
  }, [users]);

  useEffect(() => {
    if (!storage || usersLoading) return;

    setLoading(true);
    const fetchAllDocuments = async () => {
      try {
        const allFiles: DocumentWithClient[] = [];
        for (const [userId, userName] of usersMap.entries()) {
          const userFolderRef = ref(storage, `documents/${userId}`);
          const fileList = await listAll(userFolderRef);

          const filePromises = fileList.items.map(async (fileRef) => {
            const metadata = await getMetadata(fileRef);
            return {
              path: fileRef.fullPath,
              name: metadata.name,
              size: metadata.size,
              uploadDate: new Date(metadata.timeCreated),
              clientName: userName,
              clientId: userId,
            };
          });

          const userFiles = await Promise.all(filePromises);
          allFiles.push(...userFiles);
        }
        setDocuments(allFiles);
      } catch (error) {
        console.error('Error fetching documents:', error);
      } finally {
        setLoading(false);
      }
    };

    if (!usersLoading && usersMap.size > 0) {
      fetchAllDocuments();
    } else if (!usersLoading) {
      setLoading(false);
    }
  }, [storage, usersLoading, usersMap]);

  const handleDownload = async (path: string) => {
    if (!storage) return;
    try {
      const url = await getDownloadURL(ref(storage, path));
      // Open in a new tab to trigger download
      window.open(url, '_blank');
    } catch (error) {
      console.error('Error getting download URL:', error);
      alert('Could not get download URL.');
    }
  };

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
          <CardDescription>
            Review documents uploaded by clients.
          </CardDescription>
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
              {loading ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center h-24">
                    <Loader2 className="mx-auto h-6 w-6 animate-spin" />
                  </TableCell>
                </TableRow>
              ) : documents.length > 0 ? (
                documents.map((doc) => (
                  <TableRow key={doc.path}>
                    <TableCell className="font-medium">{doc.name}</TableCell>
                    <TableCell>{doc.clientName}</TableCell>
                    <TableCell>
                      {doc.uploadDate.toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDownload(doc.path)}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center h-24">
                    No documents found.
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
