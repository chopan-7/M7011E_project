const fetch = require('node-fetch')

var query = `mutation {
    authenticate(email: "d1@greenlight.org", password: "d1") {
      status
      tokens {
        access
        refresh
      }
    }
  }`

var data = fetch('http://localhost:8000/api/prosumer',{
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
.then(data => {
    console.log(data.data.authenticate.tokens)
});