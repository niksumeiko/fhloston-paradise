# What we have to test

- Given the user is unauthorized, when they navigate to the home page, then they should be redirected to the /login page.
- Given the user is on the /login page, when they enter valid credentials and submit the form, then they should be redirected to the home page and see a welcome message with their name.
- Given the user is on the /login page, when they enter invalid credentials and submit the form, then they should see an error message indicating that the login failed.
- Given the user is on the /login page, when they submit the form and the server returns an error (e.g., network error), then they should see an error message indicating that the login failed.
- Given the user is on the home page, when they click the logout button, then they should be redirected to the /login page.
