const { nextISSTimesForMyLocation } = require('./iss_promised');

// see index.js for printPassTimes 
// copy it from there, or better yet, moduralize and require it in both files

// Call 
const printPassTimes = function(data){
  let data3 = ""
  for (let flyover of data) {
    var d = new Date(flyover.risetime * 1000);
    data3 += (`Next Pass at ${d} for ${flyover.duration} seconds` + "\n");
  }
  return console.log(data3)
}



nextISSTimesForMyLocation()
  .then((passTimes) => {
    printPassTimes(passTimes);
  })
  .catch((error) => {
    console.log("It didn't work: ", error.message);
  });