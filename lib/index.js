if (typeof module !== 'undefined' && module.exports) {
    require('./root');
    require('./consts');
    require('./pathToRegexp');
    require('./utils');
    require('./route');
    require('./router');
    require('./server');
    require('./client');
    module.exports = require('jm-core');
}
