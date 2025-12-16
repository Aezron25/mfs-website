export interface serviceRequest {
  id: string;
  clientId: string;
  serviceType: string;
  description: string;
  status: "pending" | "in-progress" | "completed" | "cancelled";
  assignedStaff?: string;
  createdAt: {
    seconds: number;
    nanoseconds: number;
  } | string;
}

export interface appointment {
    id: string;
    clientId: string;
    date: string;
    time: string;
    serviceType: string;
    status: "confirmed" | "pending" | "cancelled";
}
