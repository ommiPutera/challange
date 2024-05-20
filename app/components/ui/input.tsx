import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "~/lib/utils";

import { Icon } from "../icons";

const sizes = {
  md: "h-10 md:h-10 rounded-lg text-sm",
  sm: "h-9 md:h-9 rounded-md text-sm",
};

const inputVariants = cva(
  "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      inputSize: { ...sizes },
    },
    defaultVariants: {
      inputSize: "md",
    },
  }
);
export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement>,
  VariantProps<typeof inputVariants> {
  error?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, inputSize, ...props }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false);
    const togglePasswordVisibility = () => {
      setShowPassword(!showPassword);
    };
    const inputType = type === "password" && showPassword ? "text" : type;

    return (
      <div className={cn("relative", className)}>
        <input
          className={cn(inputVariants({ inputSize }))}
          type={inputType}
          ref={ref}
          {...props}
        />
        {type === "password" ? <button
          type="button"
          className="absolute right-0 top-1/2 flex h-full w-9 -translate-y-1/2 items-center justify-center"
          onClick={togglePasswordVisibility}
        >
          {showPassword ? (
            <Icon name="EyeOff" className="text-grey-950 h-4 w-4" />
          ) : (
            <Icon name="Eye" className="text-grey-950 h-4 w-4" />
          )}
        </button> : null}
      </div>
    );
  }
);
Input.displayName = "Input";

export interface ErrorMessageProps
  extends React.HTMLAttributes<HTMLParagraphElement>,
  VariantProps<typeof inputVariants> { }

const ErrorMessage = React.forwardRef<HTMLParagraphElement, ErrorMessageProps>(
  ({ className, children, ...props }) => {
    return (
      <p
        className={cn("px-1 text-xs font-normal text-red-600", { className })}
        {...props}
      >
        {children}
      </p>
    );
  }
);
ErrorMessage.displayName = "ErrorMessage";

export { Input, inputVariants, ErrorMessage };
