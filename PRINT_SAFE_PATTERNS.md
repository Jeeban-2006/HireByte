# Quick Reference: Print-Safe Resume Components

## 🎯 When to Use What

### Scenario 1: Link That Should Be Interactive on Screen, Text in PDF
```tsx
{url && (
  <>
    {/* Screen: Interactive link */}
    <a href={url} className="screen:inline print:hidden text-primary">
      Link Text
    </a>
    {/* Print: Static text */}
    <span className="screen:hidden print:inline text-gray-700">
      Link Text
    </span>
  </>
)}
```

### Scenario 2: Right-Aligned Metadata (Dates, Locations)
```tsx
{/* Use grid, NOT flex justify-between */}
<div className="grid grid-cols-[1fr_auto] items-baseline gap-1">
  <h3 className="print:text-black">{title}</h3>
  <span className="print:text-gray-700 whitespace-nowrap">{date}</span>
</div>
```

### Scenario 3: Two-Column Layout (Content Left, Metadata Right)
```tsx
<div className="grid grid-cols-[1fr_auto] items-start gap-1">
  <div>
    <p className="print:text-gray-700">{leftContent}</p>
  </div>
  <p className="print:text-gray-700 whitespace-nowrap">{rightContent}</p>
</div>
```

---

## 🚫 DO NOT Use in PDF Context

❌ `flex justify-between` - Breaks in PDF  
❌ `<a>` without screen/print separation - Shows full URL  
❌ Colored backgrounds - May not print well  
❌ Complex animations/transitions - Ignored in print  

---

## ✅ DO Use for PDF Stability

✅ `grid grid-cols-[1fr_auto]` - PDF-stable alignment  
✅ `print:text-black` - ATS-friendly text  
✅ `print:hidden` / `screen:hidden` - Clean separation  
✅ `whitespace-nowrap` - Prevent text wrapping  
✅ `print:page-break-inside-avoid` - Keep sections together  

---

## 📋 Tailwind Classes Cheat Sheet

| Class | When to Use |
|-------|-------------|
| `screen:inline` | Show element only on screen, hide in PDF |
| `screen:flex` | Flex layout on screen, hidden in PDF |
| `print:hidden` | Hide element in PDF (e.g., icons, buttons) |
| `print:inline` | Show element in PDF, hidden on screen |
| `print:text-black` | Force black text in PDF for ATS |
| `print:text-gray-700` | Subtle metadata text in PDF |
| `print:leading-tight` | Compact line spacing in PDF |
| `grid grid-cols-[1fr_auto]` | Two-column layout (left flex, right fixed) |
| `whitespace-nowrap` | Prevent dates/locations from wrapping |

---

## 🧪 Testing Your Changes

1. **Screen Test**: Check interactive elements work
2. **Print Preview** (Ctrl+P): Verify no URLs appear
3. **PDF Download**: Ensure alignment is correct
4. **ATS Test**: Parse PDF through ATS checker

---

## 💡 Common Patterns

### Pattern: Contact Info Header
```tsx
<div className="flex justify-center items-center gap-x-1.5 flex-wrap">
  {email && (
    <a href={`mailto:${email}`} className="flex items-center gap-1.5">
      <Mail className="h-3 w-3" /> {email}
    </a>
  )}
  {linkedin && (
    <>
      <a href={linkedin} className="screen:flex print:hidden items-center gap-1.5">
        <Linkedin className="h-3 w-3" /> LinkedIn
      </a>
      <span className="screen:hidden print:inline-flex items-center gap-1.5">
        <Linkedin className="h-3 w-3 print:hidden" />LinkedIn
      </span>
    </>
  )}
</div>
```

### Pattern: Section Header
```tsx
<section className="mb-1.5 print:mb-1 print:page-break-inside-avoid">
  <h2 className="text-xs font-bold uppercase tracking-wide text-primary mb-0.5 border-b border-primary pb-0 print:text-xs print:mb-0.5">
    {title}
  </h2>
  {/* Content */}
</section>
```

### Pattern: Experience/Education Item
```tsx
<div className="print:page-break-inside-avoid">
  {/* Title + Date */}
  <div className="grid grid-cols-[1fr_auto] items-baseline gap-1">
    <h3 className="font-bold text-xs print:text-black">{title}</h3>
    <span className="text-xs text-muted-foreground print:text-gray-700 whitespace-nowrap">
      {date}
    </span>
  </div>
  
  {/* Subtitle + Location */}
  <div className="grid grid-cols-[1fr_auto] items-baseline text-muted-foreground print:text-gray-700 text-xs gap-1">
    <p className="italic">{subtitle}</p>
    <p className="italic text-xs whitespace-nowrap">{location}</p>
  </div>
  
  {/* Description */}
  <ul className="list-disc list-inside mt-0.5 text-muted-foreground/90 print:text-black text-xs">
    {items.map(item => <li key={item.id}>{item.text}</li>)}
  </ul>
</div>
```

---

## 🔧 Debugging Print Issues

### Issue: URLs Still Showing in PDF
**Solution**: Ensure `a[href]:after { content: "" }` is in globals.css

### Issue: Right-Aligned Content Not Aligned
**Solution**: Replace `flex justify-between` with `grid grid-cols-[1fr_auto]`

### Issue: Screen/Print Variants Not Working
**Solution**: Check that custom screen variant is in tailwind.config.ts

### Issue: Text Too Small/Large in PDF
**Solution**: Use `print:text-[size]` utilities (e.g., `print:text-xs`)

---

## 📚 File Locations

- **Main Component**: [src/components/resume/ResumePreview.tsx](src/components/resume/ResumePreview.tsx)
- **Print Styles**: [src/app/globals.css](src/app/globals.css)
- **Tailwind Config**: [tailwind.config.ts](tailwind.config.ts)
- **Full Documentation**: [PDF_RENDERING_FIXES.md](PDF_RENDERING_FIXES.md)

---

**Last Updated**: January 29, 2026  
**Maintained By**: Development Team
