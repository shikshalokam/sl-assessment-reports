var log4js = require('log4js'); // include log4js

log4js.configure({ // configure to use all types in different files.
    appenders: {
        errorschool: {
            type: 'file',
            filename: "../../logs/school/errorschool.log",
            category: 'error'
        },
        infoschool: {
            type: "file",
            filename: "../../logs/school/successschool.log",
            category: 'info'
        }
    },
    categories: {
        default: { appenders: ['infoschool'], level: 'info' },
        infoschool: { appenders: ['infoschool'], level: 'info' },
        errorschool: { appenders: ['errorschool'], level: 'error' }
    }
});

var loggerinfoschool = log4js.getLogger('infoschool');
var loggererrorschool = log4js.getLogger('errorschool');

module.exports = {
    loggerinfoschool: loggerinfoschool,
    loggererrorschool: loggererrorschool
}
