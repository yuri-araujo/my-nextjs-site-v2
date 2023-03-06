import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "react-query";
import axios from "axios";
import { FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa";
import { useState } from "react";

const contactFormSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  message: z.string(),
});

type ContactFormSchema = z.infer<typeof contactFormSchema>;

function Contact() {
  const { mutate: sendEmail } = useMutation(
    (data: ContactFormSchema) => axios.post("http://localhost:3000/api/contato", data),
    {
      onSuccess: () => {
        alert("Email enviado com sucesso!");
      },
      onError: () => {
        alert("Erro ao enviar email!");
      },
    }
  );

  const {
    register,
    handleSubmit,
    formState: { isValid, isDirty },
    reset,
  } = useForm<ContactFormSchema>({
    mode: "all",
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
  });
  const onSubmit = (data: ContactFormSchema) => {
    sendEmail(data);
    reset();
  };

  const [shouldFlip, setShouldFlip] = useState<boolean>(false)

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <section
        id="contato"
        className="relative flex items-center justify-center w-full h-screen bg-transparent text-gray-900 dark:text-gray-200 gap-4 text-[1.25rem]"
      >
        <div className={`relative flex items-center justify-center preserve-3d duration-700 w-1/3 h-full ${shouldFlip && "my-rotate-y-180"} `}>
          <div className="absolute backface-hidden w-full h-full">
            <div className="flex flex-col items-center justify-center h-screen bg-transparent text-lg text-gray-900 dark:text-gray-200 gap-4">
              <a
                href="https://github.com/yuri-araujo"
                target="_blank"
                className="hover:border border-github p-4 space-y-4 group"
                rel="noreferrer"
              >
                <span className="flex text-[3rem] items-center justify-center gap-4 dark:text-white font-bold group-hover:text-github w-[400px]">
                  <FaGithub /> Github
                </span>
                <h2 className="subtitle group-hover:text-github flex justify-center">
                  Acompanhe dos meus desenvolvimentos pessoais.
                </h2>
              </a>
              <a
                href="https://www.linkedin.com/in/yuridsaraujo/"
                target="_blank"
                className="hover:border border-linkedin p-4 space-y-4 group"
                rel="noreferrer"
              >
                <span className="flex text-[3rem] items-center justify-center gap-4 dark:text-white font-bold group-hover:text-linkedin w-[400px]">
                  <FaLinkedin /> Linkedin
                </span>
                <h2 className="subtitle group-hover:text-linkedin flex justify-center">
                  Meu perfil profissional.
                </h2>
              </a>
              <a
                href=""
                target="_blank"
                className="hover:border border-twitter p-4 space-y-4 group"
              >
                <span className="flex text-[3rem] items-center justify-center gap-4 text-white font-bold group-hover:text-twitter w-[400px]">
                  <FaTwitter /> Twitter
                </span>
                <h2 className="subtitle group-hover:text-twitter flex justify-center">
                  Um pouco do meu eu não profissional.
                </h2>
              </a>
              <button type="button" className="button" onClick={() => setShouldFlip(true)}>
                Contate-me
              </button>
            </div>
          </div>
          <div className="absolute my-rotate-y-180 backface-hidden w-fit h-fit">
            <div className="relative rounded divide-y divide-solid divide-slate-900 dark:divide-white">
              <div className="p-4">
                <h1 className="title hover:text-sky-400 animate-glow">
                  Vamos conversar.
                </h1>
                <h2 className="subtitle hover:text-sky-400">
                  Novos projetos, trabalho, papo sobre códigos ou qualquer coisa.
                </h2>
              </div>
              <div className="space-y-4 py-8">
                <div className="flex flex-col div-input">
                  <input
                    spellCheck={false}
                    type="text"
                    className="my-input peer"
                    {...register("name", { required: true })}
                  />
                  <label className="peer-focus:text-sky-400 order-1 transition-all duration-400">
                    Nome:{" "}
                  </label>
                </div>
                <div className="flex flex-col div-input">
                  <input
                    spellCheck={false}
                    autoComplete="off"
                    type="email"
                    className="my-input peer"
                    {...register("email", { required: true })}
                  />
                  <label className="peer-focus:text-sky-400 order-1 peer-invalid:text-red-500">
                    Email:{" "}
                  </label>
                </div>
                <div className="flex flex-col div-input">
                  <textarea
                    spellCheck={false}
                    className="my-input peer resize-none"
                    maxLength={2000}
                    {...register("message", { required: true })}
                  />
                  <label className="peer-focus:text-sky-400 order-1">Mensagem: </label>
                </div>
                <div className="flex justify-center gap-4">
                  <button type="submit" disabled={!isValid || !isDirty} className="button">
                    Enviar Mensagem
                  </button>
                  <button type="reset" onClick={() => setShouldFlip(false)} className="button-red">Voltar</button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <span className="whitespace-nowrap opacity-[0.15] dark:opacity-[0.012] text-[300px] absolute font-bold inset-0 pointer-events-none">
          Contato
        </span>
      </section>
    </form>
  );
}

export default Contact;
