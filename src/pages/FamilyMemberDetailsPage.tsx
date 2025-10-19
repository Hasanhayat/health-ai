import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  User,
  Calendar,
  Users,
  Loader2,
  FileText,
  Pill,
  Activity,
  Upload,
  ChevronDown,
  ExternalLink,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import { Badge } from "../components/ui/badge";
import { Separator } from "../components/ui/separator";
import { Navbar } from "../components/Navbar";
import { ReportUploadSection } from "../components/ReportUploadSection";
import { familyMemberAPI } from "../services/api";
import { FamilyMember } from "../types";
import { toast } from "sonner@2.0.3";

export function FamilyMemberDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [member, setMember] = useState<FamilyMember | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("reports");
  const [expandedReports, setExpandedReports] = useState<{[key: number]: boolean}>({});

  useEffect(() => {
    if (id) {
      loadMemberDetails();
    }
  }, [id]);

  const loadMemberDetails = async () => {
    if (!id) return;
    setIsLoading(true);
    try {
      const response = await familyMemberAPI.getById(id);
      setMember(response.familyMember || response);
    } catch (error: any) {
      toast.error(
        error.response?.data?.message ||
          "Failed to load member details",
      );
      navigate("/dashboard");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-teal-50">
        <Navbar />
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-12 w-12 text-teal-600 animate-spin" />
        </div>
      </div>
    );
  }

  if (!member) {
    return null;
  }

  const getGenderColor = (gender: string) => {
    if (gender.toLowerCase() === "male")
      return "bg-blue-100 text-blue-700";
    if (gender.toLowerCase() === "female")
      return "bg-pink-100 text-pink-700";
    return "bg-gray-100 text-gray-700";
  };

  const toggleReportExpansion = (index: number) => {
    setExpandedReports(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const shouldTruncateAnalysis = (text: string) => text.length > 400;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-teal-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          whileHover={{ x: -5 }}
        >
          <Button
            variant="ghost"
            onClick={() => navigate("/dashboard")}
            className="mb-6 text-gray-600 hover:text-teal-600 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </motion.div>

        {/* Member Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="mb-8 border-gray-200 hover:shadow-lg transition-shadow duration-300">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <motion.div 
                  whileHover={{ rotate: 360, scale: 1.1 }}
                  transition={{ duration: 0.5 }}
                  className="bg-gradient-to-br from-teal-100 to-blue-100 p-4 rounded-full"
                >
                  <User className="h-10 w-10 text-teal-600" />
                </motion.div>
                <div>
                  <CardTitle className="text-teal-700">
                    {member.name}
                  </CardTitle>
                  <CardDescription className="mt-1">
                    Health records and medical information
                  </CardDescription>
                </div>
              </div>
              <Badge
                variant="outline"
                className={getGenderColor(member.gender)}
              >
                {member.gender}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-3 gap-6">
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-gray-500">Age</p>
                  <p className="text-gray-900">
                    {member.age} years
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Users className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-gray-500">Relationship</p>
                  <p className="text-gray-900">
                    {member.relationship}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-gray-500">Reports</p>
                  <p className="text-gray-900">
                    {member.reports?.length || 0} uploaded
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
          </Card>
        </motion.div>

        {/* Tabs Section */}
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:inline-grid">
            <TabsTrigger value="reports" className="gap-2">
              <FileText className="h-4 w-4" />
              Reports
            </TabsTrigger>
            <TabsTrigger value="history" className="gap-2">
              <Activity className="h-4 w-4" />
              Medical History
            </TabsTrigger>
            <TabsTrigger value="medications" className="gap-2">
              <Pill className="h-4 w-4" />
              Medications
            </TabsTrigger>
          </TabsList>

          <TabsContent value="reports" className="space-y-6">
            <div>
              <h3 className="text-gray-900 mb-4">
                Upload New Report
              </h3>
              <ReportUploadSection
                memberId={member._id}
                onUploadSuccess={loadMemberDetails}
              />
            </div>

            <div>
              <h3 className="text-gray-900 mb-4">
                Previous Reports
              </h3>
              {member.reports && member.reports.length > 0 ? (
                <div className="grid md:grid-cols-2 gap-4">
                    {member.reports.map((report, index) => {
                      const isExpanded = expandedReports[index];
                      const analysisText = report.aiAnalysis || '';
                      const shouldTruncate = !isExpanded && shouldTruncateAnalysis(analysisText);
                      const displayText = shouldTruncate 
                        ? analysisText.substring(0, 400) + '...' 
                        : analysisText;

                      return (
                        <motion.div
                          key={report._id || index}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <Card className="border-gray-200 hover:shadow-lg transition-shadow duration-300">
                            <CardHeader>
                              <CardTitle className="flex items-center gap-2">
                                <motion.div
                                  whileHover={{ rotate: 360 }}
                                  transition={{ duration: 0.5 }}
                                >
                                  <FileText className="h-5 w-5 text-teal-600" />
                                </motion.div>
                                {report.title}
                              </CardTitle>
                              {report.uploadDate && (
                                <CardDescription className="flex items-center gap-2">
                                  <Calendar className="h-3 w-3" />
                                  {new Date(report.uploadDate).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                  })}
                                </CardDescription>
                              )}
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-3">
                                <div>
                                  <div className="flex items-center justify-between mb-2">
                                    <p className="text-gray-600 flex items-center gap-2">
                                      <Activity className="h-4 w-4 text-teal-600" />
                                      AI Health Analysis:
                                    </p>
                                    {report.cloudinaryUrl && (
                                      <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => window.open(report.cloudinaryUrl, "_blank")}
                                        className="text-teal-600 hover:text-teal-700 flex items-center gap-1 transition-colors"
                                      >
                                        <ExternalLink className="h-4 w-4" />
                                        <span>View File</span>
                                      </motion.button>
                                    )}
                                  </div>
                                  <motion.div 
                                    className="bg-gradient-to-br from-teal-50 to-blue-50 border border-teal-200 rounded-lg p-4 shadow-sm"
                                    whileHover={{ scale: 1.01 }}
                                    transition={{ duration: 0.2 }}
                                  >
                                    <p className="text-gray-900 whitespace-pre-wrap leading-relaxed">
                                      {displayText}
                                    </p>
                                  </motion.div>
                                  
                                  {shouldTruncateAnalysis(analysisText) && (
                                    <motion.button
                                      initial={{ opacity: 0 }}
                                      animate={{ opacity: 1 }}
                                      transition={{ delay: 0.2 }}
                                      onClick={() => toggleReportExpansion(index)}
                                      className="mt-3 text-teal-600 hover:text-teal-700 flex items-center gap-1 transition-colors"
                                      whileHover={{ x: 5 }}
                                    >
                                      <ChevronDown 
                                        className={`h-4 w-4 transition-transform duration-300 ${
                                          isExpanded ? 'rotate-180' : ''
                                        }`} 
                                      />
                                      <span>{isExpanded ? 'Show less' : 'Read full analysis'}</span>
                                    </motion.button>
                                  )}
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      );
                    })}
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <Card className="border-gray-200">
                    <CardContent className="pt-6 text-center py-12">
                      <motion.div
                        animate={{ 
                          y: [0, -10, 0],
                          rotate: [0, 5, -5, 0]
                        }}
                        transition={{ duration: 3, repeat: Infinity }}
                      >
                        <FileText className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                      </motion.div>
                      <p className="text-gray-600">
                        No reports uploaded yet
                      </p>
                      <p className="text-gray-500">
                        Upload medical reports to get AI-powered
                        analysis
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="history">
            <Card className="border-gray-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-teal-700">
                  <Activity className="h-5 w-5" />
                  Medical History
                </CardTitle>
                <CardDescription>
                  Past conditions and treatments
                </CardDescription>
              </CardHeader>
              <CardContent>
                {member.medicalHistory &&
                member.medicalHistory.length > 0 ? (
                  <div className="space-y-4">
                    {member.medicalHistory.map(
                      (history, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          whileHover={{ x: 5 }}
                        >
                          {index > 0 && (
                            <Separator className="my-4" />
                          )}
                          <div className="space-y-2 p-3 rounded-lg hover:bg-blue-50 transition-colors">
                            <div className="flex items-start justify-between">
                              <h4 className="text-gray-900">
                                {history.condition}
                              </h4>
                              <Badge
                                variant="outline"
                                className="bg-blue-50 text-blue-700"
                              >
                                {new Date(
                                  history.date,
                                ).toLocaleDateString()}
                              </Badge>
                            </div>
                            {history.notes && (
                              <p className="text-gray-600">
                                {history.notes}
                              </p>
                            )}
                          </div>
                        </motion.div>
                      ),
                    )}
                  </div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-12"
                  >
                    <motion.div
                      animate={{ 
                        y: [0, -10, 0],
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Activity className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                    </motion.div>
                    <p className="text-gray-600">
                      No medical history recorded
                    </p>
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="medications">
            <Card className="border-gray-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-teal-700">
                  <Pill className="h-5 w-5" />
                  Current Medications
                </CardTitle>
                <CardDescription>
                  Active prescriptions and supplements
                </CardDescription>
              </CardHeader>
              <CardContent>
                {member.medications &&
                member.medications.length > 0 ? (
                  <div className="space-y-4">
                    {member.medications.map(
                      (medication, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          whileHover={{ x: 5 }}
                        >
                          {index > 0 && (
                            <Separator className="my-4" />
                          )}
                          <div className="space-y-2 p-3 rounded-lg hover:bg-purple-50 transition-colors">
                            <h4 className="text-gray-900 flex items-center gap-2">
                              <Pill className="h-4 w-4 text-purple-600" />
                              {medication.name}
                            </h4>
                            <div className="grid sm:grid-cols-2 gap-4 text-gray-600">
                              <div>
                                <span className="text-gray-500">
                                  Dosage:{" "}
                                </span>
                                {medication.dosage}
                              </div>
                              <div>
                                <span className="text-gray-500">
                                  Frequency:{" "}
                                </span>
                                {medication.frequency}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ),
                    )}
                  </div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-12"
                  >
                    <motion.div
                      animate={{ 
                        rotate: [0, 10, -10, 0],
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Pill className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                    </motion.div>
                    <p className="text-gray-600">
                      No medications recorded
                    </p>
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}