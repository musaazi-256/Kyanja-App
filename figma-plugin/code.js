// Kyanja Junior App — Upload Modal Figma Plugin
// Generates both modal steps as editable frames side by side.

async function main() {
  await figma.loadFontAsync({ family: 'Inter', style: 'Regular' })
  await figma.loadFontAsync({ family: 'Inter', style: 'Medium' })
  await figma.loadFontAsync({ family: 'Inter', style: 'SemiBold' })
  await figma.loadFontAsync({ family: 'Inter', style: 'Bold' })

  // ── Colour tokens (Tailwind equivalents) ──────────────────────────────
  const C = {
    white:    { r: 1,     g: 1,     b: 1     },
    blue900:  { r: 0.118, g: 0.227, b: 0.541 },
    blue800:  { r: 0.149, g: 0.298, b: 0.647 },
    blue700:  { r: 0.114, g: 0.306, b: 0.847 },
    blue600:  { r: 0.145, g: 0.388, b: 0.922 },
    blue500:  { r: 0.231, g: 0.510, b: 0.965 },
    blue100:  { r: 0.859, g: 0.937, b: 1     },
    blue50:   { r: 0.937, g: 0.969, b: 1     },
    slate900: { r: 0.059, g: 0.090, b: 0.122 },
    slate700: { r: 0.200, g: 0.255, b: 0.322 },
    slate600: { r: 0.278, g: 0.333, b: 0.408 },
    slate500: { r: 0.392, g: 0.455, b: 0.533 },
    slate400: { r: 0.580, g: 0.639, b: 0.710 },
    slate300: { r: 0.792, g: 0.816, b: 0.851 },
    slate200: { r: 0.886, g: 0.902, b: 0.922 },
    slate100: { r: 0.945, g: 0.953, b: 0.965 },
    slate50:  { r: 0.973, g: 0.980, b: 0.992 },
    red500:   { r: 0.937, g: 0.267, b: 0.267 },
  }

  // ── Helpers ───────────────────────────────────────────────────────────
  const solid  = (color, opacity = 1) => [{ type: 'SOLID', color, opacity }]
  const noFill = () => []

  function txt(content, size, color, weight = 'Regular', opacity = 1) {
    const t = figma.createText()
    t.fontName = { family: 'Inter', style: weight }
    t.fontSize = size
    t.fills = solid(color, opacity)
    t.characters = content
    t.textAutoResize = 'WIDTH_AND_HEIGHT'
    return t
  }

  function wrapTxt(content, size, color, weight = 'Regular') {
    const t = figma.createText()
    t.fontName = { family: 'Inter', style: weight }
    t.fontSize = size
    t.fills = solid(color)
    t.characters = content
    t.textAutoResize = 'HEIGHT'
    t.layoutSizingHorizontal = 'FILL'
    return t
  }

  function vframe(name, gap, pt = 0, pr = 0, pb = 0, pl = 0) {
    const f = figma.createFrame()
    f.name = name
    f.layoutMode = 'VERTICAL'
    f.primaryAxisSizingMode = 'AUTO'
    f.counterAxisSizingMode = 'AUTO'
    f.itemSpacing = gap
    f.paddingTop = pt; f.paddingRight = pr
    f.paddingBottom = pb; f.paddingLeft = pl
    f.fills = noFill()
    return f
  }

  function hframe(name, gap, pt = 0, pr = 0, pb = 0, pl = 0) {
    const f = figma.createFrame()
    f.name = name
    f.layoutMode = 'HORIZONTAL'
    f.primaryAxisSizingMode = 'AUTO'
    f.counterAxisSizingMode = 'AUTO'
    f.itemSpacing = gap
    f.paddingTop = pt; f.paddingRight = pr
    f.paddingBottom = pb; f.paddingLeft = pl
    f.fills = noFill()
    f.counterAxisAlignItems = 'CENTER'
    return f
  }

  function divider() {
    const r = figma.createRectangle()
    r.name = 'Divider'
    r.resize(472, 1)
    r.fills = solid(C.slate200)
    r.layoutSizingHorizontal = 'FILL'
    return r
  }

  function inputField(placeholder) {
    const wrap = hframe('Input', 0, 8, 12, 8, 12)
    wrap.layoutSizingHorizontal = 'FILL'
    wrap.cornerRadius = 8
    wrap.fills = solid(C.white)
    wrap.strokes = [{ type: 'SOLID', color: C.slate200 }]
    wrap.strokeWeight = 1
    wrap.strokeAlign = 'INSIDE'
    const label = wrapTxt(placeholder, 13, C.slate400)
    wrap.appendChild(label)
    return wrap
  }

  function typeCard(label, sub, selected) {
    const card = vframe(`Card / ${label}`, 4, 16, 16, 16, 16)
    card.layoutSizingHorizontal = 'FILL'
    card.cornerRadius = 12
    card.fills = selected ? solid(C.blue50) : solid(C.white)
    card.strokes = [{ type: 'SOLID', color: selected ? C.blue900 : C.slate200 }]
    card.strokeWeight = 2
    card.strokeAlign = 'INSIDE'

    // Icon dot
    const icon = figma.createEllipse()
    icon.name = 'Icon'
    icon.resize(18, 18)
    icon.fills = solid(selected ? C.blue900 : C.slate400, 0.2)

    const inner = figma.createEllipse()
    inner.name = 'Icon Inner'
    inner.resize(10, 10)
    inner.fills = solid(selected ? C.blue900 : C.slate400)

    // We can't nest easily without a wrapper — use rectangle icons instead
    const iconRect = figma.createRectangle()
    iconRect.name = 'Icon'
    iconRect.resize(18, 14)
    iconRect.cornerRadius = 3
    iconRect.fills = solid(selected ? C.blue900 : C.slate400, 0.25)

    const lbl  = txt(label, 13, selected ? C.blue900 : C.slate700, 'SemiBold')
    const subT = txt(sub,   11, C.slate400, 'Regular')

    card.appendChild(iconRect)
    card.appendChild(lbl)
    card.appendChild(subT)
    return card
  }

  function dropZone(empty = true, fileName = '') {
    const zone = vframe('Drop Zone', 6, 28, 28, 28, 28)
    zone.layoutSizingHorizontal = 'FILL'
    zone.cornerRadius = 12
    zone.fills = solid(C.slate50)
    zone.strokes = [{ type: 'SOLID', color: C.slate200 }]
    zone.strokeWeight = 2
    zone.strokeAlign = 'INSIDE'
    zone.primaryAxisAlignItems = 'CENTER'
    zone.counterAxisAlignItems = 'CENTER'

    if (empty) {
      const icon = figma.createRectangle()
      icon.name = 'Upload Icon'
      icon.resize(22, 18)
      icon.cornerRadius = 3
      icon.fills = solid(C.slate400, 0.5)

      const t1 = txt('Click to choose a file', 13, C.slate400)
      const t2 = txt('JPEG, PNG, WEBP  ·  Max 3 MB', 11, C.slate300)
      zone.appendChild(icon)
      zone.appendChild(t1)
      zone.appendChild(t2)
    } else {
      const nameT = txt(fileName, 13, C.slate700, 'Medium')
      const meta  = txt('1.2 MB  ·  JPEG', 11, C.slate400)
      const repl  = txt('Click to replace', 11, C.blue900)
      zone.appendChild(nameT)
      zone.appendChild(meta)
      zone.appendChild(repl)
    }
    return zone
  }

  function labelNode(text, required = false) {
    if (!required) return txt(text, 12, C.slate700, 'Medium')
    const row = hframe('Label Row', 4)
    row.layoutSizingHorizontal = 'FILL'
    row.appendChild(txt(text, 12, C.slate700, 'Medium'))
    row.appendChild(txt('*', 12, C.red500, 'Medium'))
    return row
  }

  function specBox() {
    const box = vframe('Spec Box', 4, 10, 12, 10, 12)
    box.layoutSizingHorizontal = 'FILL'
    box.cornerRadius = 8
    box.fills = solid(C.blue50)
    box.strokes = [{ type: 'SOLID', color: C.blue100 }]
    box.strokeWeight = 1
    box.strokeAlign = 'INSIDE'

    const row = hframe('Spec Header', 6)
    row.layoutSizingHorizontal = 'FILL'
    const dot = figma.createEllipse()
    dot.resize(8, 8)
    dot.fills = solid(C.blue600)
    row.appendChild(dot)
    row.appendChild(wrapTxt('Recommended size: 1920 × 1080 px (16:9)', 11, C.blue700, 'SemiBold'))

    box.appendChild(row)
    box.appendChild(wrapTxt('Landscape · Centre your subject · Avoid text near the edges', 11, C.blue600))
    box.appendChild(wrapTxt("You'll add a headline & description on the next step.", 11, C.blue500))
    return box
  }

  function primaryBtn(label, disabled = false) {
    const btn = hframe(`Button / ${label}`, 8, 9, 20, 9, 20)
    btn.cornerRadius = 8
    btn.fills = solid(C.blue900, disabled ? 0.5 : 1)
    btn.primaryAxisAlignItems = 'CENTER'
    btn.counterAxisAlignItems = 'CENTER'
    btn.appendChild(txt(label, 13, C.white, 'Medium'))
    return btn
  }

  function outlineBtn(label) {
    const btn = hframe(`Button / ${label}`, 8, 9, 20, 9, 20)
    btn.cornerRadius = 8
    btn.fills = solid(C.white)
    btn.strokes = [{ type: 'SOLID', color: C.slate200 }]
    btn.strokeWeight = 1
    btn.strokeAlign = 'INSIDE'
    btn.primaryAxisAlignItems = 'CENTER'
    btn.counterAxisAlignItems = 'CENTER'
    btn.appendChild(txt(label, 13, C.slate700, 'Medium'))
    return btn
  }

  function modal(name, width) {
    const m = figma.createFrame()
    m.name = name
    m.layoutMode = 'VERTICAL'
    m.primaryAxisSizingMode = 'AUTO'
    m.counterAxisSizingMode = 'FIXED'
    m.resize(width, 100)
    m.fills = solid(C.white)
    m.cornerRadius = 12
    m.effects = [{
      type: 'DROP_SHADOW',
      color: { r: 0, g: 0, b: 0, a: 0.12 },
      offset: { x: 0, y: 8 },
      radius: 24,
      spread: -4,
      visible: true,
      blendMode: 'NORMAL',
    }]
    return m
  }

  // ── STEP 1: General / Carousel ────────────────────────────────────────
  const step1 = modal('Step 1 — Upload Image (General / Carousel)', 520)

  // Header
  const h1 = vframe('Header', 6, 24, 24, 20, 24)
  h1.layoutSizingHorizontal = 'FILL'
  h1.appendChild(txt('Upload Image', 18, C.slate900, 'SemiBold'))
  h1.appendChild(wrapTxt("Choose what you're uploading and fill in the details below.", 13, C.slate500))
  step1.appendChild(h1)
  step1.appendChild(divider())

  // Body
  const body1 = vframe('Body', 20, 24, 24, 24, 24)
  body1.layoutSizingHorizontal = 'FILL'

  // Type selector
  const typeRow = hframe('Type Selector', 12)
  typeRow.layoutSizingHorizontal = 'FILL'
  typeRow.counterAxisAlignItems = 'STRETCH'
  typeRow.appendChild(typeCard('General Media', 'Carousel, gallery, news…', true))
  typeRow.appendChild(typeCard('Hero Image', 'Homepage background', false))
  body1.appendChild(typeRow)

  // Category
  const catSection = vframe('Category Section', 8)
  catSection.layoutSizingHorizontal = 'FILL'
  catSection.appendChild(labelNode('Category'))

  const dropdown = hframe('Select / Dropdown', 0, 9, 12, 9, 12)
  dropdown.layoutSizingHorizontal = 'FILL'
  dropdown.cornerRadius = 8
  dropdown.fills = solid(C.white)
  dropdown.strokes = [{ type: 'SOLID', color: C.slate200 }]
  dropdown.strokeWeight = 1
  dropdown.strokeAlign = 'INSIDE'
  dropdown.primaryAxisAlignItems = 'SPACE_BETWEEN'
  const ddVal = wrapTxt('Carousel', 13, C.slate700)
  dropdown.appendChild(ddVal)
  dropdown.appendChild(txt('▾', 13, C.slate400))

  catSection.appendChild(dropdown)
  catSection.appendChild(specBox())
  body1.appendChild(catSection)

  // File
  const fileSection = vframe('File Section', 6)
  fileSection.layoutSizingHorizontal = 'FILL'
  fileSection.appendChild(labelNode('File'))
  fileSection.appendChild(dropZone(true))
  body1.appendChild(fileSection)

  step1.appendChild(body1)
  step1.appendChild(divider())

  // Footer
  const footer1 = hframe('Footer', 12, 20, 24, 24, 24)
  footer1.layoutSizingHorizontal = 'FILL'
  footer1.primaryAxisAlignItems = 'MAX'
  footer1.appendChild(outlineBtn('Cancel'))
  footer1.appendChild(primaryBtn('Next: Add Copy', true))
  step1.appendChild(footer1)

  step1.x = 0
  step1.y = 0

  // ── STEP 2: Add Carousel Copy ─────────────────────────────────────────
  const step2 = modal('Step 2 — Add Carousel Copy', 520)

  const h2 = vframe('Header', 6, 24, 24, 20, 24)
  h2.layoutSizingHorizontal = 'FILL'
  h2.appendChild(txt('Add Carousel Copy', 18, C.slate900, 'SemiBold'))
  h2.appendChild(wrapTxt('Provide a headline and description for this slide. Both fields are required.', 13, C.slate500))
  step2.appendChild(h2)
  step2.appendChild(divider())

  const body2 = vframe('Body', 20, 24, 24, 24, 24)
  body2.layoutSizingHorizontal = 'FILL'

  // File pill
  const pill = hframe('File Pill', 8, 8, 12, 8, 12)
  pill.layoutSizingHorizontal = 'FILL'
  pill.cornerRadius = 8
  pill.fills = solid(C.slate50)
  pill.strokes = [{ type: 'SOLID', color: C.slate100 }]
  pill.strokeWeight = 1
  pill.strokeAlign = 'INSIDE'
  const pillDot = figma.createEllipse()
  pillDot.resize(8, 8)
  pillDot.fills = solid(C.blue500)
  pill.appendChild(pillDot)
  pill.appendChild(wrapTxt('hero-carousel-banner.jpg', 12, C.slate500, 'Medium'))
  body2.appendChild(pill)

  // Headline field
  const headlineSection = vframe('Headline Section', 6)
  headlineSection.layoutSizingHorizontal = 'FILL'
  headlineSection.appendChild(labelNode('Headline', true))
  headlineSection.appendChild(inputField('e.g. Creative Expression'))
  headlineSection.appendChild(wrapTxt('Large title overlaid on the carousel slide.', 11, C.slate400))
  body2.appendChild(headlineSection)

  // Description field
  const descSection = vframe('Description Section', 6)
  descSection.layoutSizingHorizontal = 'FILL'
  descSection.appendChild(labelNode('Description', true))

  const textarea = vframe('Textarea', 0, 10, 12, 60, 12)
  textarea.layoutSizingHorizontal = 'FILL'
  textarea.cornerRadius = 8
  textarea.fills = solid(C.white)
  textarea.strokes = [{ type: 'SOLID', color: C.slate200 }]
  textarea.strokeWeight = 1
  textarea.strokeAlign = 'INSIDE'
  textarea.appendChild(wrapTxt('e.g. Nurturing artistic talents through hands-on activities.', 13, C.slate400))

  descSection.appendChild(textarea)
  descSection.appendChild(wrapTxt('Subtitle shown beneath the headline.', 11, C.slate400))
  body2.appendChild(descSection)

  step2.appendChild(body2)
  step2.appendChild(divider())

  const footer2 = hframe('Footer', 12, 20, 24, 24, 24)
  footer2.layoutSizingHorizontal = 'FILL'
  footer2.primaryAxisAlignItems = 'SPACE_BETWEEN'

  const backBtn = hframe('Button / Back', 6, 9, 20, 9, 20)
  backBtn.cornerRadius = 8
  backBtn.fills = solid(C.white)
  backBtn.strokes = [{ type: 'SOLID', color: C.slate200 }]
  backBtn.strokeWeight = 1
  backBtn.strokeAlign = 'INSIDE'
  backBtn.primaryAxisAlignItems = 'CENTER'
  backBtn.counterAxisAlignItems = 'CENTER'
  backBtn.appendChild(txt('‹ Back', 13, C.slate700, 'Medium'))

  footer2.appendChild(backBtn)
  footer2.appendChild(primaryBtn('Upload', true))
  step2.appendChild(footer2)

  step2.x = 560
  step2.y = 0

  // ── Viewport ──────────────────────────────────────────────────────────
  figma.currentPage.appendChild(step1)
  figma.currentPage.appendChild(step2)
  figma.viewport.scrollAndZoomIntoView([step1, step2])
  figma.closePlugin('✅ Upload Modal frames created!')
}

main().catch(err => figma.closePlugin('❌ Error: ' + err.message))
