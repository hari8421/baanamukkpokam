import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// List recent travels
export const list = query({
  args: {
    limit: v.optional(v.number()),
    vibe: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let q = ctx.db
      .query("travels")
      .withIndex("by_publishedAt")
      .order("desc");

    if (args.vibe) {
      q = ctx.db
        .query("travels")
        .withIndex("by_vibe", (idx) => idx.eq("vibe", args.vibe!))
        .order("desc");
    }

    const travels = await q.take(args.limit ?? 20);

    // Enrich with traveler name
    const enriched = await Promise.all(
      travels.map(async (t) => {
        const traveler = await ctx.db.get(t.travelerId);
        return { ...t, travelerName: traveler?.name ?? "Unknown" };
      })
    );
    return enriched;
  },
});

// Get single travel with photos and moments
export const get = query({
  args: { travelId: v.id("travels") },
  handler: async (ctx, args) => {
    const travel = await ctx.db.get(args.travelId);
    if (!travel) return null;

    const traveler = await ctx.db.get(travel.travelerId);

    const photos = await ctx.db
      .query("photos")
      .withIndex("by_travel", (q) => q.eq("travelId", args.travelId))
      .order("asc")
      .collect();

    const moments = await ctx.db
      .query("moments")
      .withIndex("by_travel", (q) => q.eq("travelId", args.travelId))
      .collect();

    return {
      ...travel,
      travelerName: traveler?.name ?? "Unknown",
      photos,
      moments,
    };
  },
});

// Get travels by a specific traveler
export const byTraveler = query({
  args: { travelerId: v.id("travelers") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("travels")
      .withIndex("by_traveler", (q) => q.eq("travelerId", args.travelerId))
      .order("desc")
      .collect();
  },
});

// Create a new travel
export const create = mutation({
  args: {
    travelerId: v.id("travelers"),
    title: v.string(),
    description: v.optional(v.string()),
    from: v.string(),
    to: v.string(),
    route: v.string(),
    vibe: v.string(),
    vehicle: v.optional(v.string()),
    photoCount: v.number(),
  },
  handler: async (ctx, args) => {
    const travelId = await ctx.db.insert("travels", {
      travelerId: args.travelerId,
      title: args.title,
      description: args.description,
      from: args.from,
      to: args.to,
      route: args.route,
      vibe: args.vibe,
      vehicle: args.vehicle,
      photoCount: args.photoCount,
      momentCount: 0,
      reliveCount: 0,
      likeCount: 0,
      viewCount: 0,
      publishedAt: Date.now(),
    });

    // Increment traveler's travel count
    const traveler = await ctx.db.get(args.travelerId);
    if (traveler) {
      await ctx.db.patch(args.travelerId, {
        travelCount: traveler.travelCount + 1,
      });
    }

    return travelId;
  },
});

// Record a view
export const recordView = mutation({
  args: { travelId: v.id("travels") },
  handler: async (ctx, args) => {
    const travel = await ctx.db.get(args.travelId);
    if (travel) {
      await ctx.db.patch(args.travelId, {
        viewCount: travel.viewCount + 1,
      });
    }
  },
});
