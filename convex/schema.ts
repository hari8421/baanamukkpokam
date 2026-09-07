import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Users / Travelers
  travelers: defineTable({
    name: v.string(),
    email: v.string(),
    avatar: v.optional(v.string()),
    bio: v.optional(v.string()),
    followerCount: v.number(),
    followingCount: v.number(),
    travelCount: v.number(),
  })
    .index("by_email", ["email"])
    .index("by_followerCount", ["followerCount"]),

  // Travels / Journeys
  travels: defineTable({
    travelerId: v.id("travelers"),
    title: v.string(),
    description: v.optional(v.string()),
    from: v.string(),
    to: v.string(),
    route: v.string(),
    vibe: v.string(),
    vehicle: v.optional(v.string()),
    photoCount: v.number(),
    momentCount: v.number(),
    reliveCount: v.number(),
    likeCount: v.number(),
    viewCount: v.number(),
    publishedAt: v.number(),
  })
    .index("by_traveler", ["travelerId"])
    .index("by_publishedAt", ["publishedAt"])
    .index("by_route", ["route"])
    .index("by_vibe", ["vibe"]),

  // Photos in a travel
  photos: defineTable({
    travelId: v.id("travels"),
    index: v.number(),
    gradient: v.string(),
    caption: v.string(),
    time: v.string(),
  })
    .index("by_travel", ["travelId", "index"]),

  // Moments — markers on specific photos
  moments: defineTable({
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
    createdAt: v.number(),
  })
    .index("by_travel", ["travelId"])
    .index("by_photo", ["photoId"])
    .index("by_type", ["type"]),

  // Follows
  follows: defineTable({
    followerId: v.id("travelers"),
    followingId: v.id("travelers"),
  })
    .index("by_follower", ["followerId"])
    .index("by_following", ["followingId"])
    .index("by_pair", ["followerId", "followingId"]),

  // Likes
  likes: defineTable({
    travelerId: v.id("travelers"),
    travelId: v.id("travels"),
  })
    .index("by_travel", ["travelId"])
    .index("by_traveler", ["travelerId"])
    .index("by_pair", ["travelerId", "travelId"]),

  // Relive sessions — when someone relives a journey
  relives: defineTable({
    travelerId: v.id("travelers"),
    travelId: v.id("travels"),
    completedAt: v.optional(v.number()),
    favoritedMoments: v.array(v.id("moments")),
  })
    .index("by_travel", ["travelId"])
    .index("by_traveler", ["travelerId"]),
});
