'use client';

import { AuthCard } from '@/app/auth/components/AuthCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuthForm } from '@/hooks/use-auth-form';
import { forgotPassword } from '@/lib/api/auth';
import Link from 'next/link';
import { useState } from 'react';
import { z } from 'zod';

const forgotPasswordSchema = z.object({
  email: z.email({ message: 'E-mail inválido' }),
});

export default function ForgotPasswordPage() {
  const [isSuccess, setIsSuccess] = useState(false);

  const { form, isLoading, handleSubmit } = useAuthForm({
    schema: forgotPasswordSchema,
    defaultValues: {
      email: '',
    },
    onSubmit: async (data) => {
      await forgotPassword(data.email);
      setIsSuccess(true);
    },
    successMessage: 'Link enviado com sucesso!',
  });

  const {
    register,
    formState: { errors },
  } = form;

  if (isSuccess) {
    return (
      <AuthCard
        title='Verifique seu e-mail'
        description='Enviamos um link de recuperação para o e-mail informado.'
      >
        <div className='grid gap-6'>
          <div className='text-center text-sm text-muted-foreground'>
            <p className='mb-4'>
              O link é válido por 24 horas. Caso não receba em alguns minutos, verifique sua caixa de spam.
            </p>
          </div>
          <Link href='/auth/login'>
            <Button className='w-full' variant='outline'>
              Voltar para o Login
            </Button>
          </Link>
        </div>
      </AuthCard>
    );
  }

  return (
    <AuthCard
      title='Recuperar senha'
      description='Digite seu e-mail para receber um link de redefinição'
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

            <Button disabled={isLoading}>
              {isLoading && (
                <span className='mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent' />
              )}
              Enviar Link
            </Button>
          </div>
        </form>

        <div className='text-center text-sm text-muted-foreground'>
          Lembrou sua senha?{' '}
          <Link href='/auth/login' className='underline underline-offset-4 hover:text-primary'>
            Voltar para o Login
          </Link>
        </div>
      </div>
    </AuthCard>
  );
}
