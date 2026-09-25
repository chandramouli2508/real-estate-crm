"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { FilterToolbar } from "@/components/ui/FilterToolbar";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { Modal } from "@/components/ui/Modal";
import { EmptyState } from "@/components/ui/EmptyState";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { useToast } from "@/components/ui/Toast";
import styles from "./properties.module.css";
import {
  Building2, Plus, MapPin, RefreshCw,
  Home, Eye, Edit3, Trash2, Layers, CheckCircle2,
  Building, Maximize2, Heart, ChevronRight, BedDouble,
  Upload, Image as ImageIcon, Sparkles, X, ShieldCheck
} from "lucide-react";

/* ─────────────────────────────────────────────────────────────
   TYPES & DEFAULT IMAGES
   ───────────────────────────────────────────────────────────── */

export type PropertyType = "Apartments" | "Villas" | "Plots" | "Commercial";
export type PropertyStatus = "Ready to Move" | "Under Construction" | "New Launch" | "Sold Out";

export interface Property {
  id: string;
  name: string;
  location: string;
  type: PropertyType;
  specs: string;
  areaRange: string;
  startingPrice: string;
  priceValueLakhs: number;
  totalUnits: number;
  availableUnits: number;
  status: PropertyStatus;
  possessionDate: string;
  description: string;
  imageUrl?: string;
  imagePublicId?: string;
  developer?: string;
  reraId?: string;
  amenities?: string;
  bannerGradient?: string;
}

const DEFAULT_PROPERTY_IMAGES = [
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80",
];

const INITIAL_PROPERTIES: Property[] = [
  {
    id: "prop-1",
    name: "Greenview Residences",
    location: "Whitefield, Bangalore",
    type: "Apartments",
    specs: "2, 3 & 4 BHK",
    areaRange: "1,250 - 2,400 sq.ft",
    startingPrice: "₹1.25 Cr",
    priceValueLakhs: 125,
    totalUnits: 120,
    availableUnits: 42,
    status: "Under Construction",
    possessionDate: "Dec 2026",
    developer: "Green Earth Developers",
    reraId: "PRM/KA/RERA/1251/446/PR/210315",
    amenities: "Infinity Pool, Clubhouse, Gym, Badminton Court, 24/7 Power Backup",
    description: "Premium eco-friendly residential towers featuring rooftop infinity pool, clubhouse, and lush green garden landscapes.",
    imageUrl: DEFAULT_PROPERTY_IMAGES[0],
  },
  {
    id: "prop-2",
    name: "Sky Heights Phase 2",
    location: "Indiranagar, Bangalore",
    type: "Apartments",
    specs: "3 & 4 BHK Sky Villas",
    areaRange: "2,100 - 3,600 sq.ft",
    startingPrice: "₹2.45 Cr",
    priceValueLakhs: 245,
    totalUnits: 80,
    availableUnits: 12,
    status: "Under Construction",
    possessionDate: "Aug 2027",
    developer: "Prestige Group",
    reraId: "PRM/KA/RERA/1251/310/PR/220510",
    amenities: "Private Decks, Smart Home Automation, Sky Lounge, Heated Pool, Concierge",
    description: "Ultra-luxury sky villas with private decks, smart home automation, and panoramic city views in the heart of Indiranagar.",
    imageUrl: DEFAULT_PROPERTY_IMAGES[1],
  },
  {
    id: "prop-3",
    name: "Emerald Villas",
    location: "Sarjapur Road, Bangalore",
    type: "Villas",
    specs: "4 & 5 BHK Duplex",
    areaRange: "3,200 - 5,000 sq.ft",
    startingPrice: "₹3.80 Cr",
    priceValueLakhs: 380,
    totalUnits: 45,
    availableUnits: 18,
    status: "Ready to Move",
    possessionDate: "Immediate",
    developer: "Sobha Developers",
    reraId: "PRM/KA/RERA/1251/472/PR/191104",
    amenities: "Private Pool, Double Height Living, Organic Garden, Tennis Court, Solar Backup",
    description: "Exclusive waterfront villas with private garden lawns, double-height ceilings, and private pool options.",
    imageUrl: DEFAULT_PROPERTY_IMAGES[2],
  },
];

const STATUS_CLASS_MAP: Record<PropertyStatus, string> = {
  "Ready to Move": styles.statusReady,
  "Under Construction": styles.statusUnderConst,
  "New Launch": styles.statusNewLaunch,
  "Sold Out": styles.statusSoldOut,
};

const TYPE_ICONS: Record<PropertyType, React.ReactNode> = {
  Apartments: <Building2 size={14} strokeWidth={1.8} />,
  Villas: <Home size={14} strokeWidth={1.8} />,
  Plots: <Layers size={14} strokeWidth={1.8} />,
  Commercial: <Building size={14} strokeWidth={1.8} />,
};

function normalizeStatus(rawStatus?: string): PropertyStatus {
  if (!rawStatus) return "Under Construction";
  const s = String(rawStatus).toUpperCase().replace(/\s+/g, "_");
  if (s === "READY_TO_MOVE" || s === "READY TO MOVE") return "Ready to Move";
  if (s === "UNDER_CONSTRUCTION" || s === "UNDER CONSTRUCTION") return "Under Construction";
  if (s === "NEW_LAUNCH" || s === "NEW LAUNCH") return "New Launch";
  if (s === "SOLD_OUT" || s === "SOLD OUT") return "Sold Out";
  return "Under Construction";
}

