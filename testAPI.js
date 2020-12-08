const fetch = require('node-fetch')

var query = `query Simulator {
    simulate {
        getConsumption
    }
}`

var data = fetch('http://localhost:3000/graphql',{
    method: 'POST',
    headers: {
        'Content-type': 'application/json',
        'Accept': 'application/json',
    },
    body: JSON.stringify({
        query
    })
})
.then( r => r.json())
.then(data => console.log('data returned:', data));