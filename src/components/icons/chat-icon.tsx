type ChatIconProps = {
  className?: string;
};

export function ChatIcon({ className }: ChatIconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M8 10h8M8 14h5M12 3c4.97 0 9 3.58 9 8 0 1.65-.53 3.2-1.45 4.5L21 21l-4.2-1.4C15.4 20.5 13.7 21 12 21c-4.97 0-9-3.58-9-8s4.03-8 9-8z"
      />
    </svg>
  );
}