function normalizeType(rawType?: string): PropertyType {
  if (!rawType) return "Apartments";
  const t = String(rawType).toUpperCase();
  if (t === "APARTMENTS" || t === "APARTMENT") return "Apartments";
  if (t === "VILLAS" || t === "VILLA") return "Villas";
  if (t === "PLOTS" || t === "PLOT") return "Plots";
  if (t === "COMMERCIAL") return "Commercial";
  return "Apartments";
}

function toDbPropertyType(rawType?: string): string {
  if (!rawType) return "APARTMENTS";
  const t = String(rawType).toUpperCase();
  if (t === "APARTMENTS" || t === "APARTMENT") return "APARTMENTS";
  if (t === "VILLAS" || t === "VILLA") return "VILLAS";
  if (t === "PLOTS" || t === "PLOT") return "PLOTS";
  if (t === "COMMERCIAL") return "COMMERCIAL";
  return "APARTMENTS";
}

function toDbPropertyStatus(rawStatus?: string): string {
  if (!rawStatus) return "UNDER_CONSTRUCTION";
  const s = String(rawStatus).toUpperCase().replace(/\s+/g, "_");
  if (s === "READY_TO_MOVE" || s === "READY TO MOVE") return "READY_TO_MOVE";
  if (s === "UNDER_CONSTRUCTION" || s === "UNDER CONSTRUCTION") return "UNDER_CONSTRUCTION";
  if (s === "NEW_LAUNCH" || s === "NEW LAUNCH") return "NEW_LAUNCH";
  if (s === "SOLD_OUT" || s === "SOLD OUT") return "SOLD_OUT";
  return "UNDER_CONSTRUCTION";
}

function formatSpecsText(rawSpecs?: string): string {
  if (!rawSpecs) return "2 & 3 BHK";
  let s = String(rawSpecs).trim();
  s = s.replace(/\s*BHK\s*BHK+/gi, " BHK").replace(/BHK\s+BHK/gi, "BHK").trim();
  return s;
}

function formatAreaText(rawArea?: string | number): string {
  if (!rawArea) return "1,200 - 2,400 sq.ft";
  let a = String(rawArea).trim();
  a = a.replace(/\s*sq\.?ft\s*sq\.?ft+/gi, " sq.ft").replace(/sq\.?ft\s+sq\.?ft/gi, "sq.ft").trim();
  return a;
}

/* ─────────────────────────────────────────────────────────────
   MAIN COMPONENT
   ───────────────────────────────────────────────────────────── */

