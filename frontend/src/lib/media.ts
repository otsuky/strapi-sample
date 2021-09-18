import { getStrapiURL } from "./api";

// TODO: any
export function getStrapiMedia(media: any) {
  const imageUrl = media.url.startsWith("/")
    ? getStrapiURL(media.url)
    : media.url;
  return imageUrl;
}
