import { test as base, expect, type Page } from '@playwright/test';

class LoginPageModel {
    constructor(private readonly page: Page) {}

    async goto() {
        await this.page.goto('/login');
    }

    async fillEmail(email: string) {
        await this.page.getByLabel('Email').fill(email);
    }

    async fillPassword(password: string) {
        await this.page.getByLabel('Password').fill(password);
    }

    async submit() {
        await this.page.getByRole('button', { name: 'Login' }).click();
    }

    async login(email: string, password: string) {
        await this.fillEmail(email);
        await this.fillPassword(password);
        await this.submit();
    }

    async expectOnDashboard() {
        await expect(this.page).toHaveURL('/');
    }

    async expectOnLoginPage() {
        await expect(this.page).toHaveURL('/login');
    }

    async expectError(message: string) {
        await expect(this.page.getByText(message)).toBeVisible();
    }
}

type AuthFixtures = {
    loginPage: LoginPageModel;
};

export const test = base.extend<AuthFixtures>({
    loginPage: async ({ page }, use) => {
        await page.goto('/login');
        await page.evaluate(() => localStorage.clear());
        await page.reload();

        await use(new LoginPageModel(page));
    },
});

export { expect } from '@playwright/test';
