import { test, expect } from '@playwright/test';

test.describe('The passenger journeys', () => {
    test('allows Korben Dallas to board with valid credentials', async ({ page }) => {
        await page.goto('/login');

        await page.getByLabel('Email').fill('korben@fhloston.com');
        await page.getByLabel('Password').fill('multipass');
        await page.getByRole('button', { name: 'Login' }).click();

        await expect(page.getByText('Welcome, Korben Dallas')).toBeVisible();
    });

    test("prevents Zorg's worker from boarding with fake credentials", async ({ page }) => {
        await page.goto('/login');

        await page.getByLabel('Email').fill('zorg@fhloston.com');
        await page.getByLabel('Password').fill('destroyall');
        await page.getByRole('button', { name: 'Login' }).click();

        await expect(page.getByText('Invalid email or password')).toBeVisible();
    });

    test('allows a passenger to leave the ship', async ({ page }) => {
        await page.goto('/login');

        await page.getByLabel('Email').fill('korben@fhloston.com');
        await page.getByLabel('Password').fill('multipass');
        await page.getByRole('button', { name: 'Login' }).click();
        await expect(page.getByText('Welcome, Korben Dallas')).toBeVisible();

        await page.getByRole('button', { name: 'Logout' }).click();

        await expect(page.getByRole('button', { name: 'Login' })).toBeVisible();
    });
});
