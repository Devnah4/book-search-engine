// imports the models
const { User } = require('../models');
// error handler
const { AuthenticationError } = require('apollo-server-express');
// token variable to create users
const { signToken } = require('../utils/auth');

const resolvers = {
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
        login: async (parent, { email, password }) => {
            const user = await User.findOne({ email });

            // if there's no user then it should throw an error
            if(!user) {
                throw new AuthenticationError('Invalid login information');
            }

            const correctPw = await user.isCorrectPassword(password);

            if(!correctPw) {
                throw new AuthenticationError('Invalid login information');
            }

            const token = signToken(user);
            return { token, user };
        },
        saveBook: async (_parent, { input }, context) => {
            if (context.user) {
                const updateUser = await User.findOneAndUpdate(
                    { _id: context.user._id },
                    { $push: { savedBooks: input } },
                    { new: true }
                );

                return updateUser;
            }
            throw new AuthenticationError('You must be logged in to access this data');
        },
        deleteBook: async (_parent, {bookId}, context) => {
            console.log('resolver: ', bookId);
            if (context.user) {
                const updateUser = await User.findOneAndUpdate(
                    { _id: context.user._id },
                    { $pull: { savedBooks: { _id: bookId } } },
                    { new: true }
                );

                return updateUser;
            }
            throw new AuthenticationError('You must be logged in to access this data');
        }
    }
}

module.exports = resolvers;