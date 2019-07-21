const {
    promisify
} = require('util');
const config = require('config');
const logger = require('./src/utils/logger');
const createServer = require('./src/koa');
const initRoutes = require('./src/routes');
const {
    version
} = require('./package.json');



(async () => {
    try {
        global.log = await logger(config.get('apiName'), version);
        global.log.info(`Starting up server on environment ${config.util.getEnv('NODE_ENV')}`);
        const app = createServer();

        initRoutes(app);

        const listen = promisify(app.listen).bind(app);
        await listen(config.get('port'));
        global.log.info(`Started ${config.get('apiName')} on port ${config.get('port')} of environment ${config.util.getEnv('NODE_ENV')}`);
    } catch (err) {
        if (global.log) {
            global.log.error({
                err
            }, 'Error starting');
        } else {
            console.error('Error starting', err); // eslint-disable-line no-console
        }
    }
})();