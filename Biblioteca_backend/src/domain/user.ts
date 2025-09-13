export interface UserProps {
    id: string;
    nome: string;
    email: string;
    passwordHash: string;
    createdAt: Date;
}

export class User {
    constructor(public readonly props: UserProps) {}

    get id() { return this.props.id; }
    get nome() { return this.props.nome }
    get email() { return this.props.email }
    get passwordHash() { return this.props.passwordHash }
    get createdAt() { return this.props.createdAt}
}