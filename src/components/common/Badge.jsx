export default function Badge({ children }) {
  return (
    <span className="bg-orange-500 text-xs px-2 py-1 rounded-full">
      {children}
    </span>
  );
}
