import { BrainCircuit } from 'lucide-react';

export const Logo = () => {
  return (
    <div className="flex justify-center items-center text-3xl text-center py-4 font-heading">
      <span className="mr-1">BlogOptima</span>
      <BrainCircuit color="white" size={28} />
    </div>
  );
};
