import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlayCircle, StopCircle, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { StudentList } from "@/components/StudentList";

interface Session {
  id: number;
  subject: string;
  startTime: string;
  endTime: string | null;
  isActive: boolean;
  attendanceCount: number;
}

export default function CaptureAttendance() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [subject, setSubject] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const { toast } = useToast();

  const createSession = () => {
    if (!subject.trim()) {
      toast({
        title: "Error",
        description: "Please enter a subject name",
        variant: "destructive",
      });
      return;
    }

    const newSession: Session = {
      id: Date.now(),
      subject: subject,
      startTime: new Date().toLocaleTimeString(),
      endTime: null,
      isActive: true,
      attendanceCount: 0,
    };

    setSessions([newSession, ...sessions]);
    setSubject("");
    setShowCreateForm(false);
    toast({
      title: "Session Started",
      description: `${subject} session is now active. Students can mark attendance.`,
    });
  };

  const endSession = (sessionId: number) => {
    setSessions(sessions.map(s => 
      s.id === sessionId 
        ? { ...s, isActive: false, endTime: new Date().toLocaleTimeString() }
        : s
    ));
    toast({
      title: "Session Ended",
      description: "Attendance session has been stopped",
    });
  };

  const deleteSession = (sessionId: number) => {
    setSessions(sessions.filter(s => s.id !== sessionId));
    toast({
      title: "Session Deleted",
      description: "Session has been removed",
    });
  };

  const activeSession = sessions.find(s => s.isActive);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Manage Sessions</h1>
          <p className="text-muted-foreground">Create and manage attendance sessions for students</p>
        </div>
        <Button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="gap-2"
          disabled={activeSession !== undefined}
        >
          <Plus className="h-4 w-4" />
          Create Session
        </Button>
      </div>

      {activeSession && (
        <>
          <Card className="bg-success/10 border-success">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-success font-medium mb-1">
                    ✓ Active Session: {activeSession.subject}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Started at {activeSession.startTime} • {activeSession.attendanceCount} students marked
                  </p>
                </div>
                <Button
                  onClick={() => endSession(activeSession.id)}
                  variant="destructive"
                  size="sm"
                  className="gap-2"
                >
                  <StopCircle className="h-4 w-4" />
                  End Session
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <StudentList />
        </>
      )}

      {showCreateForm && !activeSession && (
        <Card>
          <CardHeader>
            <CardTitle>Create New Session</CardTitle>
            <CardDescription>Start a new attendance session for a subject</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="subject">Subject Name</Label>
              <Input
                id="subject"
                placeholder="e.g., Mathematics, Physics"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={createSession} className="gap-2">
                <PlayCircle className="h-4 w-4" />
                Start Session
              </Button>
              <Button onClick={() => setShowCreateForm(false)} variant="outline">
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Session History</CardTitle>
          <CardDescription>All attendance sessions</CardDescription>
        </CardHeader>
        <CardContent>
          {sessions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No sessions created yet. Click "Create Session" to start.
            </div>
          ) : (
            <div className="space-y-3">
              {sessions.map((session) => (
                <div
                  key={session.id}
                  className="flex items-center justify-between p-4 rounded-lg border bg-card"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold">{session.subject}</h4>
                      <Badge variant={session.isActive ? "default" : "secondary"}>
                        {session.isActive ? "Active" : "Ended"}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {session.startTime} {session.endTime && `- ${session.endTime}`} • {session.attendanceCount} students
                    </p>
                  </div>
                  {!session.isActive && (
                    <Button
                      onClick={() => deleteSession(session.id)}
                      variant="ghost"
                      size="sm"
                      className="gap-2 text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
