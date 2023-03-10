import React from "react";

import Image, { StaticImageData } from "next/image";

import Tilt from 'react-parallax-tilt';
import { FaArrowRight } from "react-icons/fa";

type ProjectCardProps = {
  title: string;
  description: string;
  image: StaticImageData;
  className: string
};

function ProjectCard({ image, title, description, className }: ProjectCardProps) {
  return (
    <Tilt tiltMaxAngleX={7.5} tiltMaxAngleY={7.5} scale={1.05}>
      <div className="flex max-w-lg max-h-lg group border-gray-500 h-full items-center">
        <Image className={className} src={image} alt="" />
        <div className="absolute left-[-12rem] items-start justify-center flex flex-col h-fit rounded-xl p-4 divide-y bg-sky-500 bg-opacity-10">
          <span className="text-[2rem]">{title}</span>
          <span className="text-base">{description || ""}</span>
        </div>
      </div>
    </Tilt>
  );
}

export default ProjectCard;
