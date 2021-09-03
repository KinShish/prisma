const Hapi = require('@hapi/hapi');
const hapiAuthJWT = require('hapi-auth-jwt2');
const ip = require("ip");
const logger=(pool,id_manager,id_company,type,description,url,params)=>{
    pool.query("INSERT INTO vtr_logger (id_manager,id_company,type,description,url,params) VALUES (?, ?, ?, ?,?,?)",[id_manager,id_company,type,description,url,JSON.stringify(params)]);
    console.log(id_manager,id_company,type,description,url)
}//1
const validate = async function (decoded, req, h) {
    const pool = req.mysql.pool;
    await pool.query("UPDATE vtr_session SET lastAuth=NOW() WHERE `key`=?",[decoded.key]);
    const [rows] = await pool.query("SELECT data FROM vtr_session WHERE `key`=?",[decoded.key]);
    if (rows.length>0) {
        return { isValid: true ,credentials:rows[0].data};
    }
    else {
        return { isValid: false};
    }
};

const init = async (configs) => {
    const host = ip.address() || configs.server.host;
    const port = process.env.PORT || configs.server.port;
    const server = new Hapi.Server({
        debug: { request: ['error'] },
        host,
        port,
        routes: {
            timeout: {
                server: 60000 * 60
            },
            cors: {
                origin: ['*'],
                additionalHeaders: ['cache-control', 'x-requested-with','x-custom-header']
            }
        }
    });
    for(const plugin of configs.server.plugins){
        await require('./plugin/'+plugin).register(server,configs);
    }
    for(const module of configs.server.modules){
        await server.register({plugin:require('./api/'+module),options:{configs:configs.modules,func:require('./function')}});
    }
    server.ext({
        type: 'onRequest',
        method: async function (request, h) {
            request.server.config = Object.assign({}, );
            request.server.logger = logger;
            console.log(request.path)
            return h.continue;
        }
    });
    await server.register(hapiAuthJWT);
    server.auth.strategy('jwt', 'jwt',
        { key: configs.modules.key,
            validate: validate,
            //verifyOptions: { algorithms: [ 'HS256' ] }
        });
    server.auth.default('jwt');
    return server;
};
module.exports={init};