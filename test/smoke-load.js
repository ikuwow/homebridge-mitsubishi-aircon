'use strict'

// Smoke test: load the plugin module against a mock Homebridge API and
// verify the platform registers and survives the early-return paths
// (no config / missing credentials). This catches v1/v2 ABI mismatches
// at the registerPlatform boundary without requiring a real Homebridge
// process or network access.

const assert = require('assert')
const path = require('path')

const pluginPath = path.resolve(__dirname, '..', 'lib', 'index.js')
delete require.cache[pluginPath]

const registered = []
const mockHomebridge = {
  hap: {
    Service: {},
    Characteristic: {},
    uuid: { generate: (s) => `uuid-${s}` },
  },
  platformAccessory: class {
    constructor(name, uuid) {
      this.displayName = name
      this.UUID = uuid
    }
  },
  registerPlatform(name, platformName, ctor, dynamic) {
    registered.push({ name, platformName, ctor, dynamic })
  },
}

const pluginExport = require(pluginPath)
assert.strictEqual(typeof pluginExport, 'function', 'plugin must export a function')

pluginExport(mockHomebridge)
assert.strictEqual(registered.length, 1, 'registerPlatform must be called exactly once')
const entry = registered[0]
assert.strictEqual(entry.platformName, 'MitsubishiAircon')
assert.strictEqual(entry.dynamic, true)
assert.strictEqual(typeof entry.ctor, 'function', 'platform constructor must be a function')

const Platform = entry.ctor
const stubLog = () => {}
const stubApi = { once: () => {} }

// No config: must short-circuit without throwing.
new Platform(stubLog, null, stubApi)
// Config without user/pass: must short-circuit without throwing.
new Platform(stubLog, {}, stubApi)

console.log('smoke-load: registerPlatform reached, early-return paths OK')
