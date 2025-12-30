# Claude Code Integration Guide - QR2Pay React

This guide helps you work effectively with Claude Code CLI when developing the QR2Pay React application.

## Project Overview

QR2Pay is a Next.js 15 application that generates encrypted QR codes for New Zealand bank payment details. The app uses AES-256-GCM encryption to securely embed payment information in shareable URLs without storing any data in a database.

## Quick Context for Claude Code

### Tech Stack
- **Framework:** Next.js 15.3.5 (App Router) + React 19
- **Language:** TypeScript 5 (strict mode)
- **Styling:** Tailwind CSS 4 + Radix UI components
- **Encryption:** Node.js crypto (AES-256-GCM server-side), crypto-js (client utilities)
- **Deployment:** Azure Web App with IIS (see `web.config` and `startup.js`)
- **Email:** Nodemailer with Gmail SMTP
- **Validation:** NZ bank account validation via `@fnzc/nz-bank-account-validator`

### Key Architecture Patterns

#### 1. Server vs Client Components
- **Server Components:** [app/share/page.tsx](app/share/page.tsx), [app/view/page.tsx](app/view/page.tsx)
- **Client Components:** [components/ClientShare.tsx](components/ClientShare.tsx), [components/ClientView.tsx](components/ClientView.tsx)
- Use `'use client'` directive for components needing interactivity

#### 2. Encryption Flow
- **Key Location:** `SYMMETRIC_KEY` environment variable (32 bytes, base64-encoded)
- **Encryption:** [lib/actions.ts](lib/actions.ts) - `generateAction()` server action
- **Payload Format:** `[iv].[authTag].[encryptedData]` (dot-separated base64)
- **Decryption:** [lib/actions.ts](lib/actions.ts) - `decrypt()` function

#### 3. Data Model
```typescript
// lib/types.ts
interface UserData {
  accountName: string;
  accountNumber: string;
  amount: string;
  reference: string;
  code: string;
  particulars: string;
}
```

#### 4. Routing Structure
```
/                 → Landing page (app/page.tsx)
/create          → QR code creation form (app/create/page.tsx)
/share?data=...  → Display & share QR code (app/share/page.tsx)
/view?data=...   → View payment details (app/view/page.tsx)
/contact         → Contact form (app/contact/page.tsx)
/donate          → Donation page (app/donate/page.tsx)
/api/contact     → Email API endpoint (app/api/contact/route.ts)
```

## Common Development Tasks

### Adding a New Page
1. Create file in [app/](app/) directory (e.g., `app/newpage/page.tsx`)
2. Use `export default function NewPage()` for component
3. Add `'use client'` if interactivity needed
4. Import shared components from [components/](components/)
5. Update [components/header.tsx](components/header.tsx) navigation if needed

### Adding UI Components
- Use existing Shadcn/Radix components from [components/ui/](components/ui/)
- Follow Tailwind utility-first approach
- Use CSS variables for theme colors (see [app/globals.css](app/globals.css))

### Working with Encryption
```typescript
// Server-side encryption (in server actions or API routes)
import { generateAction, decrypt } from '@/lib/actions';

// Encrypt user data
const payload = await generateAction(userData);

// Decrypt payload
const decrypted = decrypt(encryptedPayload);
```

### Environment Variables Required
```env
# Encryption key (32 bytes, base64-encoded)
SYMMETRIC_KEY=<your-key-here>

# Gmail SMTP (for contact form)
EMAIL_USER=<gmail-address>
EMAIL_PASS=<app-password>

# Next.js
NODE_ENV=production
```

### Testing Locally
```bash
# Development
npm run dev        # Starts dev server on http://localhost:3000

# Production build
npm run build      # Creates .next production build
npm start          # Runs production server
```

### Azure Deployment
- **Startup:** [startup.js](startup.js) handles build verification
- **IIS Config:** [web.config](web.config) routes requests to Node.js
- **Build timeout:** 5 minutes maximum
- Set environment variables in Azure App Service Configuration

## Code Conventions

### File Naming
- **Pages:** `page.tsx` in route folders
- **Components:** PascalCase (e.g., `ClientShare.tsx`)
- **Utilities:** camelCase (e.g., `downloadUtils.ts`)
- **Types:** `types.ts` for shared interfaces

### Styling
- **Tailwind classes** for all styling
- **CSS variables** for theme colors (HSL-based)
- **Responsive design:** Use Tailwind breakpoints (`sm:`, `md:`, `lg:`)

