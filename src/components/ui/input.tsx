import * as React from "react"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={`
          flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm 
          ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium 
          placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 
          focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50
          border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 
          focus:border-indigo-500 dark:focus:border-indigo-400
          ${className}
        `}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
