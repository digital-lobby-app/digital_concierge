import { randomUUID } from 'crypto';
import type { ReviewCreateInput, ReviewListFilter, ReviewType } from '../schemas/review.schema';

export type Review = {
  id: string;
  hotelId: string;
  type: ReviewType;
  poiId: string | null;
  rating: number | null;
  comment: string;
  reviewerName: string | null;
  createdAt: Date;
};

const seedNow = new Date();

const runtime: Record<string, Review[]> = {
  lepaindore: [
    { id: 'R001', hotelId: 'H003', type: 'map', poiId: 'P001', rating: 5, comment: 'Best croissants in the 6th — flaky and fresh.', reviewerName: 'Marie', createdAt: seedNow },
    { id: 'R002', hotelId: 'H003', type: 'map', poiId: 'P001', rating: 4, comment: 'Lovely atmosphere, a bit pricey but worth it.', reviewerName: null, createdAt: seedNow },
    { id: 'R003', hotelId: 'H003', type: 'map', poiId: 'P003', rating: 5, comment: 'Skip-the-queue ticket was a lifesaver.', reviewerName: 'Tom', createdAt: seedNow },
    { id: 'R004', hotelId: 'H003', type: 'guestbook', poiId: null, rating: null, comment: 'A magical stay in Paris — Alfred made everything feel effortless. We will be back.', reviewerName: 'Sarah', createdAt: seedNow },
    { id: 'R005', hotelId: 'H003', type: 'guestbook', poiId: null, rating: null, comment: 'Beautiful room overlooking the courtyard. Breakfast was top notch.', reviewerName: 'James', createdAt: seedNow },
    { id: 'R006', hotelId: 'H003', type: 'guestbook', poiId: null, rating: null, comment: 'Friendly staff and a perfect location near the Jardin du Luxembourg.', reviewerName: null, createdAt: seedNow },
  ],
  adalinos: [
    { id: 'R007', hotelId: 'H001', type: 'map', poiId: 'P005', rating: 5, comment: 'The Knödel were incredible. Cosy hut with stunning views.', reviewerName: 'Klaus', createdAt: seedNow },
    { id: 'R008', hotelId: 'H001', type: 'map', poiId: 'P006', rating: 4, comment: 'Great instructor for our beginner kids — patient and fun.', reviewerName: 'Anna', createdAt: seedNow },
    { id: 'R009', hotelId: 'H001', type: 'guestbook', poiId: null, rating: null, comment: 'A perfect base for skiing the Lienzer Dolomiten. Warm welcome from the team.', reviewerName: 'Lukas', createdAt: seedNow },
    { id: 'R010', hotelId: 'H001', type: 'guestbook', poiId: null, rating: null, comment: 'The sauna after a long ski day — pure bliss.', reviewerName: null, createdAt: seedNow },
  ],
};

function sortNewestFirst(list: Review[]): Review[] {
  return [...list].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}

export async function listReviews(slug: string, filter: ReviewListFilter): Promise<Review[]> {
  const all = runtime[slug] ?? [];
  if (filter.type === 'map') {
    return sortNewestFirst(all.filter((r) => r.type === 'map' && r.poiId === filter.poiId));
  }
  return sortNewestFirst(all.filter((r) => r.type === 'guestbook'));
}

export async function createReview(
  slug: string,
  hotelId: string,
  input: ReviewCreateInput,
): Promise<Review> {
  const base = {
    id: randomUUID(),
    hotelId,
    reviewerName: input.reviewerName ?? null,
    createdAt: new Date(),
  };
  const review: Review =
    input.type === 'map'
      ? {
          ...base,
          type: 'map',
          poiId: input.poiId,
          rating: input.rating,
          comment: input.comment,
        }
      : {
          ...base,
          type: 'guestbook',
          poiId: null,
          rating: null,
          comment: input.comment,
        };
  runtime[slug] = [...(runtime[slug] ?? []), review];
  return review;
}

export async function deleteReview(slug: string, reviewId: string): Promise<boolean> {
  const list = runtime[slug] ?? [];
  const idx = list.findIndex((r) => r.id === reviewId);
  if (idx === -1) return false;
  runtime[slug] = list.filter((_, i) => i !== idx);
  return true;
}
