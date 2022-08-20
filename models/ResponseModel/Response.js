export class ResponseObj{
    
    constructor(){
        this.response = {
            message: String,
            data: {
                username: String,
                email: String,
                password: String,
                phoneNumber: String,
                userType: String
            }
        };
    }

    onSuccess(message, data){
        this.response.data = data;
        this.response.message = message;
        return this.response;
    }

    onError(message){
        this.response.data = null;
        this.response.message = message;
        return this.response;
    }

//    getReponse(){
//      return this.response;
//   }
}
