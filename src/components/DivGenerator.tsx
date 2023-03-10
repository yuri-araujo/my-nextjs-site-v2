import { ReactNode } from "react";

type DivGeneratorProps = {
  amountOfDivs: number;
  className: string;
  content?: string | ReactNode;
  useNumbersAsContent: boolean;
};

function DivGenerator({
  amountOfDivs,
  className,
  content,
  useNumbersAsContent = false,
}: DivGeneratorProps) {
  const Array = [];
  for (let i = 0; i < amountOfDivs; i++)
    Array.push(
      <div key={i}>
        {useNumbersAsContent ? (i+1).toString().padStart(2, "0") : content || ""}
      </div>
    );

  return <div className={className}>{Array.map((div) => div)}</div>;
}

export default DivGenerator;
