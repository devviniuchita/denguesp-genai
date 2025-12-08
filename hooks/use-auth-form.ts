'use client';

import { useToast } from '@/components/ui/toast';
import { AuthResponse } from '@/types/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import {
    DefaultValues,
    FieldValues,
    Resolver,
    SubmitHandler,
    useForm,
    UseFormReturn,
} from 'react-hook-form';
import { z } from 'zod';

// Re-export Zod for consumers
export { z } from 'zod';

interface UseAuthFormProps<T extends FieldValues> {
  schema: z.ZodType<T>;
  defaultValues: DefaultValues<T>;
  onSubmit: (data: T) => Promise<AuthResponse>;
  successMessage?: string;
}

interface UseAuthFormReturn<T extends FieldValues> {
  form: UseFormReturn<T>;
  isLoading: boolean;
  handleSubmit: ReturnType<UseFormReturn<T>['handleSubmit']>;
}

export function useAuthForm<T extends FieldValues>({
  schema,
  defaultValues,
  onSubmit,
  successMessage,
}: UseAuthFormProps<T>): UseAuthFormReturn<T> {
  const [isLoading, setIsLoading] = useState(false);
  const { addToast } = useToast();
  const router = useRouter();

  // Type assertion to handle Zod 4 / @hookform/resolvers compatibility
  // zodResolver runtime implementation handles both Zod 3 and 4 schemas correctly
  const form = useForm<T>({
    resolver: zodResolver(schema as never) as Resolver<T>,
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
    } catch {
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
    // Cast needed due to Zod 4 / react-hook-form type incompatibility
    handleSubmit: form.handleSubmit(handleSubmit as SubmitHandler<FieldValues>),
  };
}
