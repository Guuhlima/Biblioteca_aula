import { IAuthRepository } from "./ports";
import { Session } from "./models";

export function makeLogin(repo: IAuthRepository) {
    return (email: string, password: string): Promise<Session> =>
        repo.login(email, password)
}

export function makeLogout(repo: IAuthRepository) {
    return (): Promise<void> => repo.logout();
}

export function makeGetSession(repo: IAuthRepository) {
    return (): Promise<Session | null> => repo.getSession();
}