"use client";

import { useActionState } from "react";
import {
  sendContact,
  type ContactField,
  type ContactState,
} from "@/app/actions/contact";
import { cn } from "@/lib/utils";

const initialState: ContactState = { status: "idle", message: "" };

const inputClass =
  "mt-2 w-full rounded-md border border-line-strong bg-surface-2 px-4 py-3 text-[length:var(--step-0)] text-fg placeholder:text-fg-3 outline-none transition-[border-color,box-shadow] duration-300 hover:border-fg-3 focus:border-accent focus:ring-2 focus:ring-accent/25 aria-[invalid=true]:border-accent";

const labelClass = "label-mono block text-fg-2";

/** Enquiry form — submits to a Server Action that emails the message to Gmail. */
export function ContactForm() {
  const [state, action, pending] = useActionState(sendContact, initialState);
  const v = state.values ?? {};
  const err = (f: ContactField) => state.errors?.[f];

  const field = (f: ContactField) => ({
    id: `contact-${f}`,
    name: f,
    defaultValue: v[f],
    "aria-invalid": err(f) ? true : undefined,
    "aria-describedby": err(f) ? `contact-${f}-error` : undefined,
    className: inputClass,
  });

  const errorText = (f: ContactField) =>
    err(f) && (
      <p id={`contact-${f}-error`} className="mt-2 text-[length:var(--step--1)] text-accent">
        {err(f)}
      </p>
    );

  return (
    <form action={action} noValidate className="relative grid gap-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="contact-name" className={labelClass}>
            Name
          </label>
          <input
            {...field("name")}
            type="text"
            autoComplete="name"
            required
            maxLength={100}
            placeholder="Your name"
          />
          {errorText("name")}
        </div>
        <div>
          <label htmlFor="contact-email" className={labelClass}>
            Email
          </label>
          <input
            {...field("email")}
            type="email"
            autoComplete="email"
            required
            maxLength={200}
            placeholder="you@company.com"
          />
          {errorText("email")}
        </div>
      </div>

      <div>
        <label htmlFor="contact-subject" className={labelClass}>
          Subject <span className="normal-case text-fg-3">(optional)</span>
        </label>
        <input
          id="contact-subject"
          name="subject"
          type="text"
          maxLength={150}
          defaultValue={v.subject}
          placeholder="New website, redesign, landing page…"
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="contact-message" className={labelClass}>
          Message
        </label>
        <textarea
          {...field("message")}
          required
          rows={5}
          maxLength={5000}
          placeholder="Tell me about your project, timeline and budget."
          className={cn(inputClass, "resize-y")}
        />
        {errorText("message")}
      </div>

      {/* Honeypot — hidden from people, tempting to bots */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor="contact-company">Company</label>
        <input id="contact-company" name="company" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="flex flex-wrap items-center gap-6">
        <button
          type="submit"
          disabled={pending}
          data-cursor="open"
          className="label-mono inline-flex min-h-12 items-center gap-3 rounded-full bg-accent px-7 py-3 text-accent-ink transition-colors duration-300 hover:bg-fg disabled:cursor-wait disabled:opacity-60"
        >
          {pending ? "Sending…" : "Send message →"}
        </button>
        <p
          role="status"
          aria-live="polite"
          className={cn(
            "text-[length:var(--step--1)]",
            state.status === "error" ? "text-accent" : "text-fg",
          )}
        >
          {state.message}
        </p>
      </div>
    </form>
  );
}
