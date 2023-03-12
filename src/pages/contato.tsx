import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "react-query";
import axios from "axios";
import { FaGithub, FaLinkedin, FaMapMarkerAlt, FaTwitter } from "react-icons/fa";
import { useState } from "react";

import BrasilSvg from "@/components/BrasilSvg";
import GenericAnchorCard from "@/components/GenericAnchorCard";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { toast } from "react-toastify";

const contactFormSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  message: z.string().min(1),
});

type ContactFormSchema = z.infer<typeof contactFormSchema>;

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["contact"])),
      // Will be passed to the page component as props
    },
  };
}

function Contact() {
  const { t: translate } = useTranslation("contact");

  const { mutate: sendEmail } = useMutation(
    (data: ContactFormSchema) => axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/contato`, data),
    {
      onSuccess: () => {
        toast.success("Email enviado com sucesso!");
      },
      onError: () => {
        toast.error("Erro ao enviar email!");
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

  const [shouldFlip, setShouldFlip] = useState<boolean>(false);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <section
        id="contato"
        className="relative flex items-center justify-around w-full h-screen bg-transparent text-gray-900 dark:text-gray-200 gap-4 text-[1.25rem]"
      >
        <BrasilSvg />
        <div
          className={`relative flex items-center justify-center preserve-3d duration-700 w-1/2 h-full ${
            shouldFlip && "my-rotate-y-180"
          } `}
        >
          <div className="absolute backface-hidden w-full h-full">
            <div className="flex flex-col items-center justify-center h-screen gap-4">
              <div className="flex flex-col items-center justify-center text-gray-900 dark:text-gray-200 gap-4 p-16">
                <GenericAnchorCard
                  icon={<FaGithub />}
                  title="Github"
                  description={translate("github-description")}
                  link="https://github.com/yuri-araujo"
                />
                <GenericAnchorCard
                  icon={<FaLinkedin />}
                  title="Linkedin"
                  description={translate("linkedin-description")}
                  link="https://www.linkedin.com/in/yuriaraujodev/"
                />
                {/* <GenericAnchorCard
                  icon={<FaTwitter />}
                  title="Twitter"
                  description="Um pouco do meu eu não profissional."
                  link=""
                  color="sky"
                /> */}
                <button
                  type="button"
                  className="button mt-2"
                  onClick={() => setShouldFlip(true)}
                >
                  {translate("contact-button")}
                </button>
              </div>
            </div>
          </div>
          <div className="absolute my-rotate-y-180 backface-hidden w-[65%] h-fit lg:w-fit">
            <div className="relative divide-y divide-solid divide-slate-900 dark:divide-white gap-4 p-16">
              <div className="p-4">
                <h1 className="title hover:text-sky-600 dark:hover:text-sky-400 animate-glow">
                  {translate("form.title")}
                </h1>
                <h2 className="subtitle hover:text-sky-600 dark:hover:text-sky-400 whitespace-nowrap">
                  {translate("form.subtitle")}
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
                  <label className="peer-focus:text-sky-600 dark:peer-focus:text-sky-400 order-1 transition-all duration-400">
                    {translate("form.name-field")}
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
                  <label className="peer-focus:text-sky-600 dark:peer-focus:text-sky-400 order-1 peer-invalid:text-red-600 dark:peer-invalid:text-red-500">
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
                  <label className="peer-focus:text-sky-600 dark:peer-focus:text-sky-400 order-1">
                    {translate("form.message-field")}
                  </label>
                </div>
                <div className="flex justify-center gap-4">
                  <button
                    type="submit"
                    disabled={!isValid || !isDirty}
                    className="button"
                  >
                    {translate("form.send-message-button")}
                  </button>
                  <button type="reset" onClick={() => reset()} className="button">
                    {translate("form.clear-button")}
                  </button>
                  <button
                    type="reset"
                    onClick={() => setShouldFlip(false)}
                    className="button"
                  >
                    {translate("form.back-button")}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <span className="whitespace-nowrap opacity-[0.04] dark:opacity-[0.012] text-[300px] absolute font-bold inset-0 pointer-events-none lg:text-[200px]">
          {translate("page-indicator")}
        </span>
      </section>
    </form>
  );
}

export default Contact;
