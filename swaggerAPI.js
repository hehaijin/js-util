'use strict';

const util = require('util');
const schemaGenerator = require('json-schema-generator');

/**
 * some utility methods to work with swagger/OAS 3.0.
 */
class SwaggerAPI {
    constructor(title, description, version) {
        this.swaggerjson = {
            openapi: '3.0.0',
            info: {
                title,
                description,
                version
            },
            servers: [],
            paths: {}
        };
    }


    addExpressApp(server) {
        server._router.stack.filter(r => r.route && r.route.path).map(
            r => {
                //r.route.methods object
                Object.keys(r.route.methods).forEach(method => this.addPath(r.route.path, method));
            }
        )
    }





    get Routes() {
        let result = [];
        for (const path of Object.keys(json.paths)) {
            for (const method of Object.keys(json.paths[path])) {
                result.push(this.swaggerjson.paths[path][method]);
            }
        }
        return result;
    }


    addServer(url, description) {
        if (!util.isArray(this.swaggerjson.servers)) throw new Error('Server must be a array');
        let servers = this.swaggerjson.servers;
        servers.push({ url, description });
    }

    /**
     *
     * @param {*} path : a express path,  i.e. '/search/client', can have ':' for templating; do not support regex elements like ?+* yet. 
     * @param {*} method  'GET'
     * @param {*} body
     * @param {*} parameters
     */
    addPath(path, method) {
        if (!this.swaggerjson.paths[path]) this.swaggerjson.paths[path] = {};
        if (this.swaggerjson.paths[path][method]) {
            throw new Error('method already exist');
        }

        if (path.indexOf(':') === -1) {
            this.swaggerjson.paths[path][method] = {
                tags: [],
                requestBody: {},
                parameters: [],
                responses: {
                    200: {
                        description: 'OK'
                    }
                }
            };
        } else {
            // needs a way to auto translate ':'  
            // good practice of regex here
            const arr1 = /\/:[\/$]/.exec(path);
            const path2 = path.replace(/:id/, '&{id}');
            arr1.forEach(variable => {

            });

        }
    }

    addBody(path, method, body) {
        this.swaggerjson.paths[path][method].requestBody= body;
      }
    
    addResponse(path, method, code, description) {
        this.swaggerjson.paths[path][method].responses[code] = { description };
    }

    /**
     * add tag to path that matches the given string/regex
     * @param tag
     * @param ipath  a string or regex.
     * @param imethod
     */
    addTag(ipath, imethod, tag) {
        let json = this.swaggerjson;
        for (const path of Object.keys(json.paths)) {
            if (!path.match(ipath)) continue;
            for (const method of Object.keys(json.paths[path])) {
                if (method !== imethod) continue;
                if (!json.paths[path][method].tags) json.paths[path][method].tags = [];
                json.paths[path][method].tags.push(tag);
            }
        }
    }


    addParameter(ipath, imethod, parameter) {
        let json = this.swaggerjson;
        for (const path of Object.keys(json.paths)) {
            if (!path.match(ipath)) continue;
            for (const method of Object.keys(json.paths[path])) {
                if (method !== imethod) continue;
                if (!json.paths[path][method].tags) json.paths[path][method].parameters = [];
                json.paths[path][method].parameters.push(parameter);
            }
        }
    }


   static createParameter(name, place, description, defaultValue) {
        return {
            name,
            in: place,
            description,
            required: true,
            schema: {
                type: 'string',
                default: defaultValue
            }
        };
    }

    static createJSONRequestBody(schema, required) {
        return {
            required,
            content: {
                "application/json": {
                    schema
                }
            }
        };
    }

    static createSchemaFromJSON(j) {
        return schemaGenerator(j);
    }


    /**
     * adds a level of wrapping for a object schema.
     * if schema is not provided, it assume it is a empty object
     * @param {*} name 
     * @param {*} schema 
     */
    static schemaAddWrapper(name, schema) {
        if (!schema)
            return {
                type: 'object',
                properties: {
                    [name]: {
                        type: 'object',
                        properties: {}
                    }
                }
            }
        return {
            type: 'object',
            properties: {
                [name]: schema
            }
        }
    }



    /**
     * check if a route already exists for this request.
     * turns out much more complex than I thought.
     * 
     * @param {} req 
     */
    findMatchingRoute(req) {
        const url = req.url;
        const method = req.method;
        const query = req.query;
        for (const key of Object.keys(this.swaggerjson.paths)) {
            if (this.isRouteMatch(req, key)) return key;
        }
        return undefined;
    }


    /**
     * check if route match
     * @param {*} req // req.url:the url might have query string
     * @param {*} pathURL  // this url is without path string, and might have path parameter like /{id}
     */
    isRouteMatch(req, pathURL) {
        // using req.path we do not need to check req.query
        if (path.indexOf('{') === -1 && path.indexOf('}') === -1) {
            return path === req.path;
        } else {
            // split with '/' and check each part.
            // omit parts with '{}'
            const splits1 = path.split('/');
            const splits1 = req.path.split('/');
            if (splits1.length !== splits2.length) return false;
            for (var i in splits1) {
                if (splits1[i].indexOf('{') === -1 && splits1[i] !== splits[i]) return false;
                return true;
            }
        }
    }



    autoCapture(req, res, next) {

        const url = req.url;
        const method = req.method;
        const headers = req.headers;
        const body = req.body;
        const bodySchema = schemaGenerator(body);

        if (!this.findMatchingRoute(req)) {
            // create new route


        } else {
            // check method also match


            // no matching method


        }


        next();
    }

}

module.exports = SwaggerAPI;
