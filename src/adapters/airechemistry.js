const { DateTime } = require('luxon');

module.exports.name = 'Airechemistry';

module.exports.fetchStream = async function (source) {
  const res = await fetch(source.sourceURL);
  const data = await res.json();
  console.log("🚀 Starting Airechemistry adapter fetch...");
  console.log("✅ JSON data parsed successfully.");
  console.log("📦 Raw data:", JSON.stringify(data, null, 2));
  const latitude = -25.74611;
  const longitude = 28.18806;

  const utcDate = DateTime.utc();
  const localDate = utcDate.setZone('Africa/Johannesburg');

  const measurements = [];

  // Temperature
  measurements.push({
    parameter: 'temperature',
    value: data.Temperature_C.value,
    unit: '°C',
    date: { utc: utcDate.toISO(), local: localDate.toISO() },
    coordinates: { latitude, longitude },
    attribution: [{ name: 'Airechemistry', url: 'https://airechemistry.example.com' }],
    averagingPeriod: { value: 10, unit: 'seconds' }
  });

  // Humidity
  measurements.push({
    parameter: 'humidity',
    value: data.Humidity_Percent.value,
    unit: '%',
    date: { utc: utcDate.toISO(), local: localDate.toISO() },
    coordinates: { latitude, longitude },
    attribution: [{ name: 'Airechemistry', url: 'https://airechemistry.example.com' }],
    averagingPeriod: { value: 10, unit: 'seconds' }
  });

  // Ozone (O3)
  measurements.push({
    parameter: 'o3',
    value: data.Gas.CH0.value,
    unit: 'ppm',
    date: { utc: utcDate.toISO(), local: localDate.toISO() },
    coordinates: { latitude, longitude },
    attribution: [{ name: 'Airechemistry', url: 'https://airechemistry.example.com' }],
    averagingPeriod: { value: 10, unit: 'seconds' }
  });

  // Carbon Monoxide (CO)
  measurements.push({
    parameter: 'co',
    value: data.Gas.CH1.value,
    unit: 'ppm',
    date: { utc: utcDate.toISO(), local: localDate.toISO() },
    coordinates: { latitude, longitude },
    attribution: [{ name: 'Airechemistry', url: 'https://airechemistry.example.com' }],
    averagingPeriod: { value: 10, unit: 'seconds' }
  });

  // PM1
  measurements.push({
    parameter: 'pm1',
    value: data.Dust['PM1.0'].value,
    unit: 'µg/m³',
    date: { utc: utcDate.toISO(), local: localDate.toISO() },
    coordinates: { latitude, longitude },
    attribution: [{ name: 'Airechemistry', url: 'https://airechemistry.example.com' }],
    averagingPeriod: { value: 10, unit: 'seconds' }
  });

  // PM2.5
  measurements.push({
    parameter: 'pm25',
    value: data.Dust['PM2.5'].value,
    unit: 'µg/m³',
    date: { utc: utcDate.toISO(), local: localDate.toISO() },
    coordinates: { latitude, longitude },
    attribution: [{ name: 'Airechemistry', url: 'https://airechemistry.example.com' }],
    averagingPeriod: { value: 10, unit: 'seconds' }
  });

  // PM10
  measurements.push({
    parameter: 'pm10',
    value: data.Dust['PM10'].value,
    unit: 'µg/m³',
    date: { utc: utcDate.toISO(), local: localDate.toISO() },
    coordinates: { latitude, longitude },
    attribution: [{ name: 'Airechemistry', url: 'https://airechemistry.example.com' }],
    averagingPeriod: { value: 10, unit: 'seconds' }
  });

  return {
    name: 'Airechemistry Harate',
    measurements
  };
};
