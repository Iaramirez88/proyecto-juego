/* eslint-disable no-console */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', 'src', 'assets', 'images');

function walk(dirPath) {
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      files.push(...walk(fullPath));
    } else {
      files.push(fullPath);
    }
  }
  return files;
}

function stripC2paMetadata(svgText) {
  if (!svgText.includes('<metadata')) return { changed: false, text: svgText };

  // Only strip when it looks like the problematic C2PA namespace payload.
  if (!svgText.includes('c2pa:') && !svgText.includes('xmlns:c2pa')) {
    return { changed: false, text: svgText };
  }

  const stripped = svgText.replace(/<metadata[\s\S]*?<\/metadata>/g, '');
  return { changed: stripped !== svgText, text: stripped };
}

function main() {
  if (!fs.existsSync(ROOT)) {
    console.warn(`[stripSvgMetadata] Skipped: folder not found: ${ROOT}`);
    return;
  }

  const allFiles = walk(ROOT);
  const svgFiles = allFiles.filter((f) => f.toLowerCase().endsWith('.svg'));

  let changedCount = 0;

  for (const filePath of svgFiles) {
    const original = fs.readFileSync(filePath, 'utf8');
    const { changed, text } = stripC2paMetadata(original);

    if (changed) {
      fs.writeFileSync(filePath, text, 'utf8');
      changedCount += 1;
    }
  }

  if (changedCount > 0) {
    console.log(`[stripSvgMetadata] Stripped metadata from ${changedCount} SVG(s).`);
  } else {
    console.log('[stripSvgMetadata] No SVGs needed changes.');
  }
}

main();
