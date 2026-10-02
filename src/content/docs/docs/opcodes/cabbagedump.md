---
title: "cabbageDump"
description: "Prints the JSON representation of a widget to the Csound console."
---

This opcode will print the JSON representation of a widget to the Csound console. This can be useful for debugging widgets.

## Syntax
```csound
cabbageDump:i(SChannel, iIndent)
cabbageDump:k(kTrig, SChannel, iIndent)
```

### Initialization
* *SChannel* – the name of the channel to query
* *iIndent* - If *iIndent* is nonnegative, then array elements and object members will be pretty-printed with that indent level. An indent level of 0 will only insert newlines. -1 selects the most compact representation. The default level is 4.

### Performance
* *kTrig* - a trigger signal that will cause the widget's JSON representation to be printed to the console.

## Example:

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
            "text"   : "Gain"
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
    //print entire JSON object associated with 'gain' widget
    cabbageDump "gain", 4
endin

</CsInstruments>  
<CsScore>
i1 0 1
</CsScore>
</CsoundSynthesizer>
```
