"use client";

import React, { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import styles from "./page.module.css";
import {
  Users,
  Building2,
  CalendarCheck2,
  DollarSign,
  TrendingUp,
  Download,
  RotateCw,
  ShoppingBag,
  Plus,
  UserCheck,
  BarChart3,
  Settings,
  ChevronRight,
  ShieldCheck,
  AlertTriangle,
  ArrowUpRight,
  Clock,
  CheckCircle2,
} from "lucide-react";

export default function DashboardPage() {
  const [analyticsPeriod, setAnalyticsPeriod] = useState<"month" | "year">("month");

  return (
    <AppShell>
      <div className={styles.dashboardContainer}>
        {/* ─────────────────────────────────────────────────────────────
           1. HERO WELCOME BANNER (DARK BLUE GRADIENT BOX)
           ───────────────────────────────────────────────────────────── */}
        <section className={styles.heroBanner}>
          <div className={styles.heroHeader}>
            <div className={styles.heroTitleGroup}>
              <h1 className={styles.heroTitle}>
                Welcome back, Admin
              </h1>
              <p className={styles.heroSubtitle}>
                Here&apos;s your real estate platform performance overview
              </p>
            </div>

            <div className={styles.heroRightControls}>
              <span className={styles.datePill}>Wednesday, April 1, 2026</span>
              <button className={styles.heroBtn}>
                <Download size={14} /> Export
              </button>
              <button className={styles.heroIconBtn} title="Refresh Data">
                <RotateCw size={14} />
              </button>
            </div>
          </div>

          {/* Integrated 4 Hero Stat Cards */}
          <div className={styles.heroKpiGrid}>
            <div className={styles.heroKpiCard}>
              <div className={styles.heroKpiHeader}>
                <div className={styles.heroKpiIcon}><ShoppingBag size={14} /></div>
                Today&apos;s Orders
              </div>
              <div className={styles.heroKpiValue}>47</div>
              <div className={styles.heroKpiTrend}>+12% from yesterday</div>
            </div>

            <div className={styles.heroKpiCard}>
              <div className={styles.heroKpiHeader}>
                <div className={styles.heroKpiIcon}><Users size={14} /></div>
                New Users
              </div>
              <div className={styles.heroKpiValue}>23</div>
              <div className={styles.heroKpiTrend}>+8% from yesterday</div>
            </div>

            <div className={styles.heroKpiCard}>
              <div className={styles.heroKpiHeader}>
                <div className={styles.heroKpiIcon}><DollarSign size={14} /></div>
                Revenue Today
              </div>
              <div className={styles.heroKpiValue}>PKR 84K</div>
              <div className={styles.heroKpiTrend}>+18% from yesterday</div>
            </div>

            <div className={styles.heroKpiCard}>
              <div className={styles.heroKpiHeader}>
                <div className={styles.heroKpiIcon}><TrendingUp size={14} /></div>
                Conversion Rate
              </div>
              <div className={styles.heroKpiValue}>3.24%</div>
              <div className={styles.heroKpiTrend}>+0.4% from yesterday</div>
            </div>
          </div>
        </section>

        {/* ─────────────────────────────────────────────────────────────
           2. ROW 1: 4 MAIN METRIC CARDS GRID
           ───────────────────────────────────────────────────────────── */}
        <section className={styles.metricsGrid}>
          {/* Card 1: Total Users / Leads */}
          <div className={styles.metricCard}>
            <div className={styles.metricCardTop}>
              <div className={styles.metricIconBadge} style={{ background: "#EFF6FF", color: "#0066CC" }}>
                <Users size={18} />
              </div>
              <span className={`${styles.trendPill} ${styles.trendGreen}`}>
                <TrendingUp size={12} /> +12.5%
              </span>
            </div>
            <div>
              <div className={styles.metricValue}>12,543</div>
              <div className={styles.metricLabel}>Total Users</div>
              <div className={styles.metricSublabel}>Active buyers & clients</div>
            </div>
            <div className={styles.progressContainer}>
              <div className={styles.progressTextRow}>
                <span>Progress</span>
                <span>75%</span>
              </div>
              <div className={styles.progressBarBg}>
                <div className={styles.progressBarFill} style={{ width: "75%", background: "#0066CC" }} />
              </div>
            </div>
            <div className={styles.metricFooter}>
              <span>vs last month:</span>
              <strong style={{ color: "#334155" }}>11,156</strong>
            </div>
          </div>

          {/* Card 2: Total Products / Properties */}
          <div className={styles.metricCard}>
            <div className={styles.metricCardTop}>
              <div className={styles.metricIconBadge} style={{ background: "#E6F7F1", color: "#00B074" }}>
                <Building2 size={18} />
              </div>
              <span className={`${styles.trendPill} ${styles.trendTeal}`}>
                <TrendingUp size={12} /> +8.2%
              </span>
            </div>
            <div>
              <div className={styles.metricValue}>3,842</div>
              <div className={styles.metricLabel}>Total Products</div>
              <div className={styles.metricSublabel}>Listed property units</div>
            </div>
            <div className={styles.progressContainer}>
              <div className={styles.progressTextRow}>
                <span>Progress</span>
                <span>62%</span>
              </div>
              <div className={styles.progressBarBg}>
                <div className={styles.progressBarFill} style={{ width: "62%", background: "#00B074" }} />
              </div>
            </div>
            <div className={styles.metricFooter}>
              <span>vs last month:</span>
              <strong style={{ color: "#334155" }}>3,551</strong>
            </div>
          </div>

          {/* Card 3: Total Orders / Site Visits */}
          <div className={styles.metricCard}>
            <div className={styles.metricCardTop}>
              <div className={styles.metricIconBadge} style={{ background: "#FFF7ED", color: "#FF7A00" }}>
                <CalendarCheck2 size={18} />
              </div>
              <span className={`${styles.trendPill} ${styles.trendOrange}`}>
                <TrendingUp size={12} /> +15.3%
              </span>
            </div>
            <div>
              <div className={styles.metricValue}>9,238</div>
              <div className={styles.metricLabel}>Total Orders</div>
              <div className={styles.metricSublabel}>Bookings & visits</div>
            </div>
            <div className={styles.progressContainer}>
              <div className={styles.progressTextRow}>
                <span>Progress</span>
                <span>85%</span>
              </div>
              <div className={styles.progressBarBg}>
                <div className={styles.progressBarFill} style={{ width: "85%", background: "#FF7A00" }} />
              </div>
            </div>
            <div className={styles.metricFooter}>
              <span>vs last month:</span>
              <strong style={{ color: "#334155" }}>8,012</strong>
            </div>
          </div>

          {/* Card 4: Total Revenue */}
          <div className={styles.metricCard}>
            <div className={styles.metricCardTop}>
              <div className={styles.metricIconBadge} style={{ background: "#F3E8FF", color: "#9933FF" }}>
                <DollarSign size={18} />
              </div>
              <span className={`${styles.trendPill} ${styles.trendPurple}`}>
                <TrendingUp size={12} /> +23.1%
              </span>
            </div>
            <div>
              <div className={styles.metricValue}>PKR 2.4M</div>
              <div className={styles.metricLabel}>Total Revenue</div>
              <div className={styles.metricSublabel}>Net platform income</div>
            </div>
            <div className={styles.progressContainer}>
              <div className={styles.progressTextRow}>
                <span>Progress</span>
                <span>90%</span>
              </div>
              <div className={styles.progressBarBg}>
                <div className={styles.progressBarFill} style={{ width: "90%", background: "#9933FF" }} />
              </div>
            </div>
            <div className={styles.metricFooter}>
              <span>vs last month:</span>
              <strong style={{ color: "#334155" }}>PKR 1.95M</strong>
            </div>
          </div>
        </section>

        {/* ─────────────────────────────────────────────────────────────
           3. ROW 2: ANALYTICS & LIVE ACTIVITY GRID
           ───────────────────────────────────────────────────────────── */}
        <section className={styles.analyticsGrid}>
          {/* Revenue Analytics (2/3 width) */}
          <div className={styles.sectionCard}>
            <div className={styles.cardHeader}>
              <div className={styles.cardHeaderTitleGroup}>
                <h2 className={styles.cardTitle}>Revenue Analytics</h2>
                <p className={styles.cardSubtitle}>Comprehensive revenue performance metrics</p>
              </div>
              <div className={styles.toggleButtonGroup}>
                <button
                  className={`${styles.toggleBtn} ${analyticsPeriod === "month" ? styles.toggleBtnActive : ""}`}
                  onClick={() => setAnalyticsPeriod("month")}
                >
                  This Month
                </button>
                <button
                  className={`${styles.toggleBtn} ${analyticsPeriod === "year" ? styles.toggleBtnActive : ""}`}
                  onClick={() => setAnalyticsPeriod("year")}
                >
                  This Year
                </button>
              </div>
            </div>

            {/* Monthly Analytics Bars */}
            <div className={styles.analyticsBarsList}>
              <div className={styles.analyticsBarItem}>
                <div className={styles.barMetaRow}>
                  <span>January <span className={styles.barMetaCount}>• 842 orders</span></span>
                  <div className={styles.barMetaRight}>
                    <span className={`${styles.trendPill} ${styles.trendGreen}`}>+12.5%</span>
                    <span className={styles.barValText}>PKR 180K</span>
                  </div>
                </div>
                <div className={styles.barBg}>
                  <div className={styles.barFill} style={{ width: "60%" }}>60%</div>
                </div>
              </div>

              <div className={styles.analyticsBarItem}>
                <div className={styles.barMetaRow}>
                  <span>February <span className={styles.barMetaCount}>• 1,024 orders</span></span>
                  <div className={styles.barMetaRight}>
                    <span className={`${styles.trendPill} ${styles.trendGreen}`}>+22.2%</span>
                    <span className={styles.barValText}>PKR 220K</span>
                  </div>
                </div>
                <div className={styles.barBg}>
                  <div className={styles.barFill} style={{ width: "73%" }}>73%</div>
                </div>
              </div>

              <div className={styles.analyticsBarItem}>
                <div className={styles.barMetaRow}>
                  <span>March <span className={styles.barMetaCount}>• 1,156 orders</span></span>
                  <div className={styles.barMetaRight}>
                    <span className={`${styles.trendPill} ${styles.trendGreen}`}>+9.1%</span>
                    <span className={styles.barValText}>PKR 240K</span>
                  </div>
                </div>
                <div className={styles.barBg}>
                  <div className={styles.barFill} style={{ width: "80%" }}>80%</div>
                </div>
              </div>
            </div>

            {/* Analytics Summary Footer */}
            <div className={styles.analyticsSummaryGrid}>
              <div className={styles.summaryBox} style={{ background: "#EFF6FF" }}>
                <span className={styles.summaryBoxVal}>PKR 640K</span>
                <span className={styles.summaryBoxLbl}>Total Revenue</span>
              </div>
              <div className={styles.summaryBox} style={{ background: "#ECFDF5" }}>
                <span className={styles.summaryBoxVal} style={{ color: "#10B981" }}>+18.5%</span>
                <span className={styles.summaryBoxLbl}>Growth Rate</span>
              </div>
              <div className={styles.summaryBox} style={{ background: "#F3E8FF" }}>
                <span className={styles.summaryBoxVal}>PKR 213K</span>
                <span className={styles.summaryBoxLbl}>Avg/Month</span>
              </div>
              <div className={styles.summaryBox} style={{ background: "#FFF7ED" }}>
                <span className={styles.summaryBoxVal}>3,022</span>
                <span className={styles.summaryBoxLbl}>Total Orders</span>
              </div>
            </div>
          </div>

          {/* Live Activity (1/3 width) */}
          <div className={styles.sectionCard}>
            <div className={styles.cardHeader}>
              <div className={styles.cardHeaderTitleGroup}>
                <h2 className={styles.cardTitle}>Live Activity</h2>
                <p className={styles.cardSubtitle}>Real-time updates</p>
              </div>
              <span className={styles.liveIndicator}>
                <span className={styles.liveDot} /> Live
              </span>
            </div>

            <div className={styles.activityList}>
              <div className={styles.activityItem}>
                <div className={styles.activityAvatar} style={{ background: "#EFF6FF", color: "#0066CC" }}>
                  <ShoppingBag size={16} />
                </div>
                <div className={styles.activityContent}>
                  <span>
                    <strong className={styles.activityUser}>Ahmad Sharif</strong> placed a new order{" "}
                    <span className={styles.activityHighlight}>PKR 4,500</span>
                  </span>
                  <span className={styles.activityTime}>2 minutes ago</span>
                </div>
              </div>

              <div className={styles.activityItem}>
                <div className={styles.activityAvatar} style={{ background: "#ECFDF5", color: "#10B981" }}>
                  <UserCheck size={16} />
                </div>
                <div className={styles.activityContent}>
                  <span>
                    <strong className={styles.activityUser}>Fatima Nazari</strong> registered as a seller
                  </span>
                  <span className={styles.activityTime}>15 minutes ago</span>
                </div>
              </div>

              <div className={styles.activityItem}>
                <div className={styles.activityAvatar} style={{ background: "#F3E8FF", color: "#9333EA" }}>
                  <Building2 size={16} />
                </div>
                <div className={styles.activityContent}>
                  <span>
                    <strong className={styles.activityUser}>Hamid Karimi</strong> added a new product listing
                  </span>
                  <span className={styles.activityTime}>32 minutes ago</span>
                </div>
              </div>

              <div className={styles.activityItem}>
                <div className={styles.activityAvatar} style={{ background: "#FFF7ED", color: "#EA580C" }}>
                  <CheckCircle2 size={16} />
                </div>
                <div className={styles.activityContent}>
                  <span>
                    <strong className={styles.activityUser}>Sara Ahmadi</strong> left a 5-star review
                  </span>
                  <span className={styles.activityTime}>1 hour ago</span>
                </div>
              </div>
            </div>

            <a href="#activities" className={styles.viewAllLink}>
              View All Activities &rarr;
            </a>
          </div>
        </section>

        {/* ─────────────────────────────────────────────────────────────
           4. ROW 3: QUICK ACTIONS & TOP SELLERS GRID
           ───────────────────────────────────────────────────────────── */}
        <section className={styles.actionsLeadersGrid}>
          {/* Quick Actions (1/2 width) */}
          <div className={styles.sectionCard}>
            <div className={styles.cardHeader}>
              <div className={styles.cardHeaderTitleGroup}>
                <h2 className={styles.cardTitle}>Quick Actions</h2>
                <p className={styles.cardSubtitle}>Frequently used admin tasks</p>
              </div>
            </div>

            <div className={styles.quickActionsGrid}>
              <button className={`${styles.actionTile} ${styles.tileBlue}`}>
                <div className={styles.tileIcon}>
                  <Plus size={18} />
                </div>
                <div className={styles.tileTitle}>Add Product</div>
                <div className={styles.tileSub}>Create new listing</div>
              </button>

              <button className={`${styles.actionTile} ${styles.tileGreen}`}>
                <div className={styles.tileIcon}>
                  <UserCheck size={18} />
                </div>
                <div className={styles.tileTitle}>Approve Users</div>
                <div className={styles.tileSub}>Review pending</div>
              </button>

              <button className={`${styles.actionTile} ${styles.tileOrange}`}>
                <div className={styles.tileIcon}>
                  <BarChart3 size={18} />
                </div>
                <div className={styles.tileTitle}>View Reports</div>
                <div className={styles.tileSub}>Analytics data</div>
              </button>

              <button className={`${styles.actionTile} ${styles.tilePurple}`}>
                <div className={styles.tileIcon}>
                  <Settings size={18} />
                </div>
                <div className={styles.tileTitle}>Settings</div>
                <div className={styles.tileSub}>Configure system</div>
              </button>
            </div>
          </div>

          {/* Top Sellers (1/2 width) */}
          <div className={styles.sectionCard}>
            <div className={styles.cardHeader}>
              <div className={styles.cardHeaderTitleGroup}>
                <h2 className={styles.cardTitle}>Top Sellers</h2>
                <p className={styles.cardSubtitle}>This month&apos;s leaders</p>
              </div>
              <a href="#sellers" className={styles.viewAllLink}>View All &gt;</a>
            </div>

            <div className={styles.leaderList}>
              <div className={styles.leaderItem}>
                <div className={styles.leaderLeft}>
                  <div className={styles.rankBadge}>1</div>
                  <div className={styles.leaderAvatar} style={{ background: "#FFEDD5", color: "#EA580C" }}>
                    KH
                  </div>
                  <div className={styles.leaderInfo}>
                    <span className={styles.leaderName}>Kabul Handicrafts</span>
                    <span className={styles.leaderSub}>1,245 orders • <span style={{ color: "#10B981" }}>+24.5%</span></span>
                  </div>
                </div>
                <div className={styles.leaderRight}>
                  <span className={styles.leaderRev}>PKR 245K</span>
                  <span className={styles.leaderRevLbl}>Revenue</span>
                </div>
              </div>

              <div className={styles.leaderItem}>
                <div className={styles.leaderLeft}>
                  <div className={styles.rankBadge} style={{ background: "#94A3B8" }}>2</div>
                  <div className={styles.leaderAvatar} style={{ background: "#E2E8F0", color: "#475569" }}>
                    AC
                  </div>
                  <div className={styles.leaderInfo}>
                    <span className={styles.leaderName}>Afghan Carpets Co.</span>
                    <span className={styles.leaderSub}>876 orders • <span style={{ color: "#10B981" }}>+16.2%</span></span>
                  </div>
                </div>
                <div className={styles.leaderRight}>
                  <span className={styles.leaderRev}>PKR 198K</span>
                  <span className={styles.leaderRevLbl}>Revenue</span>
                </div>
              </div>

              <div className={styles.leaderItem}>
                <div className={styles.leaderLeft}>
                  <div className={styles.rankBadge} style={{ background: "#D97706" }}>3</div>
                  <div className={styles.leaderAvatar} style={{ background: "#FFEDD5", color: "#D97706" }}>
                    HT
                  </div>
                  <div className={styles.leaderInfo}>
                    <span className={styles.leaderName}>Herat Textiles</span>
                    <span className={styles.leaderSub}>654 orders • <span style={{ color: "#10B981" }}>+19.7%</span></span>
                  </div>
                </div>
                <div className={styles.leaderRight}>
                  <span className={styles.leaderRev}>PKR 167K</span>
                  <span className={styles.leaderRevLbl}>Revenue</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─────────────────────────────────────────────────────────────
           5. ROW 4: PENDING ACTIONS CARDS
           ───────────────────────────────────────────────────────────── */}
        <section className={styles.pendingActionsSection}>
          <div className={styles.cardHeader}>
            <div className={styles.cardHeaderTitleGroup}>
              <h2 className={styles.cardTitle}>Pending Actions</h2>
              <p className={styles.cardSubtitle}>Items requiring your immediate attention</p>
            </div>
            <span className={styles.pendingBadge}>
              <span className={styles.pendingDot} /> 25 Pending
            </span>
          </div>

          <div className={styles.pendingGrid}>
            {/* Card 1: Seller Verifications */}
            <div className={`${styles.pendingCard} ${styles.cardOrange}`}>
              <div className={styles.pendingCardTop}>
                <div className={styles.pendingCardIcon}>
                  <ShieldCheck size={20} />
                </div>
                <div className={styles.pendingCountBadge}>12</div>
              </div>
              <div className={styles.pendingCardContent}>
                <span className={styles.pendingCardTitle}>Seller Verifications</span>
                <span className={styles.pendingCardSub}>New sellers awaiting approval and verification</span>
              </div>
              <button className={styles.pendingCtaBtn}>
                Review Now <ChevronRight size={14} />
              </button>
            </div>

            {/* Card 2: Product Approvals */}
            <div className={`${styles.pendingCard} ${styles.cardBlue}`}>
              <div className={styles.pendingCardTop}>
                <div className={styles.pendingCardIcon}>
                  <Building2 size={20} />
                </div>
                <div className={styles.pendingCountBadge}>8</div>
              </div>
              <div className={styles.pendingCardContent}>
                <span className={styles.pendingCardTitle}>Product Approvals</span>
                <span className={styles.pendingCardSub}>New product listings pending review</span>
              </div>
              <button className={styles.pendingCtaBtn}>
                Review Now <ChevronRight size={14} />
              </button>
            </div>

            {/* Card 3: Reported Issues */}
            <div className={`${styles.pendingCard} ${styles.cardRed}`}>
              <div className={styles.pendingCardTop}>
                <div className={styles.pendingCardIcon}>
                  <AlertTriangle size={20} />
                </div>
                <div className={styles.pendingCountBadge}>5</div>
              </div>
              <div className={styles.pendingCardContent}>
                <span className={styles.pendingCardTitle}>Reported Issues</span>
                <span className={styles.pendingCardSub}>Urgent disputes and flagged content</span>
              </div>
              <button className={styles.pendingCtaBtn}>
                View Issues <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </section>
      </div>
    </AppShell>
  );
}
