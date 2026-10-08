---
title: "cabbageGet"
description: "Queries the current value of a widget property."
---

This opcode queries the current value of a widget property, i.e,`colour`, `bounds.top`, `height`, etc. It can run at init-time or k-time and includes an optional output argument that triggers a value of 1 for one k-cycle whenever the widget value is updated or changed. String results can also be returned as a single [built-in trigger struct](/docs/using/csound7/#built-in-trigger-structs) variable.

## Syntax
```csound
value:k = cabbageGet(SChannel, SProperty)
value:i = cabbageGet(SChannel, SProperty)
value:S = cabbageGet(SChannel, SProperty)
value:k, kTrig = cabbageGet(SChannel, SProperty)
value:S, kTrig = cabbageGet(SChannel, SProperty)
res:CabbageStrTrig = cabbageGet(SChannel, SProperty)
```

### Initialization
* *SChannel* – the name of the channel to query
* *SProperty* - the property you wish to access. If the property is part of a JSON object, such as `"bounds:{"left":0}` you can use dot notation, i.e., "bounds.left"
* *iValue* - the current value of the widget at init-time

### Performance
* *kValue* - the current value of the widget property
* *SValue* - the current string value of the widget property
* *kTrig* - a trigger signal that will return 1 for a single k-cycle whenever the value has been updated/changed
* *res:CabbageStrTrig* - `res.val` mirrors *SValue* and `res.trig` mirrors *kTrig*. k-rate only; the trigger fires when the property value changes.

## Example

```csound
<Cabbage>
{
    "pluginId"      : "RMSy",
    "enableDevTools": true,
    "channelConfig" : [ {"name": "0 in 2 out", "ins": "0", "outs": "2"} ],
    "widgets"       : [
        { "type": "form", "caption": "Simple Instrument", "size": {"width": 1000, "height": 520} },
        {
            "type"    : "rotarySlider",
            "bounds"  : {"left": 150, "top": 10, "width": 100, "height": 100},
            "channels": [
                {
                    "id"   : "gain",
                    "event": "valueChanged",
                    "range": {"min": 0, "max": 2, "defaultValue": 1, "skew": 1, "increment": 0.1}
                }
            ],
            "label"  : {"text": "Gain"}
        },
        {
            "type"    : "label",
            "channels": [ {"id": "status", "event": "valueChanged"} ],
            "bounds"  : {"left": 150, "top": 130, "width": 300, "height": 30},
            "label"   : {"text": "idle"}
        }
    ]
}
</Cabbage>
<CsoundSynthesizer>
<CsOptions>
-dm0 -n -+rtmidi=NULL -M0 --midi-key=4 --midi-velocity=5
</CsOptions>
<CsInstruments>
; sr set by host
ksmps = 16
nchnls = 2
0dbfs = 1

instr 1
    ; read a widget property as a string
    SStatus cabbageGet "status", "text"
    printf "status label now reads %s\n", 1, SStatus

    ; the same query using a trigger struct: fires when the text changes
    res:CabbageStrTrig cabbageGet "gain", "text"
    if res.trig == 1 then
        printf "gain label changed to %s\n", 1, res.val
    endif
endin

instr 2
    ; change the status label after 1 second
    cabbageSet("status", "label.text", "running")
endin

</CsInstruments>
<CsScore>
i1 0 z
i2 1 1
</CsScore>
</CsoundSynthesizer>
```

