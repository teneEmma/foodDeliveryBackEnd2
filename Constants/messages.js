
const MessageObj = {
    success: {
        
        createdUser: "User Created Successfully",
        userNotTaken: "Free to use",
        listOfUsers: "List Of Users",
        loggedIn: "Login Successful",
        refreshedToken: "Token Refreshed Successfully"
    },
    error: {
        duplicatingData: "Trying To Duplicate Data",
        userTaken: "User Exists",
        credentialsIncorrect: "Email or Password incorrect",
        headerEmpty: "Empty Header.You must provide a token",
        expiredRefreshtoken: "Refresh token is expired. You need to SignIn Again",
        unauthorizedRequest: "Not Authorised To Make Such a Request"
    }
};

module.exports = MessageObj;