/**
 * Zod schema for validating workspace creation/update inputs
 *
 * Validation rules:
 * - name: Required string with minimum length of 1 character
 *
 * @example
 * ```typescript
 * // Valid input
 * workspaceSchema.parse({ name: "My Workspace" }); // ✓
 *
 * // Invalid inputs
 * workspaceSchema.parse({ name: "" }); // ✗ "Workspace name cannot be empty"
 * workspaceSchema.parse({}); // ✗ Required
 * ```
 *
 * @type {z.ZodObject<{name: z.ZodString}>}
 */

import { z } from "zod";

export const workspaceSchema = z.object({
  name: z.string().min(1, { message: "Workspace name cannot be empty" }),
});
