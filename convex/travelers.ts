import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Get traveler by ID
export const get = query({
  args: { travelerId: v.id("travelers") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.travelerId);
  },
});

// Get traveler by email
export const getByEmail = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    const traveler = await ctx.db
      .query("travelers")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .unique();
    return traveler;
  },
});

// Create traveler (sign up)
export const create = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    bio: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Check if already exists
    const existing = await ctx.db
      .query("travelers")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .unique();
    if (existing) return existing;

    return await ctx.db.insert("travelers", {
      name: args.name,
      email: args.email,
      bio: args.bio,
      followerCount: 0,
      followingCount: 0,
      travelCount: 0,
    });
  },
});

// Get top travelers by follower count
export const popular = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("travelers")
      .withIndex("by_followerCount")
      .order("desc")
      .take(args.limit ?? 10);
  },
});

// Get traveler's travel count
export const getStats = query({
  args: { travelerId: v.id("travelers") },
  handler: async (ctx, args) => {
    const traveler = await ctx.db.get(args.travelerId);
    if (!traveler) return null;

    const travels = await ctx.db
      .query("travels")
      .withIndex("by_traveler", (q) => q.eq("travelerId", args.travelerId))
      .collect();

    return {
      ...traveler,
      travelCount: travels.length,
    };
  },
});
