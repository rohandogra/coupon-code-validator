## clone or download

```terminal
$ git clone https://github.com/rohandogra/coupon-code-validator.git
$ npm i
$ cd coupon-code-validator-fe
$ npm i
```

## project structure

```terminal
package.json
.env (to create .env, and add MONGODB_URI)
coupon-code-validator-fe/
   package.json
...
```

# Usage (run fullstack app on your machine)

## Prerequisites

- [MongoDB](https://gist.github.com/nrollr/9f523ae17ecdbb50311980503409aeb3)
- [Node](https://nodejs.org/en/download/) ^10.0.0
- [npm](https://nodejs.org/en/download/package-manager/)

notice, you need client and server runs concurrently in different terminal session, in order to make them talk to each other

## Server-side usage(PORT: 3030)

### Prepare your secret

run the script at the first level:

(You need to add a MONGODB_URI in .env to connect to MongoDB)

Start
$ npm i // npm install packages
$ npm run index.js // run it locally

## Client-side usage(PORT: 3000)

```terminal
$ cd coupon-code-validator-fe   // go to coupon-code-validator-fe folder
$ npm i       // npm install packages
$ npm start // run it locally

```
