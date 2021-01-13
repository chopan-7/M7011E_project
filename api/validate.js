const AppSettings = require("../appSettings")
const jwt = require('jsonwebtoken')


/*
TODO:
    - verify Tokens and return user id
  */
function verifyToken(token){
  var result = {verified: false, data:{}}
  try {
    const decoder = jwt.verify(token, AppSettings.secrets.access)
    result.verified = true
    result.data = {id:decoder.userid}
    return(result)
  } catch(err) {
    console.log(err)
    return(err)
  }

}

function unsignToken(token){
  const tokenData = verifyToken(token)
  const accessToken = jwt.sign({id: tokenData.data.id}, AppSettings.secrets.unsign, {expiresIn: '15m'})
  const refreshToken = jwt.sign({id: tokenData.data.id}, AppSettings.secrets.unsign, {expiresIn: '7d'})
  return { access: accessToken, refresh: refreshToken }
}

module.exports = {verifyToken, unsignToken};