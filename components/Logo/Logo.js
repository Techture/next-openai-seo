import { BrainCircuit } from 'lucide-react';

export const Logo = ({ size }) => {
  return (
    <>
      <div className="flex justify-center items-center text-4xl text-center py-1 font-heading">
        <span className="text-1xl">BlogOptima</span>
        <BrainCircuit className="ml-1" color="white" size={40} />
      </div>
    </>
  );
};
