import puppeteer from 'puppeteer';
import { readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';

const resume = JSON.parse(readFileSync('/tmp/resume-builder/resume.json', 'utf-8'));

// Embed photo as base64
let photoBase64 = '';
try {
  const photoData = readFileSync('/tmp/resume-builder/mypicture.jpg');
  photoBase64 = `data:image/jpeg;base64,${photoData.toString('base64')}`;
} catch(e) {}

const formatDate = (d) => {
  if (!d) return 'Present';
  const [y, m] = d.split('-');
  const months = ['','Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  return m ? `${months[parseInt(m)]} ${y}` : y;
};

const GREEN       = '#2e7d32';
const GREEN_MID   = '#43a047';
const GREEN_LIGHT = '#e8f5e9';
const SIDEBAR_BG  = '#1a1a1a';

const dayItems = [
  { label: 'A', text: 'Community Engagement to address the questions and requirements from internal users and data platform consumers' },
  { label: 'B', text: 'Code reviews and Pair programming' },
  { label: 'C', text: 'Teams Q&A and knowledge sharing' },
  { label: 'D', text: 'Collaborating with business squads and product owners to define new features, align on priorities, and support product release planning' },
];

// SVG donut chart – 4 segments, varying shades of green
// Segments: A=30%, B=25%, C=20%, D=25% (approx visual proportions from screenshot)
function polarToCartesian(cx, cy, r, angleDeg) {
  const rad = (angleDeg - 90) * Math.PI / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}
function arcPath(cx, cy, outerR, innerR, startAngle, endAngle) {
  const o1 = polarToCartesian(cx, cy, outerR, startAngle);
  const o2 = polarToCartesian(cx, cy, outerR, endAngle);
  const i1 = polarToCartesian(cx, cy, innerR, endAngle);
  const i2 = polarToCartesian(cx, cy, innerR, startAngle);
  const large = (endAngle - startAngle) > 180 ? 1 : 0;
  return `M ${o1.x} ${o1.y} A ${outerR} ${outerR} 0 ${large} 1 ${o2.x} ${o2.y} L ${i1.x} ${i1.y} A ${innerR} ${innerR} 0 ${large} 0 ${i2.x} ${i2.y} Z`;
}

const cx = 100, cy = 100, outerR = 70, innerR = 38, gap = 3;
const segments = [
  { label: 'A', pct: 30, color: '#388e3c' },
  { label: 'B', pct: 25, color: '#66bb6a' },
  { label: 'C', pct: 20, color: '#81c784' },
  { label: 'D', pct: 25, color: '#a5d6a7' },
];
let cumAngle = 0;
const svgSegments = segments.map(s => {
  const start = cumAngle + gap / 2;
  const end = cumAngle + (s.pct / 100) * 360 - gap / 2;
  cumAngle += (s.pct / 100) * 360;
  const midAngle = (start + end) / 2;
  // label position outside ring
  const lp = polarToCartesian(cx, cy, outerR + 14, midAngle);
  const lp2 = polarToCartesian(cx, cy, outerR + 4, midAngle);
  return `
    <path d="${arcPath(cx, cy, outerR, innerR, start, end)}" fill="${s.color}" />
    <line x1="${lp2.x}" y1="${lp2.y}" x2="${lp.x - (lp.x > cx ? 2 : -2)}" y2="${lp.y}" stroke="#aaa" stroke-width="0.8"/>
    <circle cx="${lp.x}" cy="${lp.y}" r="8" fill="${GREEN}" />
    <text x="${lp.x}" y="${lp.y + 3.5}" text-anchor="middle" font-size="8" font-weight="700" fill="white">${s.label}</text>
  `;
}).join('');

const donutSVG = `<svg width="200" height="200" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
  ${svgSegments}
</svg>`;

const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Segoe UI', Arial, sans-serif; color: #1a1a1a; background: white; font-size: 9.5pt; line-height: 1.5; }
  .layout { display: flex; min-height: 100vh; }

  .sidebar { width: 220px; min-width: 220px; background: ${SIDEBAR_BG}; color: #fff; padding: 28px 20px; }
  .sidebar-photo { width: 120px; height: 120px; border-radius: 50%; overflow: hidden; margin: 0 auto 20px; border: 3px solid ${GREEN_MID}; }
  .sidebar-photo img { width: 100%; height: 100%; object-fit: cover; object-position: center top; }
  .sidebar-photo-initials { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; background: #333; font-size: 28pt; font-weight: 700; color: ${GREEN_MID}; }

  .sidebar-section { margin-bottom: 18px; }
  .sidebar-title { font-size: 8.5pt; font-weight: 700; color: ${GREEN_MID}; text-transform: uppercase; letter-spacing: 1.5px; border-bottom: 1px solid #333; padding-bottom: 4px; margin-bottom: 8px; }
  .contact-item { font-size: 7.5pt; color: #ccc; margin-bottom: 4px; word-break: break-all; }
  .contact-icon { color: ${GREEN_MID}; margin-right: 4px; }
  .skill-group { margin-bottom: 8px; }
  .skill-group-name { font-size: 8.5pt; font-weight: 700; color: #fff; margin-bottom: 2px; }
  .skill-keywords { font-size: 7.5pt; color: #aaa; }
  .cert-item { font-size: 7.5pt; color: #ccc; margin-bottom: 4px; padding-left: 10px; position: relative; }
  .cert-item::before { content: '✓'; color: ${GREEN_MID}; position: absolute; left: 0; font-weight: bold; }

  .main { flex: 1; padding: 28px 30px; }
  .main-header { margin-bottom: 18px; padding-bottom: 12px; border-bottom: 3px solid ${GREEN}; }
  .main-header h1 { font-size: 22pt; font-weight: 700; letter-spacing: 0.5px; color: #1a1a1a; }
  .main-header .label { font-size: 9.5pt; color: #fff; font-weight: 600; margin-top: 4px; background: ${GREEN}; display: inline-block; padding: 3px 12px; border-radius: 3px; }

  .section { margin-bottom: 16px; }
  .section-title { font-size: 10pt; font-weight: 700; color: ${GREEN}; text-transform: uppercase; letter-spacing: 1px; border-bottom: 1px solid #dcedc8; padding-bottom: 3px; margin-bottom: 8px; display: flex; align-items: center; gap: 6px; }
  .section-title::before { content: ''; display: inline-block; width: 3px; height: 14px; background: ${GREEN}; border-radius: 2px; }
  .summary { font-size: 8.5pt; color: #444; line-height: 1.6; }

  .job { margin-bottom: 12px; }
  .job-header { display: flex; justify-content: space-between; align-items: baseline; }
  .company { font-weight: 700; font-size: 10pt; color: #1a1a1a; }
  .location { font-size: 8pt; color: #888; }
  .role-row { display: flex; justify-content: space-between; margin-top: 1px; margin-bottom: 3px; }
  .role { font-size: 9pt; color: #555; font-style: italic; }
  .dates { font-size: 8pt; color: #999; }
  ul { padding-left: 14px; }
  ul li { font-size: 8pt; color: #444; margin-bottom: 1px; }

  /* Day of my life */
  .page2 { display: flex; page-break-before: always; }
  .day-item { display: flex; align-items: flex-start; gap: 10px; margin-bottom: 12px; }
  .day-badge { width: 22px; height: 22px; min-width: 22px; border-radius: 50%; background: ${GREEN}; color: white; font-weight: 700; font-size: 8pt; display: flex; align-items: center; justify-content: center; }
  .day-text { font-size: 9pt; color: #444; line-height: 1.5; }
</style>
</head>
<body>
<div class="layout">

  <div class="sidebar">
    <div class="sidebar-photo">
      ${photoBase64
        ? `<img src="${photoBase64}" />`
        : `<div class="sidebar-photo-initials">RK</div>`}
    </div>

    <div class="sidebar-section">
      <div class="sidebar-title">Contacts</div>
      <div class="contact-item"><span class="contact-icon">✆</span>${resume.basics.phone}</div>
      <div class="contact-item"><span class="contact-icon">@</span>${resume.basics.email}</div>
      <div class="contact-item"><span class="contact-icon">🌐</span>${resume.basics.url}</div>
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

    <div class="sidebar-section">
      <div class="sidebar-title">A Day of My Life</div>
      <div style="display:flex; justify-content:center; margin-bottom:10px;">${donutSVG}</div>
      ${dayItems.map(item => `
      <div class="day-item" style="margin-bottom:8px;">
        <div class="day-badge">${item.label}</div>
        <div class="day-text" style="color:#ccc; font-size:7.5pt; line-height:1.4;">${item.text}</div>
      </div>`).join('')}
    </div>

  </div>

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
        <ul>${job.highlights.map(h => `<li>${h}</li>`).join('')}</ul>
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
