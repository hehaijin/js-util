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
    servers.push({url, description});
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
    this.swaggerjson.paths[path][method].responses[code] = {description};
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

}

module.exports = SwaggerAPI;
