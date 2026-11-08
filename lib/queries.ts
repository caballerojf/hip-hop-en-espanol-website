import { asc, desc, eq, inArray } from 'drizzle-orm'
import { db } from '@/lib/db'
import { episodes, submissions, tracks } from '@/lib/db/schema'

export type EpisodeWithTracks = typeof episodes.$inferSelect & {
  tracks: (typeof tracks.$inferSelect)[]
}

export async function getEpisodes(): Promise<EpisodeWithTracks[]> {
  const rows = await db.select().from(episodes).orderBy(desc(episodes.number))
  if (rows.length === 0) return []

  const trackRows = await db
    .select()
    .from(tracks)
    .where(
      inArray(
        tracks.episodeId,
        rows.map((row) => row.id),
      ),
    )
    .orderBy(asc(tracks.position))

  return rows.map((row) => ({
    ...row,
    tracks: trackRows.filter((track) => track.episodeId === row.id),
  }))
}

export async function getReviewedSubmissions() {
  return db
    .select({
      id: submissions.id,
      artistName: submissions.artistName,
      trackTitle: submissions.trackTitle,
      trackUrl: submissions.trackUrl,
      city: submissions.city,
      grade: submissions.grade,
      review: submissions.review,
      reviewedAt: submissions.reviewedAt,
    })
    .from(submissions)
    .where(eq(submissions.status, 'reviewed'))
    .orderBy(desc(submissions.reviewedAt))
    .limit(12)
}

export async function getPendingSubmissions() {
  return db
    .select()
    .from(submissions)
    .where(eq(submissions.status, 'pending'))
    .orderBy(asc(submissions.createdAt))
}
