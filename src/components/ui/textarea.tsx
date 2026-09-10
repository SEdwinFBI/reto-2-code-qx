"use client";

import * as React from "react";
import { cn } from "cn";
import { Field, FieldLabel } from "@/components/ui/field";

interface FormTextareaProps extends React.ComponentProps<"textarea"> {
  label: string;
}

export function FormTextarea({ label, id, className, ...props }: FormTextareaProps) {
  const generatedId = React.useId();
  const textareaId = id ?? generatedId;

  return (
    <Field>
      <FieldLabel htmlFor={textareaId}>
        {label}
        {props.required && <span className="text-red-600" aria-hidden="true">*</span>}
      </FieldLabel>
      <textarea
        id={textareaId}
        className={cn(
          "w-full min-w-0 resize-y rounded-lg border border-input bg-transparent px-2.5 py-2 text-base outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className
        )}
        {...props}
      />
    </Field>
  );
}
