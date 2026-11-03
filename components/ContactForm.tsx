"use client";
import { useState } from "react";

// One underline form (house rule): name, email, WhatsApp, message. A hidden field catches bots.
export default function ContactForm() {
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    setState("sending");
    try {
      const res = await fetch("/api/contact", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(Object.fromEntries(f)) });
      const j = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(j.error || "Something went wrong. Please try again.");
      setState("sent");
    } catch (err: any) {
      setError(err.message);
      setState("error");
    }
  }

  if (state === "sent") {
    return <p className="font-display text-[28px] leading-[1.3]">Thank you. Your message is with us, and we'll write back soon.</p>;
  }

  const field = "w-full py-3 text-[17px] outline-none placeholder:italic placeholder:text-ink focus:border-cobalt";
  return (
    <form onSubmit={submit} className="space-y-8">
      <label className="block">
        <span className="text-[14px]">Your name</span>
        <input name="name" required autoComplete="name" className={field} />
      </label>
      <label className="block">
        <span className="text-[14px]">Email</span>
        <input name="email" type="email" required autoComplete="email" className={field} />
      </label>
      <label className="block">
        <span className="text-[14px]">WhatsApp, with the country code (optional)</span>
        <input name="phone" type="tel" autoComplete="tel" className={field} />
      </label>
      <label className="block">
        <span className="text-[14px]">Your message: when you'd like to come, how many of you</span>
        <textarea name="message" required rows={4} className={`${field} resize-none`} />
      </label>
      <input name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />
      {state === "error" && <p className="text-[15px]">{error}</p>}
      <button disabled={state === "sending"} className="bg-ink px-8 py-3.5 text-[15px] text-plaster hover:bg-cobalt transition-colors disabled:bg-wool disabled:text-ink">
        {state === "sending" ? "Sending" : "Send"}
      </button>
    </form>
  );
}
