"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { motion, type MotionProps } from "framer-motion";
import { ArrowRight, CheckCircle2, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

declare global {
  interface Window {
    Calendly?: {
      initInlineWidget: (options: {
        url: string;
        parentElement: HTMLElement;
      }) => void;
    };
  }
}

// ─── Animation helpers ───────────────────────────────────────────────────────

function fadeUp(delay = 0, duration = 0.55): MotionProps {
  return {
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    transition: { duration, delay, ease: [0.21, 0.47, 0.32, 0.98] as const },
  };
}

// ─── Section heading ─────────────────────────────────────────────────────────

function SectionHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="space-y-3">
      <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-slate-600">
        {eyebrow}
      </p>
      <h2 className="text-3xl font-semibold tracking-tight text-slate-100 sm:text-4xl">
        {title}
      </h2>
      <p className="max-w-2xl text-base leading-7 text-slate-400 sm:text-[17px]">
        {description}
      </p>
    </div>
  );
}

// ─── Calendly modal ────────────────────────────────────────────────────────

function CalendlyModal({ onClose }: { onClose: () => void }) {
  const widgetRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let cancelled = false;
    let attempts = 0;

    const initWidget = () => {
      if (cancelled || !widgetRef.current) {
        return;
      }

      const calendly = window.Calendly;

      if (!calendly?.initInlineWidget) {
        attempts += 1;
        if (attempts < 50) {
          window.setTimeout(initWidget, 100);
        }
        return;
      }

      widgetRef.current.innerHTML = "";
      calendly.initInlineWidget({
        url: "https://calendly.com/santiago-trintus/30min?hide_event_type_details=1&hide_gdpr_banner=1&primary_color=8300ff",
        parentElement: widgetRef.current,
      });
    };

    initWidget();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />
      {/* Modal */}
      <div className="relative z-10 w-full max-w-3xl rounded-2xl overflow-hidden border border-slate-800 bg-[#0a0f18] shadow-[0_32px_80px_rgba(0,0,0,0.8)]">
        <div className="flex items-center justify-between border-b border-slate-800 px-5 py-4">
          <span className="text-sm font-medium text-slate-200">Book a demo</span>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-800 text-slate-500 transition hover:border-slate-700 hover:text-slate-300"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div
          ref={widgetRef}
          className="calendly-inline-widget"
          style={{ minWidth: "320px", height: "630px" }}
        />
      </div>
    </div>
  );
}

// ─── Waitlist form ──────────────────────────────────────────────────────────

