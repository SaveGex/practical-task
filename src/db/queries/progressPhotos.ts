import { desc, eq } from "drizzle-orm";
import { db } from "../client";
import { NewProgressPhoto, progress_photos } from "../schema";

// READ

export const getAllProgressPhotos = () => {
  return db
    .select()
    .from(progress_photos)
    .orderBy(desc(progress_photos.created_at));
};

export const getProgressPhotoById = (id: string) => {
  return db
    .select()
    .from(progress_photos)
    .where(eq(progress_photos.id, id))
    .get();
};

// CREATE

export const insertProgressPhoto = (data: NewProgressPhoto) => {
  return db.insert(progress_photos).values(data);
};

// DELETE

export const deleteProgressPhoto = (id: string) => {
  return db.delete(progress_photos).where(eq(progress_photos.id, id));
};