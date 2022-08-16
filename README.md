# foodDeliveryBackEnd2

Here is how the files for this this project is structured.

==========================================================================================================================
|-->(app.js) This is where our app first starts which is the entry point of our app.
  |-->(database/database.js) In this directory, the base and access to connect to Mongo emote database is defined here.
    |-->(models/*) Here the dfferent models, and the mongo schemas which we are going to use are defined here
      |-->(Routes/routers.js) This is where the different end ponts are are implemented and thier callback functions are implemented in 
        |-->(Controller/users/userControllers.js)
        
          |-->(Controller/users/validation.js) In this file, the different logic for validations using joi package are implemented here.
===================================================================================================================