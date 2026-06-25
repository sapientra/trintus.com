"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowRight, Menu, X } from "lucide-react";

declare global {
  interface Window {
    Calendly?: {
      initInlineWidget(options: {
        url: string;
        parentElement: HTMLElement;
      }): void;
    };
  }
}

// ─── Calendly modal ───────────────────────────────────────────────────────────

const CALENDLY_URL =
  "https://calendly.com/santiago-trintus/30min?hide_gdpr_banner=1&background_color=1a1a1d&text_color=f5f5f7&primary_color=e85d3a";

function CalendlyModal({ onClose }: { onClose: () => void }) {
  const scriptRef = useRef<HTMLScriptElement | null>(null);

  useEffect(() => {
    document.body.style.overflow = "hidden";

    if (!document.getElementById("calendly-widget-script")) {
      const s = document.createElement("script");
      s.id = "calendly-widget-script";
      s.src = "https://assets.calendly.com/assets/external/widget.js";
      s.async = true;
      document.head.appendChild(s);
      scriptRef.current = s;
    }

    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);

    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handler);
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-background/85 backdrop-blur-sm"
        onClick={onClose}
      />
      {/* Panel */}
      <div className="relative z-10 mx-4 w-full max-w-3xl overflow-hidden rounded-lg border border-border bg-background shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <span className="eyebrow">Book a demo</span>
          <button
            onClick={onClose}
            className="rounded p-1 text-muted-foreground transition-colors hover:bg-surface-2 hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        {/* Widget */}
        <div
          className="calendly-inline-widget"
          data-url={CALENDLY_URL}
          style={{ minWidth: "320px", height: "700px" }}
        />
      </div>
    </div>
  );
}

// ─── Navbar ───────────────────────────────────────────────────────────────────

const NAV_LINKS = [
  { label: "Findings", href: "#findings" },
  { label: "Workflows", href: "#workflows" },
  { label: "Case types", href: "#cases" },
  { label: "Privacy", href: "#privacy" },
  { label: "How it works", href: "#how" },
  { label: "Integrations", href: "#stack" },
];

function Navbar({ onDemo }: { onDemo: () => void }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 h-14 border-b border-border bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-full max-w-6xl items-center justify-between px-6">
        {/* Wordmark */}
        <a
          href="#top"
          className="font-mono text-sm font-semibold tracking-widest text-foreground no-underline"
        >
          TRINTUS
        </a>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-6 md:flex">
          {NAV_LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-[13px] text-muted-foreground transition-colors hover:text-foreground"
            >
              {l.label}
            </a>
          ))}
        </nav>

        {/* Desktop CTA */}
        <button
          onClick={onDemo}
          className="hidden border border-border-strong bg-surface-2 px-3.5 py-1.5 text-[13px] font-medium text-foreground transition-colors hover:bg-surface md:block"
        >
          Book a demo
        </button>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileOpen((v) => !v)}
          className="rounded p-1 text-muted-foreground transition-colors hover:bg-surface-2 hover:text-foreground md:hidden"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-border bg-background px-6 pb-4 pt-3 md:hidden">
          <nav className="flex flex-col gap-3">
            {NAV_LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setMobileOpen(false)}
                className="text-[13px] text-muted-foreground transition-colors hover:text-foreground"
              >
                {l.label}
              </a>
            ))}
            <button
              onClick={() => {
                setMobileOpen(false);
                onDemo();
              }}
              className="mt-1 border border-border-strong bg-surface-2 px-3.5 py-1.5 text-left text-[13px] font-medium text-foreground transition-colors hover:bg-surface"
            >
              Book a demo
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}

// ─── Primary CTA button ────────────────────────────────────────────────────────

function DemoButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="group inline-flex items-center gap-2 bg-foreground px-5 py-2.5 text-sm font-medium text-background transition-transform hover:-translate-y-0.5"
    >
      Book a demo
      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
    </button>
  );
}

// ─── Chip ─────────────────────────────────────────────────────────────────────

