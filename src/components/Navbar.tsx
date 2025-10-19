import { LogOut, Heart, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { clearAuth, getAuth } from '../services/auth';
import { Button } from './ui/button';
import { Avatar, AvatarFallback } from './ui/avatar';

export function Navbar() {
  const navigate = useNavigate();
  const { user } = getAuth();

  const handleLogout = () => {
    clearAuth();
    navigate('/login');
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/dashboard')}>
            <div className="bg-gradient-to-br from-teal-500 to-blue-600 p-2 rounded-lg">
              <Heart className="h-6 w-6 text-white" />
            </div>
            <span className="text-teal-700">HealthCare+</span>
          </div>

          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/dashboard')}
              className="text-gray-600 hover:text-teal-600"
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              AI Assistant
            </Button>

            <div className="flex items-center gap-3">
              <Avatar className="h-9 w-9">
                <AvatarFallback className="bg-teal-100 text-teal-700">
                  {user?.name ? getInitials(user.name) : 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="hidden sm:block">
                <div className="text-gray-900">{user?.name}</div>
                <div className="text-gray-500">{user?.email}</div>
              </div>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-gray-600 hover:text-red-600"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
