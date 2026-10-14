<Cabbage>
{
    "pluginId"      : "GWdg",
    "enableDevTools": true,
    "channelConfig" : [ {"name": "0 in 2 out", "ins": "0", "outs": "2"} ],
    "widgets"       : [
        { "type": "form", "caption": "Widget JSON Example", "size": {"width": 600, "height": 300} },
        {
            "type"    : "rotarySlider",
            "bounds"  : {"left": 50, "top": 50, "width": 100, "height": 100},
            "channels": [
                {
                    "id"   : "gain",
                    "event": "valueChanged",
                    "range": {"min": 0, "max": 1, "defaultValue": 0.5, "skew": 1, "increment": 0.01}
                }
            ]
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
    ; Fetch the widget's full JSON object as a string
    json:S = cabbageGetWidget("gain")
    ; Pick fields out of the returned JSON
    type:S = cabbageJsonGet(json, "type")
    printf("Widget type: %s\n", type)
    printf("Widget JSON: %s\n", json)
endin

</CsInstruments>
<CsScore>
i1 0 1
</CsScore>
</CsoundSynthesizer>
