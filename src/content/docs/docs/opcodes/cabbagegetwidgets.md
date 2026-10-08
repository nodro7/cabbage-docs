---
title: "cabbageGetWidgets"
description: "Returns the IDs of all widgets currently loaded in the instrument."
---

Returns a string array containing the IDs of all widgets currently loaded in the instrument. This opcode works at i-time only. Each entry in the returned array corresponds to a widget's top-level `id` field, or falls back to `channels[0].id` if no top-level `id` is present. This opcodes runs at i-time only. 

## Syntax
```csound
SWidgetIds[] = cabbageGetWidgets()
```

## Initialization

- `SWidgetIds[]` – a string array of widget IDs, one entry per widget in the current Cabbage layout.

## Example

```csound
<Cabbage>
{
    "pluginId"      : "GWdt",
    "enableDevTools": true,
    "channelConfig" : [ {"name": "0 in 2 out", "ins": "0", "outs": "2"} ],
    "widgets"       : [
        { "type": "form", "caption": "Simple Instrument", "size": {"width": 600, "height": 300} },
        {
            "type"    : "rotarySlider",
            "bounds"  : {"left": 50, "top": 50, "width": 100, "height": 100},
            "channels": [
                {
                    "id"   : "gain",
                    "event": "valueChanged",
                    "range": {"min": 0, "max": 1, "defaultValue": 0.5, "skew": 1, "increment": 0.001}
                }
            ],
            "label"  : {"text": "Gain"}
        },
        {
            "type"    : "button",
            "bounds"  : {"left": 200, "top": 80, "width": 80, "height": 40},
            "channels": [ {"id": "trigger", "event": "valueChanged"} ],
            "label"   : { "text": {"on": "On", "off": "Off"} }
        }
    ]
}
</Cabbage>
<CsoundSynthesizer>
<CsOptions>
-dm0 -n
</CsOptions>
<CsInstruments>
ksmps = 32
nchnls = 2
0dbfs = 1

instr 1
    ; Retrieve all widget IDs
    SWidgets[] = cabbageGetWidgets()
    i = 0
    while i < lenarray(SWidgets) do
        prints("Widget ID: %s\n", SWidgets[i])
        i += 1
    od
endin

</CsInstruments>
<CsScore>
i1 0 1
</CsScore>
</CsoundSynthesizer>
```

## Notes

- This opcode is i-time only; call it from an instrument that runs at initialisation, or from a always-on instrument (`i1 0 z`).
- The form widget is included in the returned array.
- If a widget has no `id` field and no `channels[0].id`, an empty string is returned for that entry.
- Combine with `cabbageGet` or `cabbageHasKey` to dynamically inspect widget properties at startup.
