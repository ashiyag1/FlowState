import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const svgPath = path.join(__dirname, 'public', 'favicon.svg');
const publicDir = path.join(__dirname, 'public');

async function generateIcons() {
  try {
    if (!fs.existsSync(svgPath)) {
      console.error('Error: favicon.svg not found at', svgPath);
      return;
    }

    console.log('Generating PWA icons from favicon.svg...');

    // Generate standard 192x192
    await sharp(svgPath)
      .resize(192, 192)
      .png()
      .toFile(path.join(publicDir, 'icon-192.png'));
    console.log('Created icon-192.png');

    // Generate standard 512x512
    await sharp(svgPath)
      .resize(512, 512)
      .png()
      .toFile(path.join(publicDir, 'icon-512.png'));
    console.log('Created icon-512.png');

    // For maskable icons, we center the resized logo (80% size) inside a background canvas
    // 192 * 0.8 = 153.6 -> 154px
    const logo192 = await sharp(svgPath).resize(154, 154).toBuffer();
    await sharp({
      create: {
        width: 192,
        height: 192,
        channels: 4,
        background: '#1c1208' // Theme color
      }
    })
      .composite([{ input: logo192, gravity: 'center' }])
      .png()
      .toFile(path.join(publicDir, 'icon-192-maskable.png'));
    console.log('Created icon-192-maskable.png');

    // 512 * 0.8 = 409.6 -> 410px
    const logo512 = await sharp(svgPath).resize(410, 410).toBuffer();
    await sharp({
      create: {
        width: 512,
        height: 512,
        channels: 4,
        background: '#1c1208' // Theme color
      }
    })
      .composite([{ input: logo512, gravity: 'center' }])
      .png()
      .toFile(path.join(publicDir, 'icon-512-maskable.png'));
    console.log('Created icon-512-maskable.png');

    console.log('All icons generated successfully!');
  } catch (error) {
    console.error('Error generating icons:', error);
  }
}

generateIcons();
