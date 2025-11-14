import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Camera, CheckCircle2, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";

export default function RegisterFace() {
  const [step, setStep] = useState<"start" | "capturing" | "processing" | "success">("start");
  const [captureCount, setCaptureCount] = useState(0);
  const navigate = useNavigate();
  const { toast } = useToast();

  const startCapture = () => {
    setStep("capturing");
    // Simulate multiple face captures for ML training
    let count = 0;
    const interval = setInterval(() => {
      count += 1;
      setCaptureCount(count);
      if (count >= 5) {
        clearInterval(interval);
        setStep("processing");
        setTimeout(() => {
          setStep("success");
          toast({
            title: "Face Registered Successfully!",
            description: "Your face data has been saved for attendance recognition",
          });
        }, 2000);
      }
    }, 1000);
  };

  const handleComplete = () => {
    navigate("/student-attendance");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/5 p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">Register Your Face</CardTitle>
          <CardDescription>
            We'll capture multiple angles to train the recognition system
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {step === "start" && (
            <div className="text-center space-y-6">
              <div className="mx-auto w-64 h-64 bg-muted rounded-lg flex items-center justify-center">
                <Camera className="h-24 w-24 text-muted-foreground" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">First Time Setup</h3>
                <p className="text-muted-foreground">
                  We'll capture 5 photos of your face from different angles to ensure accurate recognition
                </p>
              </div>
              <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 space-y-2">
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-5 w-5 text-primary mt-0.5" />
                  <div className="text-left text-sm">
                    <p className="font-medium text-foreground">Tips for best results:</p>
                    <ul className="mt-2 space-y-1 text-muted-foreground">
                      <li>• Ensure good lighting</li>
                      <li>• Look directly at the camera</li>
                      <li>• Remove glasses if possible</li>
                      <li>• Keep a neutral expression</li>
                    </ul>
                  </div>
                </div>
              </div>
              <Button onClick={startCapture} size="lg" className="w-full">
                Start Face Registration
              </Button>
            </div>
          )}

          {step === "capturing" && (
            <div className="text-center space-y-6">
              <div className="mx-auto w-64 h-64 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg flex items-center justify-center animate-pulse">
                <Camera className="h-24 w-24 text-primary" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Capturing Face Data</h3>
                <p className="text-muted-foreground">
                  Photo {captureCount} of 5 - Hold still...
                </p>
                <Progress value={(captureCount / 5) * 100} className="w-full" />
              </div>
            </div>
          )}

          {step === "processing" && (
            <div className="text-center space-y-6">
              <div className="mx-auto w-64 h-64 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg flex items-center justify-center">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary"></div>
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Processing Face Data</h3>
                <p className="text-muted-foreground">
                  Training the ML model with your face data...
                </p>
              </div>
            </div>
          )}

          {step === "success" && (
            <div className="text-center space-y-6">
              <div className="mx-auto w-64 h-64 bg-success/10 rounded-lg flex items-center justify-center">
                <CheckCircle2 className="h-24 w-24 text-success" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-success">Registration Complete!</h3>
                <p className="text-muted-foreground">
                  Your face has been successfully registered. You can now mark attendance using face recognition.
                </p>
              </div>
              <Button onClick={handleComplete} size="lg" className="w-full">
                Continue to Attendance
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
