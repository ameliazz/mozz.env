<h1 align='center'>(🔺) Mozz.js</h1>
<p align='center'>Mozz is your Environment Enhancer</p>

## How to use

We need to configure the environment for Mozz work, first, let's create the `mozz.profile.json` file in the root of the project.
Let's set up two environments, one for development and one for production using the following code:

```json
{
    "environments": {
        "production": {
            "hostname": "0.0.0.0"
        },
        "development": {
            "hostname": "localhost"
        }
    }
}
```

> In the Mozz profile you can set `@file` for every environment to change your `.env` file, for example:

```json
{
    "production": {
        "@file": ".env",
        "hostname": "0.0.0.0"
    },
    "development": {
        "@file": ".env.local",
        "hostname": "localhost"
    }
}
```

And we will also configure the `MOZZ_ENV` environment variable:

```env
MOZZ_ENV="development"
```

Now, we can move on to the code, just import `Mozz` and create a instance to access your environment settings

```js
const Mozz = require('mozz.js')
const Enhancer = new Mozz()

Enhancer.env.hostname // localhost
```