### TypeScript
- **Strict mode** enabled
- Define types in [lib/types.ts](lib/types.ts)
- Use `interface` for data structures
- Avoid `any` - use proper typing

### Component Structure
```typescript
'use client'; // If needed

import { ... } from '...';

export default function ComponentName() {
  // State and hooks
  const [state, setState] = useState();

  // Event handlers
  const handleEvent = () => { ... };

  // Render
  return (
    <div className="...">
      {/* JSX */}
    </div>
  );
}
```

## Security Considerations

### When Modifying Encryption
- **Never** store decrypted data in localStorage/sessionStorage
- **Always** use server-side encryption for sensitive operations
- **Validate** all inputs before encryption
- **Test** encryption/decryption round-trip thoroughly

### Input Validation
- NZ bank accounts: Use [lib/types.ts](lib/types.ts) validation helper
- Sanitize user inputs before displaying
- Validate on both client and server

### API Routes
- **Always** validate request methods (POST, GET, etc.)
- **Return** appropriate status codes
- **Handle** errors gracefully
- **Never** expose sensitive env variables

## Troubleshooting with Claude Code

### "Module not found" errors
1. Check [tsconfig.json](tsconfig.json) path aliases (`@/*` → root)
2. Verify imports use correct paths
3. Run `npm install` if package missing

### Build failures in Azure
1. Check [startup.js](startup.js) logs
2. Verify environment variables are set
3. Ensure `SYMMETRIC_KEY` is base64-encoded 32 bytes
4. Check [web.config](web.config) IIS settings

### Encryption/Decryption issues
1. Verify `SYMMETRIC_KEY` matches between encrypt/decrypt
2. Check payload format: `[iv].[authTag].[encryptedData]`
3. Ensure base64 encoding is URL-safe (no padding issues)
4. Test with [lib/actions.ts](lib/actions.ts) directly

### Styling not applying
1. Check Tailwind config in [tailwind.config.js](tailwind.config.js)
2. Verify CSS variables in [app/globals.css](app/globals.css)
3. Clear `.next` cache and rebuild

## Useful Claude Code Prompts

### Code Review
```
Review the encryption implementation in lib/actions.ts for security vulnerabilities
```

### Feature Addition
```
Add a new field "email" to the payment form in app/create/page.tsx and update the encryption flow
```

### Bug Fixing
```
The QR code download feature in components/ClientShare.tsx isn't working on mobile Safari
```

### Refactoring
```
Extract the bank account validation logic from app/create/page.tsx into a reusable utility function
```

### Testing
```
Write unit tests for the decrypt function in lib/actions.ts
```

## Project-Specific Notes

### NZ Bank Account Format
- Format: `XX-XXXX-XXXXXXX-XXX` (bank-branch-account-suffix)
- Validation uses checksum algorithm
- Library: `@fnzc/nz-bank-account-validator`

### QR Code Generation
- **Display:** `qrcode.react` component
- **External API:** `api.qrserver.com` for fallback
- **Download:** HTML-to-image conversion via `html-to-image`

### Email Contact Form
- **SMTP:** Gmail with App Passwords (not regular password)
- **Template:** HTML email in [app/api/contact/route.ts](app/api/contact/route.ts)
- **Rate limiting:** None currently (consider adding)

## Resources

- **Next.js 15 Docs:** https://nextjs.org/docs
- **Tailwind CSS:** https://tailwindcss.com/docs
- **Radix UI:** https://www.radix-ui.com/
- **Node.js Crypto:** https://nodejs.org/api/crypto.html
- **Azure App Service Node.js:** https://learn.microsoft.com/en-us/azure/app-service/

## Quick Reference

### Important Files
| File | Purpose |
|------|---------|
| [lib/actions.ts](lib/actions.ts) | Encryption/decryption server actions |
| [lib/types.ts](lib/types.ts) | TypeScript interfaces |
| [lib/keyManager.ts](lib/keyManager.ts) | Symmetric key retrieval |
| [components/header.tsx](components/header.tsx) | Navigation header |
| [app/layout.tsx](app/layout.tsx) | Root layout with toast notifications |
| [next.config.ts](next.config.ts) | Next.js configuration |
| [web.config](web.config) | IIS/Azure configuration |
| [startup.js](startup.js) | Azure startup script |

### Commands
```bash
npm run dev          # Development server
npm run build        # Production build
npm run start        # Production server
npm run lint         # ESLint check
```

---

**Last Updated:** 2025-12-27
**Next.js Version:** 15.3.5
**Node.js Version:** 22.x
