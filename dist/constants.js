"use strict";
module.exports = {
    messages: {
        SERVER: {
            connection: 'server started at port'
        },
        DB: {
            successfullyConnected: 'DB connection has been established successfully.'
        },
        USER: {
            successfullyCreateNewUser: 'new user created successfully',
            successfullyDeactivatedUser: 'user deactivated successfully'
        }
    },
    errorMessages: {
        DB: {
            connection: 'Unable to connect to the database.'
        },
        USER: {
            invalidUserParameters: 'invalid user parameters',
            invalidUserID: 'invalid user ID'
        }
    }
};
