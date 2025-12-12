import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const OAuth2Redirect = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { setAuth } = useAuthStore();

  useEffect(() => {
    const token = searchParams.get('token');
    const userId = searchParams.get('userId');
    const username = searchParams.get('username');
    const email = searchParams.get('email');
    const role = searchParams.get('role');
    const error = searchParams.get('error');

    if (error) {
      alert('OAuth login failed: ' + error);
      navigate('/login');
      return;
    }

    if (token && userId && username && email && role) {
      // Save authentication
      const user = {
        id: userId,
        username: username,
        email: email,
        role: role
      };
      
      setAuth(user, token);
      
      // Show success message
      setTimeout(() => {
        navigate('/');
      }, 1000);
    } else {
      alert('Missing OAuth data');
      navigate('/login');
    }
  }, [searchParams, navigate, setAuth]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a0a] via-[#121212] to-[#0a0a0a] flex flex-col items-center justify-center">
      <LoadingSpinner size="large" />
      <p className="text-white text-xl mt-6 animate-pulse">Completing Google Sign-In...</p>
      <p className="text-gray-400 mt-2">Please wait...</p>
    </div>
  );
};

export default OAuth2Redirect;

