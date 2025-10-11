'use client';

import { useState } from 'react';
import { User } from 'firebase/auth';
import { useStorage } from '@/firebase';
import {
  ref,
  listAll,
  getDownloadURL,
  deleteObject,
  getMetadata,
} from 'firebase/storage';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileUploader } from './FileUploader';
import { FileList, type StoredFile } from './FileList';
import { useToast } from '@/hooks/use-toast';

interface DocumentsTabProps {
  user: User;
}

export function DocumentsTab({ user }: DocumentsTabProps) {
  const storage = useStorage();
  const { toast } = useToast();
  const [files, setFiles] = useState<StoredFile[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchFiles = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const userFolderRef = ref(storage, `uploads/${user.uid}`);
      const fileList = await listAll(userFolderRef);
      const filePromises = fileList.items.map(async (fileRef) => {
        const url = await getDownloadURL(fileRef);
        const metadata = await getMetadata(fileRef);
        return {
          ref: fileRef,
          name: metadata.name,
          url: url,
          size: metadata.size,
          type: metadata.contentType,
          createdAt: metadata.timeCreated,
        };
      });
      const userFiles = await Promise.all(filePromises);
      setFiles(userFiles);
    } catch (error) {
      console.error("Error fetching files: ", error);
      toast({
        variant: 'destructive',
        title: 'Error fetching files',
        description: 'Could not retrieve your documents. Please try again later.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUploadSuccess = () => {
    toast({
      title: "Upload successful",
      description: "Your file has been uploaded.",
    });
    fetchFiles(); // Refresh the file list
  };

  const handleUploadError = (error: Error) => {
     toast({
      variant: 'destructive',
      title: 'Upload failed',
      description: error.message || "Could not upload your file. Please try again.",
    });
  }

  const handleDeleteFile = async (fileRef: any) => {
    try {
      await deleteObject(fileRef);
      toast({
        title: 'File Deleted',
        description: `${fileRef.name} has been successfully deleted.`,
      });
      fetchFiles(); // Refresh list after deletion
    } catch (error) {
      console.error("Error deleting file:", error);
      toast({
        variant: 'destructive',
        title: 'Deletion failed',
        description: 'Could not delete the file. Please try again.',
      });
    }
  };


  return (
    <div className="grid gap-8 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Upload Documents</CardTitle>
          <CardDescription>
            Securely upload your financial documents (max 5MB).
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FileUploader 
            user={user} 
            onUploadSuccess={handleUploadSuccess}
            onUploadError={handleUploadError} 
          />
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
           <FileList 
            files={files}
            isLoading={isLoading}
            onDelete={handleDeleteFile}
            onRefresh={fetchFiles}
           />
        </CardContent>
      </Card>
    </div>
  );
}
