import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils"

type Variatn =
  "form" |
  "default" |
  "destructive" |
  "outline" |
  "secondary" |
  "ghost" |
  "social-action" |
  "social-ghost" |
  "social-link" |
  "input-action" |
  "image-remove" |
  "social-icon" |
  "dropdown-item" |
  "star-action" |
  "clear-action" |
  "profile-edit" |
  "profile-save" |
  "profile-cancel" |
  "profile-follow-active" |
  "profile-follow" |
  "profile-tab-active" |
  "profile-tab" |
  "link";


type Sizes = "default" |
  "sm" |
  "lg" |
  "pill" |
  "icon" |
  "icon-sm" |
  "icon-lg";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        form: "bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-all shadow-lg shadow-red-900/20 disabled:opacity-50 disabled:cursor-not-allowed",
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost:
          "bg-transparent border border-white hover:shadow-neon-purple transition-all duration-300",
        "social-action":
          "group h-auto border-none bg-transparent px-0 py-0 text-sm focus-visible:ring-0 focus-visible:ring-offset-0",
        "social-ghost":
          "border-none bg-transparent text-slate-500 hover:bg-slate-800/50 hover:text-white focus-visible:ring-0 focus-visible:ring-offset-0",
        "social-link":
          "h-auto border-none bg-transparent p-0 text-slate-500 hover:text-slate-300 focus-visible:ring-0 focus-visible:ring-offset-0",
        "input-action":
          "absolute right-2 top-1/2 h-7 w-7 -translate-y-1/2 rounded-full border-none bg-transparent p-0 opacity-0 transition-colors group-focus-within:opacity-100 focus-visible:ring-0 focus-visible:ring-offset-0 text-slate-500 hover:bg-red-500/10 hover:text-red-500",
        "image-remove":
          "absolute top-2 right-2 h-8 w-8 rounded-full border-none bg-black/60 p-0 text-white opacity-0 backdrop-blur-sm transition-all hover:bg-black/80 group-hover:opacity-100",
        "social-icon":
          "h-9 w-9 rounded-full border-none p-0 transition-colors text-slate-400 hover:bg-slate-800 hover:text-red-500 data-[active=true]:bg-red-500/20 data-[active=true]:text-red-500",
        "dropdown-item":
          "h-auto w-full justify-start rounded-none border-none px-4 py-2.5 text-left text-sm text-slate-300 hover:bg-red-600 hover:text-white",
        "star-action":
          "h-8 w-8 rounded-full border-none bg-transparent p-0 transition-transform hover:scale-110 focus-visible:ring-0 focus-visible:ring-offset-0",
        "clear-action":
          "ml-auto h-7 w-7 rounded-full border-none bg-transparent p-0 text-slate-500 hover:text-white focus-visible:ring-0 focus-visible:ring-offset-0",
        "profile-edit":
          "bg-slate-800 border border-slate-700 hover:bg-slate-700 text-slate-200 font-medium rounded-full transition-colors flex items-center gap-2",
        "profile-save":
          "bg-green-600 hover:bg-green-700 text-white font-medium rounded-full transition-colors flex items-center gap-2 shadow-lg shadow-green-900/20",
        "profile-cancel":
          "bg-slate-800 border border-slate-700 hover:bg-slate-700 text-slate-300 font-medium rounded-full transition-colors",
        "profile-follow-active":
          "font-semibold rounded-full transition-colors shadow-lg flex items-center gap-2 bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white",
        "profile-follow":
          "font-semibold rounded-full transition-colors shadow-lg flex items-center gap-2 bg-red-600 text-white hover:bg-red-700 shadow-red-900/20",
        "profile-tab-active":
          "pb-3 text-red-500 border-b-2 border-red-500 font-medium rounded-none h-auto px-0 bg-transparent hover:bg-transparent focus-visible:ring-0",
        "profile-tab":
          "pb-3 text-slate-500 border-b-2 border-transparent hover:text-slate-300 font-medium transition-colors rounded-none h-auto px-0 bg-transparent hover:bg-transparent focus-visible:ring-0",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        pill: "h-9 rounded-full px-6 py-2",
        icon: "size-9",
        "icon-sm": "size-8",
        "icon-lg": "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className = "",
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: { variant: Variatn, size?: Sizes, asChild?: boolean } & React.ComponentProps<'button'>) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props} />
  );
}

export { Button, buttonVariants }
