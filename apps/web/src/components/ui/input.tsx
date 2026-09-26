"use client"

import * as React from "react"
import { Input as InputPrimitive } from "@base-ui/react/input"
import { Eye, EyeOff } from "lucide-react"
import { cn } from "cn"

import { Button } from "@/components/ui/button"

const inputClassName =
  "h-8 w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-1 text-base transition-colors outline-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm dark:bg-input/30 dark:disabled:bg-input/80 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  const [isPasswordVisible, setIsPasswordVisible] = React.useState(false)
  const isPassword = type === "password"

  const input = (
    <InputPrimitive
      type={isPassword && isPasswordVisible ? "text" : type}
      data-slot="input"
      className={cn(inputClassName, isPassword && "pr-9", className)}
      {...props}
    />
  )

  if (!isPassword) {
    return input
  }

  return (
    <div className="relative">
      {input}
      <Button
        type="button"
        variant="ghost"
        size="icon-xs"
        className="absolute top-1 right-1 text-muted-foreground"
        aria-label={isPasswordVisible ? "Hide password" : "Show password"}
        aria-pressed={isPasswordVisible}
        onClick={() => setIsPasswordVisible((current) => !current)}
      >
        {isPasswordVisible ? <EyeOff /> : <Eye />}
      </Button>
    </div>
  )
}

export { Input }
