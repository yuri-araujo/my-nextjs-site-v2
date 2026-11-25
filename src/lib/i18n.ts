export type Lang = "en" | "pt";

export const dictionary = {
  en: {
    nav: {
      projects: "Projects",
      about: "About",
      toggleTheme: "Toggle theme",
      toggleLang: "Mudar para Português",
    },
    hero: {
      badge: "yuriaraujo.dev.br · Brazil",
      titleStart: "Building ",
      titleAccent: "interactive",
      titleEnd: " things for the web.",
      subtitle:
        "I'm Yuri Araujo — a software engineer exploring expressive interfaces, web audio, classic games, and visual mathematics.",
      ctaProjects: "Selected work",
    },
    projects: {
      eyebrow: "Selected Work",
      heading: "Things I've built",
      subheading:
        "Small, self-contained interactive spaces — hover the cards to preview, or open them live.",
      openLive: "Open",
      items: [
        {
          id: "sound-lab",
          title: "Sound Lab",
          tag: "Web Audio · Synthesis",
          domain: "sound-lab.yuriaraujo.dev.br",
          url: "https://sound-lab.yuriaraujo.dev.br/",
          description:
            "An experimental browser studio for shaping waveforms, sculpting harmonics, and exploring interactive sound synthesis.",
        },
        {
          id: "freecell",
          title: "FreeCell",
          tag: "Classic Game · Logic",
          domain: "freecell.yuriaraujo.dev.br",
          url: "https://freecell.yuriaraujo.dev.br/",
          description:
            "A crisp, tactile take on classic FreeCell solitaire with smooth card interactions, keyboard-friendly play, and focused table design.",
        },
        {
          id: "math-gallery",
          title: "Math Gallery",
          tag: "Visual Math · Generative",
          domain: "math-gallery.yuriaraujo.dev.br",
          url: "https://math-gallery.yuriaraujo.dev.br/",
          description:
            "A museum of mathematics: interactive visual exhibits where curves, symmetries, and geometry come alive as you explore.",
        },
      ],
    },
    playground: {
      tabs: {
        flow: { label: "Flow" },
        dragon: { label: "Dragon" },
        sound: { label: "Sound" },
      },
      controls: {
        scale: "Scale",
        wave: "Wave",
        chord: "Chord",
        folds: "Folds",
        angle: "Angle",
        breathe: "Morph",
        pause: "Pause",
        reset: "Reset",
        mode: "Force",
        attract: "Attract",
        repel: "Repel",
        orbit: "Orbit",
        reseed: "Reseed",
        trails: "Trails",
      },
    },
    about: {
      eyebrow: "About",
      heading: "Simple software, crafted with curiosity.",
      body: "I'm a Brazilian developer who enjoys turning abstract ideas — whether a fractal curve, a synthesizer, or a card game — into fast, responsive, and pleasant experiences in the browser. Always experimenting with new ways to make interfaces feel alive.",
      connect: "Find me around the web",
      shortcuts: "Keys: 1–3 · T theme · L language",
    },
  },
  pt: {
    nav: {
      projects: "Projetos",
      about: "Sobre",
      toggleTheme: "Alternar tema",
      toggleLang: "Switch to English",
    },
    hero: {
      badge: "yuriaraujo.dev.br · Brasil",
      titleStart: "Construindo coisas ",
      titleAccent: "interativas",
      titleEnd: " para a web.",
      subtitle:
        "Sou Yuri Araujo — engenheiro de software explorando interfaces expressivas, áudio na web, jogos clássicos e matemática visual.",
      ctaProjects: "Projetos selecionados",
    },
    projects: {
      eyebrow: "Projetos Selecionados",
      heading: "Coisas que construí",
      subheading:
        "Pequenos espaços interativos e autocontidos — passe o mouse nos cards ou abra ao vivo.",
      openLive: "Abrir",
      items: [
        {
          id: "sound-lab",
          title: "Sound Lab",
          tag: "Web Audio · Síntese",
          domain: "sound-lab.yuriaraujo.dev.br",
          url: "https://sound-lab.yuriaraujo.dev.br/",
          description:
            "Um estúdio experimental no navegador para esculpir ondas, explorar harmônicos e brincar com síntese sonora interativa.",
        },
        {
          id: "freecell",
          title: "FreeCell",
          tag: "Jogo Clássico · Lógica",
          domain: "freecell.yuriaraujo.dev.br",
          url: "https://freecell.yuriaraujo.dev.br/",
          description:
            "Uma releitura limpa e tátil do clássico FreeCell, com interações fluidas nas cartas e foco total na jogabilidade.",
        },
        {
          id: "math-gallery",
          title: "Math Gallery",
          tag: "Matemática Visual · Generativa",
          domain: "math-gallery.yuriaraujo.dev.br",
          url: "https://math-gallery.yuriaraujo.dev.br/",
          description:
            "Um museu de matemática: exposições visuais interativas onde curvas, simetrias e geometria ganham vida ao explorar.",
        },
      ],
    },
    playground: {
      tabs: {
        flow: { label: "Fluxo" },
        dragon: { label: "Dragão" },
        sound: { label: "Som" },
      },
      controls: {
        scale: "Escala",
        wave: "Onda",
        chord: "Acorde",
        folds: "Dobras",
        angle: "Ângulo",
        breathe: "Animar",
        pause: "Pausar",
        reset: "Resetar",
        mode: "Força",
        attract: "Atrair",
        repel: "Repelir",
        orbit: "Orbitar",
        reseed: "Novo",
        trails: "Rastros",
      },
    },
    about: {
      eyebrow: "Sobre",
      heading: "Software simples, feito com curiosidade.",
      body: "Sou um desenvolvedor brasileiro que gosta de transformar ideias abstratas — seja um fractal, um sintetizador ou um jogo de cartas — em experiências rápidas, responsivas e gostosas de usar no navegador. Sempre experimentando formas de deixar interfaces mais vivas.",
      connect: "Onde me encontrar",
      shortcuts: "Teclas: 1–3 · T tema · L idioma",
    },
  },
} as const;

export type Dictionary = (typeof dictionary)[Lang];
