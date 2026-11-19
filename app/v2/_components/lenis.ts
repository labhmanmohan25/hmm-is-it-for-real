import type Lenis from "lenis";

// The page's single Lenis instance (null when reduced motion turns smooth scroll off).
export const lenisRef: { current: Lenis | null } = { current: null };
