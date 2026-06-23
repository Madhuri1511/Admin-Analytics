import * as React from 'react';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

export interface FormSelectOption {
  value: string;
  label: string;
}

export interface FormSelectProps {
  label?: string;
  error?: string;
  name: string;
  value: string;
  onChange: (event: { target: { name: string; value: string } }) => void;
  options: FormSelectOption[];
  id?: string;
  className?: string;
  placeholder?: string;
}

export function FormSelect({
  label,
  error,
  name,
  value,
  onChange,
  options,
  id,
  className,
  placeholder,
}: FormSelectProps) {
  const selectId = id ?? label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className={cn('grid gap-2', className)}>
      {label ? <Label htmlFor={selectId}>{label}</Label> : null}
      <Select
        value={value}
        onValueChange={(nextValue) =>
          onChange({ target: { name, value: nextValue } })
        }
      >
        <SelectTrigger id={selectId} className="w-full" aria-invalid={Boolean(error)}>
          <SelectValue placeholder={placeholder ?? 'Select an option'} />
        </SelectTrigger>
        <SelectContent>
          {options
            .filter((option) => option.value !== '')
            .map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
        </SelectContent>
      </Select>
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
    </div>
  );
}
