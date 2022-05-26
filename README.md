# mvwords-test

> url shortener

## About

This project uses [Feathers](http://feathersjs.com). An open source web framework for building modern real-time applications.

## Getting Started

1. Make sure you have [NodeJS](https://nodejs.org/) and [npm](https://www.npmjs.com/) installed.
2. Install your dependencies

    ```
    cd path/to/mvwords-test
    npm install
    ```
3. Make sure you have MongoDB running at port 27017 
4. Start your app

    ```
    npm start
    ```

## Testing

Simply run `npm test` and all your tests in the `test/` directory will be run.

## Features

* User authentication
* Short url creation for users and guests
* Short url redirection at `/{shortCode}`
* Short url stats with permissions at `/{shortCode}/stats`
    * Stats for urls created by guests are publicly available
    * Stats for private urls are only available to the user created them

## Endpoints
URL|Method|Parameters|Description|Headers|
|:--:|:--:|:-----:|:----------|:----------|
|**`/users`**|`POST`|`email, password`|Register a new user|
|**`/authentication`**|`POST`|`strategy, email, password`|Get JWT token for a user (strategy should be "local")|
|**`/submit`**|`POST`|`url, shortCode?`|Create and return a short url|(*Optional*) Authorization: Bearer {JWT token}|
|**`/:shortCode`**|`GET`|`-`|Redirect to the original url
|**`/:shortCode/stats`**|`GET`|`-`|Return stats about a short url|(*Optional*) Authorization: Bearer {JWT token}|
