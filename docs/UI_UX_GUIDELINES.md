# P314 UI/UX Guidelines

## Overview
This document outlines best practices for maintaining consistent, accessible, and responsive UI/UX across the P314 application.

## Responsive Design

### Breakpoints
- **Mobile (xs)**: < 640px
- **Small (sm)**: ≥ 640px
- **Medium (md)**: ≥ 768px
- **Large (lg)**: ≥ 1024px
- **Extra Large (xl)**: ≥ 1280px

### Mobile-First Approach
Always design for mobile first, then enhance for larger screens using Tailwind's responsive prefixes.

```tsx
// Bad
<div className="grid grid-cols-3 gap-8">

// Good
<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 sm:gap-4 md:gap-6">
```

## Component Usage

### Skeletons for Loading States
Use skeleton loaders when fetching data to improve perceived performance.

```tsx
import { MessageSkeleton, ChannelListSkeleton } from "@/components/message-skeleton"

{isLoading ? <MessageSkeleton /> : <MessageList messages={messages} />}
```

### Empty States
Always provide meaningful empty states with icons and actions.

```tsx
import { EmptyState } from "@/components/empty-state"

<EmptyState
  icon={Users}
  title="No channels yet"
  description="Join a channel to start connecting"
  action={{ label: "Browse channels", onClick: handleBrowse }}
/>
```

### Error Boundaries
Wrap components that might error in error boundaries for graceful degradation.

```tsx
import { ErrorBoundary } from "@/components/error-boundary"

<ErrorBoundary onReset={handleReset}>
  <ComplexComponent />
</ErrorBoundary>
```

## Typography

### Font Sizes
- **xs**: 0.75rem (12px) - Help text, captions
- **sm**: 0.875rem (14px) - Body text, labels
- **base**: 1rem (16px) - Default body text
- **lg**: 1.125rem (18px) - Card titles
- **xl**: 1.25rem (20px) - Section titles
- **2xl**: 1.5rem (24px) - Page titles

### Line Heights
- Body text: `leading-relaxed` (1.625) for paragraphs
- Headings: `leading-tight` (1.25) for impact
- Form labels: `leading-none` (1) for compactness

## Colors & Contrast

### Color Usage
- **Primary**: Action buttons, key highlights (#674198 Pi Purple)
- **Destructive**: Delete, error states (red)
- **Muted**: Disabled states, secondary text
- **Background**: Page background (white)
- **Foreground**: Primary text (nearly black)

### Accessibility
- Maintain WCAG AA contrast ratios (4.5:1 for text)
- Don't rely on color alone to convey information
- Test with accessibility tools regularly

## Spacing

### Tailwind Scale
- `p-2` = 8px (small padding)
- `p-3` = 12px (medium padding)
- `p-4` = 16px (standard padding)
- `p-6` = 24px (large padding)
- `p-8` = 32px (extra large padding)

### Guidelines
- Use consistent spacing for visual rhythm
- Mobile: smaller spacing (p-2, p-3)
- Desktop: larger spacing (p-4, p-6)

## Interactive Elements

### Buttons
```tsx
// Primary action
<Button onClick={handleClick}>Primary Action</Button>

// Secondary action
<Button variant="outline" onClick={handleClick}>Secondary Action</Button>

// Destructive
<Button variant="destructive" onClick={handleDelete}>Delete</Button>

// Disabled state
<Button disabled>Disabled</Button>
```

### Form Inputs
Always wrap in FormGroup for consistent styling and error handling.

```tsx
import { FormGroup } from "@/components/form-group"

<FormGroup label="Email" required error={errors.email} hint="We'll never share this">
  <Input type="email" {...register("email")} />
</FormGroup>
```

## Performance

### Image Optimization
- Use Next.js Image component for automatic optimization
- Provide alt text for all images
- Use responsive sizes: `sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"`

### Code Splitting
- Use dynamic imports for heavy components
- Lazy load modals and dialogs
- Implement pagination for large lists

## Accessibility

### ARIA Labels
```tsx
<button aria-label="Close menu" onClick={closeMenu}>
  <X size={24} />
</button>
```

### Keyboard Navigation
- All interactive elements must be focusable
- Implement logical tab order
- Support Escape key for dismissing dialogs

### Screen Readers
```tsx
// Bad
<div onClick={handleClick}>Click me</div>

// Good
<button onClick={handleClick}>Click me</button>

// With label
<label htmlFor="email">Email</label>
<input id="email" type="email" />
```

## Component Patterns

### Loading States
1. Show skeleton if loading
2. Show data when ready
3. Show error with retry option
4. Show empty state if no data

### Error Handling
```tsx
if (error) {
  return <EmptyState icon={AlertTriangle} title="Error loading data" />
}
```

### Pagination
- Default 20 items per page
- Show total count
- Implement cursor-based pagination for performance

## Testing Checklist

- [ ] Responsive on mobile, tablet, desktop
- [ ] All buttons/links accessible via keyboard
- [ ] Loading states show appropriately
- [ ] Error messages are clear and helpful
- [ ] Images have alt text
- [ ] Color contrast meets WCAG AA standards
- [ ] Forms have proper labels
- [ ] Touch targets are at least 44x44px on mobile
