// imports the models
const { User } = require('../models');
// error handler
const { AuthenticationError } = require('apollo-server-express');
// token variable to create users
const { signToken } = require('../utils/auth');

const Resolvers = {
    Query: {
        me: async (parent, args, context) => {
            // check if there is a user in the context
            if (context.user) {
                const userData = await User.findOne({ _id: context.user._id })
                // sets value that should not be returned
                .select('-__v -password');
                return userData;
            }
            // error handling
            throw new AuthenticationError('You must be logged in to access this data');
        }
    },
    Mutation: {
        makeUser: async (parent, args, context) => {
            const user = await User.creation(args);
            const token = signToken(user);
            
            return { user, token};
        },
        login: asunc
    }
}