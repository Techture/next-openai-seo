import { BrainCircuit } from 'lucide-react';

export const Logo = () => {
  return (
    <div className="flex justify-center items-center text-7xl text-center py-4 font-heading">
      <span className="mr-1">BlogOptima</span>
      <BrainCircuit className="ml-1" color="white" size={70} />
    </div>
  );
};
