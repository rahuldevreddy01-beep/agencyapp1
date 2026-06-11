# CMS + UI Overhaul 
# COMPLETED TASK 1 2 3 9 
# NEED TO DO TASK 4 5 6 7 8

## Task 1: New SQL Schema (`schema.sql`)
Drop all old tables/functions/triggers. Create fresh schema:

- **`services`** -- id, title, description, category (web_static/web_dynamic/web_fullstack/web_ecommerce/mobile_app/java_proxy/courses/ui_ux), price_start NUMERIC, price_end NUMERIC, duration, image_url, icon_name, features TEXT[], tech_stack TEXT[], is_active, sort_order
- **`recent_works`** -- id, title, category, image_url, description, color_hex, sort_order, is_active
- **`testimonials`** -- id, name, role, avatar_url, text, rating (1-5), is_active, sort_order
- **`courses`** -- id, title, description, category, price, duration, students_count, image_url, icon_name, grad_color_1, grad_color_2, is_special, is_active, sort_order
- RLS: all tables readable by everyone (public SELECT), no auth required for read
- Seed data matching current hardcoded UI content (services in rupees, 4 website types, mobile apps, proxy interviews, courses, 3 recent works, 3 testimonials)

## Task 2: Update TypeScript types (`lib/types.ts`)
Add interfaces: `Service`, `RecentWork`, `Testimonial`, `Course` matching the new DB columns. Update `Category` type to match new categories.

## Task 3: Create Supabase data hooks (`lib/useData.ts`)
Custom hooks that fetch from Supabase:
- `useServices()` -- fetches services ordered by sort_order
- `useRecentWorks()` -- fetches recent_works
- `useTestimonials()` -- fetches testimonials
- `useCourses()` -- fetches courses

Each returns `{ data, loading }`. Uses `useEffect` + `useState` with `supabase.from('table').select('*').eq('is_active', true).order('sort_order')`.

## Task 4: HomeScreen Parallax Hero (`screens/HomeScreen.tsx`)
Hero section stays pinned at top, content sections scroll over it:

```tsx
<View style={{ flex: 1 }}>
  {/* Hero pinned behind */}
  <View style={[StyleSheet.absoluteFill, { top: 52 }]}>
    {hero content}
  </View>
  {/* Content slides over hero */}
  <ScrollView style={{ flex: 1 }}>
    <View style={{ height: heroHeight }} /> {/* spacer */}
    <View style={{ backgroundColor: BG, borderTopLeftRadius: 24, borderTopRightRadius: 24 }}>
      {drag handle bar}
      {Expertise section from Supabase}
      {Testimonials from Supabase}
      {Recent Works from Supabase}
    </View>
  </ScrollView>
</View>
```

- Content panel has `borderTopLeftRadius: 24` + `borderTopRightRadius: 24` for the "sheet" look
- Small drag handle pill at top of content panel
- Expertise, Testimonials, Recent Works all fetched from Supabase
- Total animation stagger: max delay ~600ms + 350ms duration = ~950ms total

## Task 5: ServicesScreen Redesign (`screens/ServicesScreen.tsx`)
- Fetch services from Supabase via `useServices()`
- Display as tappable cards (current card layout preserved)
- Tapping a card calls `onServiceSelect(service)` prop to navigate to detail
- Add `onServiceSelect` prop to component interface
- Keep Mobile Apps, Proxy Interviews, Courses Preview sections (also from Supabase data)

## Task 6: ServiceDetailScreen (`screens/ServiceDetailScreen.tsx`) -- NEW
Full-screen detail view for a service:
- Back button at top
- Hero image/gradient area with category badge
- Title, description, duration, price range
- Features list (checkmark icons)
- Tech stack tags
- "Inquire Now" CTA button
- Receives `service` object + `onBack` callback as props

## Task 7: CoursesScreen + Testimonials (`screens/CoursesScreen.tsx`)
- Fetch courses from Supabase via `useCourses()`
- Add Testimonials section below course cards
- Fetch testimonials via `useTestimonials()`
- Each testimonial: avatar circle, name, role, quote text, star rating

## Task 8: Wire up App.tsx
- Re-add Supabase import
- Add `selectedService` state for service detail navigation
- When `selectedService` is set, render `ServiceDetailScreen` instead of `ServicesScreen`
- Pass `onServiceSelect` to ServicesScreen
- Back handler clears `selectedService`

## Task 9: Animation Timing (`components/Animations.tsx` + all screens)
- FadeInUp default duration: 250ms (from 350ms)
- FadeIn default duration: 200ms (from 300ms)
- ScaleIn default duration: 200ms (from 280ms)
- Reduce all max stagger delays so total animation completes in ~1 second
- Spring configs: higher stiffness (220) + damping (18) for snappier settle

## Task 10: Verify and test
- TypeScript compiles clean
- All screens render with Supabase data
- Service detail navigation works
- Parallax hero scroll feels natural
