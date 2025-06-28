
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { TrendingUp, Mail, Lock, Eye, EyeOff, BarChart3, Sparkles } from 'lucide-react';
import { z } from 'zod';
import { useAuth } from '@/context/AuthContext';
import { ThemeToggle } from '@/components/ThemeToggle';

const loginSchema = z.object({
  email: z.string().email({ message: "Email inválido" }),
  password: z.string().min(6, { message: "Senha deve ter pelo menos 6 caracteres" })
});

const Index = () => {
  const navigate = useNavigate();
  const { signIn, user, isLoading: authLoading } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
  }>({});

  const [isPageLoaded, setIsPageLoaded] = useState(false);
  
  useEffect(() => {
    setIsPageLoaded(true);
  }, []);

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const validateForm = () => {
    try {
      loginSchema.parse(formData);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: {
          email?: string;
          password?: string;
        } = {};
        
        error.errors.forEach(err => {
          if (err.path[0]) {
            newErrors[err.path[0] as keyof typeof newErrors] = err.message;
          }
        });
        
        setErrors(newErrors);
      }
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      const { error } = await signIn(formData.email, formData.password);
      
      if (error) {
        console.error('Login error:', error);
        toast.error(error.message || 'Erro ao fazer login. Tente novamente.');
      } else {
        toast.success('Login realizado com sucesso!');
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      toast.error('Erro ao fazer login. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-blue-600 dark:bg-gray-900">
        <div className="h-16 w-16 border-4 border-t-transparent border-yellow-400 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex relative overflow-hidden">
      <div className="absolute top-4 right-4 z-30">
        <ThemeToggle />
      </div>
      
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=1920&h=1080&fit=crop" 
          alt="Financial background" 
          className="w-full h-full object-cover transition-opacity duration-1000 opacity-80"
        />
        <div className="absolute inset-0 backdrop-blur-md bg-blue-600/30 dark:bg-gray-900/50"></div>
      </div>
      
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-10">
        <div className="absolute top-[10%] left-[5%] w-28 h-28 rounded-full bg-yellow-400 dark:bg-amber-500 opacity-20 animate-float"></div>
        <div className="absolute bottom-[20%] right-[10%] w-40 h-40 rounded-full bg-yellow-400 dark:bg-amber-500 opacity-10 animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-[40%] right-[20%] w-24 h-24 rounded-full bg-yellow-400 dark:bg-amber-500 opacity-15 animate-float" style={{ animationDelay: '2s' }}></div>
        
        <TrendingUp className="absolute top-[15%] right-[25%] w-16 h-16 text-white opacity-10 animate-bounce" style={{ animationDelay: '1.5s' }} />
        <BarChart3 className="absolute bottom-[30%] left-[15%] w-20 h-20 text-white opacity-10 animate-float" style={{ animationDelay: '2.5s' }} />
        <TrendingUp className="absolute top-[60%] right-[10%] w-12 h-12 text-yellow-400 dark:text-amber-500 opacity-15 animate-pulse" style={{ animationDelay: '0.5s' }} />
        <BarChart3 className="absolute top-[25%] left-[30%] w-10 h-10 text-yellow-400 dark:text-amber-500 opacity-15 animate-pulse" style={{ animationDelay: '1.2s' }} />
        <Sparkles className="absolute bottom-[15%] right-[25%] w-14 h-14 text-white opacity-10 animate-pulse" style={{ animationDelay: '1.8s' }} />
      </div>
      
      <div 
        className={`m-auto z-20 px-6 py-8 transition-all duration-700 transform ${isPageLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
      >
        <div className="w-full max-w-md mx-auto">
          <form 
            onSubmit={handleSubmit} 
            className="glass-card dark:bg-gray-800/40 rounded-2xl p-8 space-y-6 animate-fade-in"
            style={{ backdropFilter: "blur(16px)" }}
          >
            <h1 className="text-2xl font-bold text-white text-center mb-2 animate-slide-up" style={{ animationDelay: '0.2s' }}>
              Bem-vindo ao Unicapital!
            </h1>
            <p className="text-white/80 text-center mb-6 animate-slide-up" style={{ animationDelay: '0.3s' }}>
              Entre para gerenciar seu sistema
            </p>

            <div className="space-y-4 animate-slide-up" style={{ animationDelay: '0.4s' }}>
              <div className="relative group">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 h-5 w-5 group-hover:text-yellow-400 transition-colors duration-300" />
                <Input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`pl-10 h-12 bg-white/10 dark:bg-gray-700/50 border-white/20 text-white rounded-md transition-all duration-300 hover:border-yellow-400/50 ${errors.email ? 'border-red-400' : 'focus:border-yellow-400'}`}
                />
                {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email}</p>}
              </div>

              <div className="relative group">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 h-5 w-5 group-hover:text-yellow-400 transition-colors duration-300" />
                <Input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Senha"
                  value={formData.password}
                  onChange={handleChange}
                  className={`pl-10 h-12 bg-white/10 dark:bg-gray-700/50 border-white/20 text-white rounded-md transition-all duration-300 hover:border-yellow-400/50 ${errors.password ? 'border-red-400' : 'focus:border-yellow-400'}`}
                />
                <button 
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 h-5 w-5 hover:text-yellow-400 transition-colors duration-300"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
                {errors.password && <p className="text-red-400 text-sm mt-1">{errors.password}</p>}
              </div>
            </div>

            <div className="flex items-center justify-between animate-slide-up" style={{ animationDelay: '0.5s' }}>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="remember"
                  className="w-4 h-4 bg-white/10 dark:bg-gray-700/50 border-white/20 rounded focus:ring-yellow-400 text-yellow-400"
                />
                <label htmlFor="remember" className="ml-2 text-sm text-white/80 hover:text-white transition-colors duration-300">
                  Lembrar-me
                </label>
              </div>
              <a href="#" className="text-sm text-yellow-400 hover:text-white transition-colors duration-300">
                Esqueceu a senha?
              </a>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full button-hover-effect bg-yellow-400 hover:bg-amber-500 text-gray-900 font-bold py-3 px-4 rounded-md flex items-center justify-center transition-all duration-300 animate-slide-up"
              style={{ animationDelay: '0.6s' }}
            >
              {isLoading ? (
                <div className="h-5 w-5 border-2 border-gray-900 border-t-transparent rounded-full animate-spin mr-2"></div>
              ) : (
                <TrendingUp className="mr-2 h-5 w-5" />
              )}
              {isLoading ? "Entrando..." : "Login"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Index;
