export const prerender = false;
import type { APIRoute } from 'astro';

export const GET: APIRoute = async () => {
  try {
    const response = await fetch('https://shaig.substack.com/feed', {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; personal-site/1.0)' },
    });

    if (!response.ok) {
      throw new Error(`Substack returned ${response.status}`);
    }

    const xml = await response.text();
    const itemMatches = xml.match(/<item>([\s\S]*?)<\/item>/g) ?? [];

    const posts = itemMatches.slice(0, 4).map(item => {
      const title =
        item.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/s)?.[1]?.trim() ??
        item.match(/<title>(.*?)<\/title>/s)?.[1]?.trim() ??
        '';

      const link =
        item.match(/<link>(https?:\/\/[^<\s]+)<\/link>/)?.[1]?.trim() ??
        '';

      const pubDate =
        item.match(/<pubDate>(.*?)<\/pubDate>/s)?.[1]?.trim() ??
        '';

      const rawDesc =
        item.match(/<description><!\[CDATA\[([\s\S]*?)\]\]><\/description>/)?.[1]?.trim() ??
        item.match(/<description>([\s\S]*?)<\/description>/)?.[1]?.trim() ??
        '';
      const description = rawDesc.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim().slice(0, 160);

      return { title, link, pubDate, description };
    });

    return new Response(JSON.stringify(posts), {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (err) {
    console.error('Substack fetch error:', err);
    return new Response(JSON.stringify([]), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
