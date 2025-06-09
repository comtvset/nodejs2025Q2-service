# Home Library Service

## Prerequisites

- Git - [Download & Install Git](https://git-scm.com/downloads).
- Node.js - [Download & Install Node.js](https://nodejs.org/en/download/) and the npm package manager.
- Docker – [Download & Install Docker Desktop](https://www.docker.com/products/docker-desktop)

## Downloading

```
git clone https://github.com/comtvset/nodejs2025Q2-service.git
```

## Installing NPM modules

```
npm install
```

## Create .env file

```
cp .env.example .env
```

## Docker Installation

Go to [Docker Desktop](https://www.docker.com/products/docker-desktop/) and download application
Install the application
Verify installation in terminal:

```
docker --version
```

```
docker compose version
```

#### ⚠️⚠️⚠️ Note: If you're running PostgreSQL locally, you must stop the local PostgreSQL service before using Docker.
#### To do this:

Press <kbd>Win</kbd> + <kbd>R</kbd>

Type services.msc and press <kbd>Enter</kbd>

Find PostgreSQL in the list

Right-click it and select Stop

## Running application

```
npm run start:prod
```

or

```
npm run start:dev
```

or

```
npm start
```

After starting the app on port (4000 as default) you can open
in your browser OpenAPI documentation by typing http://localhost:4000/doc/.
For more information about OpenAPI/Swagger please visit https://swagger.io/.

## Testing

After application running open new terminal and enter:

To run all tests without authorization

```
npm run test
```

To run only one of all test suites

```
npm run test -- <path to suite>
```

To run all test with authorization

```
npm run test:auth
```

To run only specific test suite with authorization

```
npm run test:auth -- <path to suite>
```

### Auto-fix and format

```
npm run lint
```

```
npm run format
```

### Debugging in VSCode

Press <kbd>F5</kbd> to debug.

For more information, visit: https://code.visualstudio.com/docs/editor/debugging
