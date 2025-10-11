'use client';

import { User } from 'firebase/auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileUp, FolderKanban } from 'lucide-react';

interface DocumentsTabProps {
  user: User;
}

export function DocumentsTab({ user }: DocumentsTabProps) {
  return (
    <div className="grid gap-8 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Upload Documents</CardTitle>
          <CardDescription>
            Securely upload your financial documents.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center text-center p-8 border-2 border-dashed rounded-lg h-full">
            <FileUp className="h-12 w-12 text-muted-foreground" />
            <p className="mt-4 text-lg font-semibold">Coming Soon</p>
            <p className="mt-1 text-sm text-muted-foreground">
              The file upload functionality is being built.
            </p>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>My Documents</CardTitle>
          <CardDescription>
            View and manage your uploaded files.
          </CardDescription>
        </CardHeader>
        <CardContent>
           <div className="flex flex-col items-center justify-center text-center p-8 border-2 border-dashed rounded-lg h-full">
                <FolderKanban className="h-12 w-12 text-muted-foreground" />
                <p className="mt-4 text-lg font-semibold">No Documents Yet</p>
                <p className="mt-1 text-sm text-muted-foreground">
                    Your uploaded documents will appear here.
                </p>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
