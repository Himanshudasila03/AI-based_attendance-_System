import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Search, Upload, UserPlus, X } from "lucide-react";
import { useState, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

interface Student {
  id: number;
  name: string;
  email: string;
  admissionYear: string;
  stream: string;
  marked: boolean;
}

export function StudentList() {
  const [students, setStudents] = useState<Student[]>([
    { id: 1, name: "John Doe", email: "john@example.com", admissionYear: "2023", stream: "Computer Science", marked: false },
    { id: 2, name: "Jane Smith", email: "jane@example.com", admissionYear: "2022", stream: "Electronics", marked: false },
    { id: 3, name: "Bob Johnson", email: "bob@example.com", admissionYear: "2023", stream: "Computer Science", marked: false },
    { id: 4, name: "Alice Brown", email: "alice@example.com", admissionYear: "2024", stream: "Mechanical", marked: false },
  ]);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [yearFilter, setYearFilter] = useState("all");
  const [streamFilter, setStreamFilter] = useState("all");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newStudent, setNewStudent] = useState({ name: "", email: "", admissionYear: "", stream: "" });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesYear = yearFilter === "all" || student.admissionYear === yearFilter;
    const matchesStream = streamFilter === "all" || student.stream === streamFilter;
    return matchesSearch && matchesYear && matchesStream;
  });

  const uniqueYears = Array.from(new Set(students.map(s => s.admissionYear))).sort();
  const uniqueStreams = Array.from(new Set(students.map(s => s.stream))).sort();

  const handleAddStudent = () => {
    if (!newStudent.name || !newStudent.email || !newStudent.admissionYear || !newStudent.stream) {
      toast({
        title: "Error",
        description: "Please fill all fields",
        variant: "destructive",
      });
      return;
    }

    const student: Student = {
      id: Date.now(),
      ...newStudent,
      marked: false,
    };

    setStudents([...students, student]);
    setNewStudent({ name: "", email: "", admissionYear: "", stream: "" });
    setShowAddDialog(false);
    toast({
      title: "Student Added",
      description: `${student.name} has been added successfully`,
    });
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Mock Excel upload - in real app would parse Excel file
      toast({
        title: "File Uploaded",
        description: `${file.name} - Excel parsing will be implemented with backend`,
      });
    }
  };

  const handleRemoveStudent = (id: number) => {
    setStudents(students.filter(s => s.id !== id));
    toast({
      title: "Student Removed",
      description: "Student has been removed from the list",
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Students in Session</CardTitle>
          <div className="flex gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx,.xls,.csv"
              className="hidden"
              onChange={handleFileUpload}
            />
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="h-4 w-4" />
              Upload Excel
            </Button>
            <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
              <DialogTrigger asChild>
                <Button size="sm" className="gap-2">
                  <UserPlus className="h-4 w-4" />
                  Add Student
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Student Manually</DialogTitle>
                  <DialogDescription>
                    Enter student details to add them to the session
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      value={newStudent.name}
                      onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
                      placeholder="Enter student name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={newStudent.email}
                      onChange={(e) => setNewStudent({ ...newStudent, email: e.target.value })}
                      placeholder="Enter student email"
                    />
                  </div>
                  <div>
                    <Label htmlFor="year">Admission Year</Label>
                    <Input
                      id="year"
                      value={newStudent.admissionYear}
                      onChange={(e) => setNewStudent({ ...newStudent, admissionYear: e.target.value })}
                      placeholder="e.g., 2023"
                    />
                  </div>
                  <div>
                    <Label htmlFor="stream">Stream</Label>
                    <Input
                      id="stream"
                      value={newStudent.stream}
                      onChange={(e) => setNewStudent({ ...newStudent, stream: e.target.value })}
                      placeholder="e.g., Computer Science"
                    />
                  </div>
                  <Button onClick={handleAddStudent} className="w-full">
                    Add Student
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={yearFilter} onValueChange={setYearFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Year" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Years</SelectItem>
              {uniqueYears.map(year => (
                <SelectItem key={year} value={year}>{year}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={streamFilter} onValueChange={setStreamFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Stream" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Streams</SelectItem>
              {uniqueStreams.map(stream => (
                <SelectItem key={stream} value={stream}>{stream}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Admission Year</TableHead>
                <TableHead>Stream</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStudents.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground">
                    No students found
                  </TableCell>
                </TableRow>
              ) : (
                filteredStudents.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell className="font-medium">{student.name}</TableCell>
                    <TableCell>{student.email}</TableCell>
                    <TableCell>{student.admissionYear}</TableCell>
                    <TableCell>{student.stream}</TableCell>
                    <TableCell>
                      {student.marked ? (
                        <Badge variant="default" className="bg-success text-success-foreground">
                          Present
                        </Badge>
                      ) : (
                        <Badge variant="secondary">Pending</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveStudent(student.id)}
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>
            Showing {filteredStudents.length} of {students.length} students
          </span>
          <span>
            {students.filter(s => s.marked).length} marked attendance
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
