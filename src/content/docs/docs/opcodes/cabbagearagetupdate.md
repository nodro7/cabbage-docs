---
title: "cabbageAraGetUpdate"
description: "Returns a 1-k-cycle trigger whenever ARA model data changes."
---

Returns a trigger that is `1` for a single k-cycle whenever ARA model data changes.

## Syntax
```csound
trig:k = cabbageAraGetUpdate()
```

### Performance
* *kTrig* — fires `1` for a single k-cycle whenever the shared ARA document model data has been refreshed (k-rate only)

## Description

Each time the shared ARA document model data is refreshed by the host, this opcode returns `1` for exactly one k-cycle, then returns `0` again. Use it as a trigger to re-read source metadata with `cabbageAraGet`.

Unlike earlier versions, the output is a plain edge trigger rather than a monotonic counter, so no `changed` opcode is needed around it.

If you also need to know *what kind of event* fired (for example `"audioSourceAdded"` or `"regionChanged"`), use [cabbageAraGetUpdateEvent](/docs/opcodes/cabbagearagetupdateevent/), which returns the event type alongside the same trigger.

## Example

```csound
instr 1
  trig:k = cabbageAraGetUpdate()
  if trig == 1 then
    event("i", "ReadAraData", 0, 0.001)
  endif
endin

instr ReadAraData
  idx:i = cabbageAraGet("currentIndex")
  cnt:i = cabbageAraGet("audioSourceCount")
  prints("update: source %d of %d\n", idx, cnt)
endin
```

## See Also

- [cabbageAraGetUpdateEvent](/docs/opcodes/cabbagearagetupdateevent/)
- [cabbageAraGet](/docs/opcodes/cabbagearaget/)
- [cabbageAraGetSourceSamples](/docs/opcodes/cabbagearagetsourcesamples/)
