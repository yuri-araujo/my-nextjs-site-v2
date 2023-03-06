import { useEffect } from "react";

type ILogoButtonProps = {
  sm?: boolean;
  md?: boolean;
  lg?: boolean;
  className?: string;
};

function LogoButton({ sm, md, lg, className }: ILogoButtonProps) {
  const size = sm
    ? "m-[6px] w-6 h-6"
    : md
    ? "m-[16px] w-16 h-16"
    : lg
    ? "m-[24px] w-24 h-24"
    : "m-[6px] w-6 h-6";

  const createDivs = () => {
    const Array = [];
    for (let i = 0; i < 9; i++)
      Array.push(<div key={i} className="hover:scale-125 transition-all hover:border" />);
    return Array.map((div) => div);
  };

  return (
    <div
      className={`rotate-45 grid grid-cols-3 grid-rows-3  active:scale-105 bg-gradient-to-r from-cyan-500 to-blue-500 ${size} ${className}`}
    >
      {createDivs()}
    </div>
  );
}
export default LogoButton;
