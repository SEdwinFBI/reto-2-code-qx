import * as React from "react";
import { Field, FieldLabel } from "@/components/ui/field";

interface FormSelectProps extends React.ComponentProps<"select"> {
  label: string;
}

export function FormSelect({ label, id, children, ...props }: FormSelectProps) {
  const generatedId = React.useId();
  const selectId = id ?? generatedId;

  return (
    <Field>
      <FieldLabel htmlFor={selectId}>
        {label}
        {props.required && <span className="text-red-600" aria-hidden="true">*</span>}
      </FieldLabel>
      <select
        id={selectId}
        className="h-9 w-full rounded-lg border border-input bg-background px-2.5 text-sm"
        {...props}
      >
        {children}
      </select>
    </Field>
  );
}
