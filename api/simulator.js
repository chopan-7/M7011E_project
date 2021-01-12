var express = require('express');
var router = express.Router();
var { graphqlHTTP } = require('express-graphql');
var { buildSchema } = require('graphql');

const sim = require('../system/simulator/simulator');
const simulator = new sim()

var simulatorSchema = buildSchema(`
  type simData {
    consumption: [Float!]
    wind: [Float!]
    suggestedPrice: Float!
    date: Float!
  }

  type Query {
    simulate: simData
  }
`);

var simulatorRoot = {
  simulate: () => {
    return simulator.simData()
  }
}

router
    .use('/', graphqlHTTP({
    schema: simulatorSchema,
    rootValue: simulatorRoot,
    graphiql: true,
  }));

module.exports = router;