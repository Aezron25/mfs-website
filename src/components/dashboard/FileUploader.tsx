'use client';

import { useState, useCallback } from 'react';
import { useDropzone, FileRejection } from 'react-dropzone';
import { User } from 'firebase/auth';
import { ref, uploadBytesResumable, UploadTask } from 'firebase/storage';
import { useStorage } from '@/firebase';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { FileUp, X, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FileUploaderProps {
  user: User;
  onUploadSuccess: () => void;
  onUploadError: (error: Error) => void;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export function FileUploader({ user, onUploadSuccess, onUploadError }: FileUploaderProps) {
  const storage = useStorage();
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadTask, setUploadTask] = useState<UploadTask | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [uploadComplete, setUploadComplete] = useState(false);

  const onDrop = useCallback(
    (acceptedFiles: File[], fileRejections: FileRejection[]) => {
      setError(null);
      setUploadComplete(false);

      if (fileRejections.length > 0) {
        const rejection = fileRejections[0];
        if (rejection.errors.some(e => e.code === 'file-too-large')) {
          setError(`File is too large. Max size is ${MAX_FILE_SIZE / 1024 / 1024}MB.`);
        } else {
          setError(rejection.errors[0].message);
        }
        return;
      }
      
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        handleUpload(file);
      }
    },
    [user, storage]
  );

  const handleUpload = (file: File) => {
    if (!user) {
      onUploadError(new Error("User is not authenticated."));
      return;
    }

    const storageRef = ref(storage, `uploads/${user.uid}/${file.name}`);
    const task = uploadBytesResumable(storageRef, file);

    setUploadTask(task);
    setUploading(true);
    setProgress(0);

    task.on(
      'state_changed',
      (snapshot) => {
        const prog = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
        setProgress(prog);
      },
      (error) => {
        console.error('Upload error:', error);
        setUploading(false);
        setUploadTask(null);
        setError(error.message);
        onUploadError(error);
      },
      () => {
        setUploading(false);
        setUploadTask(null);
        setUploadComplete(true);
        onUploadSuccess();
        setTimeout(() => setUploadComplete(false), 3000); // Reset after 3 seconds
      }
    );
  };

  const cancelUpload = () => {
    if (uploadTask) {
      uploadTask.cancel();
      setUploading(false);
      setProgress(0);
      setUploadTask(null);
      setError("Upload cancelled.");
    }
  };


  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    maxSize: MAX_FILE_SIZE,
    disabled: uploading,
  });

  return (
    <div
      {...getRootProps()}
      className={cn(
        "flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-lg cursor-pointer transition-colors",
        isDragActive ? "border-primary bg-primary/10" : "border-border",
        uploading ? "cursor-default" : "hover:border-primary/50"
      )}
    >
      <input {...getInputProps()} />

      {uploading ? (
        <div className="text-center w-full">
            <p className='font-medium mb-2'>Uploading...</p>
            <Progress value={progress} className="mb-4" />
            <p className='text-sm text-muted-foreground mb-4'>{progress}%</p>
            <Button variant="outline" size="sm" onClick={(e) => { e.stopPropagation(); cancelUpload(); }}>
                <X className='mr-2 h-4 w-4' /> Cancel
            </Button>
        </div>
      ) : uploadComplete ? (
        <div className="text-center text-green-600">
            <CheckCircle2 className="h-12 w-12 mx-auto mb-2" />
            <p className="font-semibold">Upload Complete!</p>
        </div>
      ) : (
        <div className="text-center">
            <FileUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            {isDragActive ? (
                <p className="font-semibold text-primary">Drop the file here...</p>
            ) : (
                <>
                <p className="font-semibold">Drag & drop a file here</p>
                <p className="text-sm text-muted-foreground mt-1">or click to select a file</p>
                </>
            )}
             {error && <p className="text-destructive text-sm mt-4">{error}</p>}
        </div>
      )}
    </div>
  );
}
