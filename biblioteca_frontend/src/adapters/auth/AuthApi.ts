import { HttpClient } from "@/lib/http/HttpClient";
import { IAuthRepository } from "@/core/auth/ports";
import { Session } from "@/core/auth/models";

export class AuthApi implements IAuthRepository {
  constructor(private http: HttpClient) {}

  login(email: string, password: string): Promise<Session> {
    return this.http.post("/api/sessions", { email, password })
  }

  async logout(): Promise<void> {
    await this.http.del("/api/sessions")
  }

  async getSession(): Promise<Session | null> {
    try {
      const { user } = await this.http.get<{ user: Session["user"] }>("/me")
      return { user, token: "" }
    } catch {
      return null
    }
  }
}