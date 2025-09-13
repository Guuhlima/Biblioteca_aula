export interface HttpClient {
    get<T>(url: string): Promise<T>;
    post<T>(url: string, body?: unknown): Promise<T>;
    del<T>(url: string): Promise<T>;
}

export const fetchClient: HttpClient = {
    async get(url) {
        const r = await fetch(url, { credentials: "include"});
        if (!r.ok) throw new Error(await r.text());
        return r.json();
    },

    async post(url, body) {
        const r = await fetch(url, {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body ?? {}),
        });
        if (!r.ok) throw new Error(await r.text());
        return r.json();
    },

    async del(url) {
        const r = await fetch(url, { 
            method: "DELETE",
            credentials: "include"
        });
        if (!r.ok) throw new Error(await r.text());
        return r.json();
    },
};