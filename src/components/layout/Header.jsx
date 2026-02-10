import Input from "../common/Input";
import Button from "../common/Button";

export default function Header() {
  return (
    <header className="p-4 space-y-4 max-w-md mx-auto">
      <div className="flex justify-between items-center">

        
        <h1 className="text-2xl font-bold">nexTapa</h1>
        <Button className="px-4 py-2 rounded-full bg-orange-500">Login Up</Button>
      </div>
      <Input 
      placeholder="Tu proxima tapa aqui..."
        className="w-full px-4 py-3 rounded-xl bg-neutral-800" />
    </header>
  );
}
