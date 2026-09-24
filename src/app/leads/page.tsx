"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { SearchInput } from "@/components/ui/SearchInput";
import { Dropdown, DropdownItem } from "@/components/ui/Dropdown";
import { Drawer } from "@/components/ui/Drawer";
import { Modal } from "@/components/ui/Modal";
import { EmptyState } from "@/components/ui/EmptyState";
import { useToast } from "@/components/ui/Toast";
import { PageHeader } from "@/components/ui/PageHeader";
import { FilterToolbar } from "@/components/ui/FilterToolbar";
import { Select } from "@/components/ui/Select";
import styles from "./leads.module.css";
import {
  Plus, Search, Filter, RefreshCw, MoreVertical,
  Eye, Edit3, Trash2, Phone, Mail, Globe,
  Users, Home, Building2, UserCheck, Calendar,
  Clock, DollarSign, CheckCircle2, MessageSquare,
  ArrowUpRight, AlertCircle, X, ExternalLink
} from "lucide-react";

/* ─────────────────────────────────────────────────────────────
   TYPES & TYPESETS
   ───────────────────────────────────────────────────────────── */

export type StageType = "New" | "Contacted" | "Site Visit" | "Interested" | "Negotiation" | "Booked" | "Lost";
export type SourceType = "Website" | "99acres" | "MagicBricks" | "Referral" | "Walk-in" | "Housing.com";

export interface Lead {
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

export interface LeadFormErrors {
  customerName?: string;
  phone?: string;
  email?: string;
}

function validateLeadInput(data: Partial<Lead>): LeadFormErrors {
  const errs: LeadFormErrors = {};

  // Customer Name validation
  if (!data.customerName || !data.customerName.trim()) {
    errs.customerName = "Customer name is required.";
  } else if (data.customerName.trim().length < 2) {
    errs.customerName = "Customer name must be at least 2 characters.";
  }

  // Phone Number validation
  if (!data.phone || !data.phone.trim()) {
    errs.phone = "Mobile phone number is required.";
  } else {
    const rawPhone = data.phone.trim().replace(/[\s\-\+\(\)]/g, "");
    if (!/^\d{10,15}$/.test(rawPhone)) {
      errs.phone = "Please enter a valid 10-digit mobile number (e.g. 9812345678).";
    }
  }

  // Email / Gmail validation (Optional, but if entered must be valid email format)
  if (data.email && data.email.trim()) {
    const emailStr = data.email.trim();
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(emailStr)) {
      errs.email = "Please enter a valid email address (e.g. buyer@gmail.com).";
    }
  }

