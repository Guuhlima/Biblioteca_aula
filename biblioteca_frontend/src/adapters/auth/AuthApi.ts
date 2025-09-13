import { HttpClient } from "@/lib/http/HttpClient";
import { IAuthRepository } from "@/core/auth/ports";
import { Session } from "@/core/auth/models";

export class AuthApi implements IAuthRepository {
    constructor(private http: HttpClient) {}

    login(email: string, password: string): Promise<Session> {
        return this.http.post("/api/sessions", { email, password });
    }

    logout(): Promise<void> {
        return this.http.del("/api/sessions");
    }

    getSession(): Promise<Session | null> {
        return this.http.get("/api/me")
    }
}