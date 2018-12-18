'use strict';
// it seems not exactly a middleware.





/**
 * adds a route that would return all routes for a express server.
 * @param {*} server  the express application 
 * @param {*} route   the route string; example '/listall'
 * returns:  methods: path. if there is multiple methods for a path, seperates by '|'
 * Example: ["POST:/Search/User", "POST:/Insert/User"]
 */

 // there seems no meta data in server that indicats its version.
 // as the method only works for express 4.x
function addListAllRoute(server, route) {
    if(!route.startsWith('/')) throw new Error('addListAllRoute: route must start with /');
    server.get(route, function (req, res, next) {
        res.send(server._router.stack.filter(r => r.route && r.route.path).map(r => {
            const methods = Object.keys(r.route.methods).filter(key => r.route.methods[key]).map(key => key.toUpperCase()).join('|');
            return methods + ':' + r.route.path;
        }));
    });
}






exports.addListAllRoute = addListAllRoute;