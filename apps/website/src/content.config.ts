/* eslint-disable @typescript-eslint/no-explicit-any */
import 'dotenv/config';
import { defineCollection, z } from 'astro:content';
import {
  fetchAllVideos,
  fetchAllOrgs,
  fetchAllPresenters,
} from './libs/content_service';

const video = defineCollection({
  loader: async () => await fetchAllVideos(),
  schema: z.object({
    id: z.string(),
    videoId: z.string(),
    videoTitle: z.string(),
    videoDescription: z.string(),
    publishedAt: z.string(),
    thumbnailDefault: z.string().nullable(),
    thumbnailMedium: z.string().nullable(),
    thumbnailHigh: z.string().nullable(),
    slug: z.string(),
    organizations: z.array(
      z.object({
        id: z.string(),
        orgTitle: z.string(),
        orgDescription: z.string().nullable(),
        website: z.string().nullable(),
        twitter: z.string().nullable(),
        logoImage: z.string().nullable(),
        contactPerson: z.string().nullable(),
        slug: z.string(),
      })
    ),
    presenters: z.array(
      z.object({
        id: z.string(),
        presenterName: z.string(),
        presenterDescription: z.string().nullable(),
        presenterByline: z.string().nullable(),
        twitter: z.string().nullable(),
        email: z.string().nullable(),
        website: z.string().nullable(),
        imageUrl: z.string().nullable(),
        slug: z.string(),
      })
    ),
  }),
});

const organization = defineCollection({
  loader: async () => await fetchAllOrgs(),
  schema: z.object({
    id: z.string(),
    orgTitle: z.string(),
    orgDescription: z.string().nullable(),
    website: z.string().nullable(),
    twitter: z.string().nullable(),
    logoImage: z.string().nullable(),
    contactPerson: z.string().nullable(),
    slug: z.string(),
    videos: z.array(
      z.object({
        id: z.string(),
        videoId: z.string(),
        videoTitle: z.string(),
        videoDescription: z.string(),
        publishedAt: z.string(),
        thumbnailDefault: z.string().nullable(),
        thumbnailMedium: z.string().nullable(),
        thumbnailHigh: z.string().nullable(),
        slug: z.string(),
      })
    ),
  }),
});

const presenter = defineCollection({
  loader: async () => await fetchAllPresenters(),
  schema: z.object({
    id: z.string(),
    presenterName: z.string(),
    presenterDescription: z.string().nullable(),
    presenterByline: z.string().nullable(),
    twitter: z.string().nullable(),
    email: z.string().nullable(),
    website: z.string().nullable(),
    imageUrl: z.string().nullable(),
    slug: z.string(),
    videos: z.array(
      z.object({
        id: z.string(),
        videoId: z.string(),
        videoTitle: z.string(),
        videoDescription: z.string(),
        publishedAt: z.string(),
        thumbnailDefault: z.string().nullable(),
        thumbnailMedium: z.string().nullable(),
        thumbnailHigh: z.string().nullable(),
        slug: z.string(),
      })
    ),
  }),
});

export const collections = { video, organization, presenter };
