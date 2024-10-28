/**
 * A custom React hook that combines React Hook Form with Zod schema validation and React Query mutations
 *
 * This hook simplifies form handling by:
 * - Integrating Zod schema validation with React Hook Form
 * - Automatically handling form submission with React Query mutations
 * - Providing typed form validation and error handling
 *
 * @param schema - Zod schema for form validation
 * @param mutation - React Query mutation function to handle form submission
 * @param defaultValues - Optional default values for form fields
 *
 * @returns {Object} Form utilities
 * @returns {Function} register - React Hook Form register function for field registration
 * @returns {Function} watch - Function to subscribe to form value changes
 * @returns {Function} reset - Function to reset form to default values
 * @returns {Function} onFormSubmit - Pre-configured submit handler that validates and mutates
 * @returns {Object} errors - Form validation errors object
 *
 * @example
 * ```tsx
 * const schema = z.object({
 *   email: z.string().email(),
 *   password: z.string().min(6)
 * });
 *
 * const { register, onFormSubmit, errors } = useZodForm(
 *   schema,
 *   createUserMutation,
 *   { email: '', password: '' }
 * );
 * ```
 */

import { UseMutateFunction } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z, { ZodSchema } from "zod";

const useZodForm = (
  schema: ZodSchema,
  mutation: UseMutateFunction,
  defaultValues?: any
) => {
  const {
    register,
    watch,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { ...defaultValues },
  });

  const onFormSubmit = handleSubmit(async (values) => mutation({ ...values }));

  return { register, watch, reset, onFormSubmit, errors };
};
export default useZodForm;
