import React from "react";

import Image from "next/image";

import Tilt from 'react-parallax-tilt';
import { FaArrowRight } from "react-icons/fa";

type ProjectCardProps = {
  title: string;
  description?: string;
  image: any;
};

function ProjectCard({ image, title, description }: ProjectCardProps) {
  return (
    <Tilt tiltMaxAngleX={7.5} tiltMaxAngleY={7.5} scale={1.05}>
      <div className="flex w-96 h-48 group">
        <Image src={image} alt="" />
        {/* <div className="absolute right-0 group-hover:w-10 h-full bg-sky-400 flex items-center justify-center text-2xl transition-all duration-500 w-0 opacity-20"><FaArrowRight /></div> */}
        <div className="absolute left-[-40px] top-10 flex flex-col divide-y">
          <span className="">{title}</span>
          <span className="text-base">{description || ""}</span>
        </div>
      </div>
    </Tilt>
  );
}

export default ProjectCard;
