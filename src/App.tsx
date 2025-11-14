import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AttendanceSidebar } from "@/components/AttendanceSidebar";
import Dashboard from "./pages/Dashboard";
import CaptureAttendance from "./pages/CaptureAttendance";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import RegisterFace from "./pages/RegisterFace";
import StudentAttendance from "./pages/StudentAttendance";
import StudentProfile from "./pages/StudentProfile";
import NotFound from "./pages/NotFound";
import { Button } from "@/components/ui/button";
import { UserCircle } from "lucide-react";

const queryClient = new QueryClient();

const App = () => {
  const [userRole, setUserRole] = useState<"student" | "teacher">("student");

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/register-face" element={<RegisterFace />} />
            <Route path="/student-attendance" element={<StudentAttendance />} />
            <Route
              path="/*"
              element={
                <SidebarProvider>
                  <div className="min-h-screen flex w-full bg-background">
                    <AttendanceSidebar userRole={userRole} />
                    <div className="flex-1 flex flex-col">
                      <header className="h-16 border-b border-border flex items-center justify-between px-6 bg-card">
                        <SidebarTrigger className="lg:hidden" />
                        <div className="flex-1"></div>
                        <div className="flex items-center gap-4">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setUserRole(userRole === "student" ? "teacher" : "student")}
                          >
                            Switch to {userRole === "student" ? "Teacher" : "Student"} View
                          </Button>
                          <div className="flex items-center gap-2">
                            <UserCircle className="h-8 w-8 text-muted-foreground" />
                            <div className="text-sm">
                              <div className="font-medium">{userRole === "student" ? "Student User" : "Teacher User"}</div>
                              <div className="text-xs text-muted-foreground capitalize">{userRole}</div>
                            </div>
                          </div>
                        </div>
                      </header>
                      <main className="flex-1 p-6 overflow-auto">
                        <Routes>
                          <Route path="/" element={<Dashboard userRole={userRole} />} />
                          <Route path="/capture" element={<CaptureAttendance />} />
                          <Route path="/attendance" element={<Dashboard userRole={userRole} />} />
                          <Route path="/profile" element={<StudentProfile />} />
                          <Route path="/records" element={<Dashboard userRole={userRole} />} />
                          <Route path="/students" element={<Dashboard userRole={userRole} />} />
                          <Route path="*" element={<NotFound />} />
                        </Routes>
                      </main>
                    </div>
                  </div>
                </SidebarProvider>
              }
            />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