  return errs;
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

const SOURCE_ICONS: Record<SourceType, React.ReactNode> = {
  Website: <Globe size={13} strokeWidth={1.8} />,
  "99acres": <Home size={13} strokeWidth={1.8} />,
  MagicBricks: <Building2 size={13} strokeWidth={1.8} />,
  Referral: <Users size={13} strokeWidth={1.8} />,
  "Walk-in": <UserCheck size={13} strokeWidth={1.8} />,
  "Housing.com": <Search size={13} strokeWidth={1.8} />,
};

/* ─────────────────────────────────────────────────────────────
   INITIAL CRM MOCK DATA
   ───────────────────────────────────────────────────────────── */

const INITIAL_LEADS: Lead[] = [
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

const SOURCE_TO_API: Record<SourceType, string> = {
  Website: "WEBSITE",
  "99acres": "ACRES_99",
  MagicBricks: "MAGICBRICKS",
  Referral: "REFERRAL",
  "Walk-in": "WALK_IN",
  "Housing.com": "HOUSING_COM",
};

const API_TO_SOURCE: Record<string, SourceType> = {
  WEBSITE: "Website",
  ACRES_99: "99acres",
  MAGICBRICKS: "MagicBricks",
  REFERRAL: "Referral",
  WALK_IN: "Walk-in",
  HOUSING_COM: "Housing.com",
};

const STAGE_TO_API: Record<StageType, string> = {
  New: "NEW",
  Contacted: "CONTACTED",
  "Site Visit": "SITE_VISIT",
  Interested: "INTERESTED",
  Negotiation: "NEGOTIATION",
  Booked: "BOOKED",
  Lost: "LOST",
};

const API_TO_STAGE: Record<string, StageType> = {
  NEW: "New",
  CONTACTED: "Contacted",
  SITE_VISIT: "Site Visit",
  INTERESTED: "Interested",
  NEGOTIATION: "Negotiation",
  BOOKED: "Booked",
  LOST: "Lost",
};

function formatDbLeadToUi(dbLead: any): Lead {
  return {
    id: dbLead.id,
    customerName: dbLead.name,
    email: dbLead.email || "N/A",
    phone: dbLead.phone,
    source: API_TO_SOURCE[dbLead.source] || "Website",
    stage: API_TO_STAGE[dbLead.status] || "New",
    agent: dbLead.agent?.name || "Ravi Kumar",
    project: dbLead.project || "Greenview Residences",
    budget: dbLead.budget || "₹1.0 Cr",
    followUp: dbLead.followUp ? new Date(dbLead.followUp).toLocaleDateString("en-IN", { month: "short", day: "numeric" }) : "Tomorrow, 10:00 AM",
    created: dbLead.createdAt ? new Date(dbLead.createdAt).toISOString().split("T")[0] : new Date().toISOString().split("T")[0],
    urgent: Boolean(dbLead.urgent),
    notes: dbLead.notes || "",
  };
}

const AGENTS_LIST = ["All Agents", "Ravi Kumar", "Sneha Patel", "Amit Singh", "Ananya Sharma"];
const STAGES_LIST: ("All Stages" | StageType)[] = ["All Stages", "New", "Contacted", "Site Visit", "Interested", "Negotiation", "Booked", "Lost"];
const SOURCES_LIST: ("All Sources" | SourceType)[] = ["All Sources", "Website", "99acres", "MagicBricks", "Referral", "Walk-in", "Housing.com"];
const PROJECTS_LIST = ["Greenview Residences", "Sky Heights Phase 2", "Lakeview Villas", "Emerald Enclave"];

/* ─────────────────────────────────────────────────────────────
   LEADS PAGE COMPONENT
   ───────────────────────────────────────────────────────────── */

export default function LeadsPage() {
  const toast = useToast();
  const router = useRouter();

  // State
  const [leads, setLeads] = useState<Lead[]>(INITIAL_LEADS);
  const [search, setSearch] = useState("");
  const [selectedStage, setSelectedStage] = useState<string>("All Stages");
  const [selectedAgent, setSelectedAgent] = useState<string>("All Agents");
  const [selectedSource, setSelectedSource] = useState<string>("All Sources");
  const [selectedFollowUp, setSelectedFollowUp] = useState<string>("All");
  const [loading, setLoading] = useState<boolean>(false);

  // Fetch leads from backend API
  const fetchLeadsFromApi = React.useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/leads?limit=100");
      const data = await res.json();
      if (res.ok && data.success && Array.isArray(data.data)) {
        const formatted = data.data.map(formatDbLeadToUi);
        setLeads(formatted);
      }
    } catch (err) {
      console.error("Failed to fetch leads from API:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchLeadsFromApi();
  }, [fetchLeadsFromApi]);

  // Modals & Drawers state
  const [viewLead, setViewLead] = useState<Lead | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editLead, setEditLead] = useState<Lead | null>(null);
  const [deleteConfirmLead, setDeleteConfirmLead] = useState<Lead | null>(null);

  // Form states & Validation error states
  const [formErrors, setFormErrors] = useState<LeadFormErrors>({});
  const [editFormErrors, setEditFormErrors] = useState<LeadFormErrors>({});

  const [formData, setFormData] = useState<Partial<Lead>>({
    customerName: "",
    email: "",
    phone: "",
    source: "Website",
    stage: "New",
    agent: "Ravi Kumar",
    project: "Greenview Residences",
    budget: "₹1.0 Cr",
    followUp: "Tomorrow, 10:00 AM",
    notes: "",
  });

  // Filtered Leads logic
  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      // Search
      const query = search.toLowerCase().trim();
      const matchesSearch =
        !query ||
        lead.customerName.toLowerCase().includes(query) ||
        lead.email.toLowerCase().includes(query) ||
        lead.phone.includes(query) ||
        lead.project.toLowerCase().includes(query);

      // Stage Filter
      const matchesStage = selectedStage === "All Stages" || lead.stage === selectedStage;

      // Agent Filter
      const matchesAgent = selectedAgent === "All Agents" || lead.agent === selectedAgent;

      // Source Filter
      const matchesSource = selectedSource === "All Sources" || lead.source === selectedSource;

