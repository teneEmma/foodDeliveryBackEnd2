module.exports = class ResponseObj{
    
    constructor(){
        this.response = {
            message: String,
            data: {},
            token: String,
            refreshToken: String,
            code: Number
        };
    }

    onSuccess(message, data, code=undefined){
        this.response.data = data;
        this.response.message = message;
        this.response.code = code;
        return this.response;
    }

    onError(message, code=undefined){
        this.response.data = null;
        this.response.message = message;
        this.response.code = code;
        return this.response;
    }

    setTokens(accessT, refreshT) {
        this.response.token = accessT;
        this.response.refreshToken = refreshT;
    }
};
