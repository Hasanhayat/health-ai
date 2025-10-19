import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Users, Loader2, Activity, TrendingUp, Heart } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Navbar } from '../components/Navbar';
import { FamilyMemberCard } from '../components/FamilyMemberCard';
import { AddMemberDialog } from '../components/AddMemberDialog';
import { AIHealthChat } from '../components/AIHealthChat';
import { motion } from 'motion/react';
import { dashboardAPI, familyMemberAPI } from '../services/api';
import { FamilyMember } from '../types';
import { toast } from 'sonner@2.0.3';

export function DashboardPage() {
  const navigate = useNavigate();
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    setIsLoading(true);
    try {
      const response = await dashboardAPI.getDashboard();
      setFamilyMembers(response.familyMembers || []);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to load dashboard');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddMember = async (data: {
    name: string;
    age: number;
    gender: string;
    relationship: string;
  }) => {
    try {
      await familyMemberAPI.create(data);
      toast.success('Family member added successfully!');
      loadDashboard();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to add family member');
      throw error;
    }
  };

  const handleViewDetails = (id: string) => {
    navigate(`/family-member/${id}`);
  };

  const totalReports = familyMembers.reduce((acc, member) => acc + (member.reports?.length || 0), 0);
  const totalMedications = familyMembers.reduce((acc, member) => acc + (member.medications?.length || 0), 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-teal-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        {!isLoading && familyMembers.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
          >
            <motion.div whileHover={{ scale: 1.03 }} transition={{ duration: 0.2 }}>
              <Card className="border-gray-200 shadow-md hover:shadow-lg transition-shadow bg-gradient-to-br from-white to-teal-50">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-gray-600">Family Members</CardTitle>
                  <Users className="h-5 w-5 text-teal-600" />
                </CardHeader>
                <CardContent>
                  <div className="flex items-baseline gap-2">
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                      className="text-gray-900"
                    >
                      {familyMembers.length}
                    </motion.span>
                    <span className="text-gray-500">registered</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div whileHover={{ scale: 1.03 }} transition={{ duration: 0.2 }}>
              <Card className="border-gray-200 shadow-md hover:shadow-lg transition-shadow bg-gradient-to-br from-white to-blue-50">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-gray-600">Medical Reports</CardTitle>
                  <Activity className="h-5 w-5 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="flex items-baseline gap-2">
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 200, delay: 0.3 }}
                      className="text-gray-900"
                    >
                      {totalReports}
                    </motion.span>
                    <span className="text-gray-500">uploaded</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div whileHover={{ scale: 1.03 }} transition={{ duration: 0.2 }}>
              <Card className="border-gray-200 shadow-md hover:shadow-lg transition-shadow bg-gradient-to-br from-white to-purple-50">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-gray-600">Active Medications</CardTitle>
                  <Heart className="h-5 w-5 text-purple-600" />
                </CardHeader>
                <CardContent>
                  <div className="flex items-baseline gap-2">
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 200, delay: 0.4 }}
                      className="text-gray-900"
                    >
                      {totalMedications}
                    </motion.span>
                    <span className="text-gray-500">tracked</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        )}

        {/* Family Members Section */}
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center justify-between"
          >
            <div>
              <h1 className="text-gray-900 flex items-center gap-2">
                <Users className="h-8 w-8 text-teal-600" />
                Family Members
              </h1>
              <p className="text-gray-600 mt-1">Manage your family's health information</p>
            </div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={() => setIsAddDialogOpen(true)}
                className="bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700 shadow-md hover:shadow-lg transition-all"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Member
              </Button>
            </motion.div>
          </motion.div>

          {isLoading ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center justify-center py-20"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <Loader2 className="h-12 w-12 text-teal-600" />
              </motion.div>
            </motion.div>
          ) : familyMembers.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="bg-white rounded-2xl border border-gray-200 p-12 text-center shadow-md">
                <motion.div
                  animate={{ 
                    y: [0, -10, 0],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                </motion.div>
                <h3 className="text-gray-700 mb-2">No family members yet</h3>
                <p className="text-gray-500 mb-6">
                  Start by adding your first family member to track their health
                </p>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    onClick={() => setIsAddDialogOpen(true)}
                    className="bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700 shadow-md hover:shadow-lg transition-all"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Your First Member
                  </Button>
                </motion.div>
              </Card>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {familyMembers.map((member, index) => (
                <motion.div
                  key={member._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <FamilyMemberCard
                    member={member}
                    onViewDetails={handleViewDetails}
                  />
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>

        {/* AI Health Assistant Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-8"
        >
          <AIHealthChat />
        </motion.div>
      </div>

      <AddMemberDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onSubmit={handleAddMember}
      />
    </div>
  );
}
