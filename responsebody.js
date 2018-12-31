

// a middleware that monkey patches res.write/end and res.

// at least res.json() is also calling res.end internally.
// but res.json()  res.jsonp() is not calling res.write. 
// so this method is not enough. 
// res.send() might call res.json() if the argument is json

function JSONResponseBodyParser(req, res, next) {
    var oldWrite = res.write,
        oldEnd = res.end;
        oldJson= res.json;
  
    var chunks = [];
  
    res.write = function (chunk) {
      chunks.push(new Buffer(chunk));
  
      oldWrite.apply(res, arguments);
    };
  
    res.end = function (chunk){
      if (chunk)
        chunks.push(new Buffer(chunk));
  
      var body = Buffer.concat(chunks).toString('utf8');
        res.body=body;
      oldEnd.apply(res, arguments);
    };
  
    res.json= function(data){
        res.body= data;
        oldJson.apply(res, data);
    }
    next();
  }
  
