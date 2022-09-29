/**
 * Makes a single API request to retrieve the user's IP address.
 * Input:
 *   - A callback (to pass back an error or the IP string)
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The IP address as a string (null if error). Example: "162.245.144.188"
 */
const request = require('request');

const fetchMyIP = function (callback) {
  // use request to fetch IP address from JSON API
  request('https://api.ipify.org/?format=json', (error, response, body) => {
    if (error) {
      const msg = "api could not be reached";
      callback(Error(msg), null);
    }
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }
    const data = JSON.parse(body);
    return callback(null, (data.ip));
  });
};

const fetchCoordsByIP = function (ip, callback) {
  // use request to fetch IP address from JSON API
  request('http://ipwho.is/' + ip, (error, response, body) => {
    if (error) {
      return callback("api inaccessable", null);
    }
    // console.log((JSON.parse(body)).success)
    const parsedBody = JSON.parse(body);
    if (!(JSON.parse(body)).success) {
      const message = `Success status was ${parsedBody.success}. Server message says: ${parsedBody.message} when fetching for IP ${parsedBody.ip}`;
      callback(Error(message), null);
      return;
    }
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }
    const data = {};
    // console.log(JSON.parse(body))
    data.latitude = (JSON.parse(body)).latitude;
    data.longitude = (JSON.parse(body)).longitude;
    return callback(null, (data));
  });
};

const fetchISSFlyOverTyimes = function (coords, callback) {
  // use request to fetch IP address from JSON API
  request('https://iss-flyover.herokuapp.com/json/?lat=' + coords.latitude + '&lon=' + coords.longitude, (error, response, body) => {
    if (error) {
      return callback("api inaccessable", null);
    }
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }
    const parsedBody = JSON.parse(body);
    if (parsedBody.message === "failure") {
      const message = `Success status was ${parsedBody.success}. Server message says: ${parsedBody.message} when fetching for IP ${parsedBody.ip}`;
      callback(Error(message), null);
      return;
    }


    let data = [];
    for (let response of parsedBody.response) {
      data.push(response);
    }

    return callback(null, (data));
  });
};

const nextISSTimesForMyLocation = function (callback) {
  fetchMyIP((error, ip) => {
    if (error) {
      return callback(error, null);
    }
    fetchCoordsByIP(ip, (error, data) => {
      if (error) {
        return callback(error, null);
      }
      fetchISSFlyOverTyimes(data, (error, data2) => {
        if (error) {
          return callback(error, null);
        }
        let data3 = "";
        for (let flyover of data2) {

          var d = new Date(flyover.risetime * 1000);
          data3 += (`Next Pass at ${d} for ${flyover.duration} seconds` + "\n");
        }
        return callback(null, data3);

      });

    });

  });
};


module.exports = { nextISSTimesForMyLocation };

