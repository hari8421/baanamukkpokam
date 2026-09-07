import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Follow a traveler
export const follow = mutation({
  args: {
    followerId: v.id("travelers"),
    followingId: v.id("travelers"),
  },
  handler: async (ctx, args) => {
    if (args.followerId === args.followingId) return;

    // Check if already following
    const existing = await ctx.db
      .query("follows")
      .withIndex("by_pair", (q) =>
        q.eq("followerId", args.followerId).eq("followingId", args.followingId)
      )
      .unique();
    if (existing) return existing._id;

    const followId = await ctx.db.insert("follows", {
      followerId: args.followerId,
      followingId: args.followingId,
    });

    // Update counts
    const follower = await ctx.db.get(args.followerId);
    const following = await ctx.db.get(args.followingId);
    if (follower) {
      await ctx.db.patch(args.followerId, {
        followingCount: follower.followingCount + 1,
      });
    }
    if (following) {
      await ctx.db.patch(args.followingId, {
        followerCount: following.followerCount + 1,
      });
    }

    return followId;
  },
});

// Unfollow
export const unfollow = mutation({
  args: {
    followerId: v.id("travelers"),
    followingId: v.id("travelers"),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("follows")
      .withIndex("by_pair", (q) =>
        q.eq("followerId", args.followerId).eq("followingId", args.followingId)
      )
      .unique();
    if (!existing) return;

    await ctx.db.delete(existing._id);

    // Update counts
    const follower = await ctx.db.get(args.followerId);
    const following = await ctx.db.get(args.followingId);
    if (follower && follower.followingCount > 0) {
      await ctx.db.patch(args.followerId, {
        followingCount: follower.followingCount - 1,
      });
    }
    if (following && following.followerCount > 0) {
      await ctx.db.patch(args.followingId, {
        followerCount: following.followerCount - 1,
      });
    }
  },
});

// Check if following
export const isFollowing = query({
  args: {
    followerId: v.id("travelers"),
    followingId: v.id("travelers"),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("follows")
      .withIndex("by_pair", (q) =>
        q.eq("followerId", args.followerId).eq("followingId", args.followingId)
      )
      .unique();
    return existing !== null;
  },
});

// Get followers
export const followers = query({
  args: { travelerId: v.id("travelers") },
  handler: async (ctx, args) => {
    const follows = await ctx.db
      .query("follows")
      .withIndex("by_following", (q) => q.eq("followingId", args.travelerId))
      .collect();

    const followers = await Promise.all(
      follows.map(async (f) => {
        return await ctx.db.get(f.followerId);
      })
    );
    return followers.filter(Boolean);
  },
});

// Get following
export const following = query({
  args: { travelerId: v.id("travelers") },
  handler: async (ctx, args) => {
    const follows = await ctx.db
      .query("follows")
      .withIndex("by_follower", (q) => q.eq("followerId", args.travelerId))
      .collect();

    const following = await Promise.all(
      follows.map(async (f) => {
        return await ctx.db.get(f.followingId);
      })
    );
    return following.filter(Boolean);
  },
});
