import puppeteer from 'puppeteer';
import { createRequire } from 'module';
import { readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';

const require = createRequire(import.meta.url);
const theme = require('jsonresume-theme-even');

const resume = JSON.parse(readFileSync('/tmp/resume-builder/resume.json', 'utf-8'));
const html = theme.render(resume);
writeFileSync('/tmp/resume.html', html);

const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
const page = await browser.newPage();
await page.goto('file:///tmp/resume.html', { waitUntil: 'networkidle0' });
await page.pdf({
  path: resolve(process.env.GITHUB_WORKSPACE, 'public/RamuKamath-CV.pdf'),
  format: 'A4',
  printBackground: true,
});
await browser.close();
console.log('PDF generated successfully');
