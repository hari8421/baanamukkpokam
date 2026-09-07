import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Get moments for a travel
export const byTravel = query({
  args: { travelId: v.id("travels") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("moments")
      .withIndex("by_travel", (q) => q.eq("travelId", args.travelId))
      .collect();
  },
});

// Get moments for a specific photo
export const byPhoto = query({
  args: { photoId: v.id("photos") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("moments")
      .withIndex("by_photo", (q) => q.eq("photoId", args.photoId))
      .collect();
  },
});

// Add a moment to a photo
export const add = mutation({
  args: {
    photoId: v.id("photos"),
    travelId: v.id("travels"),
    travelerId: v.id("travelers"),
    type: v.union(
      v.literal("exciting"),
      v.literal("scenic"),
      v.literal("nostalgic"),
      v.literal("wildlife"),
      v.literal("food"),
      v.literal("landmark"),
      v.literal("sunset"),
      v.literal("monsoon"),
      v.literal("custom")
    ),
    label: v.string(),
    note: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const momentId = await ctx.db.insert("moments", {
      ...args,
      createdAt: Date.now(),
    });

    // Increment travel's moment count
    const travel = await ctx.db.get(args.travelId);
    if (travel) {
      await ctx.db.patch(args.travelId, {
        momentCount: travel.momentCount + 1,
      });
    }

    return momentId;
  },
});

// Delete a moment
export const remove = mutation({
  args: { momentId: v.id("moments") },
  handler: async (ctx, args) => {
    const moment = await ctx.db.get(args.momentId);
    if (moment) {
      await ctx.db.delete(args.momentId);
      // Decrement moment count
      const travel = await ctx.db.get(moment.travelId);
      if (travel && travel.momentCount > 0) {
        await ctx.db.patch(moment.travelId, {
          momentCount: travel.momentCount - 1,
        });
      }
    }
  },
});

// Get all moments for a traveler (across all their travels)
export const byTraveler = query({
  args: { travelerId: v.id("travelers") },
  handler: async (ctx, args) => {
    const travels = await ctx.db
      .query("travels")
      .withIndex("by_traveler", (q) => q.eq("travelerId", args.travelerId))
      .collect();

    const allMoments = [];
    for (const travel of travels) {
      const moments = await ctx.db
        .query("moments")
        .withIndex("by_travel", (q) => q.eq("travelId", travel._id))
        .collect();
      allMoments.push(...moments);
    }
    return allMoments;
  },
});

// Get exciting moments across all travels (for discovery)
export const highlights = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const moments = await ctx.db
      .query("moments")
      .withIndex("by_type", (q) =>
        q.eq("type", "scenic")
      )
      .take(args.limit ?? 20);

    const moments2 = await ctx.db
      .query("moments")
      .withIndex("by_type", (q) =>
        q.eq("type", "exciting")
      )
      .take(args.limit ?? 20);

    return [...moments, ...moments2].slice(0, args.limit ?? 20);
  },
});
