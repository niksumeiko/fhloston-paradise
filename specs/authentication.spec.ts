import { test, expect } from './fixtures';
import { validCredentials, invalidCredentials } from './auth-test-data';

test.describe('Authentication', () => {
    test.describe('successful login', () => {
        validCredentials.forEach(({ email, password, expectedName }) => {
            test(`user ${email} can log in and see dashboard`, async ({
                loginPage,
                page,
            }) => {
                await loginPage.login(email, password);

                await loginPage.expectOnDashboard();
                await expect(
                    page.getByText(`Welcome, ${expectedName}`),
                ).toBeVisible();
                await expect(
                    page.getByRole('button', { name: 'Logout' }),
                ).toBeVisible();
            });
        });
    });

    test.describe('failed login', () => {
        invalidCredentials.forEach(
            ({ description, email, password, expectedError }) => {
                test(`login with ${description} is rejected`, async ({
                    loginPage,
                }) => {
                    await loginPage.login(email, password);

                    await loginPage.expectOnLoginPage();
                    await loginPage.expectError(expectedError);
                });
            },
        );
    });

    test.describe('route protection', () => {
        test('unauthenticated user is redirected from dashboard to login', async ({
            page,
        }) => {
            await page.goto('/');
            await expect(page).toHaveURL('/login');
        });

        test('authenticated user is redirected from login to dashboard', async ({
            loginPage,
            page,
        }) => {
            await loginPage.login('korben@fhloston.com', 'multipass');
            await loginPage.expectOnDashboard();

            await page.goto('/login');
            await expect(page).toHaveURL('/');
        });

        test('user can log out and loses access to protected route', async ({
            loginPage,
            page,
        }) => {
            await loginPage.login('korben@fhloston.com', 'multipass');
            await loginPage.expectOnDashboard();

            await page.getByRole('button', { name: 'Logout' }).click();
            await expect(page).toHaveURL('/login');

            await page.goto('/');
            await expect(page).toHaveURL('/login');
        });
    });
});