export default function PropertiesPage() {
  const toast = useToast();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Primary Data State
  const [properties, setProperties] = useState<Property[]>(INITIAL_PROPERTIES);
  const [loading, setLoading] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);

  // Filter States
  const [search, setSearch] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("All Locations");
  const [selectedType, setSelectedType] = useState("All Types");
  const [selectedAvailability, setSelectedAvailability] = useState("All Availability");
  const [selectedPriceRange, setSelectedPriceRange] = useState("All Prices");

  // Modals & Drawers State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [viewingProperty, setViewingProperty] = useState<Property | null>(null);
  const [deletingProperty, setDeletingProperty] = useState<Property | null>(null);

  // Image Upload State
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);

  // Form State for Add / Edit Property
  const [formData, setFormData] = useState<Partial<Property>>({
    name: "",
    location: "Whitefield, Bangalore",
    type: "Apartments",
    specs: "2 & 3 BHK",
    areaRange: "1,200 - 2,000 sq.ft",
    startingPrice: "₹1.10 Cr",
    priceValueLakhs: 110,
    totalUnits: 100,
    availableUnits: 45,
    status: "Under Construction",
    possessionDate: "Dec 2026",
    developer: "",
    reraId: "",
    amenities: "",
    description: "",
  });

  // Frontend File Validation Handler
  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileError(null);

    // 1. Validate File Size (Max 2 MB)
    const MAX_SIZE = 2 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      setFileError(`File size exceeds 2 MB limit (${(file.size / (1024 * 1024)).toFixed(2)} MB selected).`);
      setSelectedFile(null);
      setImagePreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    // 2. Validate Allowed Extensions / MIME
    const allowed = ["image/jpeg", "image/png", "image/jpg"];
    if (!allowed.includes(file.type.toLowerCase())) {
      setFileError("Only PNG and JPG/JPEG image formats are allowed.");
      setSelectedFile(null);
      setImagePreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    setSelectedFile(file);
    const reader = new FileReader();
    reader.onload = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  }

  function clearSelectedFile() {
    setSelectedFile(null);
    setImagePreview(null);
    setFileError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  // Helper to parse backend property payload cleanly
  const parseBackendProperty = (item: any, idx: number): Property => {
    const normStatus = normalizeStatus(item.status);
    const normType = normalizeType(item.type);
    const rawSpecs = item.bedrooms
      ? (String(item.bedrooms).includes("BHK") ? item.bedrooms : `${item.bedrooms} BHK`)
      : item.specs || "2 & 3 BHK";
    const rawArea = item.area
      ? (String(item.area).includes("sq.ft") ? item.area : `${item.area} sq.ft`)
      : item.areaRange || "1,200 - 2,400 sq.ft";

    const priceDisplay = item.priceLabel
      ? (String(item.priceLabel).startsWith("₹") ? item.priceLabel : `₹${item.priceLabel}`)
      : item.price
      ? (typeof item.price === "number" && item.price > 10000 ? `₹${(item.price / 10000000).toFixed(2)} Cr` : `₹${item.price}`)
      : "₹1.20 Cr";

    return {
      id: item.id,
      name: item.name || item.title || "Real Estate Project",
      location: item.location || "Bangalore",
      type: normType,
      specs: formatSpecsText(rawSpecs),
      areaRange: formatAreaText(rawArea),
      startingPrice: priceDisplay,
      priceValueLakhs: typeof item.price === "number" ? Math.round(item.price > 10000 ? item.price / 100000 : item.price) : 120,
      totalUnits: item.totalUnits || 100,
      availableUnits: item.availableUnits || 40,
      status: normStatus,
      possessionDate: item.possessionDate || "Dec 2026",
      developer: item.developer || "",
      reraId: item.reraId || "",
      amenities: item.amenities || "",
      description: item.description || "",
      imageUrl: item.imageUrl || item.images?.[0] || DEFAULT_PROPERTY_IMAGES[idx % DEFAULT_PROPERTY_IMAGES.length],
      imagePublicId: item.imagePublicId || undefined,
    };
  };

  // Fetch properties from Backend API on mount
  useEffect(() => {
    async function fetchProperties() {
      setLoading(true);
      try {
        const res = await fetch("/api/properties");
        if (res.ok) {
          const json = await res.json();
          if (json.success && Array.isArray(json.data) && json.data.length > 0) {
            const formatted = json.data.map((item: any, idx: number) => parseBackendProperty(item, idx));
            setProperties(formatted);
          }
        }
      } catch (err) {
        console.error("API fetch error:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchProperties();
  }, []);

  // Filter options lists derived from properties
  const locationOptions = useMemo(() => {
    const locs = Array.from(new Set(properties.map((p) => p.location)));
    return ["All Locations", ...locs];
  }, [properties]);

  const typeOptions = useMemo(() => {
    return ["All Types", "Apartments", "Villas", "Plots", "Commercial"];
  }, []);

  // Filtered Properties Computation
  const filteredProperties = useMemo(() => {
    return properties.filter((item) => {
      const query = search.toLowerCase().trim();
      if (
        query &&
        !item.name.toLowerCase().includes(query) &&
        !item.location.toLowerCase().includes(query) &&
        !item.specs.toLowerCase().includes(query) &&
        !(item.developer && item.developer.toLowerCase().includes(query))
      ) {
        return false;
      }

      if (selectedLocation !== "All Locations" && item.location !== selectedLocation) {
        return false;
      }

      if (selectedType !== "All Types" && item.type !== selectedType) {
        return false;
      }

      if (selectedAvailability !== "All Availability") {
        if (selectedAvailability === "Almost Sold Out") {
          const ratio = item.availableUnits / item.totalUnits;
          if (ratio > 0.20 || item.availableUnits === 0) return false;
        } else if (normalizeStatus(item.status) !== selectedAvailability) {
          return false;
        }
      }

      if (selectedPriceRange !== "All Prices") {
        const val = item.priceValueLakhs;
        if (selectedPriceRange === "Under ₹1 Cr" && val >= 100) return false;
        if (selectedPriceRange === "₹1 - 2 Cr" && (val < 100 || val > 200)) return false;
        if (selectedPriceRange === "₹2 - 3 Cr" && (val < 200 || val > 300)) return false;
        if (selectedPriceRange === "Above ₹3 Cr" && val <= 300) return false;
      }

      return true;
    });
  }, [properties, search, selectedLocation, selectedType, selectedAvailability, selectedPriceRange]);

  function handleClearFilters() {
    setSearch("");
    setSelectedLocation("All Locations");
    setSelectedType("All Types");
    setSelectedAvailability("All Availability");
    setSelectedPriceRange("All Prices");
  }

  const isFilterActive =
    search ||
    selectedLocation !== "All Locations" ||
    selectedType !== "All Types" ||
    selectedAvailability !== "All Availability" ||
    selectedPriceRange !== "All Prices";

  async function handleRefresh() {
    setLoading(true);
    try {
      const res = await fetch("/api/properties");
      if (res.ok) {
        const json = await res.json();
        if (json.success && Array.isArray(json.data) && json.data.length > 0) {
          const formatted = json.data.map((item: any, idx: number) => parseBackendProperty(item, idx));
          setProperties(formatted);
          toast.info("Refreshed", "Property database synchronized with backend API.");
          return;
        }
      }
      toast.info("Refreshed", "Property list up to date.");
    } catch (err) {
      toast.error("Sync Error", "Could not reach database API.");
    } finally {
      setLoading(false);
    }
  }

  // Add Property Submit with Multipart Form Upload
  async function handleAddSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!formData.name) {
      toast.error("Validation Error", "Property name is required.");
      return;
    }
    if (fileError) {
      toast.error("Image Validation Error", fileError);
      return;
    }

    setSubmitting(true);
    try {
      const fd = new FormData();
      if (selectedFile) {
        fd.append("file", selectedFile);
      }

      const payload = {
        name: formData.name,
        location: formData.location || "Whitefield, Bangalore",
        type: toDbPropertyType(formData.type),
        status: toDbPropertyStatus(formData.status),
        price: Number(formData.priceValueLakhs ? formData.priceValueLakhs * 100000 : 11000000),
        priceLabel: formData.startingPrice || "₹1.10 Cr",
        bedrooms: formatSpecsText(formData.specs || "2 & 3 BHK"),
        area: formatAreaText(formData.areaRange || "1,200 - 2,000 sq.ft"),
        totalUnits: Number(formData.totalUnits) || 100,
        availableUnits: Number(formData.availableUnits) || 45,
        possessionDate: formData.possessionDate || "Dec 2026",
        developer: formData.developer || "",
        reraId: formData.reraId || "",
        amenities: formData.amenities || "",
        description: formData.description || "Newly registered residential development project.",
      };

      fd.append("data", JSON.stringify(payload));

      const res = await fetch("/api/properties", {
        method: "POST",
        body: fd,
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        toast.error("Upload Failed", json.error || "Failed to create property.");
        setSubmitting(false);
        return;
      }

      const createdProp = parseBackendProperty(json.data, properties.length);
      setProperties([createdProp, ...properties]);
      setIsAddModalOpen(false);
      clearSelectedFile();
      toast.success("Property Added", `"${createdProp.name}" created successfully.`);
    } catch (err: any) {
      toast.error("Network Error", err.message || "Failed to submit property.");
    } finally {
      setSubmitting(false);
    }
  }

  // Edit Property Submit with Safe Image Replacement Sequence
  async function handleEditSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!editingProperty || !editingProperty.name) return;
    if (fileError) {
      toast.error("Image Validation Error", fileError);
      return;
    }

    setSubmitting(true);
    try {
      const fd = new FormData();
      if (selectedFile) {
        fd.append("file", selectedFile);
      }

      const payload = {
        name: editingProperty.name,
        location: editingProperty.location,
        type: toDbPropertyType(editingProperty.type),
        status: toDbPropertyStatus(editingProperty.status),
        price: Number(editingProperty.priceValueLakhs ? editingProperty.priceValueLakhs * 100000 : 12000000),
        priceLabel: editingProperty.startingPrice,
        bedrooms: formatSpecsText(editingProperty.specs),
        area: formatAreaText(editingProperty.areaRange),
        totalUnits: Number(editingProperty.totalUnits),
        availableUnits: Number(editingProperty.availableUnits),
        possessionDate: editingProperty.possessionDate,
        developer: editingProperty.developer || "",
        reraId: editingProperty.reraId || "",
        amenities: editingProperty.amenities || "",
        description: editingProperty.description || "",
        imageUrl: editingProperty.imagePublicId ? editingProperty.imageUrl : null,
        imagePublicId: editingProperty.imagePublicId || null,
      };

      fd.append("data", JSON.stringify(payload));

      const res = await fetch(`/api/properties/${editingProperty.id}`, {
        method: "PUT",
        body: fd,
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        toast.error("Update Failed", json.error || "Failed to update property.");
        setSubmitting(false);
        return;
      }

      const updatedProp = parseBackendProperty(json.data, 0);
      setProperties((prev) =>
        prev.map((p) => (p.id === updatedProp.id ? updatedProp : p))
      );
      setEditingProperty(null);
      clearSelectedFile();
      toast.success("Property Updated", `Changes to "${updatedProp.name}" saved.`);
    } catch (err: any) {
      toast.error("Network Error", err.message || "Failed to update property.");
    } finally {
      setSubmitting(false);
    }
  }

  // Delete Property with API Integration & Cloud Storage Cleanup
  async function handleDeleteConfirm() {
    if (!deletingProperty) return;
    try {
      const res = await fetch(`/api/properties/${deletingProperty.id}`, { method: "DELETE" });
      if (!res.ok) {
        toast.error("Delete Failed", "Could not remove property from server.");
        return;
      }
      setProperties((prev) => prev.filter((p) => p.id !== deletingProperty.id));
      toast.success("Property Deleted", `"${deletingProperty.name}" removed from catalog.`);
    } catch (err) {
      toast.error("Delete Error", "Network issue while deleting property.");
    } finally {
      setDeletingProperty(null);
    }
  }

  return (
    <AppShell>
      <div className={styles.container}>
        {/* ── OCEAN BLUE HERO BANNER ── */}
        <section className={styles.heroBanner}>
          <div className={styles.heroHeader}>
            <div className={styles.heroTitleGroup}>
              <h1 className={styles.heroTitle}>
                Properties & Projects
              </h1>
              <p className={styles.heroSubtitle}>
                Manage real estate developments, track unit availability, pricing, and project timelines
              </p>
            </div>

            <div className={styles.heroRightControls}>
              <button className={styles.heroBtn} onClick={handleRefresh}>
                <RefreshCw size={14} className={loading ? "animate-spin" : ""} /> Sync Database
              </button>
              <button
                className={styles.heroPrimaryBtn}
                onClick={() => {
                  clearSelectedFile();
                  setFormData({
                    name: "",
                    location: "Whitefield, Bangalore",
                    type: "Apartments",
                    specs: "2 & 3 BHK",
                    areaRange: "1,200 - 2,000 sq.ft",
                    startingPrice: "₹1.10 Cr",
                    priceValueLakhs: 110,
                    totalUnits: 100,
                    availableUnits: 45,
                    status: "Under Construction",
                    possessionDate: "Dec 2026",
                    developer: "",
                    reraId: "",
                    amenities: "",
                    description: "",
                  });
                  setIsAddModalOpen(true);
                }}
              >
                <Plus size={16} /> Add Property
              </button>
            </div>
          </div>

          {/* Integrated Hero KPI Grid */}
          <div className={styles.heroKpiGrid}>
            <div className={styles.heroKpiCard}>
              <div className={styles.heroKpiHeader}>
                <div className={styles.heroKpiIcon}><Building2 size={14} /></div>
                Total Projects
              </div>
              <div className={styles.heroKpiValue}>{properties.length}</div>
              <div className={styles.heroKpiTrend}>Active portfolios</div>
            </div>

            <div className={styles.heroKpiCard}>
              <div className={styles.heroKpiHeader}>
                <div className={styles.heroKpiIcon}><Home size={14} /></div>
                Available Units
              </div>
              <div className={styles.heroKpiValue}>{properties.reduce((acc, p) => acc + p.availableUnits, 0)}</div>
              <div className={styles.heroKpiTrend}>Open for booking</div>
            </div>

            <div className={styles.heroKpiCard}>
              <div className={styles.heroKpiHeader}>
                <div className={styles.heroKpiIcon}><CheckCircle2 size={14} /></div>
                Ready to Move
              </div>
              <div className={styles.heroKpiValue}>
                {properties.filter(p => normalizeStatus(p.status) === "Ready to Move").length}
              </div>
              <div className={styles.heroKpiTrend}>Immediate handover</div>
            </div>

            <div className={styles.heroKpiCard}>
              <div className={styles.heroKpiHeader}>
                <div className={styles.heroKpiIcon}><Layers size={14} /></div>
                Under Construction
              </div>
              <div className={styles.heroKpiValue}>
                {properties.filter(p => normalizeStatus(p.status) === "Under Construction").length}
              </div>
              <div className={styles.heroKpiTrend}>In active phase</div>
            </div>
          </div>
        </section>

        {/* ── RESPONSIVE FILTER TOOLBAR ── */}
        <FilterToolbar
          searchValue={search}
          onSearchChange={setSearch}
          searchPlaceholder="Search by project name, developer, location..."
          hasActiveFilters={Boolean(isFilterActive)}
          onClearFilters={handleClearFilters}
        >
          <Select
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            options={locationOptions.map((l) => ({ label: l, value: l }))}
          />
          <Select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            options={typeOptions.map((t) => ({ label: t, value: t }))}
          />
          <Select
            value={selectedAvailability}
            onChange={(e) => setSelectedAvailability(e.target.value)}
            options={[
              { label: "All Availability", value: "All Availability" },
              { label: "Ready to Move", value: "Ready to Move" },
              { label: "Under Construction", value: "Under Construction" },
              { label: "New Launch", value: "New Launch" },
              { label: "Almost Sold Out", value: "Almost Sold Out" },
            ]}
          />
          <Select
            value={selectedPriceRange}
            onChange={(e) => setSelectedPriceRange(e.target.value)}
            options={[
              { label: "All Prices", value: "All Prices" },
              { label: "Under ₹1 Cr", value: "Under ₹1 Cr" },
              { label: "₹1 - 2 Cr", value: "₹1 - 2 Cr" },
              { label: "₹2 - 3 Cr", value: "₹2 - 3 Cr" },
              { label: "Above ₹3 Cr", value: "Above ₹3 Cr" },
            ]}
          />
        </FilterToolbar>

        {/* ── PROPERTY CARDS GRID ── */}
        {filteredProperties.length === 0 ? (
          <EmptyState
            title="No Properties Found"
            description={
              isFilterActive
                ? "No listings match your search or filter parameters. Try clearing your filters."
                : "Your property catalog is currently empty. Click 'Add Property' to add your first project."
            }
            action={
              isFilterActive ? (
                <Button variant="secondary" size="sm" onClick={handleClearFilters}>
                  Reset All Filters
                </Button>
              ) : (
                <Button variant="primary" size="sm" iconLeft={<Plus size={15} />} onClick={() => setIsAddModalOpen(true)}>
                  Add Property
                </Button>
              )
            }
          />
        ) : (
          <div className={styles.grid}>
            {filteredProperties.map((property, idx) => {
              const displayImg = property.imageUrl || DEFAULT_PROPERTY_IMAGES[idx % DEFAULT_PROPERTY_IMAGES.length];
              const normalizedStatusVal = normalizeStatus(property.status);
              const amenitiesList = property.amenities ? property.amenities.split(",").slice(0, 3) : [];

              return (
                <div key={property.id} className={styles.propertyCard}>
                  {/* Top Image Banner */}
                  <div className={styles.cardImageWrap}>
                    <img
                      src={displayImg}
                      alt={property.name}
                      className={styles.cardImg}
                    />
                    <div className={styles.imageBadgesTop}>
                      <span className={`${styles.statusBadge} ${STATUS_CLASS_MAP[normalizedStatusVal] || styles.statusUnderConst}`}>
                        {normalizedStatusVal}
                      </span>
                      <button className={styles.favBtn} title="Bookmark Property">
                        <Heart size={15} />
                      </button>
                    </div>
                  </div>

                  {/* Card Body Content */}
                  <div className={styles.cardBody}>
                    {property.developer && (
                      <span className={styles.developerTag}>
                        {property.developer}
                      </span>
                    )}
                    <h3 className={styles.cardTitle}>{property.name}</h3>
                    <div className={styles.cardLocation}>
                      <MapPin size={13} style={{ color: "#0066CC" }} />
                      <span>{property.location}</span>
                    </div>

                    <div className={styles.specsRow}>
                      <span className={styles.specItem}>
                        <BedDouble size={14} />
                        {property.specs}
                      </span>
                      <span className={styles.specItem}>
                        <Maximize2 size={14} />
                        {property.areaRange}
                      </span>
                      <span className={styles.specItem}>
                        {TYPE_ICONS[property.type]}
                        {property.type}
                      </span>
                    </div>

                    {/* Amenities pills */}
                    {amenitiesList.length > 0 && (
                      <div className={styles.amenitiesWrap}>
                        {amenitiesList.map((am, aIdx) => (
                          <span key={aIdx} className={styles.amenityPill}>
                            {am.trim()}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Card Footer */}
                  <div className={styles.cardFooter}>
                    <div className={styles.priceCol}>
                      <span className={styles.priceLabel}>Starting Price</span>
                      <span className={styles.priceVal}>{property.startingPrice}</span>
                    </div>

                    <div className={styles.cardActions}>
                      <button
                        className={styles.readMoreBtn}
                        onClick={() => setViewingProperty(property)}
                      >
                        Read more <ChevronRight size={14} />
                      </button>
                      <button
                        className={styles.actionIconBtn}
                        title="Edit Property"
                        onClick={() => {
                          clearSelectedFile();
                          setEditingProperty({ ...property });
                        }}
                      >
                        <Edit3 size={14} />
                      </button>
                      <button
                        className={styles.actionIconBtn}
                        title="Delete Property"
                        style={{ color: "#EF4444" }}
                        onClick={() => setDeletingProperty(property)}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── ADD PROPERTY MODAL WITH FILE UPLOAD & NEW FIELDS ── */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Property"
        description="Register a new real estate development into the CRM catalog."
        size="lg"
      >
        <form onSubmit={handleAddSubmit}>
          <div className={styles.formGrid}>
            {/* Section 1: Basic Information */}
            <div className={styles.formSectionTitle}>
              <Building2 size={14} /> Basic Project Information
            </div>

            <div className={styles.formFullWidth}>
              <Input
                label="Property Name"
                placeholder="e.g. Greenview Residences"
                value={formData.name || ""}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <Input
              label="Developer / Builder Name"
              placeholder="e.g. Prestige Group or Sobha"
              value={formData.developer || ""}
              onChange={(e) => setFormData({ ...formData, developer: e.target.value })}
            />

            <Input
              label="RERA Registration / Ref ID"
              placeholder="e.g. PRM/KA/RERA/1251/446/PR/210315"
              value={formData.reraId || ""}
              onChange={(e) => setFormData({ ...formData, reraId: e.target.value })}
            />

            <Select
              label="Location"
              value={formData.location || locationOptions[1]}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              options={locationOptions.filter((l) => l !== "All Locations").map((l) => ({ label: l, value: l }))}
            />

            <Select
              label="Property Type"
              value={formData.type || "Apartments"}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as PropertyType })}
              options={typeOptions.filter((t) => t !== "All Types").map((t) => ({ label: t, value: t }))}
            />

            {/* Section 2: Property Image Upload */}
            <div className={styles.formSectionTitle}>
              <ImageIcon size={14} /> Showcase Image Upload (Max 2 MB - PNG / JPG)
            </div>

            <div className={styles.formFullWidth}>
              {imagePreview ? (
                <div className={styles.previewContainer}>
                  <img src={imagePreview} alt="Property Showcase Preview" className={styles.previewImg} />
                  <button type="button" className={styles.removeFileBtn} onClick={clearSelectedFile}>
                    <X size={13} /> Replace Image
                  </button>
                </div>
              ) : (
                <label className={styles.uploadDropzone}>
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/png, image/jpeg, image/jpg"
                    onChange={handleFileChange}
                    style={{ display: "none" }}
                  />
                  <div className={styles.uploadIcon}>
                    <Upload size={20} />
                  </div>
                  <p className={styles.uploadTitle}>Click to upload property image</p>
                  <p className={styles.uploadHint}>PNG, JPG or JPEG format up to 2 MB</p>
                </label>
              )}

              {fileError && <div className={styles.fileError}>{fileError}</div>}
            </div>

            {/* Section 3: Specifications & Pricing */}
            <div className={styles.formSectionTitle}>
              <Maximize2 size={14} /> Specifications & Pricing
            </div>

            <Input
              label="Specs"
              placeholder="e.g. 2, 3 & 4 BHK"
              value={formData.specs || ""}
              onChange={(e) => setFormData({ ...formData, specs: e.target.value })}
            />

            <Input
              label="Area Range"
              placeholder="e.g. 1,200 - 2,400 sq.ft"
              value={formData.areaRange || ""}
              onChange={(e) => setFormData({ ...formData, areaRange: e.target.value })}
            />

            <Input
              label="Starting Price"
              placeholder="e.g. ₹1.25 Cr"
              value={formData.startingPrice || ""}
              onChange={(e) => setFormData({ ...formData, startingPrice: e.target.value })}
              required
            />

            <Input
              label="Price in Lakhs"
              type="number"
              placeholder="e.g. 125"
              value={formData.priceValueLakhs || ""}
              onChange={(e) => setFormData({ ...formData, priceValueLakhs: Number(e.target.value) })}
            />

            {/* Section 4: Inventory & Amenities */}
            <div className={styles.formSectionTitle}>
              <Sparkles size={14} /> Inventory & Amenities
            </div>

            <Input
              label="Total Units"
              type="number"
              placeholder="e.g. 120"
              value={formData.totalUnits || ""}
              onChange={(e) => setFormData({ ...formData, totalUnits: Number(e.target.value) })}
              required
            />

            <Input
              label="Available Units"
              type="number"
              placeholder="e.g. 42"
              value={formData.availableUnits || ""}
              onChange={(e) => setFormData({ ...formData, availableUnits: Number(e.target.value) })}
              required
            />

            <Select
              label="Status"
              value={formData.status || "Under Construction"}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as PropertyStatus })}
              options={[
                { label: "Under Construction", value: "Under Construction" },
                { label: "Ready to Move", value: "Ready to Move" },
                { label: "New Launch", value: "New Launch" },
                { label: "Sold Out", value: "Sold Out" },
              ]}
            />

            <Input
              label="Possession Date"
              placeholder="e.g. Dec 2026 or Immediate"
              value={formData.possessionDate || ""}
              onChange={(e) => setFormData({ ...formData, possessionDate: e.target.value })}
            />

            <div className={styles.formFullWidth}>
              <Input
                label="Key Amenities (Comma separated)"
                placeholder="e.g. Infinity Pool, Clubhouse, Gym, Badminton Court, 24/7 Power"
                value={formData.amenities || ""}
                onChange={(e) => setFormData({ ...formData, amenities: e.target.value })}
              />
            </div>

            {/* Section 5: Highlights */}
            <div className={styles.formSectionTitle}>
              <Edit3 size={14} /> Highlights & Overview
            </div>

            <div className={styles.formFullWidth}>
              <Textarea
                label="Description & Highlights"
                placeholder="Enter key amenities, developer notes, and project highlights..."
                rows={3}
                value={formData.description || ""}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
          </div>

          <div className={styles.modalFooter}>
            <Button variant="secondary" type="button" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" disabled={submitting} iconLeft={<Plus size={16} />}>
              {submitting ? "Uploading..." : "Create Property"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* ── EDIT PROPERTY MODAL ── */}
      {editingProperty && (
        <Modal
          isOpen={Boolean(editingProperty)}
          onClose={() => setEditingProperty(null)}
          title={`Edit Property — ${editingProperty.name}`}
          description="Update development details, upload a replacement image, or adjust availability status."
          size="lg"
        >
          <form onSubmit={handleEditSubmit}>
            <div className={styles.formGrid}>
              <div className={styles.formSectionTitle}>
                <Building2 size={14} /> Basic Project Information
              </div>

              <div className={styles.formFullWidth}>
                <Input
                  label="Property Name"
                  value={editingProperty.name}
                  onChange={(e) => setEditingProperty({ ...editingProperty, name: e.target.value })}
                  required
                />
              </div>

              <Input
                label="Developer / Builder Name"
                placeholder="e.g. Prestige Group or Sobha"
                value={editingProperty.developer || ""}
                onChange={(e) => setEditingProperty({ ...editingProperty, developer: e.target.value })}
              />

              <Input
                label="RERA Registration / Ref ID"
                placeholder="e.g. PRM/KA/RERA/1251/446/PR/210315"
                value={editingProperty.reraId || ""}
                onChange={(e) => setEditingProperty({ ...editingProperty, reraId: e.target.value })}
              />

              <Select
                label="Location"
                value={editingProperty.location}
                onChange={(e) => setEditingProperty({ ...editingProperty, location: e.target.value })}
                options={locationOptions.filter((l) => l !== "All Locations").map((l) => ({ label: l, value: l }))}
              />

              <Select
                label="Property Type"
                value={editingProperty.type}
                onChange={(e) => setEditingProperty({ ...editingProperty, type: e.target.value as PropertyType })}
                options={typeOptions.filter((t) => t !== "All Types").map((t) => ({ label: t, value: t }))}
              />

              {/* Section 2: Property Image Upload / Replacement */}
              <div className={styles.formSectionTitle}>
                <ImageIcon size={14} /> Property Image (Replace or keep existing)
              </div>

              <div className={styles.formFullWidth}>
                {imagePreview || editingProperty.imageUrl ? (
                  <div className={styles.previewContainer}>
                    <img
                      src={imagePreview || editingProperty.imageUrl}
                      alt="Property Showcase Preview"
                      className={styles.previewImg}
                    />
                    <label className={styles.removeFileBtn}>
                      <input
                        type="file"
                        ref={fileInputRef}
                        accept="image/png, image/jpeg, image/jpg"
                        onChange={handleFileChange}
                        style={{ display: "none" }}
                      />
                      <Upload size={13} /> Replace Image
                    </label>
                  </div>
                ) : (
                  <label className={styles.uploadDropzone}>
                    <input
                      type="file"
                      ref={fileInputRef}
                      accept="image/png, image/jpeg, image/jpg"
                      onChange={handleFileChange}
                      style={{ display: "none" }}
                    />
                    <div className={styles.uploadIcon}>
                      <Upload size={20} />
                    </div>
                    <p className={styles.uploadTitle}>Click to upload new property image</p>
                    <p className={styles.uploadHint}>PNG, JPG or JPEG format up to 2 MB</p>
                  </label>
                )}

                {fileError && <div className={styles.fileError}>{fileError}</div>}
              </div>

              <div className={styles.formSectionTitle}>
                <Maximize2 size={14} /> Specifications & Pricing
              </div>

              <Input
                label="Specs"
                value={editingProperty.specs}
                onChange={(e) => setEditingProperty({ ...editingProperty, specs: e.target.value })}
              />

              <Input
                label="Area Range"
                value={editingProperty.areaRange}
                onChange={(e) => setEditingProperty({ ...editingProperty, areaRange: e.target.value })}
              />

              <Input
                label="Starting Price"
                value={editingProperty.startingPrice}
                onChange={(e) => setEditingProperty({ ...editingProperty, startingPrice: e.target.value })}
                required
              />

              <Input
                label="Price in Lakhs"
                type="number"
                value={editingProperty.priceValueLakhs}
                onChange={(e) => setEditingProperty({ ...editingProperty, priceValueLakhs: Number(e.target.value) })}
              />

              <div className={styles.formSectionTitle}>
                <Layers size={14} /> Inventory & Amenities
              </div>

              <Input
                label="Total Units"
                type="number"
                value={editingProperty.totalUnits}
                onChange={(e) => setEditingProperty({ ...editingProperty, totalUnits: Number(e.target.value) })}
                required
              />

              <Input
                label="Available Units"
                type="number"
                value={editingProperty.availableUnits}
                onChange={(e) => setEditingProperty({ ...editingProperty, availableUnits: Number(e.target.value) })}
                required
              />

              <Select
                label="Status"
                value={editingProperty.status}
                onChange={(e) => setEditingProperty({ ...editingProperty, status: e.target.value as PropertyStatus })}
                options={[
                  { label: "Under Construction", value: "Under Construction" },
                  { label: "Ready to Move", value: "Ready to Move" },
                  { label: "New Launch", value: "New Launch" },
                  { label: "Sold Out", value: "Sold Out" },
                ]}
              />

              <Input
                label="Possession Date"
                value={editingProperty.possessionDate}
                onChange={(e) => setEditingProperty({ ...editingProperty, possessionDate: e.target.value })}
              />

              <div className={styles.formFullWidth}>
                <Input
                  label="Key Amenities (Comma separated)"
                  placeholder="e.g. Infinity Pool, Clubhouse, Gym, Badminton Court, 24/7 Power"
                  value={editingProperty.amenities || ""}
                  onChange={(e) => setEditingProperty({ ...editingProperty, amenities: e.target.value })}
                />
              </div>

              <div className={styles.formSectionTitle}>
                <Edit3 size={14} /> Highlights & Overview
              </div>

              <div className={styles.formFullWidth}>
                <Textarea
                  label="Description & Highlights"
                  rows={3}
                  value={editingProperty.description}
                  onChange={(e) => setEditingProperty({ ...editingProperty, description: e.target.value })}
                />
              </div>
            </div>

            <div className={styles.modalFooter}>
              <Button variant="secondary" type="button" onClick={() => setEditingProperty(null)}>
                Cancel
              </Button>
              <Button variant="primary" type="submit" disabled={submitting}>
                {submitting ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* ── EXECUTIVE VIEW PROPERTY DETAILS MODAL ── */}
      {viewingProperty && (
        <Modal
          isOpen={Boolean(viewingProperty)}
          onClose={() => setViewingProperty(null)}
          title={viewingProperty.name}
          description={viewingProperty.developer ? `${viewingProperty.developer} — ${viewingProperty.location}` : viewingProperty.location}
          size="lg"
        >
          <div className={styles.viewContainer}>
            <div className={styles.viewImageHeader}>
              <img
                src={viewingProperty.imageUrl || DEFAULT_PROPERTY_IMAGES[0]}
                alt={viewingProperty.name}
              />
              <div className={styles.viewBadgeOverImg}>
                <span className={`${styles.statusBadge} ${STATUS_CLASS_MAP[normalizeStatus(viewingProperty.status)] || styles.statusUnderConst}`}>
                  {normalizeStatus(viewingProperty.status)}
                </span>
                <span className={styles.typeBadge}>
                  {viewingProperty.type}
                </span>
              </div>
            </div>

            {viewingProperty.reraId && (
              <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", color: "#059669", background: "#ECFDF5", padding: "6px 12px", borderRadius: "8px" }}>
                <ShieldCheck size={16} />
                <span><strong>RERA Reg ID:</strong> {viewingProperty.reraId}</span>
              </div>
            )}

            <div className={styles.viewSpecGrid}>
              <div className={styles.viewSpecCard}>
                <span className={styles.viewSpecLabel}>Starting Price</span>
                <span className={styles.viewSpecValue}>{viewingProperty.startingPrice}</span>
              </div>
              <div className={styles.viewSpecCard}>
                <span className={styles.viewSpecLabel}>Unit Inventory</span>
                <span className={styles.viewSpecValue}>{viewingProperty.availableUnits} / {viewingProperty.totalUnits} Units</span>
              </div>
              <div className={styles.viewSpecCard}>
                <span className={styles.viewSpecLabel}>Possession Date</span>
                <span className={styles.viewSpecValue}>{viewingProperty.possessionDate}</span>
              </div>
              <div className={styles.viewSpecCard}>
                <span className={styles.viewSpecLabel}>Configurations</span>
                <span className={styles.viewSpecValue}>{viewingProperty.specs}</span>
              </div>
              <div className={styles.viewSpecCard}>
                <span className={styles.viewSpecLabel}>Super Built-up Area</span>
                <span className={styles.viewSpecValue}>{viewingProperty.areaRange}</span>
              </div>
              <div className={styles.viewSpecCard}>
                <span className={styles.viewSpecLabel}>Developer</span>
                <span className={styles.viewSpecValue}>{viewingProperty.developer || "N/A"}</span>
              </div>
            </div>

            {viewingProperty.amenities && (
              <div style={{ background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: "10px", padding: "14px" }}>
                <strong style={{ fontSize: "12px", color: "#64748B", textTransform: "uppercase", letterSpacing: "0.04em", display: "block", marginBottom: "8px" }}>Key Amenities:</strong>
                <div className={styles.amenitiesWrap}>
                  {viewingProperty.amenities.split(",").map((am, aIdx) => (
                    <span key={aIdx} className={styles.amenityPill}>
                      {am.trim()}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className={styles.viewDescBox}>
              <strong style={{ color: "#0F172A", display: "block", marginBottom: "6px" }}>Project Description & Highlights:</strong>
              {viewingProperty.description || "No specific details logged for this property project."}
            </div>
          </div>
          <div className={styles.modalFooter}>
            <Button variant="secondary" onClick={() => setViewingProperty(null)}>
              Close Detail Sheet
            </Button>
          </div>
        </Modal>
      )}

      {/* ── DELETE CONFIRMATION MODAL ── */}
      {deletingProperty && (
        <Modal
          isOpen={Boolean(deletingProperty)}
          onClose={() => setDeletingProperty(null)}
          title={`Delete "${deletingProperty.name}"?`}
          description="Are you sure you want to delete this property development from the CRM catalog? Associated stored image files will also be removed."
          size="sm"
        >
          <div className={styles.modalFooter}>
            <Button variant="secondary" onClick={() => setDeletingProperty(null)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDeleteConfirm}>
              Delete Property
            </Button>
          </div>
        </Modal>
      )}
    </AppShell>
  );
}
