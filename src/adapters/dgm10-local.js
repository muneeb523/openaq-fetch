'use strict';
const request = require('request-promise-native');
const { DateTime } = require('luxon');

exports.name = 'dgm10-local';

exports.fetchData = async function (source, cb) {
  try {
    const response = await request({
      uri: source.url || 'http://192.168.0.196:8080/data.json',
      json: true
    });

    if (!response.sensor_ok) {
      return cb({ message: 'Sensor not OK' });
    }

    const datetimeUTC = DateTime.utc().toISO();
    const datetimeLocal = DateTime.local().toISO();
    const coordinates = source.coordinates || {
      latitude: 28.6139, // Replace with your actual sensor location
      longitude: 77.2090
    };

    const baseMeta = {
      location: source.location || 'DGM10 Sensor',
      city: source.city || 'Delhi',
      country: source.country || 'IN',
      coordinates,
      attribution: [
        {
          name: 'Your Project or Org',
          url: 'https://yourproject.example.com'
        }
      ],
      averagingPeriod: { value: 1, unit: 'hours' }
    };

    const measurements = [];

    // Loop through gas sensors
    for (const key in response) {
      if (key.startsWith('s') && response[key]?.gas_concentration_ppm !== undefined) {
        const sensor = response[key];
        const parameter = getParameterCode(sensor.gas_name);
        if (!parameter) continue; // skip unrecognized parameters

        measurements.push({
          ...baseMeta,
          parameter,
          value: sensor.gas_concentration_ppm,
          unit: 'ppm',
          date: {
            utc: datetimeUTC,
            local: datetimeLocal
          }
        });
      }
    }

    // Optionally add temperature and humidity
    measurements.push({
      ...baseMeta,
      parameter: 'temperature',
      value: response.temperature_c,
      unit: '°C',
      date: {
        utc: datetimeUTC,
        local: datetimeLocal
      }
    });

    measurements.push({
      ...baseMeta,
      parameter: 'humidity',
      value: response.humidity_percent,
      unit: '%',
      date: {
        utc: datetimeUTC,
        local: datetimeLocal
      }
    });

    return cb(null, { name: exports.name, measurements });
  } catch (e) {
    return cb(e);
  }
};

function getParameterCode(gasName) {
  const lookup = {
    'Oxygen (O2)': 'o3', // closest match (OpenAQ doesn’t officially list O2, so mapping to o3)
    'Hydrogen Selenide (H2Se)': 'h2se', // not standard; could be skipped or mapped if OpenAQ restricts
    // Add more mappings if needed
  };
  return lookup[gasName] || null;
}
