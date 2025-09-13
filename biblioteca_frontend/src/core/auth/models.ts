export type User = {
    id: string;
    nome: string;
    email: string;
}

export type Session = {
    user: User;
    token: string;
}