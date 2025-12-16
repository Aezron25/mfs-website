
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';

export default function AdminAppointmentsPage() {
  return (
     <div className="space-y-8">
       <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
          Appointments
        </h1>
        <p className="text-muted-foreground">
          Manage all scheduled client appointments.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
            <Card>
                <CardHeader>
                    <CardTitle>Appointment List</CardTitle>
                    <CardDescription>View and manage upcoming appointments.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="text-center text-muted-foreground py-24">
                        <p>Appointment list will be shown here.</p>
                    </div>
                </CardContent>
            </Card>
        </div>
        <div>
            <Card>
                <CardContent className="p-0">
                    <Calendar
                        mode="single"
                        className="p-3 w-full"
                    />
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
