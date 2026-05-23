import { cn } from "@/lib/cn";

type BrandMarkProps = {
  className?: string;
};

export function BrandMark({ className }: BrandMarkProps) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("h-8 w-8 sm:h-10 sm:w-10", className)}
      aria-hidden
    >
      <path d="M4 26L16 4l12 22H20l-4-8-4 8H4z" fill="#1d70f1" />
      <path d="M16 4l4 8H12l4-8z" fill="#0f2d6e" />
    </svg>
  );
}
