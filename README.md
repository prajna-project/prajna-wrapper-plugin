## prajna-wrapper-plugin

* prajna wrapper code injector

### Usage

import prajna-wrapper-plugin in your webpack.config.js

```
const PrajnaWrapperPlugin = require('prajna-wrapper-plugin');
// ...
plugins: [
  // ...
  new PrajnaWrapperPlugin({
    includes: ['./templates/index.html'],
    options: {
      autopv: true,    // send page view request automaticlly
      env: 'dev',
      project: 'your-project-name',
      prajnaServerUrls: {
        'dev': 'http://dev-server-url.com/to/process/prajna/requests',
        'beta': 'http://beta-server-url.com/to/process/prajna/requests',
        'product': 'http://production-server-url.com/to/process/prajna/requests',
      },
      progressive: {
        scriptPath: `http://your-cdn-url.com/for/prajna`
      }
    }
  }),
]
```

### Configurations
