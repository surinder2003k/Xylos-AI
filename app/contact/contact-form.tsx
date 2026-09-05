"use client";

import { useState } from "react";
import { Send, Check } from "lucide-react";
import Link from "next/link";

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    // Form is purely visual; no backend wired.
    // Open a mailto with the user's input so the message isn't lost.
    const fd = new FormData(e.currentTarget);
    const name = String(fd.get("name") || "");
    const email = String(fd.get("email") || "");
    const subject = String(fd.get("subject") || "");
    const message = String(fd.get("message") || "");
    const body = `Name: ${name}%0D%0AEmail: ${email}%0D%0A%0D%0A${message}`;
    const subjectMap: Record<string, string> = {
      partnership: "Partnership & Business Development",
      press: "Press & Media Inquiries",
      support: "Technical Support",
      feedback: "Product Feedback",
      careers: "Careers & Opportunities",
      other: "Other",
    };
    const subjectLabel = subjectMap[subject] || "Contact from Xylos AI site";
    window.location.href = `mailto:hello@xylosai.com?subject=${encodeURIComponent(subjectLabel)}&body=${body}`;
    setSubmitting(false);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
  };

  return (
    <form className="space-y-6 glass-card p-8" onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-2" style={{ color: '#aeb9bd' }}>
            Full Name <span className="text-[#00f0ff]">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#00f0ff]/40 transition-all"
            placeholder="Your name"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-2" style={{ color: '#aeb9bd' }}>
            Email Address <span className="text-[#00f0ff]">*</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#00f0ff]/40 transition-all"
            placeholder="you@example.com"
          />
        </div>
      </div>
      <div>
        <label htmlFor="subject" className="block text-sm font-medium mb-2" style={{ color: '#aeb9bd' }}>
          Subject <span className="text-[#00f0ff]">*</span>
        </label>
        <select
          id="subject"
          name="subject"
          required
          className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-white focus:outline-none focus:ring-2 focus:ring-[#00f0ff]/40 transition-all"
        >
          <option value="" disabled>Select a topic</option>
          <option value="partnership">Partnership & Business Development</option>
          <option value="press">Press & Media Inquiries</option>
          <option value="support">Technical Support</option>
          <option value="feedback">Product Feedback</option>
          <option value="careers">Careers & Opportunities</option>
          <option value="other">Other</option>
        </select>
      </div>
      <div>
        <label htmlFor="message" className="block text-sm font-medium mb-2" style={{ color: '#aeb9bd' }}>
          Message <span className="text-[#00f0ff]">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          rows={6}
          required
          className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#00f0ff]/40 transition-all resize-none"
          placeholder="Tell us how we can help..."
        />
      </div>
      <button
        type="submit"
        disabled={submitting}
        className="w-full md:w-auto px-8 py-4 rounded-xl font-semibold text-sm uppercase tracking-wide transition-all group disabled:opacity-60"
        style={{ background: '#00f0ff', color: '#04141a' }}
      >
        <span className="flex items-center gap-2">
          {submitted ? (
            <>
              Opened email client
              <Check className="w-4 h-4" />
            </>
          ) : (
            <>
              Send Message
              <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </span>
      </button>
      <p className="text-[11px] text-center text-gray-500">
        By submitting, you agree to our <Link href="/privacy" className="text-[#00f0ff] hover:underline">Privacy Policy</Link> and <Link href="/terms" className="text-[#00f0ff] hover:underline">Terms of Service</Link>.
      </p>
    </form>
  );
}
