# Pi Network Brand Identity Guide for P314

## Official Brand Colors

### Primary Colors
- **Pi Purple**: `#674198` (RGB: 103, 65, 152)
  - Used for: Primary buttons, headers, accent elements
  - Tailwind class: `bg-pi-purple` or `text-pi-purple`
  
- **Pi Purple Dark**: `#442371` (RGB: 68, 35, 113)
  - Used for: Dark accents, hover states, borders
  - Tailwind class: `bg-pi-purple-800` or `text-pi-purple-800`

### Background Colors
- **Light Background**: `#F5F5F5` (RGB: 245, 245, 245)
  - Used for: Page backgrounds
  - Tailwind class: `bg-background`
  
- **White**: `#FFFFFF`
  - Used for: Cards, modals, elevated surfaces
  - Tailwind class: `bg-white`

## Color Usage Guidelines

### DO's ✓
- Use Pi Purple (#674198) for all primary actions and brand elements
- Use Pi Purple Dark (#442371) for hover states and dark accents
- Maintain light gray (#F5F5F5) or white backgrounds
- Ensure text contrast meets WCAG AA standards (4.5:1 minimum)
- Use the provided CSS variables: `--pi-purple`, `--pi-purple-dark`

### DON'Ts ✗
- Never use random purple shades (e.g., purple-500, purple-600 from Tailwind's default palette)
- Avoid using Pi Purple as background for large text areas
- Don't mix Pi Purple with other brand purples

## Accessibility

### Contrast Ratios (WCAG AA Compliant)
- Pi Purple (#674198) on White: 7.04:1 ✓
- White text on Pi Purple: 7.04:1 ✓
- Pi Purple Dark (#442371) on White: 11.25:1 ✓

## CSS Variables

Use these variables for consistent theming:

```css
--pi-purple: 262 53% 40%;
--pi-purple-dark: 262 53% 29%;
--pi-purple-light: 262 53% 95%;
--pi-purple-hover: 262 53% 35%;
```

## Tailwind Classes

### Direct Color Usage
```tsx
// Backgrounds
<div className="bg-pi-purple">
<div className="bg-pi-purple-800">
<div className="bg-pi-purple-50"> // Light variant

// Text
<span className="text-pi-purple">
<span className="text-pi-purple-800">

// Borders
<div className="border-pi-purple">
<div className="border-pi-purple-800">
```

### Utility Classes
```tsx
// Gradient backgrounds
<div className="pi-purple-gradient">
<div className="pi-purple-gradient-light">

// Quick utilities
<div className="pi-bg pi-text pi-border">
```

## Responsive Design

All components follow mobile-first approach:
- Base styles for mobile (320px+)
- Tablet: `sm:` prefix (640px+)
- Desktop: `md:` prefix (768px+)
- Large: `lg:` prefix (1024px+)

## Component Examples

### Buttons
```tsx
// Primary button
<Button className="bg-pi-purple hover:bg-pi-purple-800 text-white">

// Secondary button
<Button className="border-2 border-pi-purple text-pi-purple hover:bg-pi-purple hover:text-white">
```

### Cards
```tsx
// Standard card with Pi branding
<Card className="border-pi-purple-200 bg-gradient-to-br from-pi-purple-50 to-white">
```

### Badges/Tags
```tsx
<Badge className="bg-pi-purple-100 text-pi-purple-800">
```

## Brand Consistency Checklist

- [ ] All purple shades use official Pi colors
- [ ] Background is #F5F5F5 or white
- [ ] Text contrast meets WCAG AA standards
- [ ] Hover states use Pi Purple Dark (#442371)
- [ ] Mobile-first responsive design implemented
- [ ] CSS variables used instead of hard-coded hex values
- [ ] No conflicting color systems (removed old purples)

## Migration from Old Colors

Replace these old classes with Pi Network brand colors:

| Old Class | New Class |
|-----------|-----------|
| `purple-600` | `pi-purple` |
| `purple-700` | `pi-purple-700` |
| `purple-800` | `pi-purple-800` |
| `purple-50` | `pi-purple-50` |
| `purple-100` | `pi-purple-100` |
| `from-purple-50` | `from-pi-purple-50` |
| `to-purple-50` | `to-pi-purple-50` |

## Testing

Test in multiple environments:
- Light mode and dark mode
- Different screen sizes (mobile, tablet, desktop)
- Various browsers (Chrome, Firefox, Safari)
- Accessibility tools (WAVE, axe DevTools)
