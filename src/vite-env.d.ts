/// <reference types="vite/client" />

// Shape produced by the markdown-frontmatter plugin in vite.config.ts
declare module '*.md' {
  export const data: Record<string, unknown>;
  export const content: string;
  export const readingMinutes: number;
}
