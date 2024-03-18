import powerStation from "../src/powerstation";

const apiKey = process.env.FOXESS_API_KEY;
if (apiKey === undefined) throw new Error("No API key found in environment variables");

void (async () => {
  const devices = await powerStation.getDevices(apiKey);
  console.log(devices);
  for (const device of devices) {
    const details = await powerStation.getDetails(apiKey, device);
    console.log(details);
  }
})();
