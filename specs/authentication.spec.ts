import { test, expect } from './fixtures';

test.describe('Authentication (e2e — real server)', () => {
    test('valid credentials grant access to dashboard', async ({
        loginPage,
        page,
    }) => {
        await loginPage.login('korben@fhloston.com', 'multipass');

        await loginPage.expectOnDashboard();
        await expect(page.getByText('Welcome, Korben Dallas')).toBeVisible();
    });

    test('invalid credentials are rejected', async ({ loginPage }) => {
        await loginPage.login('korben@fhloston.com', 'wrongpassword');

        await loginPage.expectOnLoginPage();
        await loginPage.expectError('Invalid email or password');
    });
});
