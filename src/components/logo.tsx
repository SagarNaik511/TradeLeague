import { cn } from "@/lib/utils";

export const Logo = ({ className }: { className?: string }) => (
  <svg
    className={cn("h-6 w-6 text-primary", className)}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M3 3v18h18" />
    <path d="M7 15l4-4 4 4 5-5" />
    <path d="M14 11l0 .01" />
    <path d="M18 7l0 .01" />
  </svg>
);
