import React from "react";

function TypeWriter({ children }: { children: React.ReactNode }) {
  const index = React.useRef(0);

  const text = children!.toString();

  const [content, setContent] = React.useState("");

  React.useEffect(() => {
    if (index.current < text.length) {
      const timeout = setTimeout(() => {
        setContent(content + text[index.current]);
        index.current++;
      }, 200);

      return () => {
        clearTimeout(timeout);
      };
    }
  }, [content]);

  return (
    <p>
      {content}
      <span className="relative after:absolute after:left-100 after:right-0 after:top-0 after:bottom-0 after:content-[''] after:w-[1px] after:bg-white after:animate-blinker"/>
    </p>
  );
}

export default TypeWriter;
