"use client";

import React, { useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { useToast } from "@/components/ui/Toast";
import styles from "./detail.module.css";
import {
  ArrowLeft, Edit3, Building2, Phone, Mail, Globe,
  Users, Home, UserCheck, Search, Calendar, Clock,
  DollarSign, CheckCircle2, MessageSquare, FileText,
  ArrowUpRight, User, MapPin, Briefcase, Star, X,
  PhoneCall, MailPlus, CalendarPlus,
} from "lucide-react";

/* ─────────────────────────────────────────────────────────────
   Types (mirrored from leads page)
   ───────────────────────────────────────────────────────────── */

type StageType = "New" | "Contacted" | "Site Visit" | "Interested" | "Negotiation" | "Booked" | "Lost";
type SourceType = "Website" | "99acres" | "MagicBricks" | "Referral" | "Walk-in" | "Housing.com";

interface Lead {
  id: string;
  customerName: string;
  email: string;
  phone: string;
  source: SourceType;
  stage: StageType;
  agent: string;
  project: string;
  budget: string;
  followUp: string;
  created: string;
  urgent?: boolean;
  notes?: string;
}

interface ActivityItem {
  id: string;
  type: "note" | "stage" | "followup" | "call";
  title: string;
  description: string;
  time: string;
  agent?: string;
}

const STAGE_BADGE_VARIANT: Record<StageType, "info" | "primary" | "secondary" | "warning" | "success" | "danger" | "neutral"> = {
  New: "info",
  Contacted: "primary",
  "Site Visit": "secondary",
  Interested: "warning",
  Negotiation: "warning",
  Booked: "success",
  Lost: "danger",
};

const PIPELINE_STAGES: StageType[] = ["New", "Contacted", "Site Visit", "Interested", "Negotiation", "Booked"];

/* ─────────────────────────────────────────────────────────────
   Mock Data — In production this would come from an API
   ───────────────────────────────────────────────────────────── */

const ALL_LEADS: Lead[] = [
  {
    id: "lead-101",
    customerName: "Siddharth Kapoor",
    email: "siddharth.k@gmail.com",
    phone: "+91 98123 45678",
    source: "Website",
    stage: "New",
    agent: "Ravi Kumar",
    project: "Greenview Residences",
    budget: "₹1.2 - 1.5 Cr",
    followUp: "Today, 4:00 PM",
    created: "2026-09-23",
    urgent: true,
    notes: "Interested in 3BHK east-facing apartment on upper floors.",
  },
  {
    id: "lead-102",
    customerName: "Deepika Padukone",
    email: "deepika.p@outlook.com",
    phone: "+91 97234 56789",
    source: "99acres",
    stage: "Site Visit",
    agent: "Sneha Patel",
    project: "Sky Heights Phase 2",
    budget: "₹85 - 95 L",
    followUp: "Sep 24, 11:30 AM",
    created: "2026-09-23",
    urgent: false,
    notes: "Completed initial virtual call. Site visit scheduled for Thursday.",
  },
  {
    id: "lead-103",
    customerName: "Amitabh Verma",
    email: "verma.amitabh@yahoo.com",
    phone: "+91 96345 67890",
    source: "Referral",
    stage: "Negotiation",
    agent: "Ravi Kumar",
    project: "Lakeview Villas",
    budget: "₹2.5 - 3.0 Cr",
    followUp: "Today, 5:30 PM",
    created: "2026-09-22",
    urgent: true,
    notes: "Requesting 5% discount on villa plot V-12. Management review pending.",
  },
  {
    id: "lead-104",
    customerName: "Neha Sharma",
    email: "neha.s@gmail.com",
    phone: "+91 95456 78901",
    source: "MagicBricks",
    stage: "Contacted",
    agent: "Amit Singh",
    project: "Greenview Residences",
    budget: "₹1.0 - 1.2 Cr",
    followUp: "Sep 25, 10:00 AM",
    created: "2026-09-22",
    urgent: false,
    notes: "Sent brochures via WhatsApp. Follow up on floor plan preferences.",
  },
  {
    id: "lead-105",
    customerName: "Rajesh Gupta",
    email: "rajesh.g@company.com",
    phone: "+91 94567 89012",
    source: "Walk-in",
    stage: "Booked",
    agent: "Sneha Patel",
    project: "Sky Heights Phase 2",
    budget: "₹92 L",
    followUp: "Completed",
    created: "2026-09-21",
    urgent: false,
    notes: "Booking amount ₹5,00,000 received. Unit A-302 confirmed.",
  },
  {
    id: "lead-106",
    customerName: "Pooja Menon",
    email: "pooja.m@rediffmail.com",
    phone: "+91 93678 90123",
    source: "Housing.com",
    stage: "Interested",
    agent: "Ananya Sharma",
    project: "Lakeview Villas",
    budget: "₹2.0 - 2.4 Cr",
    followUp: "Sep 26, 2:00 PM",
    created: "2026-09-20",
    urgent: false,
    notes: "Looking for gated villa with private pool amenities.",
  },
  {
    id: "lead-107",
    customerName: "Vikram Malhotra",
    email: "vikram.m@techcorp.io",
    phone: "+91 92789 01234",
    source: "Website",
    stage: "Lost",
    agent: "Ravi Kumar",
    project: "Greenview Residences",
    budget: "₹1.5 Cr",
    followUp: "Closed",
    created: "2026-09-18",
    urgent: false,
    notes: "Purchased property from competitor due to early possession date.",
  },
  {
    id: "lead-108",
    customerName: "Kavitha Nair",
    email: "kavitha.nair@gmail.com",
    phone: "+91 91890 12345",
    source: "Referral",
    stage: "Contacted",
    agent: "Amit Singh",
    project: "Sky Heights Phase 2",
    budget: "₹80 - 90 L",
    followUp: "Sep 25, 4:30 PM",
    created: "2026-09-19",
    urgent: false,
    notes: "Referred by existing client Rajesh Khanna.",
  },
];

function getActivities(lead: Lead): ActivityItem[] {
  return [
    {
      id: "a1",
      type: "note",
      title: "Agent Note Added",
      description: lead.notes || "No notes available.",
      time: "Today, 2:15 PM",
      agent: lead.agent,
    },
    {
      id: "a2",
      type: "stage",
      title: `Stage set to "${lead.stage}"`,
      description: `${lead.agent} moved this lead to the ${lead.stage} stage.`,
      time: "Today, 11:40 AM",
      agent: lead.agent,
    },
    {
      id: "a3",
      type: "followup",
      title: "Follow-up Scheduled",
      description: `Next follow-up set for ${lead.followUp}.`,
      time: "Yesterday, 4:00 PM",
      agent: lead.agent,
    },
    {
      id: "a4",
      type: "call",
      title: "Introductory Call Completed",
      description: `${lead.agent} completed a 12-minute introductory call with ${lead.customerName}. Discussed project ${lead.project} and budget preferences.`,
      time: "Sep 21, 3:30 PM",
      agent: lead.agent,
    },
    {
      id: "a5",
      type: "stage",
      title: "Lead Created",
      description: `New lead created from ${lead.source}. Assigned to ${lead.agent}.`,
      time: lead.created,
    },
  ];
}

/* ─────────────────────────────────────────────────────────────
   Sub-Components
   ───────────────────────────────────────────────────────────── */

function StageProgression({ currentStage }: { currentStage: StageType }) {
  const isLost = currentStage === "Lost";
  const currentIdx = PIPELINE_STAGES.indexOf(currentStage);

  return (
    <div className={styles.stageTrack}>
      {PIPELINE_STAGES.map((stage, idx) => {
        const isDone = !isLost && currentIdx > idx;
        const isCurrent = !isLost && currentIdx === idx;
        const isLostStage = isLost && idx === 0; // Show "Lost" state on first

        let dotClass = styles.stageDot;
        let labelClass = styles.stageLabel;

        if (isDone) {
          dotClass += ` ${styles.stageDotDone}`;
          labelClass += ` ${styles.stageLabelDone}`;
        } else if (isCurrent) {
          dotClass += ` ${styles.stageDotCurrent}`;
          labelClass += ` ${styles.stageLabelCurrent}`;
        }

        let connectorClass = styles.stageConnector;
        if (!isLost && currentIdx > idx) {
          connectorClass += ` ${styles.stageConnectorDone}`;
        }

        return (
          <div key={stage} className={styles.stageStep}>
            <div className={dotClass}>
              {isDone ? (
                <CheckCircle2 size={16} strokeWidth={2} />
              ) : isCurrent ? (
                <Star size={14} strokeWidth={2} />
              ) : (
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: "currentColor", opacity: 0.4 }} />
              )}
            </div>
            <span className={labelClass}>
              {isLost && idx === 0 ? "Lost" : stage}
            </span>
            <div className={connectorClass} />
          </div>
        );
      })}

      {isLost && (
        <div className={styles.stageStep}>
          <div className={`${styles.stageDot} ${styles.stageDotLost}`}>
            <X size={16} strokeWidth={2.5} />
          </div>
          <span className={`${styles.stageLabel} ${styles.stageLabelLost}`}>Lost</span>
        </div>
      )}
    </div>
  );
}

