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

Key | Value | Description
-------------------- | :---------: | ---------
includes | [string] | html or template files you want to inject prajna code to
options.autopv | boolean | send pageview request automaticlly or not `true | false`
