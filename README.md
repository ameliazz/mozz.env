<h1 align='center'>(🔺) Mozz.Env</h1>
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

We will also configure the variable `MOZZ_ENV` in `.env` so the library knows which environment we are wanting:

```env
MOZZ_ENV="development"
```

Now, we can move on to the code, just import `Mozz` and create a instance to access your environment settings

```js
const Mozz = require('mozz.env')
const Enhancer = new Mozz()

Enhancer.env.hostname // localhost
```
