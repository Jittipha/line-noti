const redis = require('redis')
const client = redis.createClient()


const cache = (key) => {
    return async (req, res, next) => {
        let data = req.params || req.body || req.query
        await client.connect()
        data.api = key
        const res_checkkey = await client.get(JSON.stringify(data))
        await client.disconnect();
        if (res_checkkey != null) {
            res.send({error:false, fromcache: true, data: JSON.parse(res_checkkey) })
        } else {
            next()
        }
    }
}
module.exports = cache;