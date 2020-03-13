
const request = require('request')

const check = function (url) {
    const start = new Date()
    return new Promise(function (resolve, reject) {

        var link = url
        const out = {
            url,
            alive: false
        }
        request(link, function (error, response, body) {

            const end = new Date()
            const durationMilli = end - start

            const durationNano = durationMilli * 1000000
            if (error) {
                 const end = new Date()
                const durationMilli = end - start

                const durationNano = durationMilli * 1000000
                return resolve({ ...out, alive: false, durationNano });
            }

            if (response.statusCode == 200 || response.statusCode == 201 || response.statusCode == 202) {
                 return resolve({ ...out, alive: true, durationNano });
               
            }

            if (response.statusCode == 301 || response.statusCode == 302) {
                return resolve({ ...out, alive: true, durationNano });
               
            }

            if (response.statusCode == 401) {
               return resolve({ ...out, alive: true, durationNano });
              
            } else {
                resolve({ ...out, alive: false, durationNano });
            }

        })
    })
}


exports.check = check
