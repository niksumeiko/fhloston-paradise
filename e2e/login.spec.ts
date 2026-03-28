import { test, expect } from '@playwright/test';

// Credentials from server.js — user "Korben Dallas"
const EMAIL = 'korben@fhloston.com';
const PASSWORD = 'multipass';

test.describe('authentication', () => {
    const login = async ({ page, email, password }) => {
        await page.goto('/login');
        await page.fill('#email', email);
        await page.fill('#password', password);
        await page.click("button[type='submit']");
    };

    test('user can log in and reach the dashboard', async ({ page }) => {
        await login({ page, email: EMAIL, password: PASSWORD });
        await expect(page).toHaveURL('/');
    });

    test('user can log out and is redirected to login', async ({ page }) => {
        await login({ page, email: EMAIL, password: PASSWORD });
        const button = await page.getByRole('button', { name: 'Logout' });
        await button.click();
        await expect(page).toHaveURL('/login');
    });

    test("user can't reach dashboard with wrong credentials", async ({ page }) => {
        await login({ page, email: 'zorg@fhloston.com', password: 'hereissomeweapon' });
        await expect(page).toHaveURL('/login');
        await expect(page.getByText('Invalid email or password')).toBeVisible();
    });
});
