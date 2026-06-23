import * as React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Eye, EyeOff } from 'lucide-react';

interface FormFieldProps extends React.ComponentProps<typeof Input> {
  label?: string;
  error?: string;
}

export const FormField = React.forwardRef<HTMLInputElement, FormFieldProps>(
  ({ label, error, id, className, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-');
    const [showPassword, setShowPassword] = React.useState(false);

    const isPassword = props.type === 'password';
    const currentType = isPassword ? (showPassword ? 'text' : 'password') : props.type;

    return (
      <div className={cn('grid gap-2', className)}>
        {label ? <Label htmlFor={inputId}>{label}</Label> : null}
        <div className="relative">
          <Input 
            id={inputId} 
            aria-invalid={Boolean(error)} 
            {...props} 
            ref={ref}
            type={currentType} 
            className={isPassword ? "pr-10" : undefined} 
          />
          {isPassword && (
            <button
              type="button"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 cursor-pointer text-muted-foreground hover:text-foreground focus:outline-none"
              onClick={() => setShowPassword(!showPassword)}
              tabIndex={-1}
              title={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <Eye className="size-4" /> : <EyeOff className="size-4" />}
            </button>
          )}
        </div>
        {error ? <p className="text-sm text-destructive">{error}</p> : null}
      </div>
    );
  }
);
FormField.displayName = 'FormField';
