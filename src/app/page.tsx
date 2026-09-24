"use client";

import React, { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { StatCard } from "@/components/ui/StatCard";
import styles from "./page.module.css";
import {
  Users, UserPlus, Home, CalendarCheck2, Clock,
  Phone, MessageSquare, Plus, Building2, LayoutGrid,
  BookOpen, ChevronRight, Globe, UserCheck, Search, Eye,
} from "lucide-react";

/* ─────────────────────────────────────────────────────────────
   SAMPLE DATA
   ───────────────────────────────────────────────────────────── */

const PIPELINE_STAGES = [
  { label: "New",         count: 84,  color: "#3B82F6", pct: 100 },
  { label: "Contacted",  count: 61,  color: "#6366F1", pct: 73  },
  { label: "Site Visit", count: 42,  color: "#8B5CF6", pct: 50  },
  { label: "Interested", count: 29,  color: "#A855F7", pct: 35  },
  { label: "Negotiation",count: 18,  color: "#F59E0B", pct: 21  },
  { label: "Booked",     count: 11,  color: "#10B981", pct: 13  },
  { label: "Lost",       count: 14,  color: "#EF4444", pct: 17  },
];

const FOLLOW_UPS = [
  {
    id: "f1",
    customer: "Priya Sharma",
    phone: "+91 98765 43210",
    stage: "Negotiation",
    project: "Greenview Residences",
    date: "Today, 3:00 PM",
    urgent: true,
    agent: { name: "Ravi Kumar", initials: "RK" },
  },
  {
    id: "f2",
    customer: "Arjun Mehta",
    phone: "+91 87654 32109",
    stage: "Site Visit",
    project: "Sky Heights Phase 2",
    date: "Today, 5:30 PM",
    urgent: true,
    agent: { name: "Sneha Patel", initials: "SP" },
  },
  {
    id: "f3",
    customer: "Kavitha Nair",
    phone: "+91 76543 21098",
    stage: "Interested",
    project: "Lakeview Villas",
    date: "Tomorrow, 10:00 AM",
    urgent: false,
    agent: { name: "Amit Singh", initials: "AS" },
  },
  {
    id: "f4",
    customer: "Rohan Desai",
    phone: "+91 65432 10987",
    stage: "Contacted",
    project: "Greenview Residences",
    date: "Tomorrow, 2:00 PM",
    urgent: false,
    agent: { name: "Ravi Kumar", initials: "RK" },
  },
  {
    id: "f5",
    customer: "Sunita Verma",
    phone: "+91 54321 09876",
    stage: "New",
    project: "Urban Square",
    date: "Sep 25, 11:00 AM",
    urgent: false,
    agent: { name: "Sneha Patel", initials: "SP" },
  },
];

const RECENT_LEADS = [
  {
    id: "l1",
    customer: "Deepak Agarwal",
    email: "deepak.a@gmail.com",
    source: "Website",
    project: "Greenview Residences",
    stage: "Negotiation",
    agent: "Ravi Kumar",
    followUp: "Sep 24",
    created: "Sep 21",
  },
  {
    id: "l2",
    customer: "Meena Iyer",
    email: "meena.i@yahoo.com",
    source: "Referral",
    project: "Sky Heights Phase 2",
    stage: "Site Visit",
    agent: "Sneha Patel",
    followUp: "Sep 24",
    created: "Sep 20",
  },
  {
    id: "l3",
    customer: "Suresh Babu",
    email: "suresh.b@outlook.com",
    source: "99acres",
    project: "Lakeview Villas",
    stage: "Interested",
    agent: "Amit Singh",
    followUp: "Sep 25",
    created: "Sep 20",
  },
  {
    id: "l4",
    customer: "Nandini Kapoor",
    email: "nandini.k@gmail.com",
    source: "MagicBricks",
    project: "Urban Square",
    stage: "Contacted",
    agent: "Ravi Kumar",
    followUp: "Sep 25",
    created: "Sep 19",
  },
  {
    id: "l5",
    customer: "Vijay Reddy",
    email: "vijay.r@gmail.com",
    source: "Walk-in",
    project: "Greenview Residences",
    stage: "New",
    agent: "Sneha Patel",
    followUp: "Sep 26",
    created: "Sep 19",
  },
  {
    id: "l6",
    customer: "Ananya Singh",
    email: "ananya.s@gmail.com",
    source: "Housing.com",
    project: "Sky Heights Phase 2",
    stage: "Booked",
    agent: "Amit Singh",
    followUp: "Oct 1",
    created: "Sep 15",
  },
];

const RECENT_BOOKINGS = [
  {
    id: "b1",
    customer: "Rajesh Khanna",
    project: "Greenview Residences",
    unit: "3BHK — B-704",
    amount: "₹1.45 Cr",
    date: "Sep 22, 2026",
    status: "Confirmed",
  },
  {
    id: "b2",
    customer: "Pooja Menon",
    project: "Sky Heights Phase 2",
    unit: "2BHK — A-302",
    amount: "₹89 L",
    date: "Sep 20, 2026",
    status: "Pending",
  },
  {
    id: "b3",
    customer: "Harish Rao",
    project: "Lakeview Villas",
    unit: "4BHK Villa — V-12",
    amount: "₹2.8 Cr",
    date: "Sep 18, 2026",
    status: "Confirmed",
  },
  {
    id: "b4",
    customer: "Ananya Singh",
    project: "Sky Heights Phase 2",
    unit: "2BHK — C-508",
    amount: "₹92 L",
    date: "Sep 15, 2026",
    status: "Docs Pending",
  },
];

const STAGE_BADGE: Record<string, "primary" | "info" | "secondary" | "warning" | "success" | "danger" | "neutral"> = {
  New: "info",
  Contacted: "primary",
  "Site Visit": "secondary",
  Interested: "warning",
  Negotiation: "warning",
  Booked: "success",
  Lost: "danger",
};

const SOURCE_ICON_COMPONENT: Record<string, React.ReactNode> = {
  Website: <Globe size={13} strokeWidth={1.8} />,
  Referral: <Users size={13} strokeWidth={1.8} />,
  "99acres": <Home size={13} strokeWidth={1.8} />,
  MagicBricks: <Building2 size={13} strokeWidth={1.8} />,
  "Walk-in": <UserCheck size={13} strokeWidth={1.8} />,
  "Housing.com": <Search size={13} strokeWidth={1.8} />,
};

/* ─────────────────────────────────────────────────────────────
   SUB-COMPONENTS
   ───────────────────────────────────────────────────────────── */

/* Icons — now all Lucide */
const Icons = {
  Leads:    () => <Users          size={20} strokeWidth={1.6} />,
  NewLeads: () => <UserPlus       size={20} strokeWidth={1.6} />,
  Visit:    () => <Home           size={20} strokeWidth={1.6} />,
  Bookings: () => <CalendarCheck2 size={20} strokeWidth={1.6} />,
  FollowUp: () => <Clock          size={20} strokeWidth={1.6} />,
  Phone:    () => <Phone          size={14} strokeWidth={1.6} />,
  Message:  () => <MessageSquare  size={14} strokeWidth={1.6} />,
  Plus:     () => <Plus           size={16} strokeWidth={1.8} />,
  Property: () => <Building2      size={16} strokeWidth={1.6} />,
  ViewAll:  () => <LayoutGrid     size={16} strokeWidth={1.6} />,
  Booking:  () => <BookOpen       size={16} strokeWidth={1.6} />,
  Chevron:  () => <ChevronRight   size={14} strokeWidth={1.8} />,
};

/* Pipeline Stage Bar */
function PipelineBar() {
  const max = PIPELINE_STAGES[0].count;
  return (
    <div className={styles.pipeline}>
      {PIPELINE_STAGES.map((stage) => {
        const barPct = Math.round((stage.count / max) * 100);
        return (
          <div key={stage.label} className={styles.pipelineStage}>
            <div className={styles.pipelineTop}>
              <span className={styles.pipelineLabel}>{stage.label}</span>
              <span className={styles.pipelineCount} style={{ color: stage.color }}>
                {stage.count}
              </span>
            </div>
            <div className={styles.pipelineTrack}>
              <div
                className={styles.pipelineBar}
                style={{
                  width: `${barPct}%`,
                  backgroundColor: stage.color,
                }}
              />
            </div>
            <span className={styles.pipelinePct}>
              {stage.label !== "New" ? `${Math.round((stage.count / max) * 100)}%` : "Base"}
            </span>
          </div>
        );
      })}
    </div>
  );
}

/* Follow-up row */
function FollowUpRow({ f }: { f: typeof FOLLOW_UPS[0] }) {
  return (
    <div className={`${styles.followUpRow} ${f.urgent ? styles.urgent : ""}`}>
      {f.urgent && <span className={styles.urgentDot} aria-label="Urgent" />}
      
      <div className={styles.followUpHeader}>
        <div className={styles.followUpAvatarWrap}>
          <Avatar name={f.customer} size="sm" />
        </div>
        <div className={styles.followUpInfo}>
          <span className={styles.followUpName}>{f.customer}</span>
          <span className={styles.followUpMeta}>{f.project}</span>
        </div>
        <div className={styles.followUpActions}>
          <button className={styles.quickAction} aria-label={`Call ${f.customer}`} title="Call">
            <Icons.Phone />
          </button>
          <button className={styles.quickAction} aria-label={`Message ${f.customer}`} title="Message">
            <Icons.Message />
          </button>
        </div>
      </div>

      <div className={styles.followUpDetails}>
        <Badge variant={STAGE_BADGE[f.stage] ?? "neutral"} size="sm" dot>
          {f.stage}
        </Badge>
        <span className={styles.followUpDate}>{f.date}</span>
        <div className={styles.followUpAgent}>
          <Avatar name={f.agent.name} size="xs" />
          <span className={styles.followUpAgentName}>{f.agent.name.split(" ")[0]}</span>
        </div>
      </div>
    </div>
  );
}

/* Recent Lead Row */
function LeadRow({ lead }: { lead: typeof RECENT_LEADS[0] }) {
  return (
    <tr className={styles.tableRow}>
      <td className={styles.td}>
        <div className={styles.customerCell}>
          <Avatar name={lead.customer} size="sm" />
          <div>
            <div className={styles.customerName}>{lead.customer}</div>
            <div className={styles.customerEmail}>{lead.email}</div>
          </div>
        </div>
      </td>
      <td className={styles.td}>
        <span className={styles.sourceTag}>
          {SOURCE_ICON_COMPONENT[lead.source]}
          <span>{lead.source}</span>
        </span>
      </td>
      <td className={styles.td}>
        <span className={styles.projectName}>{lead.project}</span>
      </td>
      <td className={styles.td}>
        <Badge variant={STAGE_BADGE[lead.stage] ?? "neutral"} size="sm" dot>
          {lead.stage}
        </Badge>
      </td>
      <td className={styles.td}>
        <div className={styles.agentCell}>
          <Avatar name={lead.agent} size="xs" />
          <span className={styles.agentName}>{lead.agent.split(" ")[0]}</span>
        </div>
      </td>
      <td className={styles.td}>
        <span className={styles.dateText}>{lead.followUp}</span>
      </td>
      <td className={styles.td}>
        <span className={styles.dateText}>{lead.created}</span>
      </td>
      <td className={styles.tdRight}>
        <Button variant="ghost" size="sm" iconRight={<Eye size={13} />}>
          View
        </Button>
      </td>
    </tr>
  );
}

/* Mobile Lead Card */
function LeadCard({ lead }: { lead: typeof RECENT_LEADS[0] }) {
  return (
    <div className={styles.mobileCard}>
      <div className={styles.mobileCardTop}>
        <div className={styles.customerCell}>
          <Avatar name={lead.customer} size="sm" />
          <div>
            <div className={styles.customerName}>{lead.customer}</div>
            <div className={styles.customerEmail}>{lead.email}</div>
          </div>
        </div>
        <Badge variant={STAGE_BADGE[lead.stage] ?? "neutral"} size="sm">
          {lead.stage}
        </Badge>
      </div>
      <div className={styles.mobileCardMeta}>
        <span className={styles.sourceTag}>
          {SOURCE_ICON_COMPONENT[lead.source]}
          <span>{lead.source}</span>
        </span>
        <span>·</span>
        <span>{lead.project}</span>
      </div>
      <div className={styles.mobileCardFooter}>
        <div className={styles.agentCell}>
          <Avatar name={lead.agent} size="xs" />
          <span className={styles.agentName}>{lead.agent}</span>
        </div>
        <span className={styles.dateText}>Follow-up: {lead.followUp}</span>
      </div>
    </div>
  );
}

/* Booking Row */
const BOOKING_BADGE: Record<string, "success" | "warning" | "info"> = {
  "Confirmed": "success",
  "Pending": "warning",
  "Docs Pending": "info",
};

function BookingRow({ b }: { b: typeof RECENT_BOOKINGS[0] }) {
  return (
    <tr className={styles.tableRow}>
      <td className={styles.td}>
        <div className={styles.customerCell}>
          <Avatar name={b.customer} size="sm" />
          <span className={styles.customerName}>{b.customer}</span>
        </div>
      </td>
      <td className={styles.td}><span className={styles.projectName}>{b.project}</span></td>
      <td className={styles.td}><span className={styles.unitText}>{b.unit}</span></td>
      <td className={styles.td}>
        <span className={styles.amountText}>{b.amount}</span>
      </td>
      <td className={styles.td}>
        <span className={styles.dateText}>{b.date}</span>
      </td>
      <td className={styles.td}>
        <Badge variant={BOOKING_BADGE[b.status] ?? "neutral"} size="sm" dot>
          {b.status}
        </Badge>
      </td>
      <td className={styles.tdRight}>
        <Button variant="ghost" size="sm" iconRight={<Eye size={13} />}>
          View
        </Button>
      </td>
    </tr>
  );
}

/* Section Header */
function SectionHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className={styles.sectionHeader}>
      <div className={styles.sectionHeaderLeft}>
        <h2 className={styles.sectionTitle}>{title}</h2>
        {subtitle && <p className={styles.sectionSub}>{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   MAIN DASHBOARD PAGE
   ───────────────────────────────────────────────────────────── */
export default function DashboardPage() {
  const [period, setPeriod] = useState("This Month");

  return (
    <AppShell>
      {/* ── Page Header ── */}
      <div className={styles.pageHeader}>
        <div className={styles.pageHeaderLeft}>
          <h1 className={styles.pageTitle}>Dashboard</h1>
          <p className={styles.pageSubtitle}>
            Good afternoon — here&apos;s your sales pulse for September 2026.
          </p>
        </div>
        <div className={styles.pageHeaderRight}>
          <select
            className={styles.periodSelect}
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            aria-label="Time period filter"
          >
            <option>This Week</option>
            <option>This Month</option>
            <option>This Quarter</option>
            <option>This Year</option>
          </select>
          <Button variant="primary" size="md" iconLeft={<Icons.Plus />} id="add-lead-btn">
            Add Lead
          </Button>
        </div>
      </div>

      {/* ── KPI Cards ── */}
      <div className={styles.kpiGrid}>
        <StatCard
          title="Total Leads"
          value="248"
          delta={{ value: 12.5, label: "vs last month" }}
          icon={<Icons.Leads />}
          iconColor="primary"
          sparklineData={[180, 195, 210, 205, 230, 248]}
        />
        <StatCard
          title="New Leads"
          value="84"
          delta={{ value: 18.2, label: "vs last month" }}
          icon={<Icons.NewLeads />}
          iconColor="info"
          sparklineData={[50, 62, 58, 70, 78, 84]}
        />
        <StatCard
          title="Site Visits"
          value="42"
          delta={{ value: 8.7, label: "vs last month" }}
          icon={<Icons.Visit />}
          iconColor="secondary"
          sparklineData={[28, 32, 30, 36, 39, 42]}
        />
        <StatCard
          title="Bookings"
          value="11"
          delta={{ value: 22.2, label: "vs last month" }}
          icon={<Icons.Bookings />}
          iconColor="success"
          sparklineData={[5, 7, 6, 8, 9, 11]}
        />
        <StatCard
          title="Follow-ups Due"
          value="23"
          delta={{ value: -4.2, positive: false, label: "improvement" }}
          icon={<Icons.FollowUp />}
          iconColor="warning"
          sparklineData={[35, 30, 28, 26, 25, 23]}
        />
      </div>

      {/* ── Main Grid ── */}
      <div className={styles.mainGrid}>

        {/* ── LEFT COLUMN ── */}
        <div className={styles.leftCol}>

          {/* Pipeline */}
          <div className={styles.card}>
            <SectionHeader
              title="Lead Pipeline"
              subtitle="Stage-wise distribution of all active leads"
              action={
                <Button variant="ghost" size="sm">View All</Button>
              }
            />
            <PipelineBar />
            <div className={styles.pipelineSummary}>
              <div className={styles.pipelineStat}>
                <span className={styles.pipelineStatVal}>73%</span>
                <span className={styles.pipelineStatLabel}>Contact rate</span>
              </div>
              <div className={styles.pipelineStat}>
                <span className={styles.pipelineStatVal}>26%</span>
                <span className={styles.pipelineStatLabel}>Visit rate</span>
              </div>
              <div className={styles.pipelineStat}>
                <span className={styles.pipelineStatVal}>4.4%</span>
                <span className={styles.pipelineStatLabel}>Conversion</span>
              </div>
              <div className={styles.pipelineStat}>
                <span className={styles.pipelineStatVal} style={{ color: "var(--color-danger)" }}>16.7%</span>
                <span className={styles.pipelineStatLabel}>Lost rate</span>
              </div>
            </div>
          </div>

          {/* Recent Leads */}
          <div className={styles.card}>
            <SectionHeader
              title="Recent Leads"
              subtitle="Latest leads across all projects"
              action={<Button variant="ghost" size="sm">View All</Button>}
            />
            {/* Desktop table */}
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th className={styles.th}>Customer</th>
                    <th className={styles.th}>Source</th>
                    <th className={styles.th}>Project</th>
                    <th className={styles.th}>Stage</th>
                    <th className={styles.th}>Assigned</th>
                    <th className={styles.th}>Follow-up</th>
                    <th className={styles.th}>Created</th>
                    <th className={styles.th}></th>
                  </tr>
                </thead>
                <tbody>
                  {RECENT_LEADS.map((lead) => (
                    <LeadRow key={lead.id} lead={lead} />
                  ))}
                </tbody>
              </table>
            </div>
            {/* Mobile cards */}
            <div className={styles.mobileCards}>
              {RECENT_LEADS.map((lead) => (
                <LeadCard key={lead.id} lead={lead} />
              ))}
            </div>
          </div>

          {/* Recent Bookings */}
          <div className={styles.card}>
            <SectionHeader
              title="Recent Bookings"
              subtitle="Confirmed and pending booking transactions"
              action={<Button variant="ghost" size="sm">View All</Button>}
            />
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th className={styles.th}>Customer</th>
                    <th className={styles.th}>Project</th>
                    <th className={styles.th}>Unit</th>
                    <th className={styles.th}>Amount</th>
                    <th className={styles.th}>Date</th>
                    <th className={styles.th}>Status</th>
                    <th className={styles.th}></th>
                  </tr>
                </thead>
                <tbody>
                  {RECENT_BOOKINGS.map((b) => (
                    <BookingRow key={b.id} b={b} />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* ── RIGHT COLUMN ── */}
        <div className={styles.rightCol}>

          {/* Quick Actions */}
          <div className={styles.card}>
            <SectionHeader title="Quick Actions" />
            <div className={styles.quickActions}>
              {[
                { label: "Add Lead",      icon: <Icons.Plus />,     color: "var(--color-primary)",   bg: "var(--color-primary-light)" },
                { label: "Add Property",  icon: <Icons.Property />, color: "var(--color-secondary)", bg: "var(--color-secondary-light)" },
                { label: "View Leads",    icon: <Icons.ViewAll />,  color: "var(--color-success)",   bg: "var(--color-success-light)" },
                { label: "View Bookings", icon: <Icons.Booking />,  color: "var(--color-warning)",   bg: "var(--color-warning-light)" },
              ].map((qa) => (
                <button
                  key={qa.label}
                  className={styles.quickActionCard}
                  style={{ "--qa-color": qa.color, "--qa-bg": qa.bg } as React.CSSProperties}
                >
                  <span className={styles.qaIcon}>{qa.icon}</span>
                  <span className={styles.qaLabel}>{qa.label}</span>
                  <span className={styles.qaChevron}><Icons.Chevron /></span>
                </button>
              ))}
            </div>
          </div>

          {/* Follow-ups Due */}
          <div className={styles.card}>
            <SectionHeader
              title="Follow-ups Due"
              subtitle="Sorted by priority"
              action={
                <span className={styles.followUpCount}>
                  <span className={styles.urgentBadge}>2 urgent</span>
                </span>
              }
            />
            <div className={styles.followUpList}>
              {FOLLOW_UPS.map((f) => (
                <FollowUpRow key={f.id} f={f} />
              ))}
            </div>
            <div className={styles.cardFooter}>
              <Button variant="secondary" size="sm" fullWidth>
                View All Follow-ups
              </Button>
            </div>
          </div>

        </div>
      </div>
    </AppShell>
  );
}
