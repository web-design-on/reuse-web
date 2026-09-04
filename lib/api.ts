const USERS_KEY = '@reuse_users';

interface StoredUser {
    firstName: string;
    userName: string;
    senha: string;
    image?: string;
}

function getStoredUsers(): StoredUser[] {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(USERS_KEY);
    return data ? JSON.parse(data) : [];
}

function saveStoredUsers(users: StoredUser[]) {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function withoutPassword(user: StoredUser): Omit<StoredUser, 'senha'> {
    const { senha, ...userWithoutPassword } = user;
    void senha;
    return userWithoutPassword;
}

export async function registerUser(firstName: string, userName: string, senha: string) {
    const users = getStoredUsers();

    const alreadyExists = users.some((u) => u.userName === userName);
    if (alreadyExists) {
        throw new Error('Esse nome de usuário já existe. Tente outro.');
    }

    const newUser: StoredUser = { firstName, userName, senha };
    users.push(newUser);
    saveStoredUsers(users);

    return withoutPassword(newUser);
}

export async function authenticateUser(userName: string, senha: string) {
    const users = getStoredUsers();

    const found = users.find((u) => u.userName === userName && u.senha === senha);

    if (!found) {
        throw new Error('Usuário ou senha inválidos.');
    }

    return withoutPassword(found);
}