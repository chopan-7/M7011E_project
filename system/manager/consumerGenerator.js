const randomWords = require('random-words')

const generateName = () => {
    return randomWords(2).join(' ')
}

const generateEmail = () => {
    var name = generateName()
    name.split(' ').join('')
    return name+'@greenlight.com'
}

const generateConsumer = () => {
    var name = generateName()
    var email = name.split(' ').join('')+'@greenlight.com'
    return {name, email}
}

module.exports = {generateConsumer, generateName, generateEmail}