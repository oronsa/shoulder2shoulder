
module.exports = {
    
    sendErrorResponse : function(response, error, status) {
        response.status(status).send(error);
    },
    
    sendObjectResponse : function(response, obj) {
           response.json(obj);
    }
    
};