function Chip({ label }: { label: string }) {
  return (
    <span className="rounded border border-border bg-surface px-2.5 py-1 text-[11.5px] text-foreground/85">
      {label}
    </span>
  );
}

// ─── Section wrapper ───────────────────────────────────────────────────────────

function Section({
  id,
  children,
  className = "",
}: {
  id?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      id={id}
      className={`section-divider px-6 py-24 ${className}`}
    >
      <div className="mx-auto max-w-6xl">{children}</div>
    </section>
  );
}

// ─── Finding card ──────────────────────────────────────────────────────────────

function FindingCard({
  caseId,
  category,
  title,
  finding,
  evidence,
  recommendation,
}: {
  caseId: string;
  category: string;
  title: string;
  finding: string;
  evidence: string[];
  recommendation: string;
}) {
  return (
    <div className="flex flex-col bg-background p-6">
      {/* Top meta */}
      <div className="mb-3 flex items-center justify-between font-mono text-[11px] tracking-wider text-muted-foreground">
        <span>CASE {caseId}</span>
        <span>{category}</span>
      </div>
      {/* Title + finding */}
      <p className="text-[15px] font-semibold text-foreground">{title}</p>
      <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">
        {finding}
      </p>
      {/* Evidence */}
      <p className="eyebrow mt-5">Evidence</p>
      <ul className="mt-2 space-y-1">
        {evidence.map((e) => (
          <li key={e} className="flex items-start gap-2 text-[12.5px] text-muted-foreground">
            <span className="mt-1 shrink-0 text-muted-foreground">•</span>
            {e}
          </li>
        ))}
      </ul>
      {/* Recommendation */}
      <div className="mt-auto border-t border-border pt-4">
        <p className="eyebrow">Recommendation</p>
        <p className="mt-1.5 text-[13px] text-foreground">{recommendation}</p>
      </div>
    </div>
  );
}

// ─── Workflow card ─────────────────────────────────────────────────────────────

function WorkflowCard({
  title,
  body,
}: {
  title: string;
  body: string;
}) {
  return (
    <div className="flex flex-col gap-2 bg-background p-6">
      <p className="text-[15px] font-semibold text-foreground">{title}</p>
      <p className="text-[13px] leading-relaxed text-muted-foreground">{body}</p>
    </div>
  );
}

// ─── Case type card ───────────────────────────────────────────────────────────

function CaseTypeCard({
  index,
  title,
  description,
  chips,
}: {
  index: string;
  title: string;
  description: string;
  chips: string[];
}) {
  return (
    <div className="flex flex-col gap-3 bg-background p-6">
      <p className="font-mono text-[11px] tracking-widest text-muted-foreground">
        {index}
      </p>
      <p className="text-lg font-semibold text-foreground">{title}</p>
      <p className="text-[13px] leading-relaxed text-muted-foreground">
        {description}
      </p>
      <div className="mt-1 flex flex-wrap gap-1.5">
        {chips.map((c) => (
          <Chip key={c} label={c} />
        ))}
      </div>
    </div>
  );
}

// ─── Architecture card ──────────────────────────────────────────────────────────

function ArchCard({
  badge,
  badgeColor,
  title,
  subtitle,
  lines,
  active,
}: {
  badge: string;
  badgeColor?: string;
  title: string;
  subtitle: string;
  lines: string[];
  active?: boolean;
}) {
  return (
    <div className="relative flex flex-col gap-3 bg-background p-6">
      <div className="flex items-center gap-2">
        <span
          className={`eyebrow ${
            badgeColor ? "" : "text-foreground/60"
          }`}
          style={badgeColor ? { color: badgeColor } : undefined}
        >
          {badge}
        </span>
        {active && (
          <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-signal" />
        )}
      </div>
      <p className="text-[13px] font-semibold text-foreground">{title}</p>
      <p className="text-[12px] text-muted-foreground">{subtitle}</p>
      <div className="mt-1 rounded border border-border bg-surface p-3 font-mono text-[11.5px] leading-relaxed text-muted-foreground">
        {lines.map((l) => (
          <div key={l}>{l}</div>
        ))}
      </div>
    </div>
  );
}

