const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3333";

function toUrl(url: string) {
  return url.startsWith("http")
    ? url
    : `${BASE_URL}${url.startsWith("/") ? url : `/${url}`}`;
}

export interface HttpClient {
    get<T>(url: string): Promise<T>;
    post<T>(url: string, body?: unknown): Promise<T>;
    del<T>(url: string): Promise<T>;
}

export const fetchClient: HttpClient = {
    async get(url) {
        const r = await fetch(toUrl(url), { credentials: "include"});
        if (!r.ok) throw new Error(await r.text());
        return r.json();
    },

    async post(url, body) {
        const r = await fetch(toUrl(url), {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body ?? {}),
        });
        if (!r.ok) throw new Error(await r.text());
        return r.json();
    },

    async del(url) {
        const r = await fetch(toUrl(url), { 
            method: "DELETE",
            credentials: "include"
        });
        if (!r.ok) throw new Error(await r.text());
        return r.json();
    },
};