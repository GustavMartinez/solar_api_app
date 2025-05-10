const axios = require('axios');

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;

async function getSolarData(lat, lng) {
  const url = `https://solar.googleapis.com/v1/buildingInsights:findClosest?location.latitude=${lat}&location.longitude=${lng}&key=${GOOGLE_API_KEY}`;

  const response = await axios.get(url);
  return response.data;
}

module.exports = {
  getSolarData,
};
