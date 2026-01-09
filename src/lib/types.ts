import type { Timestamp } from 'firebase/firestore';

export type UserProfile = {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'roles_admin';
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
  participants: string[];
  participantNames: { [key: string]: string };
  participantImages: { [key: string]: string };
  lastMessage: string;
  lastMessageAt: Timestamp;
  createdAt: Timestamp;
};

export type Message = {
  id: string;
  senderId: string;
  text: string;
  read: boolean;
  createdAt: Timestamp;
};

export type ServiceRequest = {
  id: string;
  clientId: string;
  expertId?: string;
  serviceType: string;
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled';
  description: string;
  createdAt: Timestamp;
};

export type DocumentMetadata = {
  path: string;
  name: string;
  size: number;
  uploadDate: Date;
};
