import { cva } from "class-variance-authority"

const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-2 rounded-full border border-transparent font-bold transition-colors outline-none select-none focus-visible:ring-2 focus-visible:ring-primary-500/40 disabled:pointer-events-none disabled:bg-[var(--btn-disabled-bg)] disabled:text-[var(--btn-disabled-label)] disabled:border-transparent [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        /* 1. Primary */
        default:
          "bg-[var(--btn-primary-fill)] text-[var(--btn-primary-fill-label)] hover:bg-[var(--btn-primary-fill-hover)]",
        outline:
          "border-[var(--btn-outline-border)] bg-transparent text-[var(--btn-outline-label)] hover:bg-primary-25",
        light:
          "bg-[var(--btn-light-bg)] text-[var(--btn-light-label)] hover:bg-primary-100",
        ghost:
          "bg-transparent text-[var(--btn-text-label)] hover:bg-primary-25",

        /* 2. Secondary */
        secondary:
          "bg-[var(--btn-secondary-fill)] text-[var(--btn-secondary-fill-label)] hover:bg-[var(--btn-secondary-fill-hover)]",

        /* 3. Neutral — same as ghost for text-weight actions */
        neutral:
          "bg-transparent text-[var(--text-body)] hover:bg-[var(--opacity-dark-8)]",

        /* 4. Black */
        black:
          "bg-[var(--btn-black-fill)] text-[var(--btn-black-fill-label)] hover:bg-[var(--btn-black-fill-hover)]",

        /* 5. White (use on dark backgrounds) */
        white:
          "border-2 border-[var(--btn-white-outline)] bg-transparent text-[var(--color-white)] hover:bg-[var(--opacity-light-8)]",
        "white-fill":
          "bg-[var(--btn-white-fill)] text-[var(--btn-white-fill-label)] hover:bg-[var(--opacity-light-88)]",

        /* 6. Success */
        success:
          "bg-[var(--btn-success-fill)] text-[var(--text-light-title)] hover:bg-[var(--btn-success-fill-hover)]",

        /* 7. Danger */
        destructive:
          "bg-[var(--btn-danger-fill)] text-[var(--text-light-title)] hover:bg-[var(--btn-danger-fill-hover)]",

        /* 8. Warning */
        warning:
          "bg-[var(--btn-warning-fill)] text-[var(--btn-warning-fill-label)] hover:bg-[var(--btn-warning-fill-hover)]",

        /* 9. Soft / Info */
        soft:
          "bg-[var(--btn-soft-fill)] text-[var(--btn-soft-fill-label)] hover:bg-[var(--btn-soft-fill-hover)]",

        link: "rounded-none text-[var(--text-link)] underline-offset-4 hover:underline disabled:bg-transparent",
      },
      size: {
        sm: "h-10 gap-2 px-4 text-sm has-data-[icon=only]:size-10 has-data-[icon=only]:px-0",
        default:
          "h-12 gap-2 px-5 text-base has-data-[icon=only]:size-12 has-data-[icon=only]:px-0",
        lg: "h-[52px] gap-2 px-6 text-lg has-data-[icon=only]:size-[52px] has-data-[icon=only]:px-0",
        xl: "h-14 gap-2 px-6 text-xl has-data-[icon=only]:size-14 has-data-[icon=only]:px-0",
        icon: "size-12",
        "icon-sm": "size-10",
        "icon-lg": "size-14",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export { buttonVariants }
