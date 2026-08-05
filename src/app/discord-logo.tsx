export default function DiscordLogo({
  className = "flex-none w-[1.75em] h-auto",
}: {
  className?: string;
}) {
  return (
    <svg className={className} viewBox="0 0 32 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M25.8 3.2A22 22 0 0 0 20.3 1.5l-.7 1.4a20.3 20.3 0 0 0-7.2 0l-.7-1.4a22 22 0 0 0-5.5 1.7C2.7 8.3 1.7 13.3 2.2 18.2a22 22 0 0 0 6.7 3.4l1.7-2.3a14.7 14.7 0 0 1-2.7-1.4l.7-.5a16.8 16.8 0 0 0 14.8 0l.7.5a15 15 0 0 1-2.7 1.4l1.7 2.3a22 22 0 0 0 6.7-3.4c.6-5.7-1-10.7-4-15ZM11.4 15.3c-1.6 0-2.9-1.5-2.9-3.3s1.3-3.3 2.9-3.3 2.9 1.5 2.9 3.3-1.3 3.3-2.9 3.3Zm9.2 0c-1.6 0-2.9-1.5-2.9-3.3s1.3-3.3 2.9-3.3 2.9 1.5 2.9 3.3-1.3 3.3-2.9 3.3Z"
      />
    </svg>
  );
}
