
const request = require('request')
const axios = require('axios')



const check =  function (url) {
    const start = new Date()
    return new Promise(async function (resolve, reject) {
        let link = url
        if (url.indexOf("http") === -1) link = 'http://' + url
        const out = {
            url,
            alive: false
        }
        request(link,  function (error, response, body) {
            console.log(url, url.indexOf("http"))
            const end = new Date()
            const durationMilli = end - start

            const durationNano = durationMilli * 1000000
            if (error) {
                const end = new Date()
                const durationMilli = end - start

                const durationNano = durationMilli * 1000000
                return resolve({ ...out, alive: false, durationNano });
            }

            else if (response.statusCode >= 200 && response.statusCode < 500) {
                return resolve({ ...out, alive: true, durationNano });
            }
            else {
                resolve({ ...out, alive: false, durationNano });
            }

        })
    })
}

const reportAPI = function (token, bodyUpdate) {
    return new Promise(function (resolve, reject) {
        axios.post('https://backend-challenge.line-apps.com/healthcheck/report',
            bodyUpdate,
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            }
        ).then((res) => {
            return resolve(true)
        }).catch((error) => {
            return resolve(false)
        })
    })
}


exports.check = check
exports.reportAPI = reportAPI
