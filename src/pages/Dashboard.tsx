import { Calendar, CheckCircle, Clock, TrendingUp, LogOut } from "lucide-react";
import { StatCard } from "@/components/StatCard";
import { AttendanceTable } from "@/components/AttendanceTable";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface DashboardProps {
  userRole: "student" | "teacher";
}

const studentAttendanceData = [
  {
    id: "1",
    studentName: "You",
    date: "2024-01-15",
    time: "09:00 AM",
    status: "present" as const,
    subject: "Mathematics",
  },
  {
    id: "2",
    studentName: "You",
    date: "2024-01-14",
    time: "09:05 AM",
    status: "late" as const,
    subject: "Physics",
  },
  {
    id: "3",
    studentName: "You",
    date: "2024-01-13",
    time: "09:00 AM",
    status: "present" as const,
    subject: "Chemistry",
  },
];

const teacherAttendanceData = [
  {
    id: "1",
    studentName: "John Doe",
    date: "2024-01-15",
    time: "09:00 AM",
    status: "present" as const,
  },
  {
    id: "2",
    studentName: "Jane Smith",
    date: "2024-01-15",
    time: "09:05 AM",
    status: "late" as const,
  },
  {
    id: "3",
    studentName: "Bob Johnson",
    date: "2024-01-15",
    time: "-",
    status: "absent" as const,
  },
];

export default function Dashboard({ userRole }: DashboardProps) {
  const isStudent = userRole === "student";
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/login");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            {isStudent ? "Student Dashboard" : "Teacher Dashboard"}
          </h1>
          <p className="text-muted-foreground">
            {isStudent ? "Track your attendance and performance" : "Monitor class attendance and manage sessions"}
          </p>
        </div>
        <Button onClick={handleLogout} variant="outline" size="sm">
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {isStudent ? (
          <>
            <StatCard title="Total Classes" value="24" icon={Calendar} />
            <StatCard
              title="Present"
              value="22"
              icon={CheckCircle}
              trend={{ value: 5, isPositive: true }}
            />
            <StatCard title="Attendance Rate" value="91.7%" icon={TrendingUp} />
            <StatCard title="Late Arrivals" value="2" icon={Clock} />
          </>
        ) : (
          <>
            <StatCard title="Total Students" value="45" icon={Calendar} />
            <StatCard
              title="Present Today"
              value="42"
              icon={CheckCircle}
              description="93.3% attendance"
            />
            <StatCard title="Absent" value="3" icon={Clock} />
            <StatCard
              title="Average Attendance"
              value="89.5%"
              icon={TrendingUp}
              trend={{ value: 3, isPositive: true }}
            />
          </>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Attendance Records</CardTitle>
          <CardDescription>
            {isStudent ? "Your recent attendance history" : "Latest attendance entries"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AttendanceTable records={isStudent ? studentAttendanceData : teacherAttendanceData} />
        </CardContent>
      </Card>
    </div>
  );
}
