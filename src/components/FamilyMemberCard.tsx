import { User, Calendar, Users, FileText, Activity } from 'lucide-react';
import { Card, CardContent, CardFooter } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { motion } from 'motion/react';
import { FamilyMember } from '../types';

interface FamilyMemberCardProps {
  member: FamilyMember;
  onViewDetails: (id: string) => void;
}

export function FamilyMemberCard({ member, onViewDetails }: FamilyMemberCardProps) {
  const getGenderColor = (gender: string) => {
    if (gender.toLowerCase() === 'male') return 'bg-blue-100 text-blue-700';
    if (gender.toLowerCase() === 'female') return 'bg-pink-100 text-pink-700';
    return 'bg-gray-100 text-gray-700';
  };

  const reportCount = member.reports?.length || 0;
  const medicalHistoryCount = member.medicalHistory?.length || 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
    >
      <Card className="hover:shadow-xl transition-all duration-300 border-gray-200 overflow-hidden group">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-teal-500 to-blue-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
        
        <CardContent className="pt-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <motion.div 
                whileHover={{ rotate: 360, scale: 1.1 }}
                transition={{ duration: 0.5 }}
                className="bg-gradient-to-br from-teal-100 to-blue-100 p-3 rounded-full"
              >
                <User className="h-6 w-6 text-teal-600" />
              </motion.div>
              <div>
                <h3 className="text-gray-900">{member.name}</h3>
                <Badge variant="outline" className={getGenderColor(member.gender)}>
                  {member.gender}
                </Badge>
              </div>
            </div>
          </div>

          <div className="space-y-2 text-gray-600">
            <motion.div 
              whileHover={{ x: 5 }}
              className="flex items-center gap-2"
            >
              <Calendar className="h-4 w-4 text-gray-400" />
              <span>{member.age} years old</span>
            </motion.div>
            <motion.div 
              whileHover={{ x: 5 }}
              className="flex items-center gap-2"
            >
              <Users className="h-4 w-4 text-gray-400" />
              <span>{member.relationship}</span>
            </motion.div>
          </div>

          {/* Health Stats */}
          <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-2 gap-3">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="bg-teal-50 rounded-lg p-2 text-center"
            >
              <FileText className="h-4 w-4 text-teal-600 mx-auto mb-1" />
              <p className="text-teal-700">{reportCount}</p>
              <p className="text-gray-500">Reports</p>
            </motion.div>
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="bg-blue-50 rounded-lg p-2 text-center"
            >
              <Activity className="h-4 w-4 text-blue-600 mx-auto mb-1" />
              <p className="text-blue-700">{medicalHistoryCount}</p>
              <p className="text-gray-500">History</p>
            </motion.div>
          </div>
        </CardContent>

        <CardFooter>
          <motion.div 
            className="w-full"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button
              onClick={() => onViewDetails(member._id)}
              className="w-full bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700 shadow-md hover:shadow-lg transition-all"
            >
              View Details
            </Button>
          </motion.div>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
