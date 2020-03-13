
const request = require('request')

const check = function (url) {
    // console.log('check', url)
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
            // console.log('start', start, 'end', end, 'duration', durationNano)
            if (error) {
                // console.log('Err: ' + error);
                return reject({ ...out, alive: false, durationNano });
            }

            if (response.statusCode == 200 || response.statusCode == 201 || response.statusCode == 202) {
                // console.log(link + ' is up!!');
                return resolve({ ...out, alive: true, durationNano });
                // return false;
            }

            if (response.statusCode == 301 || response.statusCode == 302) {
                // console.log(link + ' is redirecting us!!');
                return resolve({ ...out, alive: true, durationNano });
                // return false;
            }

            if (response.statusCode == 401) {
                // console.log("you are unauthorized to " + link);
                return resolve({ ...out, alive: true, durationNano });
                // return false;
            } else {
                // console.log(link + ' is down!!');
                reject({ ...out, alive: false, durationNano });
            }

        })
    })
}


exports.check = check
