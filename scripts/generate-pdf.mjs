import puppeteer from 'puppeteer';
import { readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';

const resume = JSON.parse(readFileSync('/tmp/resume-builder/resume.json', 'utf-8'));

const formatDate = (d) => {
  if (!d) return 'Present';
  const [y, m] = d.split('-');
  const months = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return m ? `${months[parseInt(m)]} ${y}` : y;
};

const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Segoe UI', Arial, sans-serif; color: #1a1a1a; background: white; font-size: 10pt; line-height: 1.5; }
  .page { max-width: 800px; margin: 0 auto; padding: 36px 48px; }
  .header { border-bottom: 3px solid #d97757; padding-bottom: 16px; margin-bottom: 20px; }
  .header h1 { font-size: 24pt; font-weight: 700; letter-spacing: 1px; color: #1a1a1a; }
  .header .label { font-size: 11pt; color: #d97757; font-weight: 600; margin-top: 2px; }
  .contact-row { display: flex; flex-wrap: wrap; gap: 16px; margin-top: 8px; font-size: 9pt; color: #555; }
  .contact-row span::before { content: '• '; color: #d97757; }
  .section { margin-bottom: 20px; }
  .section-title { font-size: 11pt; font-weight: 700; color: #d97757; text-transform: uppercase; letter-spacing: 1px; border-bottom: 1px solid #eae5dc; padding-bottom: 4px; margin-bottom: 10px; }
  .summary { color: #444; font-size: 9.5pt; }
  .job { margin-bottom: 14px; }
  .job-header { display: flex; justify-content: space-between; align-items: baseline; }
  .company { font-weight: 700; font-size: 10.5pt; }
  .location { font-size: 9pt; color: #777; }
  .role-row { display: flex; justify-content: space-between; margin-top: 1px; }
  .role { font-size: 9.5pt; color: #444; font-style: italic; }
  .dates { font-size: 9pt; color: #888; }
  ul { padding-left: 16px; margin-top: 5px; }
  ul li { font-size: 9pt; color: #444; margin-bottom: 2px; }
  .skills-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
  .skill-item { font-size: 9pt; }
  .skill-name { font-weight: 600; color: #1a1a1a; }
  .skill-keywords { color: #555; }
  .certs { columns: 2; gap: 20px; }
  .cert { font-size: 9pt; color: #444; margin-bottom: 4px; break-inside: avoid; }
  .cert::before { content: '✓ '; color: #d97757; font-weight: bold; }
</style>
</head>
<body>
<div class="page">
  <div class="header">
    <h1>${resume.basics.name}</h1>
    <div class="label">${resume.basics.label}</div>
    <div class="contact-row">
      <span>${resume.basics.phone}</span>
      <span>${resume.basics.email}</span>
      <span>${resume.basics.url}</span>
      <span>${resume.basics.location.city}, ${resume.basics.location.countryCode}</span>
    </div>
  </div>

  <div class="section">
    <div class="section-title">Summary</div>
    <p class="summary">${resume.basics.summary}</p>
  </div>

  <div class="section">
    <div class="section-title">Experience</div>
    ${resume.work.map(job => `
    <div class="job">
      <div class="job-header">
        <span class="company">${job.name}</span>
        <span class="location">${job.location}</span>
      </div>
      <div class="role-row">
        <span class="role">${job.position}</span>
        <span class="dates">${formatDate(job.startDate)} – ${formatDate(job.endDate)}</span>
      </div>
      <ul>
        ${job.highlights.map(h => `<li>${h}</li>`).join('')}
      </ul>
    </div>`).join('')}
  </div>

  <div class="section">
    <div class="section-title">Skills</div>
    <div class="skills-grid">
      ${resume.skills.map(s => `
      <div class="skill-item">
        <span class="skill-name">${s.name}:</span>
        <span class="skill-keywords">${s.keywords.join(', ')}</span>
      </div>`).join('')}
    </div>
  </div>

  <div class="section">
    <div class="section-title">Certifications</div>
    <div class="certs">
      ${resume.certificates.map(c => `<div class="cert">${c.name}</div>`).join('')}
    </div>
  </div>
</div>
</body>
</html>`;

writeFileSync('/tmp/resume.html', html);

const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
const page = await browser.newPage();
await page.goto('file:///tmp/resume.html', { waitUntil: 'networkidle0' });
await page.pdf({
  path: resolve(process.env.GITHUB_WORKSPACE, 'public/RamuKamath-CV.pdf'),
  format: 'A4',
  printBackground: true,
  margin: { top: '10mm', bottom: '10mm', left: '10mm', right: '10mm' },
});
await browser.close();
console.log('PDF generated successfully');
