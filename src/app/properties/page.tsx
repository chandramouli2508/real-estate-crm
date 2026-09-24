"use client";

import React, { useState, useMemo } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/ui/PageHeader";
import { FilterToolbar } from "@/components/ui/FilterToolbar";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { SearchInput } from "@/components/ui/SearchInput";
import { Select } from "@/components/ui/Select";
import { Dropdown } from "@/components/ui/Dropdown";
import { Modal } from "@/components/ui/Modal";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { useToast } from "@/components/ui/Toast";
import styles from "./properties.module.css";
import {
  Building2, Plus, MapPin, RefreshCw,
  Home, Eye, Edit3, Trash2, Layers, CheckCircle2,
  Building, Maximize2
} from "lucide-react";

/* ─────────────────────────────────────────────────────────────
   TYPES & MOCK DATA
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
  bannerGradient: string;
}

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
    description: "Premium eco-friendly residential towers featuring rooftop infinity pool, clubhouse, and lush green garden landscapes.",
    bannerGradient: "linear-gradient(135deg, #1E1B4B 0%, #312E81 50%, #4338CA 100%)",
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
    description: "Ultra-luxury sky villas with private decks, smart home automation, and panoramic city views in the heart of Indiranagar.",
    bannerGradient: "linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #0284C7 100%)",
  },
  {
    id: "prop-3",
    name: "Lakeview Villas",
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
    description: "Exclusive waterfront villas with private garden lawns, double-height ceilings, and private pool options.",
    bannerGradient: "linear-gradient(135deg, #064E3B 0%, #047857 50%, #10B981 100%)",
  },
  {
    id: "prop-4",
    name: "Silicon Tech Park",
    location: "Electronic City, Bangalore",
    type: "Commercial",
    specs: "Grade-A Office Spaces",
    areaRange: "1,500 - 10,000 sq.ft",
    startingPrice: "₹85 L",
    priceValueLakhs: 85,
    totalUnits: 60,
    availableUnits: 28,
    status: "Ready to Move",
    possessionDate: "Immediate",
    description: "Modern commercial complex designed for tech enterprises, featuring high-speed elevators, 100% power backup, and food court.",
    bannerGradient: "linear-gradient(135deg, #4C1D95 0%, #6D28D9 50%, #8B5CF6 100%)",
  },
  {
    id: "prop-5",
    name: "Urban Horizon Suites",
    location: "HSR Layout, Bangalore",
    type: "Apartments",
    specs: "1 & 2 BHK Compact Luxury",
    areaRange: "650 - 1,150 sq.ft",
    startingPrice: "₹65 L",
    priceValueLakhs: 65,
    totalUnits: 150,
    availableUnits: 5,
    status: "Ready to Move",
    possessionDate: "Immediate",
    description: "Smart compact apartments tailor-made for young tech professionals and high-yield rental investment.",
    bannerGradient: "linear-gradient(135deg, #78350F 0%, #B45309 50%, #F59E0B 100%)",
  },
  {
    id: "prop-6",
    name: "Royal Palm Estates",
    location: "Yelahanka, Bangalore",
    type: "Plots",
    specs: "30x40 & 40x60 Villa Sites",
    areaRange: "1,200 - 2,400 sq.ft",
    startingPrice: "₹48 L",
    priceValueLakhs: 48,
    totalUnits: 200,
    availableUnits: 110,
    status: "New Launch",
    possessionDate: "Mar 2026",
    description: "BIAPPA approved gated plot township with underground utilities, wide asphalt roads, and grand entrance arch.",
    bannerGradient: "linear-gradient(135deg, #134E4A 0%, #0D9488 50%, #14B8A6 100%)",
  },
];

const STATUS_BADGE_VARIANT: Record<PropertyStatus, "success" | "info" | "primary" | "danger"> = {
  "Ready to Move": "success",
  "Under Construction": "info",
  "New Launch": "primary",
  "Sold Out": "danger",
};

const TYPE_ICONS: Record<PropertyType, React.ReactNode> = {
  Apartments: <Building2 size={15} strokeWidth={1.8} />,
  Villas: <Home size={15} strokeWidth={1.8} />,
  Plots: <Layers size={15} strokeWidth={1.8} />,
  Commercial: <Building size={15} strokeWidth={1.8} />,
};

/* ─────────────────────────────────────────────────────────────
   MAIN COMPONENT
   ───────────────────────────────────────────────────────────── */

