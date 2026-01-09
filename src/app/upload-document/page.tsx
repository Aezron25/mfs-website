
'use client';

import { useState, useEffect, ChangeEvent } from 'react';
import { useUser } from '@/firebase/auth/use-user';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useStorage } from '@/firebase';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { Loader2, Upload, FileCheck } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function UploadDocumentPage() {
  const { user, isLoading: userLoading } = useUser();
  const router = useRouter();
  const storage = useStorage();
  const { toast } = useToast();

  const [file, setFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);

  useEffect(() => {
    if (!userLoading && !user) {
      router.push('/login');
    }
  }, [user, userLoading, router]);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setFile(files[0]);
      setUploadComplete(false);
    }
  };

  const handleUpload = () => {
    if (!file || !user || !storage) {
      toast({
        variant: 'destructive',
        title: 'Upload Error',
        description: 'No file selected or user not logged in.',
      });
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);
    setUploadComplete(false);

    const storageRef = ref(storage, `documents/${user.uid}/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadProgress(progress);
      },
      (error) => {
        console.error('Upload failed:', error);
        toast({
          variant: 'destructive',
          title: 'Upload Failed',
          description: 'There was an error uploading your file. Please try again.',
        });
        setIsUploading(false);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then(() => {
          toast({
            title: 'Upload Successful!',
            description: `"${file.name}" has been uploaded.`,
          });
          setIsUploading(false);
          setUploadComplete(true);
          setFile(null);
        });
      }
    );
  };
  
  if (userLoading || !user) {
    return (
      <div className="container py-12 md:py-24 lg:py-32">
        <div className="mx-auto max-w-xl space-y-8">
          <Skeleton className="h-10 w-3/4 mx-auto" />
          <Skeleton className="h-6 w-1/2 mx-auto" />
          <div className="space-y-8">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-12 md:py-24 lg:py-32">
      <div className="space-y-6 text-center mb-12">
        <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">
          Upload a Document
        </h1>
        <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed mx-auto">
          Securely upload your financial documents for review.
        </p>
      </div>
      <Card className="mx-auto max-w-xl">
        <CardHeader>
          <CardTitle>File Upload</CardTitle>
          <CardDescription>
            Select a file from your device to upload.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Input id="file-upload" type="file" onChange={handleFileChange} disabled={isUploading} />
          
          {file && !isUploading && !uploadComplete && (
             <div className="text-sm text-muted-foreground">
                Ready to upload: <strong>{file.name}</strong>
            </div>
          )}

          {isUploading && (
            <div className="space-y-2">
              <Progress value={uploadProgress} />
              <p className="text-sm text-center text-muted-foreground">Uploading... {Math.round(uploadProgress)}%</p>
            </div>
          )}
          
          {uploadComplete && (
            <div className="flex items-center justify-center gap-2 text-green-600">
              <FileCheck className="h-5 w-5" />
              <p>Upload completed successfully!</p>
            </div>
          )}

          <Button onClick={handleUpload} className="w-full" disabled={!file || isUploading}>
            {isUploading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Upload className="mr-2 h-4 w-4" />
            )}
            {isUploading ? 'Uploading...' : 'Upload File'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
