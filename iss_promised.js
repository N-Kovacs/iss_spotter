const request = require('request-promise-native');

const fetchMyIP = function() {
  return request('https://api.ipify.org?format=json');
};

const fetchCoordsByIP = function(body) {
  const ip = JSON.parse(body).ip;
  return request('http://ipwho.is/' + ip)
};

const fetchISSFlyOverTimes = function(body) {
  const { latitude, longitude } = JSON.parse(body);
  const url = `https://iss-flyover.herokuapp.com/json/?lat=${latitude}&lon=${longitude}`;
  return request(url);
};

const nextISSTimesForMyLocation = function() {
  return fetchMyIP()
    .then(fetchCoordsByIP)
    .then(fetchISSFlyOverTimes)
    .then((data) => {
      const { response } = JSON.parse(data);
      return response;
    });
    
};
const printPassTimes = function(data){
  let data3 = ""
  for (let flyover of data) {
    var d = new Date(flyover.risetime * 1000);
    data3 += (`Next Pass at ${d} for ${flyover.duration} seconds` + "\n");
  }
  return console.log(data3)
}

module.exports = { nextISSTimesForMyLocation };