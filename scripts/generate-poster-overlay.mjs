import sharp from 'sharp'

// Let's protect the red banner and the golden ring:
// In the original template:
// Any pixel that is part of the red banner (r > 120 and g < 60 and b < 60) should NOT be made transparent!
// Any pixel that is part of the golden metallic ring (r > 170 and g > 130 and b < 90) should NOT be made transparent!
// Only pixels inside the circle that are NOT part of the banner or ring should be transparent!

const cx = 500
const cy = 655
const rx = 195
const ry = 208

const { data, info } = await sharp('public/posters/soar-2026-custom-poster-template.png')
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true })

for (let y = 0; y < info.height; y++) {
  for (let x = 0; x < info.width; x++) {
    const dx = (x - cx) / rx
    const dy = (y - cy) / ry
    const dist = Math.sqrt(dx * dx + dy * dy)
    const idx = (y * info.width + x) * 4
    
    const r = data[idx]
    const g = data[idx + 1]
    const b = data[idx + 2]
    
    // Protect red banner:
    const isRedBanner = (r > 130 && g < 40 && b < 30) || (y < 430)
    // Protect golden frame edges:
    const isGoldenFrame = (r > 180 && g > 135 && b < 100) && dist > 0.88
    
    if (dist <= 0.96 && !isRedBanner && !isGoldenFrame) {
      data[idx + 3] = 0
    } else if (dist <= 1.0 && !isRedBanner && !isGoldenFrame) {
      const alpha = Math.round(((dist - 0.96) / 0.04) * 255)
      data[idx + 3] = alpha
    }
  }
}

await sharp(data, {
  raw: {
    width: info.width,
    height: info.height,
    channels: 4
  }
})
.png({ quality: 100 })
.toFile('public/posters/soar-2026-poster-frame.png')

console.log('✔ Generated smart protected overlay frame!')
