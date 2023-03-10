import React from "react";

type GenericAnchorCardProps = {
  icon: React.ReactNode
  title: string
  description: string
  link: string
  color?: string
}

function GenericAnchorCard(props: GenericAnchorCardProps) {
  const {icon, title, description, link, color="sky"} = props

  return (
      <a
        href={link}
        target="_blank"
        className={`border border-slate-700 dark:border-white hover:border-${color}-700 dark:hover:border-${color}-400 p-4 space-y-4 group`}
        rel="noreferrer"
      >
        <span className={`flex text-[3rem] items-center justify-center gap-4 dark:text-white font-bold dark:group-hover:text-${color}-400 group-hover:text-${color}-700 w-[400px]`}>
          {icon}{title}
        </span>
        <h2 className={`subtitle dark:group-hover:text-${color}-400 group-hover:text-${color}-700 flex justify-center`}>
          {description}
        </h2>
      </a>
  );
}

export default GenericAnchorCard;
