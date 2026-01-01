
import type { Timestamp } from 'firebase/firestore';

export type UserProfile = {
  id: string;
  name: string;
  email: string;
  role: 'client' | 'expert';
  createdAt: Timestamp;
};

export type Appointment = {
  id: string;
  clientId: string;
  expertId: string;
  date: string; 
  time: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  notes?: string;
  createdAt: Timestamp;
};

export type Conversation = {
  id: string;
  clientId: string;
  expertId: string;
  lastMessage: string;
  updatedAt: Timestamp;
};

export type Message = {
  id: string;
  conversationId: string;
  senderId: string;
  text?: string;
  fileUrl?: string;
  fileName?: string;
  createdAt: Timestamp;
};
