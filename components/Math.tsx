"use client";

import { BlockMath, InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';

interface MathProps {
  children: string;
  block?: boolean;
  className?: string;
}

export function Math({ children, block = false, className = "" }: MathProps) {
  if (block) {
    return (
      <div className={`my-4 overflow-x-auto ${className}`}>
        <BlockMath math={children} />
      </div>
    );
  }
  return <InlineMath math={children} />;
}

interface FormulaBoxProps {
  formula: string;
  className?: string;
}

export function FormulaBox({ formula, className = "" }: FormulaBoxProps) {
  return (
    <div className={`bg-gray-900 p-4 border-l-4 border-blue-500 my-4 overflow-x-auto ${className}`}>
      <BlockMath math={formula} />
    </div>
  );
}
