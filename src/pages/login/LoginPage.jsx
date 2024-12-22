import { Button } from '@/components/ui/button';
import useAuth from '@/hooks/useAuth/useAuth';

import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';


const LoginPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const {signIn,user}=useAuth()
  const navigate = useNavigate()

  const onSubmit = async(data) => {
    console.log('Login Data:', data);
  await  signIn(data.email,data.password)
  navigate(-1)
  toast.success('login successful')
  };
  console.log('user',user);
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-sm w-full">
        <h1 className="text-2xl font-bold mb-4 text-gray-800">Dashboard Login</h1>
        <p className="text-sm text-gray-600 mb-6">Welcome back! Please login to your account.</p>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Email Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <input
              type="email"
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                  message: 'Invalid email address',
                },
              })}
              className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="example@domain.com"
            />
            {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>}
          </div>

          {/* Password Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              {...register('password', {
                required: 'Password is required',
                minLength: { value: 6, message: 'Password must be at least 6 characters' },
              })}
              className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none ${
                errors.password ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter your password"
            />
            {errors.password && <p className="text-sm text-red-500 mt-1">{errors.password.message}</p>}
          </div>

          {/* Remember Me and Forgot Password */}
          <div className="flex justify-between items-center">
            <label className="flex items-center text-sm text-gray-600">
              <input type="checkbox" className="mr-2 rounded border-gray-300" />
              Remember me
            </label>
            <a href="#" className="text-sm text-blue-600 hover:underline">
              Forgot Password?
            </a>
          </div>

          {/* Submit Button */}
          <Button className='w-full' type="submit">Login</Button>
        </form>

      </div>
    </div>
  );
};

export default LoginPage;
