import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const iconsDir = path.resolve(__dirname, '../public/assets/icons/versionControl');
const outputDir = path.resolve(__dirname, '../src/data');
const outputFile = path.join(outputDir, 'versionControlIcons.json');

fs.mkdirSync(outputDir, { recursive: true });

const files = fs.readdirSync(iconsDir).filter(file => path.extname(file) === '.svg');

const iconMap = files.reduce((map, file) =>
{
    let languageName = path.basename(file, '.svg').toLowerCase();
    const iconPath = `/assets/icons/versionControl/${file}`;
    map[languageName] = iconPath;
    return map;
}, {});

fs.writeFileSync(outputFile, JSON.stringify(iconMap, null, 2), 'utf-8');

console.log(`Successfully generated icon map with ${Object.keys(iconMap).length} entries to ${outputFile}`);