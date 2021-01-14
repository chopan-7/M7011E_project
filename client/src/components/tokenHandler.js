import Cookie from 'universal-cookie'
import jwt from 'jsonwebtoken'

const cookie = new Cookie()

function getFromCookie(name) {
    try {
        const token = cookie.get(name)
        const tokenData = jwt.verify(token, "Security is always excessive until it's not enough.")
        return {token: token, data: tokenData}
    } catch(err) {
        return err
    }
}

export default getFromCookie;