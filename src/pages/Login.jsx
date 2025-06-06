
import { useContext,useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Mail, Lock, ArrowRight, Star, Sparkles,Eye,EyeOff } from "lucide-react";
import { Link } from "react-router-dom";

import Swal from "sweetalert2";
import { BioContext } from '../context/authContext';

import {loginWeb} from '../api/api';

const motivationalQuotes = [
  "Turn leads into legends, one client at a time! 🚀",
  "Your next big project is just one click away! ✨",
  "Building websites, building dreams! 💫",
  "Code with passion, design with purpose! 🎨",
  "Every pixel tells a story, every client matters! 💎"
];

const Login = () => {


    const { setAccessToken,accessToken,setisLogin,isLogin,setUserDetails } = useContext(BioContext);
 
   const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
   const toggleShow = () => setShowPassword((prev) => !prev);


  const [data,setData]=useState({
    'username':'',
    'password':''
  
  });

  const {username,password}=data;



  const changeHandler=(e)=>{
    setData({...data,[e.target.name]:e.target.value})
  }

    const payload=()=>{
    return {
       ...data,
       fcm_token :"kfdjghfdjgh"
    }
   
  }





  const navigate = useNavigate();
  const [quote] = useState(motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)]);


  const handleLogin = async (e) => {
    e.preventDefault();
   setIsLoading(true);
     try {
        //  const response= await api.post('web-login',payload());
         const response= await loginWeb(payload());

         console.log(response);
         if(response.data.status){

      //  setAccessToken(response.data.access_token);
      setAccessToken(response.data.access_token);
        setUserDetails(response.data.user); 
       
        setisLogin(true);
           Swal.fire({
              icon: 'success',
              title: 'Login Successful',
              text: 'Welcome back!',
              timer: 2000,
              showConfirmButton: false,
            });
            setIsLoading(false);

         }else {
             Swal.fire({
              icon: 'error',
              title: 'Validation Errors',
              text:response.data.message,
              timer: 2000,
              showConfirmButton: false,
            });
              setIsLoading(false);
         }
        console.log(response)
    } catch (error) {
      console.error(error);
        setIsLoading(false);
    }
    
    console.log(data);


  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 via-purple-800 to-indigo-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-64 h-64 bg-white/10 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-400/20 rounded-full blur-2xl animate-bounce"></div>
        <div className="absolute top-1/2 left-1/3 w-32 h-32 bg-pink-300/30 rounded-full blur-lg animate-ping"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
          
          {/* Left side - Motivational content */}
          <div className="text-center lg:text-left space-y-8">
            <div className="space-y-4">
              <div className="flex items-center justify-center lg:justify-start space-x-2">
                <Sparkles className="h-8 w-8 text-yellow-400 animate-spin" />
                <h1 className="text-4xl lg:text-6xl font-bold text-white">
                  Ozrit <span className="text-purple-300">CRM</span>
                </h1>
              </div>
              <p className="text-xl text-purple-200">
                Your creative command center
              </p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
              <div className="flex items-center space-x-3 mb-4">
                <Star className="h-6 w-6 text-yellow-400 fill-current" />
                <span className="text-purple-200 font-medium">Daily Inspiration</span>
              </div>
              <p className="text-2xl font-semibold text-white leading-relaxed">
                {quote}
              </p>
            </div>
            
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="bg-white/10 rounded-xl p-4">
                <div className="text-2xl font-bold text-white">127</div>
                <div className="text-purple-200 text-sm">Happy Clients</div>
              </div>
              <div className="bg-white/10 rounded-xl p-4">
                <div className="text-2xl font-bold text-white">89</div>
                <div className="text-purple-200 text-sm">Projects Done</div>
              </div>
              <div className="bg-white/10 rounded-xl p-4">
                <div className="text-2xl font-bold text-white">98%</div>
                <div className="text-purple-200 text-sm">Success Rate</div>
              </div>
            </div>
          </div>
          
          {/* Right side - Login form */}
          <div className="flex justify-center">
            <Card className="w-full max-w-md bg-white/95 backdrop-blur-lg border-0 shadow-2xl">
              <CardHeader className="text-center pb-2">
                <CardTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                  Welcome Back!
                </CardTitle>
                <p className="text-gray-600">Sign in to your creative hub</p>
              </CardHeader>
              <CardContent className="space-y-6">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-gray-700 font-medium">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="your@email.com"
                        name="username"
                        value={username}
                        onChange={changeHandler}
                        className="pl-10 h-12 border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                        required
                         autoComplete="new-username"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-gray-700 font-medium">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={changeHandler}
                        className="pl-10 h-12 border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                        required
                      />
                       <button
                        type="button"
                        onClick={toggleShow}
                        className="absolute right-3 top-3 flex items-center justify-center"
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5 text-gray-500" />
                        ) : (
                          <Eye className="h-5 w-5 text-gray-500" />
                        )}
                      </button>
                    </div>
                     {/* Forgot Password link */}
                      <div className="text-right">
                        <Link
                          to="/forgot-password"
                          className="text-sm text-purple-600 hover:underline"
                        >
                          Forgot Password?
                        </Link>
                      </div>
                  </div>
                  
                   <button
        type="submit"
        disabled={isLoading}
        className={`
          w-full h-12
          bg-gradient-to-r from-purple-600 to-indigo-600
          hover:from-purple-700 hover:to-indigo-700
          text-white font-medium
          transition-all duration-200 transform
          hover:scale-105
          ${isLoading ? 'opacity-60 cursor-not-allowed hover:scale-100' : ''}
        `}
      >
        {isLoading ? (
          // Simple spinner + text
          <div className="flex items-center justify-center space-x-2">
            <svg
              className="h-5 w-5 animate-spin text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              />
            </svg>
            <span>Loading…</span>
          </div>
        ) : (
          // Default “Sign In” state
          <div className="flex items-center justify-center">
            <span>Sign In </span>
            <ArrowRight className="ml-2 h-4 w-4" />
          </div>
        )}
      </button>

                </form>
                
              
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
