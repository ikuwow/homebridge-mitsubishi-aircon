# @ikuwow/homebridge-mitsubishi-aircon

Homebridge plugin for Mitsubishi air conditioners that talk to the Japanese
[霧ヶ峰 REMOTE](https://www.mitsubishielectric.co.jp/home/kirigamine/function/remote/)
(RacEstVis) Web service. Fork of
[japaniot/homebridge-mitsubishi-aircon](https://github.com/japaniot/homebridge-mitsubishi-aircon).

## Why this fork

The upstream plugin uses two Homebridge APIs that were removed in
Homebridge v2 (`PlatformAccessory.reachable` /
`PlatformAccessory.updateReachability`), so it fails to load on v2. There
is no actively maintained alternative for the Japan-only Kirigamine
REMOTE / RacEstVis backend, so this fork keeps the existing reverse
engineered protocol implementation and rebuilds the surrounding
packaging.

The current `2.0.0-alpha.x` line still targets Homebridge v1.x only; v2
support will land in `2.0.0`.

## Requirements

- Homebridge `^1.8.0`
- Node.js `^20 || ^22 || ^24`

## Installation

Homebridge UI:

1. Open the Homebridge UI's Plugins tab.
2. Search for `@ikuwow/homebridge-mitsubishi-aircon` (paste the full
   scoped name; it may not appear in autocomplete).
3. Install and configure via the rendered form.

CLI:

```sh
npm install -g @ikuwow/homebridge-mitsubishi-aircon
```

## Configuration

```json
{
  "platforms": [
    {
      "platform": "MitsubishiAircon",
      "user": "USERNAME",
      "pass": "PASSWORD",
      "useDryForCool": false
    }
  ]
}
```

| Key | Type | Required | Description |
|---|---|---|---|
| `platform` | string | yes | Must be `MitsubishiAircon`. |
| `user` | string | yes | 霧ヶ峰 REMOTE / くらしID account username. |
| `pass` | string | yes | Password for the same account. |
| `useDryForCool` | boolean | no | When `true`, "Cool" in HomeKit drives the unit's dry (除湿) mode instead of standard cooling. Defaults to `false`. |

## Notes

- The plugin talks to `https://wwwl12.mitsubishielectric.co.jp/RacEstVis/`
  using a third-party reverse engineering of the Mitsubishi RAC command
  protocol (no public spec). Mitsubishi may change or retire this
  endpoint at any time.
- The maintainer's account is migrated to MyMU / くらしID and the
  RacEstVis endpoint still responds for the legacy session flow as of
  the latest release. Other migrated accounts have not been tested;
  please open an issue if login fails.

## References

- Upstream plugin: https://github.com/japaniot/homebridge-mitsubishi-aircon
- Homebridge plugin development: https://developers.homebridge.io/
- Updating to Homebridge v2.0: https://github.com/homebridge/homebridge/wiki/Updating-To-Homebridge-v2.0
- HAP-NodeJS HeaterCooler service: https://developers.homebridge.io/#/service/HeaterCooler
- Plugin config schema spec: https://developers.homebridge.io/#/config-schema

## License

[CC BY-NC-SA 4.0](LICENSE)
