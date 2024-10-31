/**
 * A flexible form field generator component that renders different types of form inputs
 * based on the specified configuration. Integrates with React Hook Form for validation
 * and error handling.
 *
 * Features:
 * - Supports input, select, and textarea fields
 * - Integrated error messaging
 * - Consistent styling and layout
 * - Label support
 * - React Hook Form integration
 *
 * @example
 * ```tsx
 * // Input field
 * <FormGenerator
 *   inputType="input"
 *   type="email"
 *   label="Email Address"
 *   placeholder="Enter your email"
 *   register={register}
 *   name="email"
 *   errors={errors}
 * />
 *
 * // Select field
 * <FormGenerator
 *   inputType="select"
 *   label="Country"
 *   options={[
 *     { id: "1", value: "us", label: "United States" },
 *     { id: "2", value: "uk", label: "United Kingdom" }
 *   ]}
 *   register={register}
 *   name="country"
 *   errors={errors}
 * />
 * ```
 */

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React from "react";
import { FieldErrors, FieldValues, UseFormRegister } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";
import { Textarea } from "@/components/ui/textarea";

type Props = {
  type?: "text" | "email" | "password" | "number";
  inputType: "select" | "input" | "textarea";
  options?: { value: string; label: string; id: string }[];
  label?: string;
  placeholder: string;
  register: UseFormRegister<any>;
  name: string;
  errors: FieldErrors<FieldValues>;
  lines?: number;
};

const FormGenerator = ({
  inputType,
  options,
  label,
  placeholder,
  register,
  name,
  errors,
  type,
  lines,
}: Props) => {
  switch (inputType) {
    case "input":
      return (
        <Label
          className="flex flex-col gap-2 text-zinc-600 dark:text-zinc-400"
          htmlFor={`input-${label}`}
        >
          {label && label}
          <Input
            id={`input-${label}`}
            type={type}
            placeholder={placeholder}
            className="bg-transparent border-zinc-200 dark:border-zinc-800 
              text-zinc-900 dark:text-zinc-300
              placeholder:text-zinc-500 dark:placeholder:text-zinc-500"
            {...register(name)}
          />
          <ErrorMessage
            errors={errors}
            name={name}
            render={({ message }) => (
              <p className="text-red-500 dark:text-red-400 mt-2">
                {message === "Required" ? "" : message}
              </p>
            )}
          />
        </Label>
      );
    case "select":
      return (
        <Label
          htmlFor={`select-${label}`}
          className="flex flex-col gap-2 text-zinc-600 dark:text-zinc-400"
        >
          {label && label}
          <select
            id={`select-${label}`}
            className="w-full bg-transparent border border-zinc-200 dark:border-zinc-800 
              text-zinc-900 dark:text-zinc-300 p-3 rounded-lg
              focus:ring-2 focus:ring-zinc-200 dark:focus:ring-zinc-700
              focus:border-transparent"
            {...register(name)}
          >
            {options?.length &&
              options.map((option) => (
                <option
                  value={option.value}
                  key={option.id}
                  className="bg-white dark:bg-zinc-900"
                >
                  {option.label}
                </option>
              ))}
          </select>
          <ErrorMessage
            errors={errors}
            name={name}
            render={({ message }) => (
              <p className="text-red-500 dark:text-red-400 mt-2">
                {message === "Required" ? "" : message}
              </p>
            )}
          />
        </Label>
      );

    case "textarea":
      return (
        <Label
          className="flex flex-col gap-2 text-zinc-600 dark:text-zinc-400"
          htmlFor={`input-${label}`}
        >
          {label && label}
          <Textarea
            className="bg-transparent border-zinc-200 dark:border-zinc-800 
              text-zinc-900 dark:text-zinc-300
              placeholder:text-zinc-500 dark:placeholder:text-zinc-500"
            id={`input-${label}`}
            placeholder={placeholder}
            rows={lines}
            {...register(name)}
          />
          <ErrorMessage
            errors={errors}
            name={name}
            render={({ message }) => (
              <p className="text-red-500 dark:text-red-400 mt-2">
                {message === "Required" ? "" : message}
              </p>
            )}
          />
        </Label>
      );

    default:
      break;
  }
};

export default FormGenerator;
