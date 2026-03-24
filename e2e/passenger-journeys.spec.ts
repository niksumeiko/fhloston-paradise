import { test, expect } from '@playwright/test';

test.describe('The passenger journeys', () => {
    test('allows Korben Dallas to board with valid credentials', async ({ page }) => {
        await page.goto('/login');

        await page.getByLabel('Email').fill('korben@fhloston.com');
        await page.getByLabel('Password').fill('multipass');
        await page.getByRole('button', { name: 'Login' }).click();

        await expect(page.getByText('Welcome, Korben Dallas')).toBeVisible();
    });
});
