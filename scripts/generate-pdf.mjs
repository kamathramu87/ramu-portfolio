import puppeteer from 'puppeteer';
import { readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';

const resume = JSON.parse(readFileSync('/tmp/resume-builder/resume.json', 'utf-8'));

const formatDate = (d) => {
  if (!d) return 'Present';
  const [y, m] = d.split('-');
  const months = ['','Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  return m ? `${months[parseInt(m)]} ${y}` : y;
};

const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Segoe UI', Arial, sans-serif; color: #1a1a1a; background: white; font-size: 9.5pt; line-height: 1.5; }

  .layout { display: flex; min-height: 100vh; }

  /* ── Sidebar ── */
  .sidebar { width: 220px; min-width: 220px; background: #1a1a1a; color: #fff; padding: 28px 20px; }
  .sidebar-photo { width: 120px; height: 120px; border-radius: 50%; overflow: hidden; margin: 0 auto 20px; border: 3px solid #d97757; display: flex; align-items: center; justify-content: center; background: #333; }
  .sidebar-photo-initials { font-size: 32pt; font-weight: 700; color: #d97757; }

  .sidebar-section { margin-bottom: 20px; }
  .sidebar-title { font-size: 8.5pt; font-weight: 700; color: #d97757; text-transform: uppercase; letter-spacing: 1.5px; border-bottom: 1px solid #333; padding-bottom: 4px; margin-bottom: 10px; }

  .contact-item { font-size: 8pt; color: #ccc; margin-bottom: 5px; word-break: break-all; }
  .contact-icon { color: #d97757; margin-right: 4px; }

  .skill-group { margin-bottom: 10px; }
  .skill-group-name { font-size: 8.5pt; font-weight: 700; color: #fff; margin-bottom: 3px; }
  .skill-keywords { font-size: 8pt; color: #aaa; }

  .cert-item { font-size: 8pt; color: #ccc; margin-bottom: 5px; padding-left: 8px; position: relative; }
  .cert-item::before { content: '•'; color: #d97757; position: absolute; left: 0; }

  /* ── Main ── */
  .main { flex: 1; padding: 28px 32px; }

  .main-header { margin-bottom: 20px; padding-bottom: 14px; border-bottom: 3px solid #d97757; }
  .main-header h1 { font-size: 22pt; font-weight: 700; letter-spacing: 0.5px; color: #1a1a1a; }
  .main-header .label { font-size: 10pt; color: #d97757; font-weight: 600; margin-top: 2px; background: #fdf3ef; display: inline-block; padding: 2px 10px; border-radius: 3px; }

  .section { margin-bottom: 18px; }
  .section-title { font-size: 10pt; font-weight: 700; color: #d97757; text-transform: uppercase; letter-spacing: 1px; border-bottom: 1px solid #eae5dc; padding-bottom: 4px; margin-bottom: 10px; display: flex; align-items: center; gap: 6px; }
  .section-title::before { content: ''; display: inline-block; width: 3px; height: 14px; background: #d97757; border-radius: 2px; }

  .summary { font-size: 9pt; color: #444; line-height: 1.6; }

  .job { margin-bottom: 14px; }
  .job-header { display: flex; justify-content: space-between; align-items: baseline; }
  .company { font-weight: 700; font-size: 10pt; color: #1a1a1a; }
  .location { font-size: 8.5pt; color: #888; }
  .role-row { display: flex; justify-content: space-between; margin-top: 1px; margin-bottom: 4px; }
  .role { font-size: 9pt; color: #555; font-style: italic; }
  .dates { font-size: 8.5pt; color: #999; }
  ul { padding-left: 14px; }
  ul li { font-size: 8.5pt; color: #444; margin-bottom: 2px; }
</style>
</head>
<body>
<div class="layout">

  <!-- Sidebar -->
  <div class="sidebar">
    <div class="sidebar-photo">
      <span class="sidebar-photo-initials">RK</span>
    </div>

    <div class="sidebar-section">
      <div class="sidebar-title">Contacts</div>
      <div class="contact-item"><span class="contact-icon">✆</span>${resume.basics.phone}</div>
      <div class="contact-item"><span class="contact-icon">@</span>${resume.basics.email}</div>
      <div class="contact-item"><span class="contact-icon">🔗</span>linkedin.com/in/ramu-k-b5b40499</div>
      <div class="contact-item"><span class="contact-icon">⌂</span>${resume.basics.location.city}, ${resume.basics.location.countryCode}</div>
    </div>

    <div class="sidebar-section">
      <div class="sidebar-title">Skills</div>
      ${resume.skills.map(s => `
      <div class="skill-group">
        <div class="skill-group-name">${s.name}</div>
        <div class="skill-keywords">${s.keywords.join(' · ')}</div>
      </div>`).join('')}
    </div>

    <div class="sidebar-section">
      <div class="sidebar-title">Certifications</div>
      ${resume.certificates.map(c => `<div class="cert-item">${c.name}</div>`).join('')}
    </div>
  </div>

  <!-- Main Content -->
  <div class="main">
    <div class="main-header">
      <h1>${resume.basics.name}</h1>
      <div class="label">${resume.basics.label}</div>
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
  margin: { top: '0', bottom: '0', left: '0', right: '0' },
});
await browser.close();
console.log('PDF generated successfully');
