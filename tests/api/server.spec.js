var request = require("request"); //Nodes package for sending http requests to server
var server = require("../../server.js");
var baseUrl = "http:localhost:3000/";

describe("Automated Acceptence Tests for Plateo Api", function (){
  describe("GET /", function (){
      it("should return status code 200 O.K.", function(){
          request.get(baseUrl, function(error, response, body){
              expect(response.statusCode).toEqual(200);
              server.closeServer();
              done();//node.js is an asynchronous environment, the it function will finish before our expect function does
          });
      });
  });
});
