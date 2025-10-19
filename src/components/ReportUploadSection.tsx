import { useState } from "react";
import {
  Upload,
  FileText,
  Loader2,
  CheckCircle,
} from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Progress } from "./ui/progress";
import { familyMemberAPI } from "../services/api";
import { toast } from "sonner@2.0.3";

interface ReportUploadSectionProps {
  memberId: string;
  onUploadSuccess: () => void;
}

export function ReportUploadSection({
  memberId,
  onUploadSuccess,
}: ReportUploadSectionProps) {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      const validTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "application/pdf",
      ];

      if (!validTypes.includes(selectedFile.type)) {
        toast.error(
          "Please upload a valid image (JPG, PNG) or PDF file",
        );
        return;
      }

      if (selectedFile.size > 10 * 1024 * 1024) {
        toast.error("File size should be less than 10MB");
        return;
      }

      setFile(selectedFile);
      if (!title) {
        setTitle(selectedFile.name.split(".")[0]);
      }
    }
  };

  const handleUpload = async () => {
    if (!file || !title.trim()) {
      toast.error("Please select a file and enter a title");
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    const formData = new FormData();
    formData.append("report", file);
    formData.append("title", title);

    // Simulate progress for better UX
    const progressInterval = setInterval(() => {
      setUploadProgress((prev) => Math.min(prev + 10, 90));
    }, 200);

    try {
      await familyMemberAPI.uploadReport(
        memberId,
        formData,
      );
      setUploadProgress(100);
      toast.success(
        'Report uploaded and analyzed successfully!'
      );
      setFile(null);
      setTitle("");
      onUploadSuccess();
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Failed to upload report"
      );
    } finally {
      clearInterval(progressInterval);
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  return (
    <Card className="border-gray-200">
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Report Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Blood Test Report"
              disabled={isUploading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="file">
              Upload File (PDF or Image)
            </Label>
            <div className="flex items-center gap-2">
              <Input
                id="file"
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileChange}
                disabled={isUploading}
                className="flex-1"
              />
            </div>
            <p className="text-gray-500">
              Maximum file size: 10MB
            </p>
          </div>

          {file && (
            <div className="bg-teal-50 border border-teal-200 rounded-lg p-3 flex items-center gap-3">
              <FileText className="h-5 w-5 text-teal-600" />
              <div className="flex-1">
                <p className="text-gray-900">{file.name}</p>
                <p className="text-gray-500">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
              {!isUploading && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setFile(null)}
                  className="text-red-600 hover:text-red-700"
                >
                  Remove
                </Button>
              )}
            </div>
          )}

          {isUploading && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-gray-600">
                <span>Uploading and analyzing...</span>
                <span>{uploadProgress}%</span>
              </div>
              <Progress
                value={uploadProgress}
                className="h-2"
              />
            </div>
          )}

          <Button
            onClick={handleUpload}
            disabled={!file || !title.trim() || isUploading}
            className="w-full bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700"
          >
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Upload & Analyze
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}