---
title: "cabbageGetValue"
description: "Queries the current value of a widget."
---

This opcode queries the current value of a widget. It can run at init-time or k-time and includes an optional output argument that triggers a value of 1 for one k-cycle whenever the widget value is updated or changed. The value and trigger can either be returned as two separate variables, or as a single [built-in trigger struct](/docs/using/csound7/#built-in-trigger-structs) variable.

## Syntax
```csound
value:i = cabbageGetValue(SChannel)
value:k = cabbageGetValue(SChannel)
value:S = cabbageGetValue(SChannel)
value:k, trig:k = cabbageGetValue(SChannel)
value:S, trig:k = cabbageGetValue(SChannel)
res:CabbageNumTrig = cabbageGetValue(SChannel)
res:CabbageStrTrig = cabbageGetValue(SChannel)
```

### Initialization
* *SChannel* – the name of the channel to query
* *iValue* - the current value of the widget at i-time

### Performance
* *kValue* - the current value of the widget at k-time
* *SValue* - the current value of the widget at i/k-time. The trigger version of `cabbageGetValue` for strings works at k-rate, the non trigger version is i-time only.
* *kTrig* - a trigger signal that will return 1 for a single k-cycle whenever the value has been updated/changed
* *res:CabbageNumTrig* - numeric channels. `res.val` mirrors *kValue* and `res.trig` mirrors *kTrig*. Runs at init-time and k-time.
* *res:CabbageStrTrig* - string channels. `res.val` holds the latest string and `res.trig` fires 1 for a single k-cycle whenever the string changes. k-rate only; on the first pass the trigger is primed to 0, so only subsequent changes fire.


## Example:

```csound
<Cabbage>[
    {"type":"form","caption":"Simple Instrument","size":{"width":1000,"height":520},"pluginId":"RMSy"},
    {"type":"rotarySlider", "channels":[{"event":"valueChanged", "id":"gain", "range":{"min":0, "max":2, "value":1, "skew":1, "increment":0.1}}], "bounds":{"left":150, "top": 10, "width":100, "height":100}, "text":"Gain"},
]
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
    kSliderValue, kTrig cabbageGetValue "gain"
    //print value of 'gain' slider each time its updated
    printf "Value is now %f\n", kTrig, kSliderValue

    //the same result using a single trigger struct variable
    res:CabbageNumTrig cabbageGetValue "gain"
    printf "Struct form: val %f, trig %f\n", res.trig, res.val, res.trig
endin

</CsInstruments>  
<CsScore>
i1 0 z
</CsScore>
</CsoundSynthesizer>
```

