import { test, expect } from './fixtures';

test.describe('Authentication (integration — stubbed API)', () => {
    test.describe('successful login', () => {
        test('user sees dashboard after valid login', async ({
            loginPage,
            page,
        }) => {
            await page.route('**/api/login', (route) =>
                route.fulfill({
                    json: {
                        token: 'fhloston-token',
                        user: {
                            id: 1,
                            name: 'Korben Dallas',
                            email: 'korben@fhloston.com',
                            picture: '/korben.jpg',
                        },
                    },
                }),
            );

            await loginPage.login('korben@fhloston.com', 'anypassword');

            await loginPage.expectOnDashboard();
            await expect(page.getByText('Korben Dallas')).toBeVisible();
            await expect(
                page.getByRole('button', { name: 'Logout' }),
            ).toBeVisible();
        });
    });

    test.describe('failed login', () => {
        test('user sees error when server rejects credentials', async ({
            loginPage,
        }) => {
            await loginPage.page.route('**/api/login', (route) =>
                route.fulfill({
                    status: 401,
                    json: { message: 'Invalid email or password' },
                }),
            );

            await loginPage.login('korben@fhloston.com', 'wrongpassword');

            await loginPage.expectOnLoginPage();
            await loginPage.expectError('Invalid email or password');
        });

        test('user sees error on network failure', async ({ loginPage }) => {
            await loginPage.page.route('**/api/login', (route) =>
                route.fulfill({
                    status: 500,
                    json: { message: 'Server error' },
                }),
            );

            await loginPage.login('korben@fhloston.com', 'anypassword');

            await loginPage.expectOnLoginPage();
            await loginPage.expectError('Server error');
        });
    });

    test.describe('client-side validation', () => {
        test('rejects invalid email without calling server', async ({
            loginPage,
            page,
        }) => {
            let apiCalled = false;
            await page.route('**/api/login', (route) => {
                apiCalled = true;
                return route.abort();
            });

            await loginPage.login('not-an-email', 'validpassword');

            await loginPage.expectOnLoginPage();
            await loginPage.expectError('Please enter a valid email');
            expect(apiCalled).toBe(false);
        });
    });

    test.describe('route protection', () => {
        test('unauthenticated user is redirected from dashboard to login', async ({
            page,
        }) => {
            await page.goto('/');
            await expect(page).toHaveURL('/login');
        });

        test('user can log out and loses access to protected route', async ({
            loginPage,
            page,
        }) => {
            await page.route('**/api/login', (route) =>
                route.fulfill({
                    json: {
                        token: 'fhloston-token',
                        user: {
                            id: 1,
                            name: 'Korben Dallas',
                            email: 'korben@fhloston.com',
                            picture: '/korben.jpg',
                        },
                    },
                }),
            );

            await loginPage.login('korben@fhloston.com', 'anypassword');
            await loginPage.expectOnDashboard();

            await page.getByRole('button', { name: 'Logout' }).click();
            await expect(page).toHaveURL('/login');

            await page.goto('/');
            await expect(page).toHaveURL('/login');
        });
    });
});
