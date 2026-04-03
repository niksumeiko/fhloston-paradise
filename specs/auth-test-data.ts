type ValidCredential = {
    email: string;
    password: string;
    expectedName: string;
};

type InvalidCredential = {
    description: string;
    email: string;
    password: string;
    expectedError: string;
};

export const validCredentials: readonly ValidCredential[] = [
    {
        email: 'korben@fhloston.com',
        password: 'multipass',
        expectedName: 'Korben Dallas',
    },
    {
        email: 'leeloo@fhloston.com',
        password: 'leeloo123',
        expectedName: 'Leeloo',
    },
    {
        email: 'ruby@fhloston.com',
        password: 'greenrocks',
        expectedName: 'Ruby Rhod',
    },
];

export const invalidCredentials: readonly InvalidCredential[] = [
    {
        description: 'wrong password',
        email: 'korben@fhloston.com',
        password: 'wrongpassword',
        expectedError: 'Invalid email or password',
    },
    {
        description: 'non-existent user',
        email: 'zorg@fhloston.com',
        password: 'zorgpassword',
        expectedError: 'Invalid email or password',
    },
    {
        description: 'correct email with another user password',
        email: 'leeloo@fhloston.com',
        password: 'multipass',
        expectedError: 'Invalid email or password',
    },
];
