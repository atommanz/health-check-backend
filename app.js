const express = require('express')
const requestService = require('./services/request')
const cors = require('cors')
const bodyParser = require('body-parser')
const app = express()
const port = 3001
app.use(cors())
app.use(bodyParser())
app.post('/api/checkUrl', async (req, res) => {
    try {
        if (req.body.listUrl.length <= 0) {
            return res.status(200).send({ success: true, data: 'no data' })
        }
        console.log('Perform website checking...')
        const start = new Date()
        const listProm = []
        req.body.listUrl
            .filter(val => (val && val !== 'url'))
            .map(val => {
                console.log(listProm.length)
                listProm.push(requestService.check(val))
            })
        const listUrlOut = await Promise.all(listProm)
        console.log('Done!')

        const end = new Date()
        const durationMilli = end - start
        const durationNano = durationMilli * 1000000
        let countSuccess = 0, countFail = 0
        for (const val of listUrlOut) {
            // console.log(val)
            if (val.alive) { countSuccess = countSuccess + 1 }
            else { countFail = countFail + 1 }
        }

        console.log('Checked webistes: ', listUrlOut.length)
        console.log('Successful websites: ', countSuccess)
        console.log('Failure websites: ', countFail)
        console.log('Total times to finished checking website', durationNano)

        return res.status(200).send({
            success: true, data: {
                summary: {
                    total_websites: listUrlOut.length,
                    success: countSuccess,
                    failure: countFail,
                    total_time: durationNano
                },
                listUrl: listUrlOut
            }
        })
    } catch (e) {
        return res.status(500).send({ success: false, message: e.message })
    }

})

app.post('/api/report', async (req, res) => {
    try {

        const statusCode = await requestService.reportAPI(req.body.token, req.body.summary)
        return res.send({ success: true, data: statusCode })
    } catch (e) {
        return res.status(500).send({ success: false, message: e.message })
    }

})

app.listen(port, () => console.log(`app listening on port ${port}!`))