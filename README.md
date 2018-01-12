## prajna-wrapper-plugin

* Code injector for [Prajna](https://github.com/prajna-project/prajna)

### Usage

Import prajna-wrapper-plugin in your webpack.config.js

```javascript
const PrajnaWrapperPlugin = require('prajna-wrapper-plugin');
// ...
plugins: [
    // ...
    new PrajnaWrapperPlugin({
        includes: ['./templates/index.html'],
        options: {
            autopv: true,    // send pageview requests automaticlly
            env: 'dev',
            project: 'your-project-name',
            prajnaServerUrls: {
                'dev': 'http://dev-server-url.com/to/process/prajna/requests',
                'beta': 'http://beta-server-url.com/to/process/prajna/requests',
                'product': 'http://production-server-url.com/to/process/prajna/requests',
            }
        }
    }),
]
```

### Configurations

Key | Value | Required | Description
-------------------- | :---------: | :---------: | ---------
includes | [string] | ✔ | html or template files you want to inject prajna code to
options.autopv | boolean | ✘ | send pageview request automaticlly or not: `true`, `false`, default is false
options.env | string | ✘ | application environment: `dev`, `test`, `alpha`, `beta`, `release-candidate`, `product`, default is `dev`
options.project | string | ✔ |application name
options.prajnaServerUrls | object | ✔ | key value mapping between environment and server url for handling prajna requests: `{"dev": "https://example.com/api/prajna"}`
options.progressive.crossorigin | boolean | ✘ | add crossorigin attribute for resources on the html or template file
options.progressive.scriptPath | string | ✘ |your prajna cdn url, default is [test here!](https://cdn.jsdelivr.net/npm/prajna@1.0.0-rc.8/dist/prajna.1.0.0-rc.8.js)
