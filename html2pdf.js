function exportPDF(id) {
  const el = document.getElementById(`filament-${id}`);
  html2pdf().from(el).save(`filament-${id}.pdf`);
}
