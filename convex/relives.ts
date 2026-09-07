import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Start a relive session
export const start = mutation({
  args: {
    travelerId: v.id("travelers"),
    travelId: v.id("travels"),
  },
  handler: async (ctx, args) => {
    // Increment relive count
    const travel = await ctx.db.get(args.travelId);
    if (travel) {
      await ctx.db.patch(args.travelId, {
        reliveCount: travel.reliveCount + 1,
      });
    }

    return await ctx.db.insert("relives", {
      travelerId: args.travelerId,
      travelId: args.travelId,
      favoritedMoments: [],
    });
  },
});

// Complete a relive session
export const complete = mutation({
  args: {
    reliveId: v.id("relives"),
    favoritedMoments: v.array(v.id("moments")),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.reliveId, {
      completedAt: Date.now(),
      favoritedMoments: args.favoritedMoments,
    });
  },
});

// Get relive count for a travel
export const countByTravel = query({
  args: { travelId: v.id("travels") },
  handler: async (ctx, args) => {
    const relives = await ctx.db
      .query("relives")
      .withIndex("by_travel", (q) => q.eq("travelId", args.travelId))
      .collect();
    return relives.length;
  },
});
