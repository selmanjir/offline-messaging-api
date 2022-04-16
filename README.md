# Offline messaging API



## Database Structure

<img src="https://i.hizliresim.com/6sgfikm.jpg" width="60%">

## Routes

| Command | Description |
| --- | --- |
| `/api/login-post` | Login |
| `/api/logout` | Logout |
| `/api/register-post` | Register |
| `/api/forget-password/:email` | Forget password |
| `/api/new-password/:id/:token` | New-password page when click link in mail |
| `/api/new-password/:id/:token` | New-password |
| `/api/check-auth` | Check-auth |
| `/api/message-to/:username` | Message to the selected username |
| `/api/messages` | Messages, to the selected username  |
| `/api/messages-with/:username` |Messages, see all messages between a user |
| `/api/delete-message/:id` | Delete message, to the selected id |
| `/api/block-to/:username` |  Block user, to the selected username |
| `/api/unblock-to/:username` |  Unblock a user |
| `/api/block-list` |  Block list |

## Installation

```
npm i

```
## Migrating

```
cd src

```

```
sequelize db:migrate

```

## Database Config

```
cd src/config

```
config.json

```
"development": {
    "username": "root",
    "password": null,
    "database": "***database_name***",
    "host": "127.0.0.1",
    "dialect": "mysql"
  },
  
```


> *NOT:* Due to api incompatibility of Passport.js, "login" and "logout" responses may be "Cannot GET /login". The routes work fine, although the answers are problematic.