      // FollowUp Filter
      const matchesFollowUp =
        selectedFollowUp === "All" ||
        (selectedFollowUp === "Urgent" && lead.urgent) ||
        (selectedFollowUp === "Today" && lead.followUp.toLowerCase().includes("today"));

      return matchesSearch && matchesStage && matchesAgent && matchesSource && matchesFollowUp;
    });
  }, [leads, search, selectedStage, selectedAgent, selectedSource, selectedFollowUp]);

  const hasActiveFilters =
    search !== "" ||
    selectedStage !== "All Stages" ||
    selectedAgent !== "All Agents" ||
    selectedSource !== "All Sources" ||
    selectedFollowUp !== "All";

  const clearFilters = () => {
    setSearch("");
    setSelectedStage("All Stages");
    setSelectedAgent("All Agents");
    setSelectedSource("All Sources");
    setSelectedFollowUp("All");
  };

  const handleRefresh = () => {
    fetchLeadsFromApi().then(() => {
      toast.info("Refreshed", "Lead records synchronized with database.");
    });
  };

  // Handlers - API Integrated
  const handleCreateLead = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validateLeadInput(formData);
    if (Object.keys(errs).length > 0) {
      setFormErrors(errs);
      toast.error("Validation Error", "Please correct the highlighted form errors.");
      return;
    }

    setFormErrors({});
    try {
      const payload = {
        name: formData.customerName!.trim(),
        email: formData.email?.trim() || undefined,
        phone: formData.phone!.trim(),
        source: SOURCE_TO_API[(formData.source as SourceType) || "Website"],
        status: STAGE_TO_API[(formData.stage as StageType) || "New"],
        project: formData.project || "Greenview Residences",
        budget: formData.budget || "₹1.0 Cr",
        notes: formData.notes || undefined,
      };

      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        toast.error("API Error", data.error || "Failed to create lead in database.");
        return;
      }

      const createdUiLead = formatDbLeadToUi(data.data);
      setLeads((prev) => [createdUiLead, ...prev]);
      setIsAddModalOpen(false);
      toast.success("Lead Created", `${createdUiLead.customerName} saved to backend database.`);
    } catch (err) {
      toast.error("Network Error", "Unable to connect to server.");
    }
  };

  const handleUpdateLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editLead) return;

    const errs = validateLeadInput(editLead);
    if (Object.keys(errs).length > 0) {
      setEditFormErrors(errs);
      toast.error("Validation Error", "Please correct the highlighted form errors.");
      return;
    }

    setEditFormErrors({});
    try {
      const payload = {
        name: editLead.customerName.trim(),
        email: editLead.email !== "N/A" ? editLead.email.trim() : undefined,
        phone: editLead.phone.trim(),
        source: SOURCE_TO_API[editLead.source] || "WEBSITE",
        status: STAGE_TO_API[editLead.stage] || "NEW",
        project: editLead.project,
        budget: editLead.budget,
        notes: editLead.notes,
      };

      const res = await fetch(`/api/leads/${editLead.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        toast.error("API Error", data.error || "Failed to update lead.");
        return;
      }

      const updatedUiLead = formatDbLeadToUi(data.data);
      setLeads((prev) => prev.map((l) => (l.id === updatedUiLead.id ? updatedUiLead : l)));
      if (viewLead && viewLead.id === updatedUiLead.id) {
        setViewLead(updatedUiLead);
      }
      setEditLead(null);
      toast.success("Lead Saved", `Changes for ${updatedUiLead.customerName} saved to database.`);
    } catch (err) {
      toast.error("Network Error", "Unable to save changes to database.");
    }
  };

  const handleDeleteLead = async (id: string) => {
    const leadToDelete = leads.find((l) => l.id === id);
    try {
      const res = await fetch(`/api/leads/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok || !data.success) {
        toast.error("API Error", data.error || "Failed to delete lead from database.");
        return;
      }

      setLeads((prev) => prev.filter((l) => l.id !== id));
      if (viewLead?.id === id) setViewLead(null);
      setDeleteConfirmLead(null);
      toast.info("Lead Deleted", `${leadToDelete?.customerName || "Lead"} deleted from database.`);
    } catch (err) {
      toast.error("Network Error", "Unable to delete lead.");
    }
  };

  const handleStageChange = async (leadId: string, newStage: StageType) => {
    try {
      const res = await fetch(`/api/leads/${leadId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: STAGE_TO_API[newStage] }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        const updated = formatDbLeadToUi(data.data);
        setLeads((prev) => prev.map((l) => (l.id === leadId ? updated : l)));
        if (viewLead?.id === leadId) setViewLead(updated);
        toast.success("Stage Updated", `Lead status changed to ${newStage}.`);
      }
    } catch (err) {
      toast.error("Error", "Failed to update lead stage.");
    }
  };

  return (
    <AppShell>
      <div className={styles.container}>
        {/* ── REUSABLE PAGE HEADER ── */}
        <PageHeader
          title="Leads Management"
          subtitle="Track, manage, and engage prospective buyers across all property developments."
          actions={
            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
              <Button
                variant="secondary"
                size="md"
                iconLeft={<RefreshCw size={15} className={loading ? "animate-spin" : ""} />}
                onClick={handleRefresh}
              >
                Sync
              </Button>
              <Button
                variant="primary"
                size="md"
                iconLeft={<Plus size={16} strokeWidth={2} />}
                onClick={() => {
                  setFormData({
                    customerName: "",
                    email: "",
                    phone: "",
                    source: "Website",
                    stage: "New",
                    agent: "Ravi Kumar",
                    project: "Greenview Residences",
                    budget: "₹1.0 Cr",
                    followUp: "Tomorrow, 10:00 AM",
                    notes: "",
                  });
                  setIsAddModalOpen(true);
                }}
              >
                Add Lead
              </Button>
            </div>
          }
        />

        {/* ── REUSABLE RESPONSIVE FILTER TOOLBAR ── */}
        <FilterToolbar
          searchValue={search}
          onSearchChange={setSearch}
          searchPlaceholder="Search leads by name, email, phone, project..."
          hasActiveFilters={hasActiveFilters}
          onClearFilters={clearFilters}
        >
          <Select
            value={selectedStage}
            onChange={(e) => setSelectedStage(e.target.value)}
            options={STAGES_LIST.map((stage) => ({
              label: stage,
              value: stage,
            }))}
          />

          <Select
            value={selectedAgent}
            onChange={(e) => setSelectedAgent(e.target.value)}
            options={AGENTS_LIST.map((agent) => ({
              label: agent,
              value: agent,
            }))}
          />

          <Select
            value={selectedSource}
            onChange={(e) => setSelectedSource(e.target.value)}
            options={SOURCES_LIST.map((source) => ({
              label: source,
              value: source,
            }))}
          />

          <Select
            value={selectedFollowUp}
            onChange={(e) => setSelectedFollowUp(e.target.value)}
            options={[
              { label: "All Follow-ups", value: "All" },
              { label: "Urgent Only", value: "Urgent" },
              { label: "Due Today", value: "Today" },
            ]}
          />
        </FilterToolbar>

      {/* ── DESKTOP & TABLET DATA TABLE ── */}
      <div className={styles.tableCard}>
        {filteredLeads.length === 0 ? (
          <EmptyState
            title="No leads found"
            description={
              hasActiveFilters
                ? "No leads matched your search or filter criteria. Try adjusting your filters."
                : "You haven't created any sales leads yet. Add your first lead to get started."
            }
            action={
              hasActiveFilters ? (
                <Button variant="secondary" size="sm" onClick={clearFilters}>
                  Clear Filters
                </Button>
              ) : (
                <Button
                  variant="primary"
                  size="sm"
                  iconLeft={<Plus size={15} />}
                  onClick={() => setIsAddModalOpen(true)}
                >
                  Add First Lead
                </Button>
              )
            }
          />
        ) : (
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th className={styles.th}>Customer</th>
                  <th className={`${styles.th} ${styles.colContact}`}>Contact</th>
                  <th className={styles.th}>Source</th>
                  <th className={styles.th}>Stage</th>
                  <th className={styles.th}>Assigned To</th>
                  <th className={styles.th}>Budget</th>
                  <th className={styles.th}>Follow-up</th>
                  <th className={`${styles.th} ${styles.colCreated}`}>Created</th>
                  <th className={`${styles.th} ${styles.thRight}`}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredLeads.map((lead) => {
                  const items: DropdownItem[] = [
                    {
                      key: "view",
                      label: "View Details",
                      icon: <Eye size={14} />,
                      onClick: () => router.push(`/leads/${lead.id}`),
                    },
                    {
                      key: "edit",
                      label: "Edit Lead",
                      icon: <Edit3 size={14} />,
                      onClick: () => setEditLead(lead),
                    },
                    {
                      key: "call",
                      label: "Call Customer",
                      icon: <Phone size={14} />,
                      onClick: () => {
                        window.open(`tel:${lead.phone}`, "_self");
                        toast.info("Dialing Customer", `Calling ${lead.customerName}...`);
                      },
                    },
                    { key: "div1", label: "", divider: true },
                    {
                      key: "delete",
                      label: "Delete Lead",
                      icon: <Trash2 size={14} />,
                      danger: true,
                      onClick: () => setDeleteConfirmLead(lead),
                    },
                  ];

                  return (
                    <tr
                      key={lead.id}
                      className={styles.tableRow}
                      onClick={(e) => {
                        // Prevent click trigger if user clicks action dropdown
                        const target = e.target as HTMLElement;
                        if (!target.closest("button") && !target.closest("[role='menu']")) {
                          router.push(`/leads/${lead.id}`);
                        }
                      }}
                    >
                      {/* Customer */}
                      <td className={styles.td}>
                        <div className={styles.customerCell}>
                          <Avatar name={lead.customerName} size="sm" />
                          <div>
                            <div className={styles.customerName}>{lead.customerName}</div>
                            <div className={styles.customerEmail}>{lead.email}</div>
                          </div>
                        </div>
                      </td>

                      {/* Contact */}
                      <td className={`${styles.td} ${styles.colContact}`}>
                        <div className={styles.contactCell}>
                          <span className={styles.phoneText}>{lead.phone}</span>
                        </div>
                      </td>

                      {/* Source */}
                      <td className={styles.td}>
                        <span className={styles.sourceTag}>
                          {SOURCE_ICONS[lead.source]}
                          <span>{lead.source}</span>
                        </span>
                      </td>

                      {/* Stage Badge */}
                      <td className={styles.td}>
                        <Badge variant={STAGE_BADGE_VARIANT[lead.stage] ?? "neutral"} size="sm" dot>
                          {lead.stage}
                        </Badge>
                      </td>

                      {/* Assigned Agent */}
                      <td className={styles.td}>
                        <div className={styles.agentCell}>
                          <Avatar name={lead.agent} size="xs" />
                          <span className={styles.agentName}>{lead.agent}</span>
                        </div>
                      </td>

                      {/* Budget */}
                      <td className={styles.td}>
                        <span className={styles.budgetText}>{lead.budget}</span>
                      </td>

                      {/* Follow-up */}
                      <td className={styles.td}>
                        <div className={styles.followUpCell}>
                          {lead.urgent && <span className={styles.urgentDot} title="Urgent" />}
                          <span>{lead.followUp}</span>
                        </div>
                      </td>

                      {/* Created */}
                      <td className={`${styles.td} ${styles.colCreated}`}>
                        <span className={styles.dateText}>{lead.created}</span>
                      </td>

                      {/* Actions Icons */}
                      <td className={styles.tdRight}>
                        <div style={{ display: "flex", gap: "4px", justifyContent: "flex-end" }}>
                          <Button
                            variant="ghost"
                            size="sm"
                            title="View Details"
                            onClick={() => router.push(`/leads/${lead.id}`)}
                            style={{ padding: "6px" }}
                          >
                            <Eye size={15} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            title="Edit Lead"
                            onClick={() => setEditLead(lead)}
                            style={{ padding: "6px" }}
                          >
                            <Edit3 size={15} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            title="Delete Lead"
                            onClick={() => setDeleteConfirmLead(lead)}
                            style={{ padding: "6px", color: "var(--color-danger)" }}
                          >
                            <Trash2 size={15} />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── MOBILE LEAD CARDS ── */}
      <div className={styles.mobileCards}>
        {filteredLeads.map((lead) => (
          <div key={lead.id} className={styles.mobileCard} onClick={() => setViewLead(lead)}>
            <div className={styles.mobileCardHeader}>
              <div className={styles.customerCell}>
                <Avatar name={lead.customerName} size="sm" />
                <div>
                  <div className={styles.customerName}>{lead.customerName}</div>
                  <div className={styles.customerEmail}>{lead.email}</div>
                </div>
              </div>
              <Badge variant={STAGE_BADGE_VARIANT[lead.stage] ?? "neutral"} size="sm" dot>
                {lead.stage}
              </Badge>
            </div>

            <div className={styles.mobileCardBody}>
              <div className={styles.mobileCardRow}>
                <span className={styles.mobileCardLabel}>Project & Budget</span>
                <span className={styles.budgetText}>{lead.project} · {lead.budget}</span>
              </div>
              <div className={styles.mobileCardRow}>
                <span className={styles.mobileCardLabel}>Lead Source</span>
                <span className={styles.sourceTag}>
                  {SOURCE_ICONS[lead.source]}
                  <span>{lead.source}</span>
                </span>
              </div>
            </div>

            <div className={styles.mobileCardFooter}>
              <div className={styles.agentCell}>
                <Avatar name={lead.agent} size="xs" />
                <span className={styles.agentName}>{lead.agent}</span>
              </div>

              <div style={{ display: "flex", gap: "4px" }}>
                <Button
                  variant="ghost"
                  size="sm"
                  title="View Details"
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push(`/leads/${lead.id}`);
                  }}
                  style={{ padding: "6px" }}
                >
                  <Eye size={15} />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  title="Edit Lead"
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditLead(lead);
                  }}
                  style={{ padding: "6px" }}
                >
                  <Edit3 size={15} />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  title="Delete Lead"
                  onClick={(e) => {
                    e.stopPropagation();
                    setDeleteConfirmLead(lead);
                  }}
                  style={{ padding: "6px", color: "var(--color-danger)" }}
                >
                  <Trash2 size={15} />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
      </div>

      {/* ── LEAD DETAILS DRAWER ── */}
      <Drawer
        isOpen={Boolean(viewLead)}
        onClose={() => setViewLead(null)}
        title="Lead Profile Details"
        size="md"
        footer={
          viewLead && (
            <div style={{ display: "flex", gap: "8px", width: "100%", justifyContent: "flex-end" }}>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  setEditLead(viewLead);
                  setViewLead(null);
                }}
                iconLeft={<Edit3 size={14} />}
              >
                Edit Lead
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  window.open(`tel:${viewLead.phone}`, "_self");
                  toast.info("Calling Customer", `Calling ${viewLead.customerName}...`);
                }}
                iconLeft={<Phone size={14} />}
              >
                Call Customer
              </Button>
            </div>
          )
        }
      >
        {viewLead && (
          <div>
            <div className={styles.detailHeader}>
              <Avatar name={viewLead.customerName} size="lg" />
              <div className={styles.detailTitleWrap}>
                <h3 className={styles.detailName}>{viewLead.customerName}</h3>
                <span className={styles.detailMeta}>{viewLead.email} · {viewLead.phone}</span>
                <div style={{ marginTop: "6px" }}>
                  <Badge variant={STAGE_BADGE_VARIANT[viewLead.stage] ?? "neutral"} size="sm" dot>
                    {viewLead.stage}
                  </Badge>
                </div>
              </div>
            </div>

            <div className={styles.detailSection}>
              <span className={styles.detailSectionTitle}>Property & Financial Info</span>
              <div className={styles.detailGrid}>
                <div className={styles.detailItem}>
                  <span className={styles.detailItemLabel}>Interested Project</span>
                  <span className={styles.detailItemVal}>{viewLead.project}</span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailItemLabel}>Budget Range</span>
                  <span className={styles.detailItemVal}>{viewLead.budget}</span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailItemLabel}>Lead Source</span>
                  <span className={styles.detailItemVal}>{viewLead.source}</span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailItemLabel}>Assigned Agent</span>
                  <span className={styles.detailItemVal}>{viewLead.agent}</span>
                </div>
              </div>
            </div>

            <div className={styles.detailSection}>
              <span className={styles.detailSectionTitle}>Follow-up & Timeline</span>
              <div className={styles.detailGrid}>
                <div className={styles.detailItem}>
                  <span className={styles.detailItemLabel}>Next Follow-up</span>
                  <span className={styles.detailItemVal}>{viewLead.followUp}</span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailItemLabel}>Created Date</span>
                  <span className={styles.detailItemVal}>{viewLead.created}</span>
                </div>
              </div>
            </div>

            {viewLead.notes && (
              <div className={styles.detailSection}>
                <span className={styles.detailSectionTitle}>Agent Notes</span>
                <div className={styles.detailItem} style={{ background: "var(--color-surface-2)", padding: "12px" }}>
                  <span style={{ fontSize: "13px", color: "var(--color-text-secondary)" }}>
                    {viewLead.notes}
                  </span>
                </div>
              </div>
            )}
          </div>
        )}
      </Drawer>

      {/* ── ADD LEAD MODAL ── */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setFormErrors({});
        }}
        title="Add New Sales Lead"
        description="Enter buyer contact information and project preferences."
        size="md"
      >
        <form onSubmit={handleCreateLead} className={styles.formGrid} noValidate>
          <div className={styles.formGroup}>
            <label className={styles.label}>Customer Name *</label>
            <input
              type="text"
              className={`${styles.input} ${formErrors.customerName ? styles.inputError : ""}`}
              placeholder="e.g. Ramesh Kumar"
              value={formData.customerName || ""}
              onChange={(e) => {
                setFormData({ ...formData, customerName: e.target.value });
                if (formErrors.customerName) setFormErrors({ ...formErrors, customerName: undefined });
              }}
            />
            {formErrors.customerName && (
              <span className={styles.fieldError}>
                <AlertCircle size={12} /> {formErrors.customerName}
              </span>
            )}
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Phone Number *</label>
            <input
              type="tel"
              className={`${styles.input} ${formErrors.phone ? styles.inputError : ""}`}
              placeholder="e.g. 9812345678"
              value={formData.phone || ""}
              onChange={(e) => {
                setFormData({ ...formData, phone: e.target.value });
                if (formErrors.phone) setFormErrors({ ...formErrors, phone: undefined });
              }}
            />
            {formErrors.phone && (
              <span className={styles.fieldError}>
                <AlertCircle size={12} /> {formErrors.phone}
              </span>
            )}
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Email Address</label>
            <input
              type="email"
              className={`${styles.input} ${formErrors.email ? styles.inputError : ""}`}
              placeholder="e.g. buyer@gmail.com"
              value={formData.email || ""}
              onChange={(e) => {
                setFormData({ ...formData, email: e.target.value });
                if (formErrors.email) setFormErrors({ ...formErrors, email: undefined });
              }}
            />
            {formErrors.email && (
              <span className={styles.fieldError}>
                <AlertCircle size={12} /> {formErrors.email}
              </span>
            )}
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Interested Project</label>
            <select
              className={styles.select}
              value={formData.project || PROJECTS_LIST[0]}
              onChange={(e) => setFormData({ ...formData, project: e.target.value })}
            >
              {PROJECTS_LIST.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Budget Range</label>
            <input
              type="text"
              className={styles.input}
              placeholder="e.g. ₹1.2 - 1.5 Cr"
              value={formData.budget || ""}
              onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Lead Source</label>
            <select
              className={styles.select}
              value={formData.source || "Website"}
              onChange={(e) => setFormData({ ...formData, source: e.target.value as SourceType })}
            >
              {SOURCES_LIST.filter((s) => s !== "All Sources").map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Initial Stage</label>
            <select
              className={styles.select}
              value={formData.stage || "New"}
              onChange={(e) => setFormData({ ...formData, stage: e.target.value as StageType })}
            >
              {STAGES_LIST.filter((s) => s !== "All Stages").map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Assigned Agent</label>
            <select
              className={styles.select}
              value={formData.agent || "Ravi Kumar"}
              onChange={(e) => setFormData({ ...formData, agent: e.target.value })}
            >
              {AGENTS_LIST.filter((a) => a !== "All Agents").map((a) => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>
          </div>

          <div className={styles.formGroupFull}>
            <label className={styles.label}>Notes & Preferences</label>
            <textarea
              className={styles.textarea}
              placeholder="Specific floor plans, facing requirements, possession timelines..."
              value={formData.notes || ""}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            />
          </div>

          <div className={styles.formGroupFull} style={{ marginTop: "12px", display: "flex", gap: "8px", justifyContent: "flex-end" }}>
            <Button variant="secondary" size="md" onClick={() => setIsAddModalOpen(false)} type="button">
              Cancel
            </Button>
            <Button variant="primary" size="md" type="submit">
              Create Lead
            </Button>
          </div>
        </form>
      </Modal>

      {/* ── EDIT LEAD MODAL ── */}
      <Modal
        isOpen={Boolean(editLead)}
        onClose={() => {
          setEditLead(null);
          setEditFormErrors({});
        }}
        title="Edit Lead Details"
        size="md"
      >
        {editLead && (
          <form onSubmit={handleUpdateLead} className={styles.formGrid} noValidate>
            <div className={styles.formGroup}>
              <label className={styles.label}>Customer Name *</label>
              <input
                type="text"
                className={`${styles.input} ${editFormErrors.customerName ? styles.inputError : ""}`}
                value={editLead.customerName}
                onChange={(e) => {
                  setEditLead({ ...editLead, customerName: e.target.value });
                  if (editFormErrors.customerName) setEditFormErrors({ ...editFormErrors, customerName: undefined });
                }}
              />
              {editFormErrors.customerName && (
                <span className={styles.fieldError}>
                  <AlertCircle size={12} /> {editFormErrors.customerName}
                </span>
              )}
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Phone Number *</label>
              <input
                type="tel"
                className={`${styles.input} ${editFormErrors.phone ? styles.inputError : ""}`}
                value={editLead.phone}
                onChange={(e) => {
                  setEditLead({ ...editLead, phone: e.target.value });
                  if (editFormErrors.phone) setEditFormErrors({ ...editFormErrors, phone: undefined });
                }}
              />
              {editFormErrors.phone && (
                <span className={styles.fieldError}>
                  <AlertCircle size={12} /> {editFormErrors.phone}
                </span>
              )}
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Email Address</label>
              <input
                type="email"
                className={`${styles.input} ${editFormErrors.email ? styles.inputError : ""}`}
                value={editLead.email}
                onChange={(e) => {
                  setEditLead({ ...editLead, email: e.target.value });
                  if (editFormErrors.email) setEditFormErrors({ ...editFormErrors, email: undefined });
                }}
              />
              {editFormErrors.email && (
                <span className={styles.fieldError}>
                  <AlertCircle size={12} /> {editFormErrors.email}
                </span>
              )}
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Interested Project</label>
              <select
                className={styles.select}
                value={editLead.project}
                onChange={(e) => setEditLead({ ...editLead, project: e.target.value })}
              >
                {PROJECTS_LIST.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Budget</label>
              <input
                type="text"
                className={styles.input}
                value={editLead.budget}
                onChange={(e) => setEditLead({ ...editLead, budget: e.target.value })}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Stage</label>
              <select
                className={styles.select}
                value={editLead.stage}
                onChange={(e) => setEditLead({ ...editLead, stage: e.target.value as StageType })}
              >
                {STAGES_LIST.filter((s) => s !== "All Stages").map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Assigned Agent</label>
              <select
                className={styles.select}
                value={editLead.agent}
                onChange={(e) => setEditLead({ ...editLead, agent: e.target.value })}
              >
                {AGENTS_LIST.filter((a) => a !== "All Agents").map((a) => (
                  <option key={a} value={a}>{a}</option>
                ))}
              </select>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Next Follow-up</label>
              <input
                type="text"
                className={styles.input}
                value={editLead.followUp}
                onChange={(e) => setEditLead({ ...editLead, followUp: e.target.value })}
              />
            </div>

            <div className={styles.formGroupFull}>
              <label className={styles.label}>Notes</label>
              <textarea
                className={styles.textarea}
                value={editLead.notes || ""}
                onChange={(e) => setEditLead({ ...editLead, notes: e.target.value })}
              />
            </div>

            <div className={styles.formGroupFull} style={{ marginTop: "12px", display: "flex", gap: "8px", justifyContent: "flex-end" }}>
              <Button variant="secondary" size="md" onClick={() => setEditLead(null)} type="button">
                Cancel
              </Button>
              <Button variant="primary" size="md" type="submit">
                Save Changes
              </Button>
            </div>
          </form>
        )}
      </Modal>

      {/* ── DELETE CONFIRMATION MODAL ── */}
      <Modal
        isOpen={Boolean(deleteConfirmLead)}
        onClose={() => setDeleteConfirmLead(null)}
        title="Delete Lead"
        size="sm"
      >
        {deleteConfirmLead && (
          <div>
            <p style={{ fontSize: "14px", color: "var(--color-text-secondary)", marginBottom: "20px" }}>
              Are you sure you want to delete lead <strong>{deleteConfirmLead.customerName}</strong>? This action cannot be undone.
            </p>
            <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
              <Button variant="secondary" size="sm" onClick={() => setDeleteConfirmLead(null)}>
                Cancel
              </Button>
              <Button variant="danger" size="sm" onClick={() => handleDeleteLead(deleteConfirmLead.id)}>
                Delete Lead
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </AppShell>
  );
}
