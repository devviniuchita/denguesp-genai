'use client';

import { AuthCard } from '@/app/auth/components/AuthCard';
import { SocialButton } from '@/app/auth/components/SocialButton';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PasswordInput } from '@/components/ui/password-input';
import { Separator } from '@/components/ui/separator';
import { useAuthForm } from '@/hooks/use-auth-form';
import { login } from '@/lib/api/auth';
import Link from 'next/link';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.email({ message: 'E-mail inválido' }),
  password: z.string().min(1, 'A senha é obrigatória'),
});

export default function LoginPage() {
  const { form, isLoading, handleSubmit } = useAuthForm({
    schema: loginSchema,
    defaultValues: {
      email: '',
      password: '',
    },
    onSubmit: login,
    successMessage: 'Login realizado com sucesso!',
  });

  const {
    register,
    formState: { errors },
  } = form;

  return (
    <AuthCard
      title='Bem-vindo de volta'
      description='Entre com seu e-mail e senha para acessar sua conta'
    >
      <div className='grid gap-6'>
        <form onSubmit={handleSubmit}>
          <div className='grid gap-4'>
            <div className='grid gap-2'>
              <Label htmlFor='email'>E-mail</Label>
              <Input
                id='email'
                placeholder='nome@exemplo.com'
                type='email'
                autoCapitalize='none'
                autoComplete='email'
                autoCorrect='off'
                disabled={isLoading}
                {...register('email')}
              />
              {errors.email && <p className='text-sm text-red-500'>{errors.email.message}</p>}
            </div>
            <div className='grid gap-2'>
              <div className='flex items-center justify-between'>
                <Label htmlFor='password'>Senha</Label>
                <Link
                  href='#'
                  className='text-sm font-medium text-muted-foreground hover:underline'
                >
                  Esqueceu a senha?
                </Link>
              </div>
              <PasswordInput
                id='password'
                autoComplete='current-password'
                disabled={isLoading}
                {...register('password')}
              />
              {errors.password && <p className='text-sm text-red-500'>{errors.password.message}</p>}
            </div>
            <Button disabled={isLoading}>
              {isLoading && (
                <span className='mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent' />
              )}
              Entrar
            </Button>
          </div>
        </form>

        <div className='relative'>
          <div className='absolute inset-0 flex items-center'>
            <Separator />
          </div>
          <div className='relative flex justify-center text-xs uppercase'>
            <span className='bg-background px-2 text-muted-foreground'>Ou continue com</span>
          </div>
        </div>

        <SocialButton />

        <div className='text-center text-sm text-muted-foreground'>
          Não tem uma conta?{' '}
          <Link href='/auth/register' className='underline underline-offset-4 hover:text-primary'>
            Cadastre-se
          </Link>
        </div>
      </div>
    </AuthCard>
  );
}
