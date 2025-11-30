// Node.js script to convert SVG to ICO for Windows shortcut
// Uses sharp library if available, otherwise provides instructions

const fs = require('fs');
const path = require('path');

const svgPath = path.join(__dirname, 'controller', 'mico-icon.svg');
const icoPath = path.join(__dirname, 'controller', 'mico-icon.ico');
const pngPath = path.join(__dirname, 'controller', 'mico-icon.png');

console.log('Creating MICO icon file...\n');

// Check if SVG exists
if (!fs.existsSync(svgPath)) {
  console.error('Error: SVG file not found at', svgPath);
  process.exit(1);
}

// Try to use sharp if available
let sharp;
try {
  sharp = require('sharp');
} catch (e) {
  console.log('Sharp library not found. Installing...');
  console.log('Run: npm install --save-dev sharp');
  console.log('Then run this script again.\n');
  console.log('Alternatively, you can:');
  console.log('1. Use an online SVG to ICO converter');
  console.log('2. Use ImageMagick: magick convert controller/mico-icon.svg controller/mico-icon.ico');
  console.log('3. The shortcut will work with PNG files too\n');
  process.exit(0);
}

async function createIcon() {
  try {
    // Create PNG first (256x256 for high quality)
    await sharp(svgPath)
      .resize(256, 256, {
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      })
      .png()
      .toFile(pngPath);
    
    console.log('✓ PNG created:', pngPath);
    
    // Try to create ICO file using to-ico
    try {
      const toIco = require('to-ico');
      const fs = require('fs');
      
      // Create multiple sizes for ICO
      const sizes = [16, 32, 48, 64, 128, 256];
      const buffers = await Promise.all(
        sizes.map(size =>
          sharp(svgPath)
            .resize(size, size, {
              fit: 'contain',
              background: { r: 0, g: 0, b: 0, alpha: 0 }
            })
            .png()
            .toBuffer()
        )
      );
      
      // Convert to ICO
      const icoBuffer = await toIco(buffers);
      fs.writeFileSync(icoPath, icoBuffer);
      console.log('✓ ICO created:', icoPath);
    } catch (icoError) {
      console.log('⚠ Could not create ICO file:', icoError.message);
      console.log('  PNG file will be used instead (works fine on Windows)\n');
    }
    
    console.log('✓ Icon files created successfully!');
    console.log('  PNG:', pngPath);
    if (fs.existsSync(icoPath)) {
      console.log('  ICO:', icoPath);
    }
    console.log('');
    
  } catch (error) {
    console.error('Error creating icon:', error.message);
    process.exit(1);
  }
}

createIcon();

