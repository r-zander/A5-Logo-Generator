# Logo SVGs — export checklist

These `levelN.svg` files are recolored at runtime by the app (foreground +
background per color scheme). Recoloring is done with CSS in
`src/scss/_logo-rendering.scss`, roughly:

```scss
svg {
  fill: <color> !important;                 // recolors filled shapes
  *[stroke] { stroke: <color> !important; } // recolors stroked lines
}
```

The selected color is applied to the preview **and** to PNG/SVG exports.

## The caveat: how you express stroke & fill matters

The CSS above only reaches your shapes if they use **presentation attributes** (stroke, fill),
not inline `style="..."`. Vector tools (Affinity Designer / Serif, Illustrator)
often export color inside `style` instead — and then it silently stops being
recolorable.
