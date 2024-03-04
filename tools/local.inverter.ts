import inverter from "../src/inverter";

const apiKey = process.env.FOXESS_API_KEY;
if (apiKey === undefined) throw new Error("No API key found in environment variables");

void (async () => {
  const devices = await inverter.getDeviceList(apiKey);
  console.log(devices);
  for (const device of devices) {
    const data = await inverter.getRealTimeData(apiKey, { sn: device.deviceSN });
    console.log(data);
  }
})();
