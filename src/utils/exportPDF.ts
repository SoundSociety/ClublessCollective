import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { fmt } from "./currency";
import type { Inputs, Results } from "../types";

/**
 * Generates a one-page, invoice-style PDF for the Clubless Profit Calculator.
 */
export function exportInvoicePDF(inputs: Inputs, r: Results) {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();

  // Colors
  const text = [35, 35, 40];
  const accent = [110, 231, 249];
  const headerBg = [245, 247, 250];

  // Header
  doc.setFillColor(headerBg[0], headerBg[1], headerBg[2]);
  doc.rect(0, 0, pageWidth, 26, "F");

  doc.setFont("helvetica", "bold");
  doc.setTextColor(text[0], text[1], text[2]);
  doc.setFontSize(16);
  doc.text("Clubless Collective – Profit Report", 12, 15);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 110);
  doc.text("Seattle, WA", 12, 21);

  const generated = new Date().toLocaleString();
  doc.setTextColor(120, 120, 130);
  doc.text(`Generated: ${generated}`, pageWidth - 12, 10, { align: "right" });

  // Accent line
  doc.setDrawColor(accent[0], accent[1], accent[2]);
  doc.setLineWidth(0.8);
  doc.line(12, 28, pageWidth - 12, 28);

  // Derived staffing pay
  const bartenderPay = inputs.bartenderBill * (1 - inputs.staffingDiscountPct / 100);
  const securityPay  = inputs.securityBill  * (1 - inputs.staffingDiscountPct / 100);

  // Event Summary
  doc.setTextColor(text[0], text[1], text[2]);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("Event Summary", 12, 36);

  autoTable(doc, {
    startY: 40,
    theme: "grid",
    styles: { fontSize: 10, textColor: text, halign: "left" },
    headStyles: { fillColor: [60, 60, 70], textColor: [255, 255, 255] },
    columnStyles: {
      0: { cellWidth: 70 },
      1: { cellWidth: pageWidth - 24 - 70 }
    },
    head: [["Metric", "Value"]],
    body: [
      ["Max Occupancy", String(inputs.maxOccupancy)],
      ["Expected Attendance %", `${inputs.attendancePercent}%`],
      ["Attendees (derived)", String(r.attendees)],
      ["% Drinkers", `${inputs.percentDrinkers}%`],
      ["% Eating", `${inputs.percentEating}%`],
      ["Ticket Price", fmt(inputs.ticketPrice)],
      ["Eventbrite Fee / Ticket", fmt(inputs.eventbriteFeePerTicket)],
      ["Avg Drink Price", fmt(inputs.avgDrinkPrice)],
      ["Avg Food Price", fmt(inputs.avgFoodPrice)],
      ["Toast Fee", `${inputs.toastPercent}% + ${fmt(inputs.toastFixed)}`],
      ["COGS (Drinks / Food)", `${inputs.drinkCogsPct}% / ${inputs.foodCogsPct}%`],
      [
        "Staffing",
        `Bartenders: ${inputs.numBartenders} (~${fmt(bartenderPay)}/hr pay, ${fmt(inputs.bartenderBill)}/hr bill); ` +
        `Security: ${inputs.numSecurity} (~${fmt(securityPay)}/hr pay, ${fmt(inputs.securityBill)}/hr bill); ` +
        `Hours: ${inputs.eventHours}`
      ],
      ["Staffing Discount", `${inputs.staffingDiscountPct}% less than bill`],
      ["Splits", `Artist ${Math.round(inputs.artistSplit * 100)}% / Clubless ${Math.round(inputs.clublessSplit * 100)}%`],
      ["Venue Cost", fmt(inputs.venueCost)],
      [
        "Other Costs (sum)",
        fmt(inputs.otherCosts.reduce((s, c) => s + (isFinite(Number(c.amount)) ? Number(c.amount) : 0), 0))
      ]
    ]
  });

  const y1 = (doc as any).lastAutoTable.finalY + 8;

  // Revenue & COGS
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("Revenue & COGS", 12, y1);

  autoTable(doc, {
    startY: y1 + 4,
    theme: "striped",
    styles: { fontSize: 10, textColor: text, halign: "left" },
    headStyles: { fillColor: [60, 60, 70], textColor: [255, 255, 255] },
    head: [["Category", "Amount"]],
    body: [
      ["Ticket Revenue (net of Eventbrite)", fmt(r.ticketRevenue)],
      ["Drink Revenue (net)", fmt(r.netDrinkRevenue)],
      ["Food Revenue (net)", fmt(r.netFoodRevenue)],
      [{ content: "Total Revenue", styles: { fontStyle: "bold" } }, fmt(r.totalRevenue)],
      ["Drink COGS", fmt(r.drinkCOGS)],
      ["Food COGS", fmt(r.foodCOGS)],
      [{ content: "Total COGS", styles: { fontStyle: "bold" } }, fmt(r.totalCOGS)],
      [{ content: "Net Revenue", styles: { fontStyle: "bold" } }, fmt(r.netRevenue)]
    ],
    columnStyles: { 1: { halign: "right" } }
  });

  const y2 = (doc as any).lastAutoTable.finalY + 8;

  // Splits & Totals
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("Splits & Totals", 12, y2);

  autoTable(doc, {
    startY: y2 + 4,
    theme: "grid",
    styles: { fontSize: 10, textColor: text },
    headStyles: { fillColor: [60, 60, 70], textColor: [255, 255, 255] },
    columnStyles: { 1: { halign: "right" } },
    head: [["Share", "Amount"]],
    body: [
      ["Artist Earnings", fmt(r.artistEarnings)],
      ["Clubless Base (split)", fmt(r.clublessBase)],
      ["Bartender Margin", fmt(r.bartenderMargin)],
      ["Security Margin", fmt(r.securityMargin)],
      [{ content: "Clubless Total", styles: { fontStyle: "bold" } }, fmt(r.clublessTotal)]
    ]
  });

  // Footer
  const footerY = Math.max((doc as any).lastAutoTable.finalY + 8, 285);
  doc.setDrawColor(220, 220, 225);
  doc.line(12, footerY, pageWidth - 12, footerY);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(120, 120, 130);
  doc.text("Generated by Clubless Profit Calculator • Clubless Collective (Seattle)", 12, footerY + 6);

  doc.save("Clubless_Profit_Report.pdf");
}
