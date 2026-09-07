import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Toggle like on a travel
export const toggle = mutation({
  args: {
    travelerId: v.id("travelers"),
    travelId: v.id("travels"),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("likes")
      .withIndex("by_pair", (q) =>
        q.eq("travelerId", args.travelerId).eq("travelId", args.travelId)
      )
      .unique();

    if (existing) {
      await ctx.db.delete(existing._id);
      const travel = await ctx.db.get(args.travelId);
      if (travel && travel.likeCount > 0) {
        await ctx.db.patch(args.travelId, {
          likeCount: travel.likeCount - 1,
        });
      }
      return false;
    } else {
      await ctx.db.insert("likes", {
        travelerId: args.travelerId,
        travelId: args.travelId,
      });
      const travel = await ctx.db.get(args.travelId);
      if (travel) {
        await ctx.db.patch(args.travelId, {
          likeCount: travel.likeCount + 1,
        });
      }
      return true;
    }
  },
});

// Check if liked
export const isLiked = query({
  args: {
    travelerId: v.id("travelers"),
    travelId: v.id("travels"),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("likes")
      .withIndex("by_pair", (q) =>
        q.eq("travelerId", args.travelerId).eq("travelId", args.travelId)
      )
      .unique();
    return existing !== null;
  },
});

// Get liked travels by a traveler
export const likedBy = query({
  args: { travelerId: v.id("travelers") },
  handler: async (ctx, args) => {
    const likes = await ctx.db
      .query("likes")
      .withIndex("by_traveler", (q) => q.eq("travelerId", args.travelerId))
      .collect();

    const travels = await Promise.all(
      likes.map(async (l) => {
        return await ctx.db.get(l.travelId);
      })
    );
    return travels.filter(Boolean);
  },
});
