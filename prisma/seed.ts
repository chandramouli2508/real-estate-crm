import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import bcrypt from "bcryptjs";
import path from "path";
import "dotenv/config";

const rawUrl = process.env.DATABASE_URL ?? "file:./dev.db";
let url = rawUrl;
if (rawUrl.startsWith("file:")) {
  const dbPath = rawUrl.replace("file:", "");
  const resolvedPath = path.isAbsolute(dbPath)
    ? dbPath
    : path.resolve(process.cwd(), dbPath);
  url = `file:${resolvedPath}`;
}

const adapter = new PrismaLibSql({ url });
const prisma = new PrismaClient({ adapter });

async function initSchema() {
  console.log("Ensuring database tables exist...");
  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "users" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "name" TEXT NOT NULL,
      "email" TEXT NOT NULL UNIQUE,
      "passwordHash" TEXT NOT NULL,
      "role" TEXT NOT NULL DEFAULT 'AGENT',
      "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `);
  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "leads" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "name" TEXT NOT NULL,
      "email" TEXT,
      "phone" TEXT NOT NULL,
      "source" TEXT NOT NULL,
      "status" TEXT NOT NULL DEFAULT 'NEW',
      "assignedTo" TEXT,
      "notes" TEXT,
      "project" TEXT,
      "budget" TEXT,
      "followUp" DATETIME,
      "urgent" BOOLEAN NOT NULL DEFAULT 0,
      "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `);
  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "properties" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "name" TEXT NOT NULL,
      "location" TEXT NOT NULL,
      "type" TEXT NOT NULL,
      "status" TEXT NOT NULL DEFAULT 'UNDER_CONSTRUCTION',
      "price" REAL NOT NULL,
      "priceLabel" TEXT NOT NULL,
      "bedrooms" TEXT,
      "area" TEXT,
      "description" TEXT,
      "totalUnits" INTEGER NOT NULL DEFAULT 0,
      "availableUnits" INTEGER NOT NULL DEFAULT 0,
      "possessionDate" TEXT,
      "bannerGradient" TEXT,
      "imageUrl" TEXT,
      "imagePublicId" TEXT,
      "developer" TEXT,
      "reraId" TEXT,
      "amenities" TEXT,
      "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `);
  // Ensure new columns exist for existing Turso tables
  const alterColumns = ["imageUrl", "imagePublicId", "developer", "reraId", "amenities"];
  for (const col of alterColumns) {
    try {
      await prisma.$executeRawUnsafe(`ALTER TABLE "properties" ADD COLUMN "${col}" TEXT;`);
    } catch (_) {
      // Column already exists
    }
  }
  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "bookings" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "leadId" TEXT NOT NULL,
      "propertyId" TEXT NOT NULL,
      "bookingDate" DATETIME NOT NULL,
      "amount" REAL NOT NULL,
      "status" TEXT NOT NULL DEFAULT 'PENDING',
      "notes" TEXT,
      "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `);
}

