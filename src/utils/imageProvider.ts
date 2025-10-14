// Lightweight image provider with optional Gemini/Proxy support.
// Usage: getIllustrationFor('Data Science Internship') -> URL string
// It first tries a proxy endpoint defined by VITE_GEMINI_IMAGE_PROXY_URL (your server that returns an image URL),
// and falls back to Unsplash query-based images.

export async function getIllustrationFor(topic: string): Promise<string | undefined> {
  const proxy = (import.meta as any).env?.VITE_GEMINI_IMAGE_PROXY_URL as string | undefined;
  try {
    if (proxy) {
      const res = await fetch(proxy, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: `Vivid, techy illustration for: ${topic}` })
      });
      if (res.ok) {
        const data = await res.json();
        // Expecting { url: string } from your proxy
        if (data?.url) return data.url as string;
      }
    }
  } catch (_) {
    // ignore and fallback
  }
  // Fallback to Unsplash query
  const q = encodeURIComponent(topic);
  return `https://source.unsplash.com/1200x600/?${q}`;
}
