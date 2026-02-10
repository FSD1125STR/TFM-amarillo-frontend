export default function Input({ className = "", ...props }) {
  return (
    <input
      className={`w-full px-4 py-3 rounded-xl bg-neutral-800 text-white outline-none ${className}`}
      {...props}
    />
  );
}
