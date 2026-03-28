import { test, expect, MountResult } from '@playwright/experimental-ct-react';
import { type User } from './AuthContext';
import { LoginPageWithError, LoginPageWithSuccess } from './LoginPage.stories';

async function fillAndSubmit(component: MountResult, email: string, password: string) {
    await component.locator('#email').fill(email);
    await component.locator('#password').fill(password);
    await component.getByRole('button', { name: 'Login' }).click();
}

const CREW: Array<{ name: string; email: string; password: string }> = [
    { name: 'Korben Dallas', email: 'korben@fhloston.com', password: 'multipass' },
    { name: 'Leeloo', email: 'leeloo@fhloston.com', password: 'leeloo123' },
    { name: 'Ruby Rhod', email: 'ruby@fhloston.com', password: 'greenrocks' },
];

const ZORG_WORKERS: Array<{ name: string; email: string; password: string }> = [
    {
        name: 'Jean-Baptiste Emanuel Zorg',
        email: 'zorg@fhloston.com',
        password: 'buysomeweapon',
    },
    { name: 'Zorg Worker', email: 'worker@zorg.com', password: 'destroyall' },
];

test.describe('LoginPage — form validation', () => {
    test('shows email and password errors on empty submission', async ({ mount }) => {
        const component = await mount(<LoginPageWithError />);
        await component.getByRole('button', { name: 'Login' }).click();
        await expect(component.getByText('Please enter a valid email')).toBeVisible();
        await expect(
            component.getByText('Password must be at least 6 characters'),
        ).toBeVisible();
    });

    test('shows email error for invalid email format', async ({ mount }) => {
        const component = await mount(<LoginPageWithError />);
        await component.locator('#email').fill('not-an-email');
        await component.locator('#password').fill('validpassword');
        await component.getByRole('button', { name: 'Login' }).click();
        await expect(component.getByText('Please enter a valid email')).toBeVisible();
    });

    test('shows password error when too short', async ({ mount }) => {
        const component = await mount(<LoginPageWithError />);
        await component.locator('#email').fill('korben@fhloston.com');
        await component.locator('#password').fill('short');
        await component.getByRole('button', { name: 'Login' }).click();
        await expect(
            component.getByText('Password must be at least 6 characters'),
        ).toBeVisible();
    });
});

test.describe('LoginPage — crew with valid tickets', () => {
    for (const { name, email, password } of CREW) {
        test(`grants ${name} access to the ship`, async ({ mount, page }) => {
            const fakeUser: User = { id: 1, name, email, picture: '' };
            const component = await mount(<LoginPageWithSuccess user={fakeUser} />);
            await fillAndSubmit(component, email, password);
            await expect(page.getByText('Welcome aboard')).toBeVisible();
        });
    }
});

test.describe("LoginPage — Zorg's workers with faked tickets", () => {
    for (const { name, email, password } of ZORG_WORKERS) {
        test(`denies ${name} entry to the ship`, async ({ mount, page }) => {
            // React 19 calls window.reportError even for caught errors — suppress
            // so Playwright doesn't fail the test before our assertion runs
            page.on('pageerror', () => {});

            const component = await mount(<LoginPageWithError />);
            await fillAndSubmit(component, email, password);

            await expect(page.getByText('Invalid email or password')).toBeVisible();
            await expect(page.getByRole('button', { name: 'Login' })).toBeVisible();
        });
    }
});
