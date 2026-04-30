import { Minus, Plus } from 'lucide-react';

interface Props {
  valor: number;
  alCambiar: (valor: number) => void;
  min?: number;
  colorBtn?: 'blue' | 'red' | 'amber' | 'slate';
  className?: string;
}

export default function ControlPildora({ valor, alCambiar, min = 0, colorBtn = "blue", className = "" }: Props) {
  const handleDecrement = () => alCambiar(Math.max(min, (valor || 0) - 1));
  const handleIncrement = () => alCambiar((valor || 0) + 1);

  const colorStyles = {
    blue: "hover:bg-blue-100 hover:text-blue-600",
    red: "hover:bg-red-100 hover:text-red-600",
    amber: "hover:bg-amber-100 hover:text-amber-600",
    slate: "hover:bg-slate-200 hover:text-slate-700"
  };

  return (
    <div className={`flex items-center bg-slate-50 border border-slate-200 rounded-full overflow-hidden shadow-sm transition-all group-hover:border-slate-300 ${className}`}>
      <button onClick={handleDecrement} className={`px-1 py-0.5 text-slate-400 transition-colors active:scale-75 ${colorStyles[colorBtn] || colorStyles.blue}`}>
        <Minus size={8} strokeWidth={4} />
      </button>
      <input
        type="number"
        value={valor}
        onChange={(e) => alCambiar(parseInt(e.target.value) || 0)}
        className="w-4 md:w-5 text-center bg-transparent font-black text-[8px] md:text-[9px] outline-none text-slate-700 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
      />
      <button onClick={handleIncrement} className={`px-1 py-0.5 text-slate-400 transition-colors active:scale-75 border-l border-slate-100 ${colorStyles[colorBtn] || colorStyles.blue}`}>
        <Plus size={8} strokeWidth={4} />
      </button>
    </div>
  );
}