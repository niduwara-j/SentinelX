import { InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  mono?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, mono = false, className = "", id, ...rest }, ref) => {
    const inputId = id || rest.name;
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-text-secondary">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={`rounded-lg border border-border bg-bg px-3.5 py-2.5 text-sm text-text-primary
            placeholder:text-text-secondary/60 outline-none transition-colors
            focus:border-primary focus:ring-1 focus:ring-primary
            ${mono ? "font-mono" : ""} ${error ? "border-danger focus:border-danger focus:ring-danger" : ""}
            ${className}`}
          {...rest}
        />
        {error && <span className="text-xs text-danger">{error}</span>}
      </div>
    );
  }
);
Input.displayName = "Input";

export default Input;
