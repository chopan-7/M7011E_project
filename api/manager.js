var express = require('express');
var router = express.Router();
var { graphqlHTTP } = require('express-graphql');
var { buildSchema } = require('graphql');

const Manager = require('../system/manager/manager')
const manager = new Manager()

var managerSchema = buildSchema(`
    type Manager {
        state: Int!
        buffer: Float!
        bufferRatio: Float!
        currentPrice: Float!
        marketDemand: Float!
        prosumerOutage: Int!
        
    }

    type MarketMsg {
        status: Boolean!
        fromMarket: Float!
    }

    type StatusMsg {
        status: Boolean!
        message: String!
    }

    type Query {
        managerData: Manager
    }

    type Mutation {
        startProduction(id: Int!): StatusMsg!
        authenticate(email: String!, password: String!): StatusMsg!
        signOut(id: Int!): StatusMsg!
        setCurrentPrice(id: Int!, price: Float!): StatusMsg!
        setBufferRatio(id: Int!, ratio: Float!): StatusMsg!
        addToMarket(id: Int!, amount: Float!): Boolean!
        drainMarket(id: Int!, amount: Float!): MarketMsg
    }
    `);

var managerRoot = {
    managerData: () => {
        return manager.getData()
    },
    startProduction: (args) => {
        return manager.managerStartStop(args.id)
    },
    authenticate: (args) => {
        return manager.authenticate(args.email, args.password)
    },
    signOut: (args) => {
        return manager.signOut(args.id)
    },
    setCurrentPrice: (args) => {
        return manager.setCurrentPrice(args.id, args.price)
    },
    setBufferRatio: (args) => {
        return manager.setBufferRatio(args.id, args.ratio)
    },
    addToMarket: (args) => {
        return manager.addToMarket(args.id, args.amount)
    },
    drainMarket: (args) => {
        return manager.drainMarket(args.id, args.amount)
    }
  }

router
  .use('/', graphqlHTTP({
  schema: managerSchema,
  rootValue: managerRoot,
  graphiql: true,
}));

module.exports = router;