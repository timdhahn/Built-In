import jsPDF from 'jspdf';
import { Bay, SpaceEnvelope } from '@/domain/model';
import { Mm } from '@/domain/units/types';
import { Unit } from '@/domain/units/types';
import { formatDimension } from '@/domain/units/format';
import { BomLineItem } from '@/domain/model/bom';

export function generatePdf(
  envelope: SpaceEnvelope,
  bays: Bay[],
  bom: BomLineItem[],
  projectName: string,
  displayUnit: Unit,
) {
  const doc = new jsPDF('landscape', 'mm', 'a4');
  const pageW = 297;
  const pageH = 210;
  const margin = 15;

  // Title block
  doc.setFontSize(16);
  doc.text(projectName, margin, margin + 5);
  doc.setFontSize(10);
  doc.text(
    `${formatDimension(envelope.width as Mm, displayUnit)} x ${formatDimension(envelope.height as Mm, displayUnit)} x ${formatDimension(envelope.depth as Mm, displayUnit)}`,
    margin,
    margin + 12,
  );
  doc.text(`${envelope.wallType} | ${bays.length} bays`, margin, margin + 18);
  doc.text(new Date().toLocaleDateString(), pageW - margin, margin + 5, { align: 'right' });

  // Elevation drawing area
  const drawY = margin + 25;
  const drawW = pageW - margin * 2;
  const drawH = pageH - drawY - margin - 10;

  const envW = envelope.width as number;
  const envH = envelope.height as number;
  const scale = Math.min(drawW / envW, drawH / envH);
  const offsetX = margin + (drawW - envW * scale) / 2;
  const offsetY = drawY + (drawH - envH * scale) / 2;

  // Envelope outline
  doc.setDrawColor(100);
  doc.setLineWidth(0.5);
  doc.rect(offsetX, offsetY, envW * scale, envH * scale);

  // Bays and modules
  let bayX = 0;
  for (const bay of bays) {
    const bw = (bay.width as number) * scale;

    // Bay divider
    doc.setDrawColor(180);
    doc.setLineWidth(0.2);
    doc.line(offsetX + bayX + bw, offsetY, offsetX + bayX + bw, offsetY + envH * scale);

    // Modules
    for (const mod of bay.modules) {
      const mx = offsetX + bayX + (mod.x as number) * scale + 1;
      const my = offsetY + envH * scale - ((mod.y as number) + (mod.height as number)) * scale + 1;
      const mw = (mod.width as number) * scale - 2;
      const mh = (mod.height as number) * scale - 2;

      doc.setDrawColor(100);
      doc.setFillColor(240, 240, 250);
      doc.roundedRect(mx, my, mw, mh, 1, 1, 'FD');

      doc.setFontSize(6);
      doc.text(mod.type.replace('-', ' '), mx + mw / 2, my + mh - 2, { align: 'center' });
    }

    bayX += bay.width as number;
  }

  // BOM on page 2
  if (bom.length > 0) {
    doc.addPage();
    doc.setFontSize(14);
    doc.text('Bill of Materials', margin, margin + 5);

    const headers = ['Part', 'Material', 'Qty', 'Unit Cost', 'Total'];
    const colWidths = [50, 70, 20, 30, 30];
    let tableY = margin + 15;

    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    let tableX = margin;
    for (let i = 0; i < headers.length; i++) {
      doc.text(headers[i], tableX, tableY);
      tableX += colWidths[i];
    }

    doc.setFont('helvetica', 'normal');
    for (const item of bom) {
      tableY += 5;
      if (tableY > pageH - margin) break;

      tableX = margin;
      doc.text(item.partName, tableX, tableY);
      tableX += colWidths[0];
      doc.text(item.material.substring(0, 30), tableX, tableY);
      tableX += colWidths[1];
      doc.text(String(item.quantity), tableX, tableY);
      tableX += colWidths[2];
      doc.text(`$${item.unitCost.toFixed(2)}`, tableX, tableY);
      tableX += colWidths[3];
      doc.text(`$${item.totalCost.toFixed(2)}`, tableX, tableY);
    }

    const total = bom.reduce((sum, item) => sum + item.totalCost, 0);
    tableY += 8;
    doc.setFont('helvetica', 'bold');
    doc.text(`Total: $${total.toFixed(2)}`, margin + colWidths[0] + colWidths[1] + colWidths[2], tableY);
  }

  doc.save(`${projectName.replace(/\s+/g, '-').toLowerCase()}.pdf`);
}
