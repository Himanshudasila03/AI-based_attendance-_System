import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Camera, Clock, CheckCircle2, XCircle, AlertCircle, MapPin, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getCurrentLocation, isWithinRadius, formatDistance, Location } from "@/lib/location";

interface Session {
  id: number;
  subject: string;
  teacher: string;
  teacherLocation: Location;
  startTime: string;
  endTime: string;
  marked: boolean;
  enrolled: boolean; // Student is enrolled in this session
}

export default function StudentAttendance() {
  // Mock enrolled sessions - in real app, this would come from API based on student's enrollments
  const [activeSessions, setActiveSessions] = useState<Session[]>([
    {
      id: 1,
      subject: "Mathematics",
      teacher: "Dr. Smith",
      teacherLocation: { latitude: 28.6139, longitude: 77.2090 }, // Mock Delhi location
      startTime: "09:00 AM",
      endTime: "10:30 AM",
      marked: false,
      enrolled: true,
    },
    {
      id: 2,
      subject: "Physics",
      teacher: "Prof. Johnson",
      teacherLocation: { latitude: 28.6129, longitude: 77.2295 }, // Mock nearby location
      startTime: "11:00 AM",
      endTime: "12:30 PM",
      marked: false,
      enrolled: true,
    },
    {
      id: 3,
      subject: "Computer Science",
      teacher: "Dr. Williams",
      teacherLocation: { latitude: 28.6149, longitude: 77.2085 },
      startTime: "02:00 PM",
      endTime: "03:30 PM",
      marked: false,
      enrolled: true,
    },
  ]);
  const [isCapturing, setIsCapturing] = useState(false);
  const [isCheckingLocation, setIsCheckingLocation] = useState(false);
  const [selectedSession, setSelectedSession] = useState<number | null>(null);
  const { toast } = useToast();

  // Filter to show only enrolled sessions
  const enrolledSessions = activeSessions.filter(session => session.enrolled);

  const handleMarkAttendance = async (sessionId: number) => {
    const session = activeSessions.find(s => s.id === sessionId);
    if (!session) return;

    setSelectedSession(sessionId);
    setIsCheckingLocation(true);

    try {
      // Step 1: Check location permission and get current location
      const studentLocation = await getCurrentLocation();

      // Step 2: Verify student is within 100m of teacher
      const withinRadius = isWithinRadius(
        studentLocation,
        session.teacherLocation,
        100 // 100 meters radius
      );

      setIsCheckingLocation(false);

      if (!withinRadius) {
        // Calculate actual distance for error message
        const distance = formatDistance(
          Math.sqrt(
            Math.pow(studentLocation.latitude - session.teacherLocation.latitude, 2) +
            Math.pow(studentLocation.longitude - session.teacherLocation.longitude, 2)
          ) * 111320 // Rough conversion to meters
        );

        toast({
          title: "Too Far Away",
          description: `You must be within 100m of the teacher to mark attendance. You are approximately ${distance} away.`,
          variant: "destructive",
        });
        setSelectedSession(null);
        return;
      }

      // Step 3: Location verified, now proceed with face recognition
      setIsCapturing(true);

      // Simulate face recognition
      setTimeout(() => {
        setActiveSessions(sessions =>
          sessions.map(s => s.id === sessionId ? { ...s, marked: true } : s)
        );
        setIsCapturing(false);
        setSelectedSession(null);
        toast({
          title: "Attendance Marked!",
          description: "Your attendance has been recorded successfully with face and location verification",
        });
      }, 2000);

    } catch (error) {
      setIsCheckingLocation(false);
      setSelectedSession(null);
      toast({
        title: "Location Permission Required",
        description: error instanceof Error ? error.message : "Please enable location access to mark attendance",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Mark Attendance</h1>
          <p className="text-muted-foreground">Active sessions available for attendance</p>
        </div>

        {enrolledSessions.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Active Sessions</h3>
              <p className="text-muted-foreground">
                You don't have any enrolled sessions at the moment. Check back later or contact your administrator.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {enrolledSessions.map((session) => (
              <Card key={session.id} className={session.marked ? "border-success/50 bg-success/5" : ""}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="flex items-center gap-2">
                        {session.subject}
                        {session.marked && <CheckCircle2 className="h-5 w-5 text-success" />}
                      </CardTitle>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <User className="h-4 w-4" />
                        <span className="font-medium">{session.teacher}</span>
                      </div>
                    </div>
                    <Badge variant={session.marked ? "default" : "secondary"}>
                      {session.marked ? "Marked" : "Active"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>{session.startTime} - {session.endTime}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>Location required</span>
                    </div>
                  </div>

                  {!session.marked && (
                    <>
                      {isCheckingLocation && selectedSession === session.id ? (
                        <div className="space-y-4">
                          <div className="p-6 bg-primary/10 rounded-lg flex flex-col items-center justify-center animate-pulse">
                            <MapPin className="h-12 w-12 text-primary mb-3" />
                            <p className="text-center text-sm font-medium">
                              Checking your location...
                            </p>
                            <p className="text-center text-xs text-muted-foreground mt-1">
                              Please allow location access when prompted
                            </p>
                          </div>
                        </div>
                      ) : isCapturing && selectedSession === session.id ? (
                        <div className="space-y-4">
                          <div className="aspect-video bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg flex items-center justify-center animate-pulse">
                            <Camera className="h-16 w-16 text-primary" />
                          </div>
                          <p className="text-center text-sm text-muted-foreground">
                            Recognizing your face...
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <Button
                            onClick={() => handleMarkAttendance(session.id)}
                            className="w-full gap-2"
                            disabled={isCapturing || isCheckingLocation}
                          >
                            <Camera className="h-4 w-4" />
                            Mark Attendance
                          </Button>
                          <p className="text-xs text-center text-muted-foreground">
                            You must be within 100m of the teacher's location to mark attendance
                          </p>
                        </div>
                      )}
                    </>
                  )}

                  {session.marked && (
                    <div className="flex items-center gap-2 text-success p-3 bg-success/10 rounded-lg">
                      <CheckCircle2 className="h-5 w-5" />
                      <span className="text-sm font-medium">Attendance marked successfully</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Today's Summary</CardTitle>
            <CardDescription>Your enrolled sessions for today</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-success/10 rounded-lg">
                <div className="text-2xl font-bold text-success">
                  {enrolledSessions.filter(s => s.marked).length}
                </div>
                <div className="text-sm text-muted-foreground">Marked</div>
              </div>
              <div className="text-center p-4 bg-warning/10 rounded-lg">
                <div className="text-2xl font-bold text-warning">
                  {enrolledSessions.filter(s => !s.marked).length}
                </div>
                <div className="text-sm text-muted-foreground">Pending</div>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-foreground">
                  {enrolledSessions.length}
                </div>
                <div className="text-sm text-muted-foreground">Total Sessions</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
