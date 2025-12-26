'use client';

import { AuthCard } from '@/app/auth/components/AuthCard';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { PasswordInput } from '@/components/ui/password-input';
import { useAuthForm } from '@/hooks/use-auth-form';
import { resetPassword } from '@/lib/api/auth';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useState } from 'react';
import { z } from 'zod';

const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, 'A senha deve ter pelo menos 8 caracteres')
      .regex(/[A-Z]/, 'Deve conter pelo menos uma letra maiúscula')
      .regex(/[a-z]/, 'Deve conter pelo menos uma letra minúscula')
      .regex(/\d/, 'Deve conter pelo menos um número')
      .regex(/[^A-Za-z0-9]/, 'Deve conter pelo menos um caractere especial'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'As senhas não conferem',
    path: ['confirmPassword'],
  });

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [isSuccess, setIsSuccess] = useState(false);

  // In a real app, we might check if text token exists or is valid on load

  const { form, isLoading, handleSubmit } = useAuthForm({
    schema: resetPasswordSchema,
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
    onSubmit: async (data) => {
      // Pass token if we had one, or a mock one
      await resetPassword(token || 'mock-token', data.password);
      setIsSuccess(true);
      // Wait a bit and redirect
      setTimeout(() => {
        router.push('/auth/login');
      }, 3000);
    },
    successMessage: 'Senha redefinida com sucesso!',
  });

  const {
    register,
    formState: { errors },
  } = form;

  if (isSuccess) {
    return (
      <AuthCard
        title='Senha alterada!'
        description='Sua senha foi atualizada com sucesso.'
      >
        <div className='grid gap-6'>
          <div className='text-center text-sm text-muted-foreground'>
            <p>Você será redirecionado para o login em instantes...</p>
          </div>
          <Button className='w-full' variant='outline' onClick={() => router.push('/auth/login')}>
            Ir para Login agora
          </Button>
        </div>
      </AuthCard>
    );
  }

  return (
    <AuthCard
      title='Nova senha'
      description='Crie uma nova senha segura para sua conta'
    >
      <div className='grid gap-6'>
        <form onSubmit={handleSubmit}>
          <div className='grid gap-4'>
            <div className='grid gap-2'>
              <Label htmlFor='password'>Nova senha</Label>
              <PasswordInput
                id='password'
                autoComplete='new-password'
                disabled={isLoading}
                {...register('password')}
              />
              {errors.password && <p className='text-sm text-red-500'>{errors.password.message}</p>}
            </div>
            <div className='grid gap-2'>
              <Label htmlFor='confirmPassword'>Confirmar senha</Label>
              <PasswordInput
                id='confirmPassword'
                autoComplete='new-password'
                disabled={isLoading}
                {...register('confirmPassword')}
              />
              {errors.confirmPassword && (
                <p className='text-sm text-red-500'>{errors.confirmPassword.message}</p>
              )}
            </div>

            <Button disabled={isLoading}>
              {isLoading && (
                <span className='mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent' />
              )}
              Redefinir Senha
            </Button>
          </div>
        </form>
      </div>
    </AuthCard>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <ResetPasswordContent />
    </Suspense>
  );
}
