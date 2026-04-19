import * as React from "react"
import { cva } from "class-variance-authority"

import { cn } from "@/lib/utils"

const textareaVariants = cva(
  "flex field-sizing-content min-h-16 w-full rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
  {
    variants: {
      variant: {
        default:
          "border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 focus-visible:ring-[3px]",
        social:
          "min-h-20 resize-none border-none bg-transparent px-0 text-base text-white placeholder:text-slate-500 shadow-none focus-visible:ring-0",
        "profile-bio":
          "w-full bg-slate-900 border border-slate-700 text-slate-300 rounded p-3 min-h-[100px] text-sm md:text-base focus:outline-none focus:border-red-500 focus-visible:ring-0 focus-visible:ring-offset-0",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Textarea({ className = "", variant, ...props }) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(textareaVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Textarea }
