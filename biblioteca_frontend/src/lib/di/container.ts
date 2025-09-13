import { fetchClient } from "../http/HttpClient";
import { AuthApi } from "@/adapters/auth/AuthApi";
import { makeGetSession, makeLogin, makeLogout } from "@/core/auth/usecases";

const authRepo = new AuthApi(fetchClient)

export const useCases = {
    auth: {
        login: makeLogin(authRepo),
        logout: makeLogout(authRepo),
        getSession: makeGetSession(authRepo),
    },
};