'use client';

import { useToast } from '@/components/ui/toast';
import { AuthResponse } from '@/types/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { DefaultValues, FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import { ZodType } from 'zod';

interface UseAuthFormProps<T extends FieldValues> {
  schema: ZodType<T>;
  defaultValues: DefaultValues<T>;
  onSubmit: (data: T) => Promise<AuthResponse>;
  successMessage?: string;
}

export function useAuthForm<T extends FieldValues>({
  schema,
  defaultValues,
  onSubmit,
  successMessage,
}: UseAuthFormProps<T>) {
  const [isLoading, setIsLoading] = useState(false);
  const { addToast } = useToast();
  const router = useRouter();

  const form = useForm<T>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const handleSubmit: SubmitHandler<T> = async (data) => {
    setIsLoading(true);
    try {
      const response = await onSubmit(data);

      if (response.success) {
        if (successMessage) {
          addToast({
            type: 'success',
            description: successMessage,
          });
        }

        // Store token temporarily for dev/mock
        if (response.sessionToken) {
          localStorage.setItem('dengue_session_token', response.sessionToken);
        }

        if (response.redirectTo) {
          router.push(response.redirectTo);
        }
      } else {
        addToast({
          type: 'error',
          description: response.error || 'Ocorreu um erro. Tente novamente.',
        });
      }
    } catch (_error) {
      addToast({
        type: 'error',
        description: 'Erro de conexão. Verifique sua internet.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    form,
    isLoading,
    handleSubmit: form.handleSubmit(handleSubmit),
  };
}
