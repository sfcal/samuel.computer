// Small facts about a post, shared by the pages that list and show them.

// frontmatter dates are plain days ("2025-07-30"), read as UTC midnight
export const isoDate = post => post.data.date.toISOString().slice(0, 10);

// at 200 words a minute
export const minutesToRead = post => Math.max(1, Math.round(post.body.trim().split(/\s+/).length / 200));
