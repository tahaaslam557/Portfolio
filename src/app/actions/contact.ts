"use server";

import nodemailer from "nodemailer";
import { site } from "@/data/site";

export type ContactField = "name" | "email" | "message";

export type ContactState = {
  status: "idle" | "success" | "error";
  message: string;
  errors?: Partial<Record<ContactField, string>>;
  /** Echoed back so the fields keep their values after a failed submit. */
  values?: Partial<Record<ContactField | "subject", string>>;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const LIMITS = { name: 100, email: 200, subject: 150, message: 5000 };

const escapeHtml = (s: string) =>
  s.replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ]!,
  );

/** Strip line breaks so user input can never inject extra mail headers. */
const oneLine = (s: string) => s.replace(/[\r\n]+/g, " ").trim();

export async function sendContact(
  _prev: ContactState,
  formData: FormData,
): Promise<ContactState> {
  const get = (k: string) => String(formData.get(k) ?? "").trim();
  const values = {
    name: oneLine(get("name")),
    email: oneLine(get("email")),
    subject: oneLine(get("subject")),
    message: get("message"),
  };

  // Honeypot: real visitors never see or fill this field. Pretend success.
  if (get("company")) {
    return { status: "success", message: "Thanks — your message was sent." };
  }

  const errors: ContactState["errors"] = {};
  if (!values.name) errors.name = "Please enter your name.";
  else if (values.name.length > LIMITS.name) errors.name = "Name is too long.";
  if (!EMAIL_RE.test(values.email) || values.email.length > LIMITS.email)
    errors.email = "Please enter a valid email address.";
  if (values.message.length < 10)
    errors.message = "Please write a little more (10+ characters).";
  else if (values.message.length > LIMITS.message)
    errors.message = "Message is too long.";
  values.subject = values.subject.slice(0, LIMITS.subject);

  if (Object.keys(errors).length) {
    return {
      status: "error",
      message: "Please fix the highlighted fields.",
      errors,
      values,
    };
  }

  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD;
  if (!user || !pass) {
    console.error("[contact] GMAIL_USER / GMAIL_APP_PASSWORD are not set");
    return {
      status: "error",
      message: `The form isn't available right now — please email ${site.email} directly.`,
      values,
    };
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user, pass },
  });

  const subject = values.subject || "New enquiry";
  try {
    await transporter.sendMail({
      from: { name: `${values.name} via Portfolio`, address: user },
      to: process.env.CONTACT_TO || site.email,
      replyTo: { name: values.name, address: values.email },
      subject: `[Portfolio] ${subject}`,
      text: `Name: ${values.name}\nEmail: ${values.email}\nSubject: ${subject}\n\n${values.message}`,
      html: `<p><strong>Name:</strong> ${escapeHtml(values.name)}<br>
<strong>Email:</strong> <a href="mailto:${escapeHtml(values.email)}">${escapeHtml(values.email)}</a><br>
<strong>Subject:</strong> ${escapeHtml(subject)}</p>
<p style="white-space:pre-wrap">${escapeHtml(values.message)}</p>`,
    });
  } catch (err) {
    console.error("[contact] sendMail failed", err);
    return {
      status: "error",
      message: `Something went wrong sending your message — please email ${site.email} directly.`,
      values,
    };
  }

  return {
    status: "success",
    message: "Thanks — your message was sent. I'll get back to you soon.",
  };
}
