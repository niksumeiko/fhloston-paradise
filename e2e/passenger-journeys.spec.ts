import { test, expect, Page } from '@playwright/test';

async function login(page: Page, email: string, password: string) {
    await page.goto('/login');
    await page.getByLabel('Email').fill(email);
    await page.getByLabel('Password').fill(password);
    await page.getByRole('button', { name: 'Login' }).click();
}

test.describe('The passenger journeys', () => {
    test('allows Korben Dallas to board with valid credentials', async ({ page }) => {
        await login(page, 'korben@fhloston.com', 'multipass');

        await expect(page.getByText('Welcome, Korben Dallas')).toBeVisible();
    });

    test("prevents Zorg's worker from boarding with fake credentials", async ({ page }) => {
        await login(page, 'zorg@fhloston.com', 'destroyall');

        await expect(page.getByText('Invalid email or password')).toBeVisible();
    });

    test('allows a passenger to leave the ship', async ({ page }) => {
        await login(page, 'korben@fhloston.com', 'multipass');
        await expect(page.getByText('Welcome, Korben Dallas')).toBeVisible();

        await page.getByRole('button', { name: 'Logout' }).click();

        await expect(page.getByRole('button', { name: 'Login' })).toBeVisible();
    });
});