function WaitlistForm() {
  const [submitted, setSubmitted] = useState<{ referenceId: string } | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const payload = Object.fromEntries(new FormData(form).entries());
    setError(null);
    setSubmitting(true);
    try {
      const response = await fetch('/api/pilot-access', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(data?.error ?? 'Something went wrong. Please try again.');
      }

      const data = (await response.json()) as { referenceId: string };
      setSubmitted(data);
      form.reset();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card className="border-slate-800/80 bg-[#0a0f18]">
      <CardContent className="p-6 sm:p-8">
        {submitted ? (
          <div className="flex flex-col items-center py-8 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-emerald-500/25 bg-emerald-500/10">
              <CheckCircle2 className="h-7 w-7 text-emerald-400" />
            </div>
            <div className="mt-5 text-lg font-semibold text-slate-100">You&apos;re on the list.</div>
            <div className="mt-2 max-w-sm text-sm text-slate-400">
              We&apos;ll review your application and respond within 3 business days. No commitment required.
            </div>
            <div className="mt-4 rounded-full border border-slate-800 bg-slate-950/70 px-4 py-2 text-xs text-slate-500">
              Reference {submitted.referenceId}
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="grid gap-5 sm:grid-cols-2">
            {error && (
              <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200 sm:col-span-2">
                {error}
              </div>
            )}
            {[
              { id: "name", label: "Name", placeholder: "Jordan Lee", type: "text", required: true },
              { id: "company", label: "Company", placeholder: "Atlas Brokerage", type: "text", required: true },
              { id: "position", label: "Position", placeholder: "Head of Risk", type: "text", required: true },
              { id: "email", label: "Work email", placeholder: "jordan@atlas.com", type: "email", required: true },
            ].map((field) => (
              <div key={field.id} className="space-y-2">
                <Label htmlFor={field.id} className="text-xs text-slate-400">
                  {field.label}
                </Label>
                <Input
                  id={field.id}
                  name={field.id}
                  type={field.type}
                  placeholder={field.placeholder}
                  required={field.required}
                  className="rounded-xl border-slate-800 bg-slate-950/80 text-sm text-slate-200 placeholder:text-slate-600 focus:border-slate-600 focus:ring-1 focus:ring-slate-700"
                />
              </div>
            ))}
            <div className="sm:col-span-2">
              <Button
                type="submit"
                disabled={submitting}
                className="w-full rounded-xl bg-slate-100 text-slate-950 hover:bg-white disabled:opacity-60"
              >
                {submitting ? (
                  <span className="flex items-center gap-2">
                    <span className="h-3.5 w-3.5 animate-spin rounded-full border border-slate-500 border-t-transparent" />
                    Submitting...
                  </span>
                ) : (
                  "Request access"
                )}
              </Button>
              <p className="mt-3 text-center text-[11px] text-slate-600">
                We respond to every application within 3 business days. No commitment required.
              </p>
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  );
}

// ─── Main page ───────────────────────────────────────────────────────────────

export default function Home() {
  const [calendlyOpen, setCalendlyOpen] = useState(false);

  return (
    <main className="relative min-h-screen bg-[#070b12] text-slate-100 overflow-hidden">

      {/* Subtle background texture */}
      <div
        className="pointer-events-none fixed inset-0 opacity-[0.035]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")",
        }}
      />

      {/* ── Nav ─────────────────────────────────────────────────────── */}
      <header className="relative z-10 mx-auto flex max-w-5xl items-center justify-between px-6 py-5 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-700/80 bg-slate-900 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
            <div className="h-3.5 w-3.5 rounded-sm border border-slate-400 bg-slate-700" />
          </div>
          <div>
            <div className="text-sm font-semibold text-slate-100 tracking-tight">Trintus</div>
            <div className="text-[10px] text-slate-600">Autonomous Operations</div>
          </div>
        </div>
        <nav className="flex items-center gap-4">
          <a
            href="#waitlist"
            className="rounded-full border border-slate-700/80 bg-slate-950/80 px-4 py-2 text-sm text-slate-300 transition hover:border-slate-600 hover:text-slate-100"
          >
            Request access
          </a>
        </nav>
      </header>

      {/* ── Hero ────────────────────────────────────────────────────── */}
      <section className="relative z-10 mx-auto max-w-5xl px-6 py-20 lg:px-8 lg:py-32">
        <motion.div {...fadeUp(0, 0.6)} className="max-w-2xl">

          <h1 className="text-5xl font-semibold tracking-tight text-slate-50 sm:text-[3.4rem] lg:text-[3.8rem] leading-[1.08]">
            Your compliance team<br />investigates manually.<br />We fix that.
          </h1>

          <p className="mt-7 max-w-lg text-[17px] leading-7 text-slate-400">
            Trintus is an AI system that investigates operational incidents — fraud alerts, compliance cases, risk reviews — automatically. It gathers evidence, correlates activity across systems, and produces a structured report with a recommended action.
          </p>
          <p className="mt-4 max-w-lg text-[15px] leading-6 text-slate-500">
            Instead of your team spending hours pulling logs and drafting findings, they get a complete investigation packet in minutes — one they can stand behind, audit, and act on.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
            <button
              onClick={() => setCalendlyOpen(true)}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#8300ff] px-6 py-3.5 text-sm font-medium text-white transition hover:bg-[#7a00ed]"
            >
              Book a demo
              <ArrowRight className="h-4 w-4" />
            </button>
            <a
              href="#waitlist"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-800 bg-slate-950/80 px-6 py-3.5 text-sm font-medium text-slate-300 transition hover:border-slate-700 hover:text-slate-100"
            >
              Request pilot access
            </a>
          </div>

        </motion.div>
      </section>

      {/* ── What it does ────────────────────────────────────────────── */}
      <section className="relative z-10 mx-auto max-w-5xl px-6 py-20 lg:px-8">
        <SectionHeader
          eyebrow="What Trintus does"
          title="From alert to defensible report, without the manual work."
          description="We built Trintus because the same tasks that burn out compliance and risk teams are also the most automatable: pull data, find patterns, document findings. Trintus handles that pipeline."
        />
        <div className="mt-10 grid gap-4 lg:grid-cols-3">
          {[
            {
              title: "Gathers evidence automatically",
              description: "Pulls transaction logs, account activity, session records, and policy data from your systems — without an analyst doing the legwork.",
            },
            {
              title: "Correlates across data sources",
              description: "Links accounts, identifies patterns, and surfaces anomalies by connecting information that would take hours to piece together by hand.",
            },
            {
              title: "Produces audit-ready reports",
              description: "Every finding is traceable to the underlying data. Structured output your team can review, challenge, and stand behind in a regulatory review.",
            },
          ].map((item, i) => (
            <motion.div
              key={item.title}
              {...fadeUp(0.1 + i * 0.06, 0.45)}
            >
              <Card className="h-full border-slate-800/80 bg-[#0a0f18]">
                <CardHeader className="pb-4">
                  <CardTitle className="text-base font-medium text-slate-100">{item.title}</CardTitle>
                  <CardDescription className="text-sm leading-6 text-slate-500">{item.description}</CardDescription>
                </CardHeader>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── How it works ───────────────────────────────────────────── */}
      <section className="relative z-10 mx-auto max-w-5xl px-6 py-20 lg:px-8">
        <SectionHeader
          eyebrow="How it works"
          title="Structured investigations, end to end."
          description="Connect your data sources, define your policies, and let Trintus run the investigation loop."
        />
        <div className="mt-10 grid gap-6 lg:grid-cols-4">
          {[
            { step: "01", title: "Alert lands", description: "A fraud alert, compliance flag, or risk trigger arrives through your existing systems." },
            { step: "02", title: "Trintus investigates", description: "The system pulls relevant data, correlates activity, and builds a case picture — fully automated." },
            { step: "03", title: "Report delivered", description: "A structured report is produced: risk score, evidence summary, timeline, and a recommended action." },
            { step: "04", title: "Analyst reviews", description: "Your team reviews the output, approves or overrides the recommendation, and acts." },
          ].map((item, i) => (
            <motion.div
              key={item.step}
              {...fadeUp(0.1 + i * 0.06, 0.4)}
            >
              <div className="rounded-2xl border border-slate-800/80 bg-[#0a0f18] p-5">
                <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-emerald-400/70">{item.step}</div>
                <div className="mt-3 text-sm font-medium text-slate-100">{item.title}</div>
                <div className="mt-2 text-sm leading-5 text-slate-500">{item.description}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Calendly section ──────────────────────────────────────── */}
      <section className="relative z-10 mx-auto max-w-5xl px-6 py-20 lg:px-8">
        <div className="overflow-hidden rounded-2xl border border-[#8300ff]/30 bg-[#0a0f18] p-10 text-center shadow-[0_0_60px_rgba(131,0,255,0.08)]">
          <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#8300ff]">
            Get a live walkthrough
          </p>
          <h2 className="mt-4 text-2xl font-semibold tracking-tight text-slate-100 sm:text-3xl">
            See Trintus Risk in action.
          </h2>
          <p className="mt-4 max-w-lg mx-auto text-base leading-6 text-slate-400">
            30 minutes. We&apos;ll walk through the investigation workflow, answer your questions, and discuss how it would fit into your team&apos;s process.
          </p>
          <button
            onClick={() => setCalendlyOpen(true)}
            className="mt-8 inline-flex items-center justify-center gap-2 rounded-full bg-[#8300ff] px-8 py-3.5 text-sm font-medium text-white transition hover:bg-[#7a00ed]"
          >
            Book a demo
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </section>

      {/* ── Waitlist ───────────────────────────────────────────────── */}
      <section id="waitlist" className="relative z-10 mx-auto max-w-5xl px-6 py-20 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[0.6fr_1.4fr] lg:items-start">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-slate-600">
              Pilot access
            </p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-slate-100 sm:text-3xl">
              Running a pilot with a small group of firms.
            </h2>
            <p className="mt-4 text-base leading-6 text-slate-400">
              We&apos;re working with brokers and prop trading firms that are tired of burning analyst hours on manual investigation work. If that sounds familiar, we want to talk.
            </p>
            <div className="mt-8 space-y-3">
              {[
                "Dedicated onboarding and integration support",
                "Direct line to the product team",
                "No commitment required to apply",
              ].map((item) => (
                <div key={item} className="flex items-center gap-2.5 text-sm text-slate-500">
                  <CheckCircle2 className="h-4 w-4 text-slate-600" />
                  {item}
                </div>
              ))}
            </div>
          </div>
          <WaitlistForm />
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────────────────────── */}
      <footer className="relative z-10 mx-auto flex max-w-5xl flex-col gap-2 border-t border-slate-800/60 px-6 pb-12 pt-8 lg:flex-row lg:items-end lg:justify-between lg:px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-800/80 bg-slate-950">
            <div className="h-3 w-3 rounded-sm border border-slate-500 bg-slate-700" />
          </div>
          <div>
            <div className="text-sm font-semibold text-slate-300">Trintus</div>
            <div className="text-[10px] text-slate-600">Autonomous Operations</div>
          </div>
        </div>
        <div className="text-xs text-slate-600">
          AI investigation and compliance automation for regulated firms.
        </div>
      </footer>

      {calendlyOpen && <CalendlyModal onClose={() => setCalendlyOpen(false)} />}
    </main>
  );
}
