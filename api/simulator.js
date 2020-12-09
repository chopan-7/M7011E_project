var express = require('express');
var router = express.Router();
var { graphqlHTTP } = require('express-graphql');
var { buildSchema } = require('graphql');

const sim = require('../system/simulator/simulator');
const simulator = new sim()

var simulatorSchema = buildSchema(`
  type Simulator {
    getConsumption: [Float!],
    getWind: [Float!],
    getSuggestedPrice: Float!,
    getDate: String!
  }

  type Query {
    simulate: Simulator
  }
`);

var simulatorRoot = {
  simulate: ({}) => {
    return simulator;
  }
}

router
    .use('/', graphqlHTTP({
    schema: simulatorSchema,
    rootValue: simulatorRoot,
    graphiql: true,
  }));

module.exports = router;