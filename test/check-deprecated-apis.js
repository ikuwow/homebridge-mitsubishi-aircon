'use strict'

// Detects Homebridge v2 removed/renamed APIs in lib/.
// Run via `npm test` or directly: `node test/check-deprecated-apis.js`.
// See: https://github.com/homebridge/homebridge/wiki/Updating-To-Homebridge-v2.0

const fs = require('fs')
const path = require('path')

// `.reachable` keeps the dot prefix because "reachable" alone is a common
// English word that would false-positive on local variables; the API
// surface in question is always property/method access. `updateReachability`
// is rare enough as a bare identifier to use a plain word boundary.
const FORBIDDEN = [
  { pattern: /\bupdateReachability\b/, name: 'updateReachability() removed in homebridge v2' },
  { pattern: /\.reachable\b/, name: 'reachable accessor removed in homebridge v2 (reachability is no longer supported)' },
  { pattern: /\bgetServiceByUUIDAndSubType\b/, name: 'getServiceByUUIDAndSubType removed; use getServiceById' },
  { pattern: /\bBatteryService\b/, name: 'BatteryService removed; use Battery' },
  { pattern: /\bAccessoryLoader\b/, name: 'AccessoryLoader removed' },
  { pattern: /\buseLegacyAdvertiser\b/, name: 'useLegacyAdvertiser removed' },
  { pattern: /\b(configureCameraSource|cameraSource)\b/, name: 'cameraSource / configureCameraSource removed; use CameraController' },
  { pattern: /Characteristic\.(Units|Formats|Perms)\b/, name: 'Characteristic.{Units|Formats|Perms} moved to api.hap' },
  { pattern: /\.getValue\(/, name: 'Characteristic.getValue() removed; use .value' },
  { pattern: /PROGRAM_SCHEDULED_MANUAL_MODE_/, name: 'PROGRAM_SCHEDULED_MANUAL_MODE_ renamed (trailing underscore removed)' },
]

function collectJsFiles(dir) {
  const out = []
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name)
    if (entry.isDirectory()) out.push(...collectJsFiles(p))
    else if (entry.isFile() && entry.name.endsWith('.js')) out.push(p)
  }
  return out
}

const libDir = path.resolve(__dirname, '..', 'lib')
const files = collectJsFiles(libDir)
let violations = 0

for (const file of files) {
  const lines = fs.readFileSync(file, 'utf8').split('\n')
  lines.forEach((line, i) => {
    for (const rule of FORBIDDEN) {
      if (rule.pattern.test(line)) {
        const rel = path.relative(path.resolve(__dirname, '..'), file)
        console.error(`${rel}:${i + 1}: ${rule.name}`)
        console.error(`  ${line.trim()}`)
        violations++
      }
    }
  })
}

if (violations > 0) {
  console.error(`\n${violations} deprecated API usage(s) found.`)
  process.exit(1)
}
console.log(`check-deprecated-apis: scanned ${files.length} file(s), no violations.`)
