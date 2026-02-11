export default function Card({ children, className = "" }) {
   return (
      <div className={`bg-neutral-900 rounded-2xl overflow-hidden ${className}`}>
         {children}
      </div>
   );
}