const TIMELINE_ICON: Record<ActivityItem["type"], { className: string; icon: React.ReactNode }> = {
  note: { className: styles.timelineIconNote, icon: <FileText size={15} strokeWidth={1.8} /> },
  stage: { className: styles.timelineIconStage, icon: <ArrowUpRight size={15} strokeWidth={1.8} /> },
  followup: { className: styles.timelineIconFollowUp, icon: <Calendar size={15} strokeWidth={1.8} /> },
  call: { className: styles.timelineIconCall, icon: <PhoneCall size={15} strokeWidth={1.8} /> },
};

function ActivityTimeline({ activities }: { activities: ActivityItem[] }) {
  return (
    <div className={styles.timeline}>
      {activities.map((item) => {
        const iconInfo = TIMELINE_ICON[item.type];
        return (
          <div key={item.id} className={styles.timelineItem}>
            <div className={styles.timelineIconCol}>
              <div className={`${styles.timelineIcon} ${iconInfo.className}`}>
                {iconInfo.icon}
              </div>
              <div className={styles.timelineLine} />
            </div>
            <div className={styles.timelineContent}>
              <div className={styles.timelineTitle}>{item.title}</div>
              <div className={styles.timelineDesc}>{item.description}</div>
              <div className={styles.timelineTime}>
                {item.time}
                {item.agent && <> · {item.agent}</>}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Main Page
   ───────────────────────────────────────────────────────────── */

export default function LeadDetailPage() {
  const params = useParams();
  const router = useRouter();
  const toast = useToast();
  const leadId = params.id as string;

  const lead = useMemo(() => ALL_LEADS.find((l) => l.id === leadId), [leadId]);
  const activities = useMemo(() => (lead ? getActivities(lead) : []), [lead]);

  const [bookingModalOpen, setBookingModalOpen] = useState(false);

  if (!lead) {
    return (
      <AppShell>
        <div style={{ textAlign: "center", padding: "80px 20px" }}>
          <h2 style={{ fontSize: "20px", fontWeight: 700, color: "var(--color-text-primary)", marginBottom: "8px" }}>
            Lead Not Found
          </h2>
          <p style={{ fontSize: "14px", color: "var(--color-text-muted)", marginBottom: "20px" }}>
            The lead you&apos;re looking for doesn&apos;t exist or has been removed.
          </p>
          <Button variant="secondary" size="md" onClick={() => router.push("/leads")}>
            Back to Leads
          </Button>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      {/* ── BACK LINK ── */}
      <button className={styles.backLink} onClick={() => router.push("/leads")}>
        <ArrowLeft size={16} strokeWidth={1.8} />
        Back to Leads
      </button>

      {/* ── PAGE HEADER ── */}
      <div className={styles.pageHeader}>
        <div className={styles.headerLeft}>
          <Avatar name={lead.customerName} size="lg" />
          <div className={styles.headerInfo}>
            <div className={styles.headerNameRow}>
              <h1 className={styles.headerName}>{lead.customerName}</h1>
              <Badge variant={STAGE_BADGE_VARIANT[lead.stage]} size="sm" dot>
                {lead.stage}
              </Badge>
            </div>
            <span className={styles.headerMeta}>
              {lead.project} · {lead.source} · Created {lead.created}
            </span>
          </div>
        </div>

        <div className={styles.headerActions}>
          <Button
            variant="secondary"
            size="md"
            iconLeft={<Edit3 size={15} />}
            onClick={() => {
              toast.info("Edit Mode", "Redirecting to edit form...");
              router.push("/leads");
            }}
          >
            Edit Lead
          </Button>
          {lead.stage !== "Booked" && lead.stage !== "Lost" && (
            <Button
              variant="primary"
              size="md"
              iconLeft={<Building2 size={15} />}
              onClick={() => setBookingModalOpen(true)}
            >
              Book Property
            </Button>
          )}
        </div>
      </div>

      {/* ── TWO-COLUMN LAYOUT ── */}
      <div className={styles.detailGrid}>

        {/* ── LEFT COLUMN ── */}
        <div className={styles.mainCol}>

          {/* Customer Overview */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <div>
                <div className={styles.cardTitle}>Customer Overview</div>
                <div className={styles.cardSub}>Contact information and lead details</div>
              </div>
            </div>

            <div className={styles.overviewBody}>
              <div className={styles.overviewAvatarCol}>
                <Avatar name={lead.customerName} size="xl" />
              </div>

              <div className={styles.overviewDetailsGrid}>
                <div className={styles.detailItem}>
                  <span className={styles.detailItemLabel}>Full Name</span>
                  <span className={styles.detailItemVal}>{lead.customerName}</span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailItemLabel}>Email Address</span>
                  <span className={styles.detailItemVal}>{lead.email}</span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailItemLabel}>Phone Number</span>
                  <span className={styles.detailItemVal}>{lead.phone}</span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailItemLabel}>Lead Source</span>
                  <span className={styles.detailItemVal}>{lead.source}</span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailItemLabel}>Assigned Agent</span>
                  <span className={styles.detailItemVal}>{lead.agent}</span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailItemLabel}>Budget Range</span>
                  <span className={styles.detailItemVal}>{lead.budget}</span>
                </div>
                <div className={`${styles.detailItem} ${styles.detailItemFull}`}>
                  <span className={styles.detailItemLabel}>Interested Project</span>
                  <span className={styles.detailItemVal}>{lead.project}</span>
                </div>
              </div>
            </div>

            {/* Quick contact actions */}
            <div className={styles.contactActions}>
              <button
                className={styles.contactBtn}
                onClick={() => {
                  window.open(`tel:${lead.phone}`, "_self");
                  toast.info("Calling", `Dialing ${lead.customerName}...`);
                }}
              >
                <PhoneCall size={14} strokeWidth={1.8} /> Call
              </button>
              <button
                className={styles.contactBtn}
                onClick={() => {
                  window.open(`mailto:${lead.email}`);
                  toast.info("Email", `Opening mail to ${lead.email}...`);
                }}
              >
                <MailPlus size={14} strokeWidth={1.8} /> Email
              </button>
              <button
                className={styles.contactBtn}
                onClick={() => toast.info("Schedule", "Follow-up scheduling coming soon.")}
              >
                <CalendarPlus size={14} strokeWidth={1.8} /> Schedule
              </button>
            </div>
          </div>

          {/* Lead Pipeline / Stage Progression */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <div>
                <div className={styles.cardTitle}>Lead Progression</div>
                <div className={styles.cardSub}>Current stage in the sales pipeline</div>
              </div>
              <Badge variant={STAGE_BADGE_VARIANT[lead.stage]} size="sm" dot>
                {lead.stage}
              </Badge>
            </div>
            <div className={styles.pipelineBody}>
              <StageProgression currentStage={lead.stage} />
            </div>
          </div>

          {/* Follow-up Section */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <div>
                <div className={styles.cardTitle}>Follow-up Details</div>
                <div className={styles.cardSub}>Scheduled touchpoints and assignments</div>
              </div>
            </div>
            <div className={styles.followUpBody}>
              <div className={styles.followUpRow}>
                <span className={styles.followUpLabel}>Next Follow-up</span>
                <span className={styles.followUpVal}>
                  <Calendar size={14} strokeWidth={1.6} />
                  {lead.followUp}
                  {lead.urgent && <span className={styles.urgentBadge}>Urgent</span>}
                </span>
              </div>
              <div className={styles.followUpRow}>
                <span className={styles.followUpLabel}>Assigned Agent</span>
                <span className={styles.followUpVal}>
                  <Avatar name={lead.agent} size="xs" />
                  {lead.agent}
                </span>
              </div>
              <div className={styles.followUpRow}>
                <span className={styles.followUpLabel}>Follow-up Status</span>
                <span className={styles.followUpVal}>
                  {lead.followUp === "Completed" || lead.followUp === "Closed" ? (
                    <Badge variant="success" size="sm">Completed</Badge>
                  ) : lead.urgent ? (
                    <Badge variant="danger" size="sm" dot>Overdue</Badge>
                  ) : (
                    <Badge variant="info" size="sm" dot>Scheduled</Badge>
                  )}
                </span>
              </div>
            </div>
          </div>

          {/* Activity Timeline */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <div>
                <div className={styles.cardTitle}>Activity Timeline</div>
                <div className={styles.cardSub}>Notes, stage changes, and follow-up history</div>
              </div>
            </div>
            <div className={styles.timelineBody}>
              <ActivityTimeline activities={activities} />
            </div>
          </div>

        </div>

        {/* ── RIGHT COLUMN ── */}
        <div className={styles.sideCol}>

          {/* Quick Summary */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <div className={styles.cardTitle}>Quick Summary</div>
            </div>
            <div className={styles.summaryBody}>
              <div className={styles.summaryRow}>
                <span className={styles.summaryLabel}>
                  <Star size={14} strokeWidth={1.6} /> Current Stage
                </span>
                <span className={styles.summaryVal}>
                  <Badge variant={STAGE_BADGE_VARIANT[lead.stage]} size="sm" dot>{lead.stage}</Badge>
                </span>
              </div>
              <div className={styles.summaryRow}>
                <span className={styles.summaryLabel}>
                  <DollarSign size={14} strokeWidth={1.6} /> Budget
                </span>
                <span className={styles.summaryVal}>{lead.budget}</span>
              </div>
              <div className={styles.summaryRow}>
                <span className={styles.summaryLabel}>
                  <User size={14} strokeWidth={1.6} /> Assigned To
                </span>
                <span className={styles.summaryVal}>{lead.agent}</span>
              </div>
              <div className={styles.summaryRow}>
                <span className={styles.summaryLabel}>
                  <Calendar size={14} strokeWidth={1.6} /> Next Follow-up
                </span>
                <span className={styles.summaryVal}>{lead.followUp}</span>
              </div>
              <div className={styles.summaryRow}>
                <span className={styles.summaryLabel}>
                  <Building2 size={14} strokeWidth={1.6} /> Project
                </span>
                <span className={styles.summaryVal}>{lead.project}</span>
              </div>
              <div className={styles.summaryRow}>
                <span className={styles.summaryLabel}>
                  <Globe size={14} strokeWidth={1.6} /> Source
                </span>
                <span className={styles.summaryVal}>{lead.source}</span>
              </div>
              <div className={styles.summaryRow}>
                <span className={styles.summaryLabel}>
                  <Clock size={14} strokeWidth={1.6} /> Created
                </span>
                <span className={styles.summaryVal}>{lead.created}</span>
              </div>
            </div>
          </div>

          {/* Agent Notes */}
          {lead.notes && (
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <div className={styles.cardTitle}>Agent Notes</div>
              </div>
              <div className={styles.cardBody}>
                <div className={styles.detailItem} style={{ gridColumn: "span 1" }}>
                  <span style={{ fontSize: "13px", color: "var(--color-text-secondary)", lineHeight: "1.6" }}>
                    {lead.notes}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Booking CTA */}
          {lead.stage !== "Booked" && lead.stage !== "Lost" && (
            <div className={styles.bookingCard}>
              <div className={styles.bookingTitle}>Ready to Book?</div>
              <div className={styles.bookingSub}>
                Convert this lead into a confirmed booking for {lead.project}. This will move the pipeline stage to &quot;Booked&quot;.
              </div>
              <button
                className={styles.bookingBtn}
                onClick={() => setBookingModalOpen(true)}
              >
                <Building2 size={16} strokeWidth={1.8} />
                Book Property Now
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ── BOOKING CONFIRMATION MODAL ── */}
      <Modal
        isOpen={bookingModalOpen}
        onClose={() => setBookingModalOpen(false)}
        title="Confirm Property Booking"
        description={`Convert ${lead.customerName}'s lead into a confirmed booking for ${lead.project}.`}
        size="sm"
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div className={styles.detailItem}>
            <span className={styles.detailItemLabel}>Customer</span>
            <span className={styles.detailItemVal}>{lead.customerName}</span>
          </div>
          <div className={styles.detailItem}>
            <span className={styles.detailItemLabel}>Project</span>
            <span className={styles.detailItemVal}>{lead.project}</span>
          </div>
          <div className={styles.detailItem}>
            <span className={styles.detailItemLabel}>Budget</span>
            <span className={styles.detailItemVal}>{lead.budget}</span>
          </div>
          <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end", marginTop: "8px" }}>
            <Button variant="secondary" size="md" onClick={() => setBookingModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="md"
              iconLeft={<CheckCircle2 size={15} />}
              onClick={() => {
                setBookingModalOpen(false);
                toast.success("Booking Confirmed", `${lead.customerName}'s booking for ${lead.project} has been confirmed.`);
              }}
            >
              Confirm Booking
            </Button>
          </div>
        </div>
      </Modal>
    </AppShell>
  );
}
