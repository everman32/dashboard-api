# dashboard-api 

![GitHub release (latest by date)](https://img.shields.io/github/v/release/everman32/dashboard-api) [![GitHub stars](https://img.shields.io/github/stars/everman32/dashboard-api)](https://github.com/everman32/dashboard-api/stargazers) [![GitHub forks](https://img.shields.io/github/forks/everman32/dashboard-api)](https://github.com/everman32/dashboard-api/network) [![GitHub issues](https://img.shields.io/github/issues/everman32/dashboard-api)](https://github.com/everman32/dashboard-api/issues) [![GitHub license](https://img.shields.io/github/license/everman32/dashboard-api)](https://github.com/everman32/dashboard-api)

![logo](https://i.ibb.co/DQ8rqRS/logo.png)

## Installation

Use `npm` as a package manager. Install dependencies from `package.json`:
```bash
npm install
```

Create an `.env` configuration file in the root directory of the project and add:
* `SALT` is the number of hash generation iterations,
* `SECRET` is the secret word when generating the hash,
* `PORT` is port number listened by the server.

Run app for production:
```bash
npm run start
```
or for development:
```bash
npm run dev
```

## Usage

### Get current user authorization status
```http
  Request:
  GET http://localhost:8000/users/info

  Headers:
  Authorization: Bearer your_token
```
*Expect code **200** and email or code **401** authorization error message*

### Log in to your account
```http
  Request:
  POST http://localhost:8000/users/login

  Headers
  Content-Type: application/json
  {
    "email": "example@ex.com",
    "password": "example123"
  }
```
*Expect code **200** and jwt token or code **401** and data invalid message*

### Register an account
```http
 POST http://localhost:8000/users/register
  Content-Type: application/json
  { 
    "email": "example@ex.com",
    "name": "example",
    "password": "example123" 
  }
```
*Expect code **201** and registered user id or code **422** and message that the user already exists*

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.
Please make sure to update tests as appropriate.

## License
[MIT](https://choosealicense.com/licenses/mit/)