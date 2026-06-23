import { memo, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAuth } from '../../hooks/useAuth';
import { login as loginThunk } from '../../store/authSlice';
import { loginSchema } from '../../utils/validators';
import { FormField } from '@/components/common/form-field';
// Force Vite HMR Cache Invalidation
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { MOCK_CREDENTIALS } from '../../services/mockData';

type LoginFormValues = yup.InferType<typeof loginSchema>;

const LoginPage = memo(function LoginPage() {
  const { login, loading, error, clearError, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as any)?.from?.pathname ?? '/dashboard';

  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: yupResolver(loginSchema) as any,
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    clearError();
    const result = await login(data.email, data.password);
    if (loginThunk.fulfilled.match(result)) {
      navigate(from, { replace: true });
    }
  };

  return (
    <div className="relative flex min-h-[100dvh] items-center justify-center bg-gradient-to-br from-emerald-50 via-green-50/80 to-white p-4">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -right-[10%] h-[500px] w-[500px] rounded-full bg-emerald-200/40 mix-blend-multiply blur-[100px] animate-pulse duration-10000" />
        <div className="absolute -bottom-[20%] -left-[10%] h-[500px] w-[500px] rounded-full bg-green-200/40 mix-blend-multiply blur-[100px] animate-pulse duration-10000" />
      </div>

      <Card className="relative z-10 w-full max-w-md border-white/60 bg-white/70 shadow-2xl backdrop-blur-xl transition-all duration-300 hover:shadow-emerald-500/10">
        <CardHeader className="space-y-3 text-center pb-2 pt-8">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary">
            <svg
              className="h-8 w-8 text-primary-foreground"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <div className="space-y-1">
            <CardTitle className="text-3xl font-bold tracking-tight text-foreground">
              Admin Analytics
            </CardTitle>
            <CardDescription className="text-base text-muted-foreground">
              Sign in to continue
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="pb-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
            <div className="space-y-4">
              <FormField
                label="Email"
                type="email"
                placeholder="name@yopmail.com"
                autoComplete="email"
                error={errors.email?.message}
                {...register('email')}
              />
              <FormField
                label="Password"
                type="password"
                placeholder="••••••••"
                autoComplete="current-password"
                error={errors.password?.message}
                {...register('password')}
              />
            </div>

            {error ? (
              <Alert variant="destructive" className="bg-destructive/10 backdrop-blur-sm">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            ) : null}

            <Button
              type="submit"
              className="h-12 w-full text-base font-medium shadow-md transition-all hover:shadow-lg disabled:opacity-70 cursor-pointer"
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              ) : null}
              Sign in
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
});

export default LoginPage;
