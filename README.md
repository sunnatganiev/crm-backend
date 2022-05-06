# CRM Ticket system API

This api is a part of create CRM Ticket system with MERN stack from scratch tutorial series.
Link for the series is

## Hot to use

- run `git clone ...`
- run `npm start`

Note: Make sure you have nodemon is installed in your system otherwise you can install as a dev dependencies in the project.

## API Resources

### User API Resources

All the user API router follews `/v1/user/`

| #   | Routers                           | Verbs | Progress | Is Private | Description                                           |
| --- | --------------------------------- | ----- | -------- | ---------- | ----------------------------------------------------- |
| 1   | `/v1/user/login`                  | POST  | TODO     | No         | Verify user Authentication and return JWT             |
| 2   | `/v1/user/request-reset-password` | POST  | TODO     | No         | Verify email and send email pin to reset the password |
| 3   | `/v1/user/reset-password`         | PUT   | TODO     | No         | Replace with new password                             |
| 4   | `/v1/user/{id}`                   | GET   | TODO     | Yes        | Get users info                                        |

### Ticket API Resources

All the ticket API router follews `/v1/ticket/`

| #   | Routers                        | Verbs | Progress | Is Private | Description                             |
| --- | ------------------------------ | ----- | -------- | ---------- | --------------------------------------- |
| 1   | `/v1/ticket`                   | GET   | TODO     | Yes        | Get all ticket for the logged in user   |
| 2   | `/v1/ticket/{id}`              | GET   | TODO     | Yes        | Get a ticket details                    |
| 3   | `/v1/ticket`                   | POST  | TODO     | Yes        | Create a new ticket                     |
| 4   | `/v1/ticket/{id}`              | PUT   | TODO     | Yes        | Update ticket details ie. reply message |
| 5   | `/v1/ticket/close-ticket/{id}` | PUT   | TODO     | Yes        | Update ticket details ie. reply message |
