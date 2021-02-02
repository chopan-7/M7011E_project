var express = require('express');
var router = express.Router();
var { graphqlHTTP } = require('express-graphql');
var { buildSchema } = require('graphql');
const {verifyToken, unsignToken} = require('./validate');

const Manager = require('../system/manager/manager')
const manager = new Manager()

var managerSchema = buildSchema(`
    type ManagerData {
        state: Int!
        currentProduction: Float!
        buffer: Float!
        bufferRatio: Float!
        currentPrice: Float!
        marketDemand: Float!
        prosumerOutage: Int!
        prosumerCount: Int!
        consumerCount: Int!
        managerCount: Int!
    }

    type ManagerInfo {
        id: Int!
        name: String!
        email: String!
        role: String!
        state: String!
        picture: String
    }

    type MarketMsg {
        status: Boolean!
        fromMarket: Float!
    }

    type StatusMsg {
        status: Boolean!
        message: String!
    }

    type AuthMsg {
        status: Boolean!
        message: String!
        tokens: Tokens
    }

    type Tokens {
        access: String!
        refresh: String!
    }

    type Query {
        managerData(input: inputTokens): ManagerData
        managerInfo(id: Int!, input: inputTokens): ManagerInfo
        getCurrentPrice(input: inputTokens): Float!
    }

    input inputTokens {
        access: String
        refress: String
    }

    input RegisterUserData {
        name: String!
        email: String!
        password: String!
        picture: String
    }

    input UpdateUserData {
        tokenInput: inputTokens!
        id: Int!
        name: String
        email: String
        password: String
        picture: String
    }

    type Mutation {
        startProduction(id: Int!, input: inputTokens): StatusMsg!
        authenticate(email: String!, password: String!): AuthMsg!
        signOut(input: inputTokens): AuthMsg!
        setCurrentPrice(id: Int!, price: Float!, input: inputTokens): StatusMsg!
        setBufferRatio(id: Int!, ratio: Float!, input: inputTokens): StatusMsg!
        addToMarket(id: Int!, amount: Float!, input: inputTokens): Boolean!
        drainMarket(id: Int!, amount: Float!, input: inputTokens): MarketMsg
        blockUser(id: Int!, time: Int!, input: inputTokens): StatusMsg!
        deleteUser(id: Int!, input: inputTokens): StatusMsg!
        updateUser(input: UpdateUserData): StatusMsg!
        register(input: RegisterUserData): Boolean!
        addConsumer(input: inputTokens): StatusMsg!
        addProsumer(input: inputTokens): StatusMsg!
        removeConsumer(input: inputTokens): StatusMsg!
    }
    `);

var managerRoot = {
    managerData: (args) => {
        const getToken = verifyToken(args.input.access)
        if(getToken.verified) {
            return manager.getData(getToken.data.id)
        }
    },
    managerInfo: (args) => {
        const getToken = verifyToken(args.input.access)
        if(getToken.verified && args.id === getToken.data.id) {
            return manager.getManagerInfo(args.id)
        }
    },
    startProduction: (args) => {
        const getToken = verifyToken(args.input.access)
        if(getToken.verified && args.id === getToken.data.id) {
            return manager.managerStartStop(args.id)
        }
    },
    authenticate: (args) => {
        return manager.authenticate(args.email, args.password)
    },
    signOut: (args) => {
        const getToken = verifyToken(args.input.access)
        if(getToken.verified) {
            // signOut user from db
            manager.signOut(getToken.data.id)
            return ({
                status: true,
                message: 'Bye',
                tokens: unsignToken(args.input.access)
            })
        }
    },
    getCurrentPrice: (args) => {
        const getToken = verifyToken(args.input.access)
        if(getToken.verified) {
            return manager.getCurrentPrice()
        }
    },
    setCurrentPrice: (args) => {
        const getToken = verifyToken(args.input.access)
        if(getToken.verified && args.id === getToken.data.id) {
            return manager.setCurrentPrice(args.id, args.price)
        }
    },
    setBufferRatio: (args) => {
        const getToken = verifyToken(args.input.access)
        if(getToken.verified && args.id === getToken.data.id) {
            return manager.setBufferRatio(args.id, args.ratio)
        }
    },
    addToMarket: (args) => {
        const getToken = verifyToken(args.input.access)
        if(getToken.verified && args.id === getToken.data.id) {
            return manager.addToMarket(args.id, args.amount)
        }
    },
    drainMarket: (args) => {
        const getToken = verifyToken(args.input.access)
        if(getToken.verified && args.id === getToken.data.id) {
            return manager.drainMarket(args.id, args.amount)
        }
    },
    blockUser: (args) => {
        const getToken = verifyToken(args.input.access)
        if(getToken.verified) {
            return manager.managerBlockUser(args.id, args.time)
        }
    },
    deleteUser: (args) => {
        const getToken = verifyToken(args.input.access)
        if(getToken.verified) {
            return manager.managerDeleteUser(args.id, getToken.data.id)
        }
    },
    updateUser: (args) => {
        const getToken = verifyToken(args.input.tokenInput.access)
        if(getToken.verified) {
            return manager.managerUpdateUser(getToken.data.id, args)
        } else {
            return({status: false, message: 'Insvalid token.'})
        }
    },
    register: (args) => {
        return manager.registerManager(args)
    },
    addConsumer: (args) => {
        const getToken = verifyToken(args.input.access)
        if(getToken.verified) {
            return manager.addUser(getToken.data.id, 'consumer')
        } else {
            return({status: false, message: 'Insvalid token.'})
        }
    },
    addProsumer: (args) => {
        const getToken = verifyToken(args.input.access)
        if(getToken.verified) {
            return manager.addUser(getToken.data.id, 'prosumer')
        } else {
            return({status: false, message: 'Insvalid token.'})
        }
    },
    removeConsumer: (args) => {
        const getToken = verifyToken(args.input.access)
        if(getToken.verified) {
            return manager.removeConsumer(getToken.data.id)
        } else {
            return({status: false, message: 'Insvalid token.'})
        }
    }
  }

router
  .use('/', graphqlHTTP({
  schema: managerSchema,
  rootValue: managerRoot,
  graphiql: true,
}));

module.exports = router;