import { BrainCircuit } from 'lucide-react';
import { useState } from 'react';

export const Logo = ({ size }) => {
  const [isBig, setIsBig] = useState(size === 'big');

  return (
    <>
      {isBig ? (
        <div className="flex justify-center items-center text-7xl text-center py-4 font-heading">
          <span className="mr-1">BlogOptima</span>
          <BrainCircuit className="ml-1" color="white" size={80} />
        </div>
      ) : (
        <div className="flex justify-center items-center text-3xl text-center py-5 font-heading">
          <span className="mr-1">BlogOptima</span>
          <BrainCircuit color="white" size={35} />
        </div>
      )}
    </>
  );
};
