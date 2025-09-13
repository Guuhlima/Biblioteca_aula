import { Session } from "./models";

export interface IAuthRepository {
    login(email: string, password: string): Promise<Session>
    logout(): Promise<void>;
    getSession(): Promise<Session | null>
}