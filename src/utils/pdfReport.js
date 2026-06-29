import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

export function generatePDFReport(issues) {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(28);
  doc.setTextColor(99, 102, 241);
  doc.text("CIVIQ", margin, 25);

  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text("Civic Issue Reporting Platform", margin, 31);

  doc.setDrawColor(99, 102, 241);
  doc.setLineWidth(0.5);
  doc.line(margin, 33, pageWidth - margin, 33);

  const now = new Date();
  const dateStr = now.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
  const timeStr = now.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });

  doc.setFontSize(9);
  doc.setTextColor(120);
  doc.text(`Generated: ${dateStr} at ${timeStr}`, margin, 40);
  doc.text(`Total Issues: ${issues.length}`, pageWidth - margin, 40, { align: "right" });

  const stats = {
    total: issues.length,
    reported: issues.filter((i) => i.status === "Reported").length,
    verified: issues.filter((i) => i.status === "Verified").length,
    inProgress: issues.filter((i) => i.status === "In Progress").length,
    resolved: issues.filter((i) => i.status === "Resolved").length,
  };

  const categories = {};
  issues.forEach((i) => {
    categories[i.category] = (categories[i.category] || 0) + 1;
  });

  const topCategories = Object.entries(categories)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  let yPos = 50;

  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(30);
  doc.text("Summary Statistics", margin, yPos);
  yPos += 8;

  const statLabels = [
    ["Total Issues", stats.total.toString()],
    ["Reported", stats.reported.toString()],
    ["Verified", stats.verified.toString()],
    ["In Progress", stats.inProgress.toString()],
    ["Resolved", stats.resolved.toString()],
  ];

  autoTable(doc, {
    startY: yPos,
    head: [["Metric", "Count"]],
    body: statLabels,
    theme: "striped",
    headStyles: { fillColor: [99, 102, 241], textColor: 255, fontStyle: "bold" },
    bodyStyles: { textColor: 30 },
    alternateRowStyles: { fillColor: [245, 245, 250] },
    margin: { left: margin, right: margin },
    tableWidth: "auto",
  });

  yPos = doc.lastAutoTable.finalY + 8;

  if (topCategories.length > 0) {
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(30);
    doc.text("Top Categories", margin, yPos);
    yPos += 8;

    const catBody = topCategories.map(([cat, count]) => [cat, count.toString()]);
    autoTable(doc, {
      startY: yPos,
      head: [["Category", "Count"]],
      body: catBody,
      theme: "striped",
      headStyles: { fillColor: [99, 102, 241], textColor: 255, fontStyle: "bold" },
      bodyStyles: { textColor: 30 },
      alternateRowStyles: { fillColor: [245, 245, 250] },
      margin: { left: margin, right: margin },
      tableWidth: "auto",
    });
    yPos = doc.lastAutoTable.finalY + 8;
  }

  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(30);
  doc.text("All Issues", margin, yPos);
  yPos += 8;

  const issueBody = issues.map((issue) => [
    issue.title.substring(0, 40),
    issue.category,
    issue.status,
    `S${issue.severity}`,
    issue.upvotes.toString(),
    issue.location.substring(0, 30),
    new Date(issue.created_at).toLocaleDateString("en-IN"),
  ]);

  autoTable(doc, {
    startY: yPos,
    head: [["Title", "Category", "Status", "Severity", "Upvotes", "Location", "Date"]],
    body: issueBody,
    theme: "striped",
    headStyles: {
      fillColor: [99, 102, 241],
      textColor: 255,
      fontStyle: "bold",
      fontSize: 7,
    },
    bodyStyles: {
      textColor: 30,
      fontSize: 7,
      cellPadding: 2,
    },
    alternateRowStyles: { fillColor: [245, 245, 250] },
    margin: { left: margin, right: margin },
    columnStyles: {
      0: { cellWidth: 35 },
      1: { cellWidth: 22 },
      2: { cellWidth: 22 },
      3: { cellWidth: 15 },
      4: { cellWidth: 15 },
      5: { cellWidth: 30 },
      6: { cellWidth: 25 },
    },
    didDrawPage: () => {
      const pageCount = doc.getNumberOfPages();
      doc.setFontSize(8);
      doc.setTextColor(150);
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.text(
          `Page ${i} of ${pageCount}  |  Civiq Civic Platform`,
          pageWidth / 2,
          doc.internal.pageSize.getHeight() - 10,
          { align: "center" }
        );
      }
    },
  });

  doc.save(`civiq-report-${now.toISOString().split("T")[0]}.pdf`);
}