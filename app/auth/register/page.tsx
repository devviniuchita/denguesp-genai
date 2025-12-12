'use client';

import { AuthCard } from '@/app/auth/components/AuthCard';
import { SocialButton } from '@/app/auth/components/SocialButton';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PasswordInput } from '@/components/ui/password-input';
import { Separator } from '@/components/ui/separator';
import { useAuthForm } from '@/hooks/use-auth-form';
import { register as registerApi } from '@/lib/api/auth';
import Link from 'next/link';
import { Controller } from 'react-hook-form';
import { z } from 'zod';

const registerSchema = z
  .object({
    name: z.string().min(2, 'O nome deve ter pelo menos 2 caracteres'),
    email: z.email({ message: 'E-mail inválido' }),
    password: z
      .string()
      .min(8, 'A senha deve ter pelo menos 8 caracteres')
      .regex(/[A-Z]/, 'Deve conter pelo menos uma letra maiúscula')
      .regex(/[a-z]/, 'Deve conter pelo menos uma letra minúscula')
      .regex(/\d/, 'Deve conter pelo menos um número')
      .regex(/[^A-Za-z0-9]/, 'Deve conter pelo menos um caractere especial'),
    confirmPassword: z.string(),
    termsAccepted: z.boolean().refine((val) => val === true, 'Você deve aceitar os termos'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'As senhas não conferem',
    path: ['confirmPassword'],
  });

export default function RegisterPage() {
  const { form, isLoading, handleSubmit } = useAuthForm({
    schema: registerSchema,
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      termsAccepted: false,
    },
    onSubmit: registerApi,
    successMessage: 'Conta criada com sucesso!',
  });

  const {
    register,
    control,
    formState: { errors },
  } = form;

  return (
    <AuthCard title='Crie sua conta' description='Comece a usar o DengueSP-GenAI hoje mesmo'>
      <div className='grid gap-6'>
        <form onSubmit={handleSubmit}>
          <div className='grid gap-4'>
            <div className='grid gap-2'>
              <Label htmlFor='name'>Nome completo</Label>
              <Input
                id='name'
                placeholder='João Silva'
                autoCapitalize='words'
                autoComplete='name'
                autoCorrect='off'
                disabled={isLoading}
                {...register('name')}
              />
              {errors.name && <p className='text-sm text-red-500'>{errors.name.message}</p>}
            </div>
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
              <Label htmlFor='password'>Senha</Label>
              <PasswordInput
                id='password'
                autoComplete='new-password'
                disabled={isLoading}
                {...register('password')}
              />
              {errors.password && <p className='text-sm text-red-500'>{errors.password.message}</p>}
            </div>
            <div className='grid gap-2'>
              <Label htmlFor='confirmPassword'>Confirmar Senha</Label>
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

            <div className='flex items-center space-x-2'>
              <Controller
                name='termsAccepted'
                control={control}
                render={({ field }) => (
                  <Checkbox
                    id='terms'
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    disabled={isLoading}
                  />
                )}
              />
              <Label
                htmlFor='terms'
                className='text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
              >
                Aceito os{' '}
                <Link href='/termos' className='underline hover:text-primary'>
                  termos de serviço
                </Link>{' '}
                e{' '}
                <Link href='/privacidade' className='underline hover:text-primary'>
                  política de privacidade
                </Link>
              </Label>
            </div>
            {errors.termsAccepted && (
              <p className='text-sm text-red-500'>{errors.termsAccepted.message}</p>
            )}

            <Button disabled={isLoading}>
              {isLoading && (
                <span className='mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent' />
              )}
              Criar conta
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
          Já tem uma conta?{' '}
          <Link href='/auth/login' className='underline underline-offset-4 hover:text-primary'>
            Entrar
          </Link>
        </div>
      </div>
    </AuthCard>
  );
}
