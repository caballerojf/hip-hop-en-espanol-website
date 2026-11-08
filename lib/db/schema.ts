import { date, integer, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core'

export const episodes = pgTable('episodes', {
  id: serial('id').primaryKey(),
  number: integer('number').notNull().unique(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  airedAt: date('aired_at').notNull(),
  durationMinutes: integer('duration_minutes').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
})

export const tracks = pgTable('tracks', {
  id: serial('id').primaryKey(),
  episodeId: integer('episode_id').notNull(),
  position: integer('position').notNull(),
  artist: text('artist').notNull(),
  title: text('title').notNull(),
})

export const submissions = pgTable('submissions', {
  id: serial('id').primaryKey(),
  artistName: text('artist_name').notNull(),
  email: text('email').notNull(),
  trackTitle: text('track_title').notNull(),
  trackUrl: text('track_url').notNull(),
  city: text('city'),
  message: text('message'),
  status: text('status').notNull().default('pending'),
  grade: integer('grade'),
  review: text('review'),
  reviewedAt: timestamp('reviewed_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
})

export type Submission = typeof submissions.$inferSelect
