import { SITE_CONFIG } from "@/lib/constants";

/* ============================================================
   Footer — Minimal site footer.
   
   A clean, minimal footer with copyright and navigation links.
   ============================================================ */

/**
 * Minimal site footer with copyright and optional links.
 */
export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-[var(--border-primary)] mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Left: Brand */}
          <div className="flex items-center gap-2">
            <div
              className="w-6 h-6 rounded-md flex items-center justify-center text-white text-xs font-bold"
              style={{
                background:
                  "linear-gradient(135deg, var(--color-accent-blue), var(--color-accent-violet))",
              }}
            >
              N
            </div>
            <span className="text-sm text-[var(--text-secondary)]">
              {SITE_CONFIG.name}
            </span>
          </div>

          {/* Center: Tagline */}
          <p className="text-xs text-[var(--text-tertiary)] text-center max-w-sm">
            {SITE_CONFIG.tagline}
          </p>

          {/* Right: Copyright */}
          <p className="text-xs text-[var(--text-tertiary)]">
            &copy; {currentYear} {SITE_CONFIG.author}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
