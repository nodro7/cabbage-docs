<Cabbage>
{
    "pluginId"      : "GWdt",
    "enableDevTools": true,
    "channelConfig" : [ {"name": "0 in 2 out", "ins": "0", "outs": "2"} ],
    "widgets"       : [
        { "type": "form", "caption": "Widget Ids Example", "size": {"width": 600, "height": 300} },
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
        },
        {
            "type"    : "rotarySlider",
            "bounds"  : {"left": 200, "top": 50, "width": 100, "height": 100},
            "channels": [
                {
                    "id"   : "cutoff",
                    "event": "valueChanged",
                    "range": {"min": 20, "max": 20000, "defaultValue": 1000, "skew": 0.3, "increment": 1}
                }
            ]
        },
        {
            "type"    : "button",
            "bounds"  : {"left": 350, "top": 80, "width": 80, "height": 40},
            "channels": [{"id": "trigger", "event": "valueChanged"}],
            "style"   : {"off": {"backgroundColor": "#993d00", "textColor": "#ffffff"}}
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
    ; All channel IDs, including the form itself
    allIds:S[] = cabbageGetWidgetIds()
    ; Only rotary sliders
    sliders:S[] = cabbageGetWidgetIds("type", "rotarySlider")
    ; Any slider-like type ('*' matches any sequence)
    anySlider:S[] = cabbageGetWidgetIds("type", "*Slider")
    ; IDs starting with 'g'
    gIds:S[] = cabbageGetWidgetIds("channels.0.id", "g*")
    ; Widgets with a dark orange off-state colour
    orange:S[] = cabbageGetWidgetIds("style.off.backgroundColor", "#99*")

    num:i = lenarray(allIds)
    printf("Found %d widgets\n", num)
    idx:i = 0
    while idx < num do
        printf("Widget %d: %s\n", idx, allIds[idx])
        idx += 1
    od
    printf("%d sliders, %d starting with 'g', %d orange\n", lenarray(sliders), lenarray(gIds), lenarray(orange))
endin

</CsInstruments>
<CsScore>
i1 0 1
</CsScore>
</CsoundSynthesizer>
