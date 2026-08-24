export default function YouTubeLogo({
  className = "w-[1.38em] h-auto flex-none",
}: {
  className?: string;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 28 20"
      aria-hidden="true"
    >
      <path
        fill="#ff0033"
        d="M27.4 3.1A3.5 3.5 0 0 0 25 0.6C22.8 0 18.5 0 14 0S5.2 0 3 0.6A3.5 3.5 0 0 0 0.6 3.1C0 5.3 0 7.7 0 10s0 4.7 0.6 6.9A3.5 3.5 0 0 0 3 19.4c2.2 0.6 6.5 0.6 11 0.6s8.8 0 11-0.6a3.5 3.5 0 0 0 2.4-2.5c0.6-2.2 0.6-4.6 0.6-6.9s0-4.7-0.6-6.9Z"
      />
      <path fill="#fff" d="m11.2 14.3 7.3-4.3-7.3-4.3z" />
    </svg>
  );
}
