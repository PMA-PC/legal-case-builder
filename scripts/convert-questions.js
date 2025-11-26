import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const jsonPath = path.join(__dirname, '../public/assets/data/legal-questions.json');
const mdPath = path.join(__dirname, '../public/assets/documents/Complete-160-Questions-Answers.md');

try {
    const data = fs.readFileSync(jsonPath, 'utf8');
    const questions = JSON.parse(data);

    let mdContent = '# COMPREHENSIVE LEGAL CASE BUILDER RESPONSES\n## Joshua D. Shipman v. GAINSCO Auto Insurance (MGA Insurance Company, Inc.)\n### All 160 Questions Answered from Reference Documentation\n\n---\n\n';

    let currentSection = '';

    questions.forEach(q => {
        if (q.section && q.section !== currentSection) {
            currentSection = q.section;
            mdContent += `## SECTION: ${currentSection}\n\n`;
        }

        mdContent += `### Question ${q.id}: ${q.question}\n\n`;
        mdContent += `${q.answer}\n\n`;
        mdContent += '---\n\n';
    });

    fs.writeFileSync(mdPath, mdContent);
    console.log('Successfully converted JSON to Markdown.');

} catch (err) {
    console.error('Error converting file:', err);
    process.exit(1);
}
