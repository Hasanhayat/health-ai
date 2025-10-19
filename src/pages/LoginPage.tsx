import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Heart, Loader2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { authAPI } from '../services/api';
import { setAuth } from '../services/auth';
import { toast } from 'sonner@2.0.3';

export function LoginPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await authAPI.login(formData.email, formData.password);
      setAuth(response.token, response.user);
      toast.success('Login successful!');
      navigate('/dashboard');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-blue-50 to-white flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-gray-200 shadow-xl">
        <CardHeader className="space-y-3 text-center">
          <div className="mx-auto bg-gradient-to-br from-teal-500 to-blue-600 p-3 rounded-2xl w-fit">
            <Heart className="h-10 w-10 text-white" />
          </div>
          <CardTitle className="text-teal-700">Welcome Back</CardTitle>
          <CardDescription>Sign in to manage your family's health</CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="john@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                disabled={isLoading}
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700"
              disabled={isLoading}
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Login
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex justify-center border-t pt-6">
          <p className="text-gray-600">
            Don't have an account?{' '}
            <Link to="/signup" className="text-teal-600 hover:text-teal-700 hover:underline">
              Sign up
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