export default function PropertiesPage() {
  const toast = useToast();

  // Primary Data State
  const [properties, setProperties] = useState<Property[]>(INITIAL_PROPERTIES);
  const [loading, setLoading] = useState<boolean>(false);
  const [hasError, setHasError] = useState<boolean>(false);

  // Filter States
  const [search, setSearch] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("All Locations");
  const [selectedType, setSelectedType] = useState("All Types");
  const [selectedAvailability, setSelectedAvailability] = useState("All Availability");
  const [selectedPriceRange, setSelectedPriceRange] = useState("All Prices");

  // Modal / Drawer States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [viewingProperty, setViewingProperty] = useState<Property | null>(null);
  const [deletingProperty, setDeletingProperty] = useState<Property | null>(null);

  // Form Data State
  const [formData, setFormData] = useState<Partial<Property>>({
    name: "",
    location: "Whitefield, Bangalore",
    type: "Apartments",
    specs: "2 & 3 BHK",
    areaRange: "1,200 - 2,000 sq.ft",
    startingPrice: "₹1.10 Cr",
    priceValueLakhs: 110,
    totalUnits: 100,
    availableUnits: 50,
    status: "Under Construction",
    possessionDate: "Dec 2026",
    description: "",
  });

  // Filter Options
  const locationOptions = [
    "All Locations",
    "Whitefield, Bangalore",
    "Indiranagar, Bangalore",
    "Sarjapur Road, Bangalore",
    "Electronic City, Bangalore",
    "HSR Layout, Bangalore",
    "Yelahanka, Bangalore",
  ];

  const typeOptions = ["All Types", "Apartments", "Villas", "Plots", "Commercial"];
  const availabilityOptions = ["All Availability", "Ready to Move", "Under Construction", "New Launch", "Almost Sold Out"];
  const priceOptions = ["All Prices", "Under ₹1 Cr", "₹1 - 2 Cr", "₹2 - 3 Cr", "Above ₹3 Cr"];

  // Filtered Properties Computation
  const filteredProperties = useMemo(() => {
    return properties.filter((item) => {
      // Search term
      if (search.trim()) {
        const query = search.toLowerCase();
        const matchesName = item.name.toLowerCase().includes(query);
        const matchesLoc = item.location.toLowerCase().includes(query);
        const matchesSpecs = item.specs.toLowerCase().includes(query);
        if (!matchesName && !matchesLoc && !matchesSpecs) return false;
      }

      // Location
      if (selectedLocation !== "All Locations" && item.location !== selectedLocation) {
        return false;
      }

      // Type
      if (selectedType !== "All Types" && item.type !== selectedType) {
        return false;
      }

      // Availability status
      if (selectedAvailability !== "All Availability") {
        if (selectedAvailability === "Almost Sold Out") {
          const ratio = item.availableUnits / item.totalUnits;
          if (ratio > 0.20 || item.availableUnits === 0) return false;
        } else if (item.status !== selectedAvailability) {
          return false;
        }
      }

      // Price Range filter
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

  // Reset Filters
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

  // Simulate refresh / sync
  function handleRefresh() {
    setLoading(true);
    setHasError(false);
    setTimeout(() => {
      setLoading(false);
      toast.info("Refreshed", "Property database synced.");
    }, 600);
  }

  // Add Property Submit
  function handleAddSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!formData.name) {
      toast.error("Validation Error", "Property name is required.");
      return;
    }

    const newProp: Property = {
      id: `prop-${Date.now()}`,
      name: formData.name,
      location: formData.location || "Whitefield, Bangalore",
      type: (formData.type as PropertyType) || "Apartments",
      specs: formData.specs || "2 & 3 BHK",
      areaRange: formData.areaRange || "1,200 - 2,000 sq.ft",
      startingPrice: formData.startingPrice || "₹1.10 Cr",
      priceValueLakhs: Number(formData.priceValueLakhs) || 110,
      totalUnits: Number(formData.totalUnits) || 100,
      availableUnits: Number(formData.availableUnits) || 45,
      status: (formData.status as PropertyStatus) || "Under Construction",
      possessionDate: formData.possessionDate || "Dec 2026",
      description: formData.description || "Newly added residential development.",
      bannerGradient: "linear-gradient(135deg, #1E1B4B 0%, #312E81 50%, #4338CA 100%)",
    };

    setProperties([newProp, ...properties]);
    setIsAddModalOpen(false);
    toast.success("Property Added", `"${newProp.name}" has been created successfully.`);
  }

  // Edit Property Submit
  function handleEditSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!editingProperty || !editingProperty.name) return;

    setProperties((prev) =>
      prev.map((p) => (p.id === editingProperty.id ? editingProperty : p))
    );
    setEditingProperty(null);
    toast.success("Property Updated", `Changes to "${editingProperty.name}" saved.`);
  }

  // Delete Property
  function handleDeleteConfirm() {
    if (!deletingProperty) return;
    setProperties((prev) => prev.filter((p) => p.id !== deletingProperty.id));
    toast.warning("Property Deleted", `"${deletingProperty.name}" was removed.`);
    setDeletingProperty(null);
  }

  return (
    <AppShell>
      <div className={styles.container}>
        {/* ── REUSABLE PAGE HEADER ── */}
        <PageHeader
          title="Properties & Projects"
          subtitle="Manage real estate developments, track unit availability, pricing, and project timelines."
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
                iconLeft={<Plus size={16} />}
                onClick={() => {
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
                    description: "",
                  });
                  setIsAddModalOpen(true);
                }}
              >
                Add Property
              </Button>
            </div>
          }
        />

        {/* ── REUSABLE RESPONSIVE FILTER TOOLBAR ── */}
        <FilterToolbar
          searchValue={search}
          onSearchChange={setSearch}
          searchPlaceholder="Search by project name, location or specs..."
          hasActiveFilters={Boolean(isFilterActive)}
          onClearFilters={handleClearFilters}
        >
          <Select
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            options={locationOptions.map((loc) => ({ label: loc, value: loc }))}
          />

          <Select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            options={typeOptions.map((t) => ({ label: t, value: t }))}
          />

          <Select
            value={selectedAvailability}
            onChange={(e) => setSelectedAvailability(e.target.value)}
            options={availabilityOptions.map((a) => ({ label: a, value: a }))}
          />

          <Select
            value={selectedPriceRange}
            onChange={(e) => setSelectedPriceRange(e.target.value)}
            options={priceOptions.map((p) => ({ label: p, value: p }))}
          />
        </FilterToolbar>

        {/* ── CONTENT BODY (LOADING / ERROR / EMPTY / GRID) ── */}
        {loading ? (
          <div className={styles.grid}>
            {Array.from({ length: 6 }).map((_, idx) => (
              <div key={idx} className={styles.skeletonCard}>
                <div className={styles.skeletonBanner} />
                <div className={styles.skeletonBody}>
                  <div className={styles.skeletonLine} style={{ width: "70%" }} />
                  <div className={styles.skeletonLine} style={{ width: "40%" }} />
                  <div className={styles.skeletonLine} style={{ width: "90%", marginTop: "auto" }} />
                </div>
              </div>
            ))}
          </div>
        ) : hasError ? (
          <ErrorState
            title="Failed to load properties"
            message="Could not connect to property database. Please retry."
            onRetry={handleRefresh}
          />
        ) : filteredProperties.length === 0 ? (
          <EmptyState
            icon={<Building2 size={40} strokeWidth={1.4} />}
            title="No properties found"
            description={
              isFilterActive
                ? "No property records match your selected filter criteria."
                : "Get started by adding your first real estate project or property."
            }
            action={
              isFilterActive ? (
                <Button variant="secondary" size="md" onClick={handleClearFilters}>
                  Clear Filters
                </Button>
              ) : (
                <Button
                  variant="primary"
                  size="md"
                  iconLeft={<Plus size={16} />}
                  onClick={() => setIsAddModalOpen(true)}
                >
                  Add Property
                </Button>
              )
            }
          />
        ) : (
          <div className={styles.grid}>
            {filteredProperties.map((property) => {
              const availRatio = property.totalUnits > 0 ? property.availableUnits / property.totalUnits : 0;
              const availPercent = Math.round(availRatio * 100);

              let progressClass = styles.progressSuccess;
              if (availRatio <= 0.15) {
                progressClass = styles.progressDanger;
              } else if (availRatio <= 0.40) {
                progressClass = styles.progressWarning;
              }

              return (
                <Card key={property.id} hover padded={false}>
                  {/* Banner Header Overlay */}
                  <div
                    className={styles.cardBanner}
                    style={{ background: property.bannerGradient }}
                  >
                    <div className={styles.cardBannerOverlay} />
                    <div className={styles.bannerTop}>
                      <span className={styles.typeBadge}>
                        {property.type}
                      </span>
                      <Badge variant={STATUS_BADGE_VARIANT[property.status]} size="sm">
                        {property.status}
                      </Badge>
                    </div>

                    <div className={styles.bannerBottom}>
                      <div className={styles.bannerIcon}>
                        {TYPE_ICONS[property.type]}
                      </div>
                      <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.9)", fontWeight: 500 }}>
                        Possession: {property.possessionDate}
                      </span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <Card.Body style={{ padding: "16px 20px" }}>
                    <div>
                      <div className={styles.nameRow}>
                        <h3 className={styles.propertyName}>{property.name}</h3>
                      </div>
                      <div className={styles.locationRow}>
                        <MapPin size={13} strokeWidth={1.8} style={{ color: "var(--color-primary)" }} />
                        <span>{property.location}</span>
                      </div>
                    </div>

                    <div className={styles.specsChips}>
                      <span className={styles.specChip}>
                        <Home size={11} strokeWidth={1.8} />
                        {property.specs}
                      </span>
                      <span className={styles.specChip}>
                        <Maximize2 size={11} strokeWidth={1.8} />
                        {property.areaRange}
                      </span>
                    </div>

                    {/* Price & Availability Box */}
                    <div className={styles.infoBox}>
                      <div className={styles.priceRow}>
                        <span className={styles.priceLabel}>Starting Price</span>
                        <span className={styles.priceValue}>{property.startingPrice}</span>
                      </div>

                      <div className={styles.availabilitySection}>
                        <div className={styles.availabilityHeader}>
                          <span>Availability</span>
                          <span className={styles.availabilityText}>
                            <strong>{property.availableUnits}</strong> / {property.totalUnits} Units ({availPercent}%)
                          </span>
                        </div>
                        <div className={styles.progressTrack}>
                          <div
                            className={`${styles.progressFill} ${progressClass}`}
                            style={{ width: `${Math.min(100, Math.max(4, availPercent))}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </Card.Body>

                  {/* Footer Actions */}
                  <Card.Footer style={{ padding: "12px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span className={styles.unitsText}>
                      {property.availableUnits === 0 ? (
                        <span style={{ color: "var(--color-danger)", fontWeight: 600 }}>Sold Out</span>
                      ) : (
                        <span>{property.availableUnits} units available</span>
                      )}
                    </span>

                    <div className={styles.footerActions}>
                      <Button
                        variant="ghost"
                        size="sm"
                        title="View Details"
                        onClick={() => setViewingProperty(property)}
                        style={{ padding: "6px" }}
                      >
                        <Eye size={15} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        title="Edit Property"
                        onClick={() => setEditingProperty({ ...property })}
                        style={{ padding: "6px" }}
                      >
                        <Edit3 size={15} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        title="Delete Property"
                        onClick={() => setDeletingProperty(property)}
                        style={{ padding: "6px", color: "var(--color-danger)" }}
                      >
                        <Trash2 size={15} />
                      </Button>
                    </div>
                  </Card.Footer>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* ── ADD PROPERTY MODAL ── */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Property"
        description="Register a new real estate project or development into the CRM."
        size="lg"
      >
        <form onSubmit={handleAddSubmit}>
          <div className={styles.formGrid}>
            <div className={styles.formFullWidth}>
              <Input
                label="Property / Project Name *"
                placeholder="e.g. Greenview Residences"
                value={formData.name || ""}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <Select
              label="Location *"
              value={formData.location || locationOptions[1]}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              options={locationOptions.filter((l) => l !== "All Locations").map((l) => ({ label: l, value: l }))}
            />

            <Select
              label="Property Type *"
              value={formData.type || "Apartments"}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as PropertyType })}
              options={typeOptions.filter((t) => t !== "All Types").map((t) => ({ label: t, value: t }))}
            />

            <Input
              label="Unit Specifications"
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
              label="Starting Price *"
              placeholder="e.g. ₹1.25 Cr"
              value={formData.startingPrice || ""}
              onChange={(e) => setFormData({ ...formData, startingPrice: e.target.value })}
              required
            />

            <Input
              label="Price in Lakhs (for sorting/filter)"
              type="number"
              placeholder="e.g. 125"
              value={formData.priceValueLakhs || ""}
              onChange={(e) => setFormData({ ...formData, priceValueLakhs: Number(e.target.value) })}
            />

            <Input
              label="Total Units *"
              type="number"
              placeholder="e.g. 120"
              value={formData.totalUnits || ""}
              onChange={(e) => setFormData({ ...formData, totalUnits: Number(e.target.value) })}
              required
            />

            <Input
              label="Available Units *"
              type="number"
              placeholder="e.g. 42"
              value={formData.availableUnits || ""}
              onChange={(e) => setFormData({ ...formData, availableUnits: Number(e.target.value) })}
              required
            />

            <Select
              label="Construction / Sales Status *"
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
            <Button variant="primary" type="submit" iconLeft={<Plus size={16} />}>
              Create Property
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
          description="Update development details, unit counts, and availability status."
          size="lg"
        >
          <form onSubmit={handleEditSubmit}>
            <div className={styles.formGrid}>
              <div className={styles.formFullWidth}>
                <Input
                  label="Property Name *"
                  value={editingProperty.name}
                  onChange={(e) => setEditingProperty({ ...editingProperty, name: e.target.value })}
                  required
                />
              </div>

              <Select
                label="Location *"
                value={editingProperty.location}
                onChange={(e) => setEditingProperty({ ...editingProperty, location: e.target.value })}
                options={locationOptions.filter((l) => l !== "All Locations").map((l) => ({ label: l, value: l }))}
              />

              <Select
                label="Property Type *"
                value={editingProperty.type}
                onChange={(e) => setEditingProperty({ ...editingProperty, type: e.target.value as PropertyType })}
                options={typeOptions.filter((t) => t !== "All Types").map((t) => ({ label: t, value: t }))}
              />

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
                label="Starting Price *"
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

              <Input
                label="Total Units *"
                type="number"
                value={editingProperty.totalUnits}
                onChange={(e) => setEditingProperty({ ...editingProperty, totalUnits: Number(e.target.value) })}
                required
              />

              <Input
                label="Available Units *"
                type="number"
                value={editingProperty.availableUnits}
                onChange={(e) => setEditingProperty({ ...editingProperty, availableUnits: Number(e.target.value) })}
                required
              />

              <Select
                label="Status *"
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
                <Textarea
                  label="Description"
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
              <Button variant="primary" type="submit" iconLeft={<CheckCircle2 size={16} />}>
                Save Changes
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* ── VIEW PROPERTY QUICK DETAILS MODAL ── */}
      {viewingProperty && (
        <Modal
          isOpen={Boolean(viewingProperty)}
          onClose={() => setViewingProperty(null)}
          title="Property Details"
          size="md"
        >
          <div className={styles.detailSection}>
            <div
              className={styles.detailBanner}
              style={{ background: viewingProperty.bannerGradient }}
            >
              <div className={styles.detailBannerOverlay} />
              <div className={styles.detailTitle}>{viewingProperty.name}</div>
              <div className={styles.detailSubtitle}>
                <MapPin size={12} /> {viewingProperty.location}
              </div>
            </div>

            <div className={styles.detailGrid}>
              <div className={styles.detailBox}>
                <span className={styles.detailLabel}>Property Type</span>
                <span className={styles.detailValue}>{viewingProperty.type}</span>
              </div>
              <div className={styles.detailBox}>
                <span className={styles.detailLabel}>Starting Price</span>
                <span className={styles.detailValue}>{viewingProperty.startingPrice}</span>
              </div>
              <div className={styles.detailBox}>
                <span className={styles.detailLabel}>Unit Specs</span>
                <span className={styles.detailValue}>{viewingProperty.specs}</span>
              </div>
              <div className={styles.detailBox}>
                <span className={styles.detailLabel}>Area Range</span>
                <span className={styles.detailValue}>{viewingProperty.areaRange}</span>
              </div>
              <div className={styles.detailBox}>
                <span className={styles.detailLabel}>Status</span>
                <span className={styles.detailValue}>{viewingProperty.status}</span>
              </div>
              <div className={styles.detailBox}>
                <span className={styles.detailLabel}>Possession</span>
                <span className={styles.detailValue}>{viewingProperty.possessionDate}</span>
              </div>
              <div className={styles.detailBox}>
                <span className={styles.detailLabel}>Total Units</span>
                <span className={styles.detailValue}>{viewingProperty.totalUnits} Units</span>
              </div>
              <div className={styles.detailBox}>
                <span className={styles.detailLabel}>Available Units</span>
                <span className={styles.detailValue} style={{ color: "var(--color-primary)" }}>
                  {viewingProperty.availableUnits} Units Available
                </span>
              </div>
            </div>

            <div className={styles.detailBox}>
              <span className={styles.detailLabel}>Overview & Amenities</span>
              <p style={{ fontSize: "13px", color: "var(--color-text-secondary)", lineHeight: "1.5", marginTop: "4px" }}>
                {viewingProperty.description}
              </p>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "8px" }}>
              <Button
                variant="secondary"
                size="md"
                onClick={() => setViewingProperty(null)}
              >
                Close
              </Button>
              <Button
                variant="primary"
                size="md"
                iconLeft={<Edit3 size={15} />}
                onClick={() => {
                  const target = viewingProperty;
                  setViewingProperty(null);
                  setEditingProperty({ ...target });
                }}
              >
                Edit Property
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* ── DELETE CONFIRMATION MODAL ── */}
      {deletingProperty && (
        <Modal
          isOpen={Boolean(deletingProperty)}
          onClose={() => setDeletingProperty(null)}
          title="Delete Property"
          description={`Are you sure you want to remove "${deletingProperty.name}"? This action cannot be undone.`}
          size="sm"
        >
          <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "16px" }}>
            <Button variant="secondary" size="md" onClick={() => setDeletingProperty(null)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              size="md"
              iconLeft={<Trash2 size={15} />}
              onClick={handleDeleteConfirm}
            >
              Confirm Delete
            </Button>
          </div>
        </Modal>
      )}
    </AppShell>
  );
}
