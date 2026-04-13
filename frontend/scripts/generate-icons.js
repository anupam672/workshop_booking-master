const fs = require('fs')
const path = require('path')
const zlib = require('zlib')

/**
 * Create a valid PNG file with the specified dimensions and color
 * FOSSEE Primary Blue: RGB(15, 76, 129) = #0F4C81
 */
function createPNG(width, height, r, g, b) {
  // PNG signature
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])

  // IHDR chunk (13 bytes of data)
  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(width, 0)
  ihdr.writeUInt32BE(height, 4)
  ihdr.writeUInt8(8, 8)           // bit depth
  ihdr.writeUInt8(2, 9)            // color type (2 = RGB)
  ihdr.writeUInt8(0, 10)           // compression method
  ihdr.writeUInt8(0, 11)           // filter method
  ihdr.writeUInt8(0, 12)           // interlace method

  // IDAT chunk (image data)
  const scanlineLength = width * 3 + 1  // 3 bytes per pixel + 1 filter byte
  const imageData = Buffer.alloc(height * scanlineLength)
  let pos = 0

  for (let y = 0; y < height; y++) {
    imageData[pos++] = 0  // filter type: None
    for (let x = 0; x < width; x++) {
      imageData[pos++] = r
      imageData[pos++] = g
      imageData[pos++] = b
    }
  }

  const compressedData = zlib.deflateSync(imageData)

  // Helper to calculate CRC
  const crc32 = (data) => {
    let crc = 0xffffffff
    for (let i = 0; i < data.length; i++) {
      const byte = data[i]
      crc = crc ^ byte
      for (let j = 0; j < 8; j++) {
        if ((crc & 1) === 1) {
          crc = (crc >>> 1) ^ 0xedb88320
        } else {
          crc = crc >>> 1
        }
      }
    }
    return (crc ^ 0xffffffff) >>> 0
  }

  // Helper to create chunk
  const createChunk = (type, data) => {
    const length = Buffer.alloc(4)
    length.writeUInt32BE(data.length, 0)
    
    const typeBuffer = Buffer.from(type, 'ascii')
    const chunkData = Buffer.concat([typeBuffer, data])
    
    const crc = Buffer.alloc(4)
    crc.writeUInt32BE(crc32(chunkData), 0)
    
    return Buffer.concat([length, chunkData, crc])
  }

  // Create chunks
  const ihdrChunk = createChunk('IHDR', ihdr)
  const idatChunk = createChunk('IDAT', compressedData)
  const iendChunk = createChunk('IEND', Buffer.alloc(0))

  // Combine all parts
  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk])
}

const publicDir = path.join(__dirname, '..', 'public')

// Ensure public directory exists
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true })
}

// FOSSEE Primary Blue: RGB(15, 76, 129)
const r = 15
const g = 76
const b = 129

// Generate icons
const icon192 = createPNG(192, 192, r, g, b)
const icon512 = createPNG(512, 512, r, g, b)

fs.writeFileSync(path.join(publicDir, 'icon-192.png'), icon192)
fs.writeFileSync(path.join(publicDir, 'icon-512.png'), icon512)

console.log('✓ Icons generated successfully:')
console.log('  - public/icon-192.png (192x192)')
console.log('  - public/icon-512.png (512x512)')
