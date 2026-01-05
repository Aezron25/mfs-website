'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useFirestore } from '@/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import type { ServiceRequest } from '@/lib/types';
import { errorEmitter } from '@/firebase/error-emitter';

const availableStatuses: ServiceRequest['status'][] = [
  'pending',
  'in-progress',
  'completed',
  'cancelled',
];

interface UpdateStatusDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  request: ServiceRequest | null;
  onStatusUpdate?: () => void;
}

export function UpdateStatusDialog({
  isOpen,
  onOpenChange,
  request,
  onStatusUpdate,
}: UpdateStatusDialogProps) {
  const firestore = useFirestore();
  const { toast } = useToast();
  const [newStatus, setNewStatus] = useState<ServiceRequest['status'] | ''>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!request) return null;

  const handleUpdateStatus = async () => {
    if (!newStatus || newStatus === request.status) {
      onOpenChange(false);
      return;
    }
    if (!firestore) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Firestore is not available.',
      });
      return;
    }

    setIsSubmitting(true);
    const requestRef = doc(firestore, 'serviceRequests', request.id);

    try {
      await updateDoc(requestRef, { status: newStatus });
      toast({
        title: 'Status Updated',
        description: `The request status has been updated to "${newStatus}".`,
      });
      onStatusUpdate?.();
      onOpenChange(false);
    } catch (error) {
       errorEmitter.emit('permission-error', {
        path: requestRef.path,
        operation: 'update',
        requestResourceData: { status: newStatus },
      } as any);

      console.error('Error updating status:', error);
       if ((error as any).name !== 'FirestorePermissionError') {
            toast({
                variant: 'destructive',
                title: 'Update Failed',
                description: 'Could not update the status. Please try again.',
            });
       }
    } finally {
      setIsSubmitting(false);
      setNewStatus('');
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Request Status</DialogTitle>
          <DialogDescription>
            Select the new status for this service request. The client will be
            notified of this change.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <Select
            onValueChange={(value) => setNewStatus(value as ServiceRequest['status'])}
            defaultValue={request.status}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a new status" />
            </SelectTrigger>
            <SelectContent>
              {availableStatuses.map((status) => (
                <SelectItem key={status} value={status}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button onClick={handleUpdateStatus} disabled={!newStatus || isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
              </>
            ) : (
              'Save'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
