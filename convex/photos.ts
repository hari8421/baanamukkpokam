import { mutation } from "./_generated/server";
import { v } from "convex/values";

// Add a photo to a travel
export const add = mutation({
  args: {
    travelId: v.id("travels"),
    index: v.number(),
    gradient: v.string(),
    caption: v.string(),
    time: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("photos", {
      travelId: args.travelId,
      index: args.index,
      gradient: args.gradient,
      caption: args.caption,
      time: args.time,
    });
  },
});

// Bulk add photos
export const addMany = mutation({
  args: {
    travelId: v.id("travels"),
    photos: v.array(
      v.object({
        index: v.number(),
        gradient: v.string(),
        caption: v.string(),
        time: v.string(),
      })
    ),
  },
  handler: async (ctx, args) => {
    const ids = [];
    for (const photo of args.photos) {
      const id = await ctx.db.insert("photos", {
        travelId: args.travelId,
        ...photo,
      });
      ids.push(id);
    }
    return ids;
  },
});
