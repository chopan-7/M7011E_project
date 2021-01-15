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

        
    }

    type ManagerInfo {
        id: Int!
        name: String!
        email: String!
        role: String!
        state: String!
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

    type Mutation {
        startProduction(id: Int!, input: inputTokens): StatusMsg!
        authenticate(email: String!, password: String!): AuthMsg!
        signOut(input: inputTokens): AuthMsg!
        setCurrentPrice(id: Int!, price: Float!, input: inputTokens): StatusMsg!
        setBufferRatio(id: Int!, ratio: Float!, input: inputTokens): StatusMsg!
        addToMarket(id: Int!, amount: Float!, input: inputTokens): Boolean!
        drainMarket(id: Int!, amount: Float!, input: inputTokens): MarketMsg
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
    }
  }

router
  .use('/', graphqlHTTP({
  schema: managerSchema,
  rootValue: managerRoot,
  graphiql: true,
}));

module.exports = router;