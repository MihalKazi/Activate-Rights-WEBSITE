"use client";

import { useState } from "react";
import { Roboto_Mono } from "next/font/google";
import { cn } from "../../lib/utils";

const robotoMono = Roboto_Mono({
  subsets: ["latin"],
  weight: ["400"],
  display: "swap"
});

type ContactFormProps = {
  thanksLabel: string;
  errorLabel: string;
  sendingLabel: string;
  labels: {
    name: string;
    email: string;
    story: string;
    send: string;
  };
};

const fieldInputClass =
  "mt-3 w-full border-0 border-b border-white bg-transparent pb-2 text-[18px] text-white placeholder:text-white/40 outline-none ring-0 focus:border-white";

/** Figma 34:1519–1530 — underlined fields + blue SEND */
export function ContactForm({ labels, thanksLabel, errorLabel, sendingLabel }: ContactFormProps) {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  return (
    <form
      className="mx-auto w-full max-w-[804px] px-6 pb-10 pt-4 md:pb-16 md:pt-8"
      onSubmit={async (e) => {
        e.preventDefault();
        const form = e.currentTarget;
        const data = new FormData(form);
        const name = String(data.get("name") ?? "").trim();
        const email = String(data.get("email") ?? "").trim();
        const message = String(data.get("message") ?? "").trim();

        if (!name || !email || !message) return;

        setStatus("sending");

        try {
          const response = await fetch("/api/contact", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, message })
          });

          if (!response.ok) {
            setStatus("error");
            return;
          }

          form.reset();
          setStatus("sent");
        } catch {
          setStatus("error");
        }
      }}
    >
      <div className="space-y-10 md:space-y-11">
        <label className="block">
          <span className="home-headline-font text-[20px] font-normal leading-normal text-white">
            {labels.name}
          </span>
          <input name="name" type="text" autoComplete="name" required className={fieldInputClass} />
        </label>

        <label className="block">
          <span className="home-headline-font text-[20px] font-normal leading-normal text-white">
            {labels.email}
          </span>
          <input name="email" type="email" autoComplete="email" required className={fieldInputClass} />
        </label>

        <label className="block">
          <span className="home-headline-font text-[20px] font-normal leading-normal text-white">
            {labels.story}
          </span>
          <textarea
            name="message"
            required
            rows={6}
            className={cn(fieldInputClass, "min-h-[140px] resize-y")}
          />
        </label>
      </div>

      <div className="mt-10 flex justify-center md:mt-12">
        <button
          type="submit"
          disabled={status === "sending"}
          className={cn(
            robotoMono.className,
            "border border-transparent bg-[#303ccf] px-5 py-5 text-[18px] font-normal uppercase leading-none tracking-wide text-white transition-colors hover:bg-[#2839b5] disabled:cursor-not-allowed disabled:opacity-60"
          )}
        >
          {status === "sending" ? sendingLabel : labels.send}
        </button>
      </div>

      {status === "sent" ? (
        <p className="mt-6 text-center text-[15px] text-white/80" role="status">
          {thanksLabel}
        </p>
      ) : null}

      {status === "error" ? (
        <p className="mt-6 text-center text-[15px] text-white/90" role="alert">
          {errorLabel}
        </p>
      ) : null}
    </form>
  );
}
