import React from 'react';
import { getEmoji } from '../utils/emoji';
import { exportFullJournal, downloadPlaceholderFile, printDashboard } from '../utils/data-helpers';
import { UserData } from '../types';

interface SettingsViewProps {
  userData: UserData;
}

const SettingsView: React.FC<SettingsViewProps> = ({ userData }) => {
  const handleDownloadManifest = () => {
    const manifestContent = `{
  "name": "PMAction & Shared Space",
  "short_name": "PMActionSS",
  "description": "Personal Wellness & Communication Tracker",
  "start_url": ".",
  "display": "standalone",
  "background_color": "#1f2937",
  "theme_color": "#0d9488",
  "icons": [
    {
      "src": "/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}`;
    downloadPlaceholderFile('manifest.json', manifestContent, 'application/json');
  };

  const handleDownloadServiceWorker = () => {
    const swContent = `// This is a placeholder service worker file.
// In a real application, this would handle caching, offline capabilities, etc.
console.log('Service Worker placeholder registered.');

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('app-cache-v1').then((cache) => {
      return cache.addAll([
        '/',
        '/index.html',
        // Add other static assets here for offline access
      ]);
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});`;
    downloadPlaceholderFile('service-worker.js', swContent, 'application/javascript');
  };

  const handleDownloadReadme = () => {
    const readmeContent = `# PMAction & Shared Space - Personal Wellness & Communication Tracker

This is a combined web application for personal wellness tracking (habits, programs, feelings) and mindful communication (discussion topics, appreciation, boundaries, quotes, timer).

## Features
- Personal Wellness Tracker (PMAction):
  - Feelings check-ins
  - Daily habit tracking with streaks
  - Guided training programs
- Communication Tracker (Shared Space):
  - Discussion topic management
  - Daily 15-minute discussion timer with audio alerts
  - Communication ground rules and reminders
  - Logs for appreciation, accomplishments, boundaries, and quotes
- All data stored locally in your browser.

## Technologies Used
- React
- TypeScript
- Tailwind CSS

## How to Use
1. Enter your name on the welcome screen.
2. Navigate through the dashboard, programs, topics, and logs.
3. Use the timer for focused discussions.
4. Export your data from the settings.

## Development
This application is built as a single-page application.
`;
    downloadPlaceholderFile('README.md', readmeContent, 'text/markdown');
  };

  const handleDownloadPrivacy = () => {
    const privacyContent = `# Privacy Policy for PMAction & Shared Space

**Last Updated: October 26, 2023**

This Privacy Policy describes how PMAction & Shared Space ("the App") collects, uses, and discloses information when you use our application.

## Data Collection and Storage

**No Cloud Storage:** This App is designed to operate entirely client-side. **All your personal data, including your name, feelings check-ins, habits, programs, topics, and other logged entries, is stored exclusively in your local browser storage.** We do not transmit, collect, or store any of your personal data on our servers or any third-party servers.

**No Personal Information Collected by Us:** We do not collect any personally identifiable information about you.

**Analytics:** We do not use any analytics services that track your usage of the App.

## Data Security

Since your data is stored locally in your browser, the security of your data depends on the security of your device and browser. We recommend using a strong password for your device and keeping your browser software up to date.

## Data Export

The App provides a feature to export your data as a text file. This export is handled entirely within your browser, and the exported file is saved directly to your device. We do not have access to this exported data.

## Changes to This Privacy Policy

We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.

## Contact Us

If you have any questions about this Privacy Policy, please contact the developer.
`;
    downloadPlaceholderFile('PRIVACY.md', privacyContent, 'text/markdown');
  };

  const handleDownloadLicense = () => {
    const licenseContent = `MIT License

Copyright (c) 2023 Google

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
`;
    downloadPlaceholderFile('LICENSE', licenseContent, 'text/plain');
  };


  return (
    <div className="px-4 pb-20 max-w-3xl mx-auto animate-fadeIn">
      <h2 className="text-2xl font-bold mt-6 mb-4 text-primary-brand">{getEmoji('Settings')} Settings</h2>

      {/* Export Data */}
      <div className="bg-bg-card rounded-xl p-5 mb-4 border border-border-light shadow-card-light">
        <h3 className="text-xl font-bold mb-4 text-text-primary">Export Data</h3>
        <button
          className="btn btn-primary w-full justify-center py-3 px-6 rounded-xl font-semibold text-base flex items-center gap-2 bg-primary-brand text-white hover:bg-primary-dark-brand transition-all duration-300 transform hover:scale-[1.01] active:scale-[0.99]"
          onClick={() => exportFullJournal(userData)}
        >
          {getEmoji('Export')} Download Complete Journal
        </button>
      </div>

      {/* Print Dashboard */}
      <div className="bg-bg-card rounded-xl p-5 mb-4 border border-border-light shadow-card-light">
        <h3 className="text-xl font-bold mb-4 text-text-primary">Print Options</h3>
        <button
          className="btn btn-primary w-full justify-center py-3 px-6 rounded-xl font-semibold text-base flex items-center gap-2 bg-primary-brand text-white hover:bg-primary-dark-brand transition-all duration-300 transform hover:scale-[1.01] active:scale-[0.99]"
          onClick={printDashboard}
        >
          {getEmoji('Home')} Print Dashboard
        </button>
        <p className="text-text-secondary text-sm mt-3">This will open your browser's print dialog for the current dashboard view.</p>
      </div>

      {/* Deployment Files */}
      <div className="bg-bg-card rounded-xl p-5 mb-4 border border-border-light shadow-card-light">
        <h3 className="text-xl font-bold mb-4 text-text-primary">Deployment Files</h3>
        <p className="text-text-secondary text-sm mb-4">Download placeholder configuration files. Note: These are example files and may require modification for actual deployment.</p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <button className="btn btn-secondary w-full justify-center py-3 px-6 rounded-xl font-semibold text-base flex items-center gap-2 bg-charcoal-700 text-text-primary border-2 border-charcoal-600 hover:bg-charcoal-600 transition-all duration-300" onClick={handleDownloadManifest}>manifest.json</button>
          <button className="btn btn-secondary w-full justify-center py-3 px-6 rounded-xl font-semibold text-base flex items-center gap-2 bg-charcoal-700 text-text-primary border-2 border-charcoal-600 hover:bg-charcoal-600 transition-all duration-300" onClick={handleDownloadServiceWorker}>service-worker.js</button>
          <button className="btn btn-secondary w-full justify-center py-3 px-6 rounded-xl font-semibold text-base flex items-center gap-2 bg-charcoal-700 text-text-primary border-2 border-charcoal-600 hover:bg-charcoal-600 transition-all duration-300" onClick={handleDownloadReadme}>README.md</button>
          <button className="btn btn-secondary w-full justify-center py-3 px-6 rounded-xl font-semibold text-base flex items-center gap-2 bg-charcoal-700 text-text-primary border-2 border-charcoal-600 hover:bg-charcoal-600 transition-all duration-300" onClick={handleDownloadPrivacy}>PRIVACY.md</button>
          <button className="btn btn-secondary w-full justify-center py-3 px-6 rounded-xl font-semibold text-base flex items-center gap-2 bg-charcoal-700 text-text-primary border-2 border-charcoal-600 hover:bg-charcoal-600 transition-all duration-300" onClick={handleDownloadLicense}>LICENSE</button>
        </div>
      </div>

      {/* About */}
      <div className="bg-bg-card rounded-xl p-5 mb-4 border border-border-light shadow-card-light">
        <h3 className="text-xl font-bold mb-4 text-text-primary">About</h3>
        <p className="text-text-secondary text-sm">PMAction & Shared Space v1.0</p>
        <p className="text-text-secondary text-sm mt-2">All data stored locally in your browser</p>
        <p className="text-text-secondary text-xs mt-4">Built with React, TypeScript, and Tailwind CSS.</p>
      </div>
    </div>
  );
};

export default SettingsView;