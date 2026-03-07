import { InputHTMLAttributes, forwardRef, ReactNode } from "react";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label: string;
    icon?: ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ label, icon, className = "", id, ...props }, ref) => {
        const inputId = id || label.toLowerCase().replace(/\s+/g, "-");

        return (
            <div className="flex flex-col space-y-1.5 w-full">
                <label htmlFor={inputId} className="text-sm font-semibold text-slate-700">
                    {label}
                </label>
                <div className="relative group text-slate-400 focus-within:text-primary transition-colors duration-200">
                    {icon && (
                        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
                            {icon}
                        </div>
                    )}
                    <input
                        id={inputId}
                        ref={ref}
                        className={`w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm transition-all focus:border-primary focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary/10 ${icon ? "pl-11" : ""
                            } ${className}`}
                        {...props}
                    />
                </div>
            </div>
        );
    }
);

Input.displayName = "Input";

export default Input;
