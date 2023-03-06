import Link from "next/link";
// import { MouseParallax } from "react-just-parallax";

function Menu() {
  return (
    <div className="rotate-45 max-w-[400px] max-h-[400px]  w-[30vw] h-[30vw] grid grid-cols-2 grid-rows-2 bg-transparent gap-4 text-center ">
      <Link href="/sobre" className="menu-square group">
        <span className="rotate-[315deg] ">Sobre mim</span>
      </Link>
      {/* <Link href="/redes-sociais" className="menu-square order-4 group">
        <div className="">Redes Sociais</div>
      </Link>
      <Link href="/experiencia" className="menu-square order-2 group">
        <div className="">Experiência</div>
      </Link> */}
      <Link href="/stack" className="menu-square group">
        <div className="rotate-[315deg] ">Stack</div>
      </Link>
      {/* <Link href="/" className="menu-square order-5 group">
        <div className=""></div>
      </Link> */}
      <Link href="/projetos" className="menu-square group">
        <div className="rotate-[315deg] ">Projetos</div>
      </Link>
      <Link href="/contato" className="menu-square group">
        <div className="rotate-[315deg] ">Contato</div>
      </Link>
      {/* <Link href="/resumo" className="menu-square order-6 group">
        <div className="">Resumo</div>
      </Link> */}
      {/* <Link href="/educacao" className="menu-square order-9 group">
        <div className="">Educação</div>
      </Link> */}
    </div>
  );
}

export default Menu;
