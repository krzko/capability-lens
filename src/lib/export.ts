import { format } from 'date-fns';
import { marked } from 'marked';
import { jsPDF } from 'jspdf';
import { toPng } from 'html-to-image';
import type { Assessment } from '@/hooks/useMaturityAssessment';

export type ExportFormat = 'markdown' | 'html' | 'pdf';

export function generateAssessmentReport(assessment: Assessment, format: ExportFormat = 'markdown'): string {
  const date = format(new Date(assessment.createdAt), 'MMMM d, yyyy');
  const scores = Object.values(assessment.scores);
  const averageScore = scores.reduce((a, b) => a + b, 0) / scores.length;

  let report = `# ${assessment.template.name} Assessment Report
Generated on: ${date}

## Overview
Overall Maturity Score: ${averageScore.toFixed(1)} / 5.0

## Detailed Scores

`;

  assessment.template.facets.forEach((facet) => {
    const score = assessment.scores[facet.id] || 0;
    const level = facet.levels.find((l) => l.number === score);

    report += `### ${facet.name}
Score: ${score} / 5 - ${level?.name}
${facet.description || ''}

Current Level Description:
${level?.description || 'No description available'}

`;
  });

  report += `\n## Recommendations\n\n`;

  assessment.template.facets.forEach((facet) => {
    const currentScore = assessment.scores[facet.id] || 0;
    const nextLevel = facet.levels.find((l) => l.number === currentScore + 1);

    if (nextLevel) {
      report += `### ${facet.name} (Current: Level ${currentScore})
To reach Level ${nextLevel.number} (${nextLevel.name}):
${nextLevel.description}

`;
    }
  });

  if (format === 'html') {
    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${assessment.template.name} Assessment Report</title>
  <style>
    body {
      font-family: system-ui, -apple-system, sans-serif;
      line-height: 1.5;
      max-width: 800px;
      margin: 0 auto;
      padding: 2rem;
    }
    h1, h2, h3 { color: #2563eb; }
    .score { font-weight: bold; }
    .recommendations { background: #f3f4f6; padding: 1rem; border-radius: 0.5rem; }
  </style>
</head>
<body>
  ${marked(report)}
</body>
</html>`;
    return html;
  }

  return report;
}

async function generatePDF(content: string, filename: string) {
  // Create a temporary container for the HTML content
  const container = document.createElement('div');
  container.innerHTML = content;
  container.style.width = '800px';
  document.body.appendChild(container);

  try {
    // Convert the HTML to an image
    const image = await toPng(container, { quality: 0.95 });

    // Create PDF
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'px',
      format: 'a4',
    });

    // Add the image to the PDF
    const imgProps = pdf.getImageProperties(image);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    pdf.addImage(image, 'PNG', 0, 0, pdfWidth, pdfHeight);

    // Save the PDF
    pdf.save(filename);
  } finally {
    // Clean up
    document.body.removeChild(container);
  }
}

export async function exportAssessment(assessment: Assessment, format: ExportFormat = 'markdown') {
  const baseFilename = `${assessment.template.name.toLowerCase().replace(/\s+/g, '-')}-assessment-${format(new Date(assessment.createdAt), 'yyyy-MM-dd')}`;
  const content = generateAssessmentReport(assessment, format);

  switch (format) {
    case 'markdown':
      downloadFile(content, `${baseFilename}.md`, 'text/markdown;charset=utf-8');
      break;

    case 'html':
      downloadFile(content, `${baseFilename}.html`, 'text/html;charset=utf-8');
      break;

    case 'pdf':
      await generatePDF(content, `${baseFilename}.pdf`);
      break;
  }
}

function downloadFile(content: string, filename: string, type: string) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