async function main() {
  await initSchema();
  console.log("Seeding database...");

  // --- Seed Users ----------------------------------------------
  const adminPass = await bcrypt.hash("123456", 12);
  const agentPass = await bcrypt.hash("agent123", 12);

  const admin = await prisma.user.upsert({
    where: { email: "admin@gmail.com" },
    update: {
      passwordHash: adminPass,
    },
    create: {
      name: "Rajesh Sharma",
      email: "admin@gmail.com",
      passwordHash: adminPass,
      role: "ADMIN",
    },
  });

  const agent1 = await prisma.user.upsert({
    where: { email: "priya@recrm.com" },
    update: {},
    create: {
      name: "Priya Mehta",
      email: "priya@recrm.com",
      passwordHash: agentPass,
      role: "AGENT",
    },
  });

  const agent2 = await prisma.user.upsert({
    where: { email: "arjun@recrm.com" },
    update: {},
    create: {
      name: "Arjun Patel",
      email: "arjun@recrm.com",
      passwordHash: agentPass,
      role: "AGENT",
    },
  });

  console.log("Users seeded:", admin.name, agent1.name, agent2.name);

  // --- Seed Properties -----------------------------------------
  const p1 = await prisma.property.upsert({
    where: { id: "prop-seed-1" },
    update: {},
    create: {
      id: "prop-seed-1",
      name: "Greenview Residences",
      location: "Whitefield, Bangalore",
      type: "APARTMENTS",
      status: "UNDER_CONSTRUCTION",
      price: 12500000,
      priceLabel: "1.25 Cr",
      bedrooms: "2, 3 & 4 BHK",
      area: "1,250 - 2,400 sq.ft",
      description: "Premium eco-friendly residential towers with rooftop infinity pool.",
      totalUnits: 120,
      availableUnits: 42,
      possessionDate: "Dec 2026",
    },
  });

  const p2 = await prisma.property.upsert({
    where: { id: "prop-seed-2" },
    update: {},
    create: {
      id: "prop-seed-2",
      name: "Sky Heights Phase 2",
      location: "Indiranagar, Bangalore",
      type: "APARTMENTS",
      status: "UNDER_CONSTRUCTION",
      price: 24500000,
      priceLabel: "2.45 Cr",
      bedrooms: "3 & 4 BHK",
      area: "2,100 - 3,600 sq.ft",
      description: "Ultra-luxury sky villas with private decks and smart home automation.",
      totalUnits: 80,
      availableUnits: 12,
      possessionDate: "Aug 2027",
    },
  });

  const p3 = await prisma.property.upsert({
    where: { id: "prop-seed-3" },
    update: {},
    create: {
      id: "prop-seed-3",
      name: "Emerald Villas",
      location: "Sarjapur Road, Bangalore",
      type: "VILLAS",
      status: "READY_TO_MOVE",
      price: 38000000,
      priceLabel: "3.8 Cr",
      bedrooms: "4 & 5 BHK",
      area: "3,200 - 5,000 sq.ft",
      description: "Independent luxury villas with private gardens and pool.",
      totalUnits: 40,
      availableUnits: 8,
      possessionDate: "Ready",
    },
  });

  console.log("Properties seeded:", p1.name, p2.name, p3.name);

  // --- Seed Leads ----------------------------------------------
  const l1 = await prisma.lead.upsert({
    where: { id: "lead-seed-1" },
    update: {},
    create: {
      id: "lead-seed-1",
      name: "Siddharth Kapoor",
      email: "siddharth.k@gmail.com",
      phone: "+91 98123 45678",
      source: "WEBSITE",
      status: "INTERESTED",
      assignedTo: agent1.id,
      project: "Greenview Residences",
      budget: "1.2 Cr - 1.5 Cr",
      notes: "Looking for a 3BHK, prefers north-facing.",
      urgent: true,
    },
  });

  const l2 = await prisma.lead.upsert({
    where: { id: "lead-seed-2" },
    update: {},
    create: {
      id: "lead-seed-2",
      name: "Meera Nair",
      email: "meera.nair@outlook.com",
      phone: "+91 87654 32109",
      source: "MAGICBRICKS",
      status: "SITE_VISIT",
      assignedTo: agent2.id,
      project: "Emerald Villas",
      budget: "3.5 Cr - 4 Cr",
      notes: "Site visit scheduled for next Saturday.",
    },
  });

  const l3 = await prisma.lead.upsert({
    where: { id: "lead-seed-3" },
    update: {},
    create: {
      id: "lead-seed-3",
      name: "Vikram Reddy",
      email: "vikram.r@yahoo.com",
      phone: "+91 99887 76655",
      source: "REFERRAL",
      status: "BOOKED",
      assignedTo: agent1.id,
      project: "Sky Heights Phase 2",
      budget: "2.4 Cr - 2.8 Cr",
      notes: "Booking confirmed. Documentation in progress.",
    },
  });

  console.log("Leads seeded:", l1.name, l2.name, l3.name);

  // --- Seed Booking --------------------------------------------
  const b1 = await prisma.booking.upsert({
    where: { id: "booking-seed-1" },
    update: {},
    create: {
      id: "booking-seed-1",
      leadId: l3.id,
      propertyId: p2.id,
      bookingDate: new Date("2026-09-15"),
      amount: 24500000,
      status: "CONFIRMED",
      notes: "3BHK unit on 12th floor. Token amount paid.",
    },
  });

  console.log("Bookings seeded:", b1.id);
  console.log("\nDatabase seeded successfully!");
  console.log("Admin Login: admin@gmail.com / 123456");
  console.log("Agent Login: priya@recrm.com / agent123");
}

main()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
