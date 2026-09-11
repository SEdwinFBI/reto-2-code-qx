import * as React from "react"
import { Input as InputPrimitive } from "@base-ui/react/input"
import { cn } from "cn"
import { Field, FieldContent, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(
        "h-9 w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-1 text-base transition-colors outline-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 read-only:bg-slate-100 read-only:text-slate-600 dark:read-only:bg-slate-800 dark:read-only:text-slate-300 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm dark:bg-input/30 dark:disabled:bg-input/80 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40",
        className
      )}
      {...props}
    />
  )
}

export interface FormInputProps extends React.ComponentProps<"input"> {
  label?: string;
  error?: string;
  helperText?: string;
}

// Input con etiqueta, descripción y estado de error.
function FormInput({ label, error, helperText, id, className, ...props }: FormInputProps) {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

  return (
    <Field data-invalid={!!error}>
      {label && <FieldLabel htmlFor={inputId}>
        {label}
        {props.required && <span className="text-red-600" aria-hidden="true">*</span>}
      </FieldLabel>}
      <FieldContent>
        <Input id={inputId} aria-invalid={!!error} className={className} {...props} />
        {error ? (
          <FieldError>{error}</FieldError>
        ) : helperText ? (
          <FieldDescription>{helperText}</FieldDescription>
        ) : null}
      </FieldContent>
    </Field>
  );
}

export { Input, FormInput }
