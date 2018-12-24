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
   * @param {*} path : i.e. '/search/client'
   * @param {*} method  'GET'
   * @param {*} body
   * @param {*} parameters
   */
  addPath(path, method, body, parameters) {
    if (!this.swaggerjson.paths[path]) this.swaggerjson.paths[path] = {};
    if (this.swaggerjson.paths[path][method]) {
      throw new Error('method already exist');
    }
    this.swaggerjson.paths[path][method] = {
      tags: [],
      requestBody: body,
      parameters: parameters,
      responses: {
        200: {
          description: 'OK'
        }
      }
    };
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
  addTag(tag, ipath, imethod) {
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

  addParameter(parameter, ipath, imethod) {
    let json = this.swaggerjson;
    for (const path of Object.keys(json.paths)) {
      if (!path.match(ipath)) continue;
      for (const method of Object.keys(json.paths[path])) {
        if (method !== imethod) continue;
        if (!json.paths[path][method].tags) json.paths[path][method].parameters = {};
        json.paths[path][method].parameters[parameter.name] = parameter.obj;
      }
    }
  }

  addHeader(name, ipath, imethod) {
    let json = this.swaggerjson;
    for (const path of Object.keys(json.paths)) {
      if (!path.match(ipath)) continue;
      for (const method of Object.keys(json.paths[path])) {
        if (method !== imethod) continue;
        if (!json.paths[path][method].headers) json.paths[path][method].headers = {};
        json.paths[path][method].headers[name] = {
          "description": "The number of allowed requests in the current period",
          "schema": {
            "type": "integer"
          }
        }
      }
    }
  }


  static createParameter(name, place, required) {


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


  static schemaAddWrapper(name, schema) {
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
    for(const key of Object.keys(this.swaggerjson.paths)){
      if(this.isRouteMatch(req,key)) return key;
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
