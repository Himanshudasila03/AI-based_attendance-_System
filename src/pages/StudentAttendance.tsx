import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Camera, Clock, CheckCircle2, XCircle, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function StudentAttendance() {
  const [activeSessions, setActiveSessions] = useState([
    { id: 1, subject: "Mathematics", teacher: "Dr. Smith", startTime: "09:00 AM", endTime: "10:30 AM", marked: false },
    { id: 2, subject: "Physics", teacher: "Prof. Johnson", startTime: "11:00 AM", endTime: "12:30 PM", marked: true },
  ]);
  const [isCapturing, setIsCapturing] = useState(false);
  const [selectedSession, setSelectedSession] = useState<number | null>(null);
  const { toast } = useToast();

  const handleMarkAttendance = (sessionId: number) => {
    setSelectedSession(sessionId);
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
        description: "Your attendance has been recorded successfully",
      });
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Mark Attendance</h1>
          <p className="text-muted-foreground">Active sessions available for attendance</p>
        </div>

        {activeSessions.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Active Sessions</h3>
              <p className="text-muted-foreground">
                There are no active attendance sessions at the moment. Check back later.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {activeSessions.map((session) => (
              <Card key={session.id} className={session.marked ? "border-success/50 bg-success/5" : ""}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        {session.subject}
                        {session.marked && <CheckCircle2 className="h-5 w-5 text-success" />}
                      </CardTitle>
                      <CardDescription>Teacher: {session.teacher}</CardDescription>
                    </div>
                    <Badge variant={session.marked ? "default" : "secondary"}>
                      {session.marked ? "Marked" : "Active"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span>{session.startTime} - {session.endTime}</span>
                    </div>
                  </div>

                  {!session.marked && (
                    <>
                      {isCapturing && selectedSession === session.id ? (
                        <div className="space-y-4">
                          <div className="aspect-video bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg flex items-center justify-center animate-pulse">
                            <Camera className="h-16 w-16 text-primary" />
                          </div>
                          <p className="text-center text-sm text-muted-foreground">
                            Recognizing your face...
                          </p>
                        </div>
                      ) : (
                        <Button 
                          onClick={() => handleMarkAttendance(session.id)} 
                          className="w-full gap-2"
                          disabled={isCapturing}
                        >
                          <Camera className="h-4 w-4" />
                          Mark Attendance with Face Recognition
                        </Button>
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
            <CardDescription>Your attendance status for today</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-success/10 rounded-lg">
                <div className="text-2xl font-bold text-success">
                  {activeSessions.filter(s => s.marked).length}
                </div>
                <div className="text-sm text-muted-foreground">Marked</div>
              </div>
              <div className="text-center p-4 bg-warning/10 rounded-lg">
                <div className="text-2xl font-bold text-warning">
                  {activeSessions.filter(s => !s.marked).length}
                </div>
                <div className="text-sm text-muted-foreground">Pending</div>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-foreground">
                  {activeSessions.length}
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
