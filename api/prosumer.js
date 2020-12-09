var express = require('express');
var router = express.Router();
var { graphqlHTTP } = require('express-graphql');
var { buildSchema } = require('graphql');

const Prosumer = require('../system/prosumer/prosumer')
const prosumer = new Prosumer()

var prosumerSchema = buildSchema(`
    type Prosumer {
        id: Int!
        production: Float!
        consumption: Float!
        wind: Float!
    }

    type Query {
        prosumerData(id: Int!): Prosumer
    }
    `);

var prosumerRoot = {
    prosumerData: (args) => {
        return prosumer.getData(args.id)
    }
  }

router
  .use('/', graphqlHTTP({
  schema: prosumerSchema,
  rootValue: prosumerRoot,
  graphiql: true,
}));

module.exports = router;