// ─── Privacy note card ─────────────────────────────────────────────────────────

function PrivacyNote({
  title,
  body,
}: {
  title: string;
  body: string;
}) {
  return (
    <div className="flex flex-col gap-2 bg-background p-6">
      <p className="text-[13px] font-semibold text-foreground">{title}</p>
      <p className="text-[13px] leading-relaxed text-muted-foreground">{body}</p>
    </div>
  );
}

// ─── Step row ─────────────────────────────────────────────────────────────────

function StepRow({
  number,
  title,
  body,
  last,
}: {
  number: string;
  title: string;
  body: string;
  last?: boolean;
}) {
  return (
    <div
      className={`flex items-start gap-4 px-5 py-4 ${
        !last ? "border-b border-border" : ""
      }`}
    >
      {/* Numbered circle */}
      <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-border-strong font-mono text-[11px] text-foreground">
        {number}
      </span>
      <div className="flex flex-col gap-1">
        <p className="text-[13px] font-semibold text-foreground">{title}</p>
        <p className="text-[13px] leading-relaxed text-muted-foreground">{body}</p>
      </div>
    </div>
  );
}

// ─── Terminal output card ─────────────────────────────────────────────────────

function TerminalCard() {
  return (
    <div className="overflow-hidden rounded-lg border border-border bg-surface">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border px-5 py-3">
        <span className="eyebrow">Example output</span>
        <span className="rounded-sm bg-signal px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-signal-foreground">
          Priority: High
        </span>
      </div>
      {/* Body */}
      <div className="p-5 font-mono text-[12px] leading-relaxed">
        <p className="mb-3 text-muted-foreground">
          Case #48271 · TRN_A84B923F7D · 4 min
        </p>
        <div className="mb-3 flex flex-col gap-0.5">
          <span className="text-foreground/60">Investigation type</span>
          <span className="text-foreground">Coordinated Accounts</span>
        </div>
        <div className="mb-3 flex flex-col gap-0.5">
          <span className="text-foreground/60">Finding</span>
          <span className="text-foreground">
            Three accounts exhibit coordinated trading activity and shared
            operational characteristics consistent with collusive behavior.
          </span>
        </div>
        <div className="mb-3 flex flex-col gap-1.5">
          <span className="text-foreground/60">Evidence</span>
          <div className="flex flex-col gap-1 text-muted-foreground">
            <span>→ Shared device fingerprints across 6 sessions</span>
            <span>→ Identical trade timing patterns (±2s)</span>
            <span>→ Common withdrawal destination</span>
            <span>→ Linked account registration activity</span>
          </div>
        </div>
        <div className="rounded border border-border-strong bg-background p-3">
          <span className="text-foreground/60">Recommendation</span>
          <p className="mt-1 text-foreground">
            Escalate for enhanced review. Consider temporary withdrawal
            restrictions pending analyst approval.
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Main page ─────────────────────────────────────────────────────────────────

export default function Home() {
  const [demoOpen, setDemoOpen] = useState(false);

  const openDemo = useCallback(() => setDemoOpen(true), []);
  const closeDemo = useCallback(() => setDemoOpen(false), []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <a id="top" className="sr-only" aria-hidden="true" />

      <Navbar onDemo={openDemo} />

      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section className="px-6 pb-24 pt-20 md:pb-32 md:pt-28">
        <div className="mx-auto max-w-3xl text-center">
          <p className="eyebrow">Risk Operations Intelligence for regulated finance</p>
          <h1 className="mt-5 text-4xl font-semibold leading-[1.05] tracking-tight text-foreground md:text-6xl text-balance">
            Investigation infrastructure
            <br />
            for financial institutions.
          </h1>
          <div className="mt-8 space-y-5">
            <p className="mx-auto max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
              Trintus identifies liquidity risk, coordinated accounts, suspicious
              activity, and account takeovers across your organization, then
              delivers investigation-ready findings your analysts can review,
              defend, and act on.
            </p>
            <p className="mx-auto max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
              Built for brokers, prop firms, and fintechs. Customer identities
              never leave your infrastructure. Your analysts remain in control
              of every decision.
            </p>
          </div>
          <div className="mt-10">
            <DemoButton onClick={openDemo} />
          </div>
          <p className="mx-auto mt-4 max-w-2xl text-xs text-muted-foreground/80">
            Works alongside your existing risk, AML, fraud, surveillance, and
            compliance systems — or operates independently when none exist.
          </p>
        </div>
      </section>

      {/* ── Findings ─────────────────────────────────────────────── */}
      <Section id="findings">
        <p className="eyebrow">Investigation-ready findings</p>
        <h2 className="mt-4 max-w-2xl text-3xl font-semibold leading-tight text-foreground md:text-4xl">
          Findings arrive in a format analysts can review, defend, audit, and
          act upon.
        </h2>

        <div className="mt-10 grid gap-px overflow-hidden rounded-lg border border-border bg-border md:grid-cols-3">
          <FindingCard
            caseId="#48271"
            category="Coordinated Accounts"
            title="Three accounts exhibit coordinated trading behavior and shared operational characteristics consistent with collusive activity."
            finding="Coordinated trading behavior and shared operational characteristics consistent with collusive activity."
            evidence={[
              "Shared device fingerprints across six sessions",
              "Identical trade timing patterns",
              "Common withdrawal destination",
              "Linked registration activity",
            ]}
            recommendation="Escalate for enhanced review and analyst assessment."
          />
          <FindingCard
            caseId="#48284"
            category="Liquidity Risk"
            title="Abnormal position sizing and capital utilization patterns significantly exceed peer behavior."
            finding="Abnormal position sizing and capital utilization patterns significantly exceed peer behavior."
            evidence={[
              "Elevated leverage concentration",
              "Accelerated withdrawal activity",
              "Repeated exposure spikes",
            ]}
            recommendation="Enhanced monitoring and risk review."
          />
          <FindingCard
            caseId="#48297"
            category="Suspicious Activity"
            title="Transaction behavior inconsistent with historical profile."
            finding="Transaction behavior inconsistent with historical profile."
            evidence={[
              "Structuring and layering indicators",
              "Unusual fund sources",
              "Inconsistent transaction cadence",
            ]}
            recommendation="Compliance escalation."
          />
        </div>
      </Section>

      {/* ── Workflows ─────────────────────────────────────────────── */}
      <Section id="workflows">
        <p className="eyebrow">Built for teams that investigate</p>
        <h2 className="mt-4 max-w-2xl text-3xl font-semibold leading-tight text-foreground md:text-4xl">
          One investigation engine. Multiple risk workflows.
        </h2>

        <div className="mt-10 grid gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
          <WorkflowCard
            title="Brokers"
            body="Support surveillance, escalation, and case review across trading and operations teams."
          />
          <WorkflowCard
            title="Prop Firms"
            body="Spot coordinated behavior, account sharing, and capital-risk patterns before exposure scales."
          />
          <WorkflowCard
            title="Fintech Platforms"
            body="Investigate suspicious activity without forcing identities out of your environment."
          />
          <WorkflowCard
            title="Compliance Teams"
            body="Keep investigations defensible with evidence, chronology, and review-ready findings."
          />
          <WorkflowCard
            title="Fraud Operations"
            body="Connect operational signals across systems to isolate abuse quickly."
          />
          <WorkflowCard
            title="Risk Management"
            body="See when risk is building across accounts, desks, and workflows in one place."
          />
        </div>
      </Section>

      {/* ── Case types ───────────────────────────────────────────── */}
      <Section id="cases">
        <p className="eyebrow">Investigations Trintus handles</p>
        <h2 className="mt-4 text-3xl font-semibold leading-tight text-foreground md:text-4xl">
          Four case types.
          <br />
          One investigation engine.
        </h2>
        <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
          The same evidence gathering, correlation, and reporting engine powers
          every investigation type. The case category changes. The infrastructure
          underneath doesn&apos;t.
        </p>

        <div className="mt-10 grid gap-px overflow-hidden rounded-lg border border-border bg-border md:grid-cols-2">
          <CaseTypeCard
            index="01"
            title="Liquidity Risk"
            description="Identify traders whose behavior creates disproportionate capital exposure before it becomes a loss event."
            chips={["Withdrawal velocity", "Position sizing anomaly", "Payout pattern"]}
          />
          <CaseTypeCard
            index="02"
            title="Coordinated Accounts"
            description="Detect linked accounts, collusive behavior, and shared operational characteristics across your client base."
            chips={[
              "Account mirroring",
              "Shared device fingerprints",
              "Trade timing correlation",
              "Common withdrawal destination",
              "Linked registration",
            ]}
          />
          <CaseTypeCard
            index="03"
            title="Suspicious Activity"
            description="Automate the investigation work behind AML and regulatory workflows. Every finding is traceable to evidence."
            chips={[
              "Transaction layering",
              "Unusual fund sources",
              "SAR-triggering patterns",
              "Structuring behavior",
            ]}
          />
          <CaseTypeCard
            index="04"
            title="Account Takeover"
            description="Investigate compromised accounts, credential abuse, and unauthorized activity with a complete evidence trail."
            chips={["Session anomaly", "Device change", "Behavioral shift", "Geo inconsistency"]}
          />
        </div>

        {/* Callout */}
        <div className="mt-10 rounded-lg border border-border bg-surface p-6">
          <p className="eyebrow">Works with your existing stack</p>
          <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">
            Trintus can investigate alerts generated by your existing risk, AML,
            fraud, or compliance systems. For firms without an existing alerting
            layer, Trintus can also generate risk profiles and behavioral alerts
            directly from operational data.
          </p>
        </div>
      </Section>

      {/* ── Privacy ─────────────────────────────────────────────── */}
      <Section id="privacy">
        <p className="eyebrow">Privacy by architecture</p>
        <h2 className="mt-4 max-w-2xl text-3xl font-semibold leading-tight text-foreground md:text-4xl">
          Customer identities never leave your infrastructure.
        </h2>
        <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
          Most vendors ask you to send them your customer data. Trintus is
          designed the other way around. We investigate behavior, events, and
          transactions — not names, emails, or phone numbers.
        </p>

        {/* Architecture diagram */}
        <div className="mt-10 grid gap-px overflow-hidden rounded-lg border border-border bg-border lg:grid-cols-3">
          <ArchCard
            badge="YOUR INFRASTRUCTURE"
            title="Broker systems"
            subtitle="Client identities stay here. Always."
            lines={["name: John Smith", "email: j@…", "id: 12345"]}
          />
          <ArchCard
            badge="TRINTUS GATEWAY"
            badgeColor="#9a9aa3"
            title="Pseudonymization"
            subtitle="Runs inside your environment. Strips all identifiers."
            lines={["fn: HMAC(secret, id)", "→: TRN_A84B923F7D"]}
          />
          <ArchCard
            badge="TRINTUS CLOUD"
            title="Investigation engine"
            subtitle="Receives only pseudonymized behavioral data."
            lines={["id: TRN_A84B923F7D", "events: [...]", "priority: HIGH"]}
            active
          />
        </div>

        {/* Privacy notes */}
        <div className="mt-10 grid gap-px overflow-hidden rounded-lg border border-border bg-border md:grid-cols-3">
          <PrivacyNote
            title="PII stays on your servers"
            body="Names, emails, and documents never leave your infrastructure. Only pseudonymized IDs and behavioral events are transmitted."
          />
          <PrivacyNote
            title="Only you can reverse it"
            body="Pseudonymization uses a secret key that never leaves your environment. Trintus cannot reverse the mapping. Ever."
          />
          <PrivacyNote
            title="We investigate behavior, not people"
            body="Trintus analyzes patterns, timing, device relationships, and transaction flows — without ever seeing who those accounts belong to."
          />
        </div>
      </Section>

      {/* ── How it works ──────────────────────────────────────────── */}
      <Section id="how">
        <p className="eyebrow">How it works.</p>
        <h2 className="mt-4 text-3xl font-semibold leading-tight text-foreground md:text-4xl">
          Four steps. Minutes, not hours.
        </h2>

        <div className="mt-10 grid gap-0 overflow-hidden rounded-lg border border-border bg-surface lg:grid-cols-[1.05fr_1fr]">
          {/* Steps */}
          <div className="divide-y divide-border">
            <StepRow
              number="1"
              title="Alert lands"
              body="A fraud alert, compliance case, suspicious activity report, or risk trigger enters your workflow — from an existing tool or generated by Trintus directly."
            />
            <StepRow
              number="2"
              title="Trintus investigates"
              body="The system gathers evidence, correlates activity across accounts and systems, and constructs a complete case picture automatically."
            />
            <StepRow
              number="3"
              title="Report delivered"
              body="A structured investigation report is generated with findings, supporting evidence, case priority, and a recommended action."
            />
            <StepRow
              number="4"
              title="Analyst decides"
              body="Your team reviews the complete investigation packet and makes the final call. Trintus never acts autonomously."
              last
            />
          </div>
          {/* Terminal */}
          <div className="border-t border-border lg:border-t-0 lg:border-l border-border">
            <div className="p-5">
              <TerminalCard />
            </div>
          </div>
        </div>
      </Section>

      {/* ── Integrations + Security ──────────────────────────────── */}
      <Section id="stack">
        <div className="grid gap-12 md:grid-cols-2">
          {/* Integrations */}
          <div>
            <p className="eyebrow">Integrations</p>
            <h2 className="mt-4 text-3xl font-semibold leading-tight text-foreground md:text-4xl">
              Connects to your existing stack.
            </h2>
            <p className="mt-5 text-[15px] leading-relaxed text-muted-foreground">
              No rip-and-replace. No new data warehouse. Trintus connects to
              the systems you already operate. The gateway runs inside your
              infrastructure and the investigation engine works on top of your
              existing data.
            </p>
            <p className="mt-3 text-[13px] text-muted-foreground/80">
              Specific integrations available on request.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {[
                "Trading platforms",
                "CRM systems",
                "Compliance tools",
                "Internal databases",
                "Data warehouses",
                "Case management",
              ].map((c) => (
                <Chip key={c} label={c} />
              ))}
            </div>
          </div>

          {/* Security */}
          <div>
            <p className="eyebrow">Security controls</p>
            <h2 className="mt-4 text-3xl font-semibold leading-tight text-foreground md:text-4xl">
              Built for regulated institutions.
            </h2>
            <p className="mt-5 text-[15px] leading-relaxed text-muted-foreground">
              Beyond the pseudonymization architecture, Trintus meets the
              security requirements of regulated financial institutions.
            </p>
            <p className="mt-3 text-[13px] text-muted-foreground/80">
              Client data is never used for AI model training.
            </p>
            <div className="mt-6 grid grid-cols-2 gap-2">
              {[
                "Encryption in transit and at rest",
                "Full audit trail per case",
                "Role-based access controls",
                "Data retention controls",
                "Private cloud deployment",
                "On-prem gateway option",
              ].map((c) => (
                <Chip key={c} label={c} />
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* ── Closing CTA ──────────────────────────────────────────── */}
      <section className="section-divider px-6 py-28 text-center">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-3xl font-semibold leading-tight text-foreground md:text-5xl text-balance">
            Know where risk is building before the damage is done.
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-[14px] leading-relaxed text-muted-foreground">
            See a live case generated from your own workflow. No data leaves your
            infrastructure.
          </p>
          <div className="mt-8">
            <DemoButton onClick={openDemo} />
          </div>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────────── */}
      <footer className="border-t border-border px-6 py-6">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <span className="font-mono text-sm font-semibold tracking-widest text-foreground">
            TRINTUS
          </span>
          <span className="text-xs text-muted-foreground">© 2026</span>
        </div>
      </footer>

      {/* ── Calendly modal ────────────────────────────────────────── */}
      {demoOpen && <CalendlyModal onClose={closeDemo} />}
    </div>
  );
}
