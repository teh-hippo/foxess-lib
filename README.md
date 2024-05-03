# foxess-lib

![node](https://img.shields.io/node/v/foxess-lib)
[![npm](https://img.shields.io/npm/dt/foxess-lib.svg)](https://www.npmjs.com/package/foxess-lib)
[![npm version](https://badge.fury.io/js/foxess-lib.svg)](https://badge.fury.io/js/foxess-lib)
![Node.js CI](https://github.com/teh-hippo/foxess-lib/workflows/Node.js%20CI/badge.svg)

Javascript / Typescript library for working with the FoxESS OpenAPI.
Also supports subsidiaries that utilise FoxESS as a backend, such as [Energizer Solar](http://www.energizersolar.com).

This library is fully functional, but still considered to be in early development.

## About The Project

FoxESS provides documentation for their [Open API](https://www.foxesscloud.com/public/i18n/en/OpenApiDocument.html) endpoint, but no OpenAPI specification.
This project reverses that documentation back into an [API](./foxess-api.json) for consumption.
Types are generated by [OpenAPI TypeScript](https://openapi-ts.pages.dev/), alongside FoxESS specific connection utilities, such as generating call signatures.

## Getting Started

### Installation

```shell
    npm i foxess-lib
```

### Generate an API Key

An API key is required to communicate with the FoxESS endpoint.

1. Login to [FoxESS Cloud](https://www.foxesscloud.com). For subsidaries like Energizer Solar, your username and password will be the same.
1. Top-right, open your [User Profile](https://www.foxesscloud.com/user/center).
1. Under API Management, hit 'Generate API Key'.

For local testing (e.g., [local.inverter.ts](./tools/local.inverter.ts)), store the API key in an environment variable called `FOXESS_API_KEY`.

## Usage

### Basic

Several utility classes are provided for common tasks.

#### Power Stations

```typescript
    import powerStation from "foxess-lib/lib/powerstation";

    void (async () => {
        const apiKey = "<my-api-key>";
        const devices = await powerStation.getDevices(apiKey);
        for (const device of devices) {
            console.log(await powerStation.getDetails(apiKey, device));
        }
    })();
```

#### Inverters

```typescript
    import inverter from "foxess-lib/lib/inverter";

    void (async () => {
        const apiKey = "<my-api-key>";
        const devices = await inverter.getDevices(apiKey);
        for (const device of devices) {
            console.log(await inverter.getRealTimeData(apiKey, { sn: device.deviceSN }));
        }
    })();
```

#### Utilities

See [util.ts](src/util.ts) for FoxESS-specific functions, such as `calculateSignature`.

### Advanced

foxess-lib uses [OpenAPI TypeScript](https://openapi-ts.pages.dev/) as a wrapper around the [API specification](./foxess-api.json).
Usage follows the same approach provided by OpenAPI.

```typescript
    import { header, BaseUrl, createClient, type paths } from "foxess-api";

    // Types
    export type Inverter = paths["/op/v0/device/list"]["post"]["responses"]["200"]["content"]["application/json"]["result"]["data"][0];

    // Request types
    export type GetDeviceRealTimeDataRequest = paths["/op/v0/device/real/query"]["post"]["requestBody"]["content"]["application/json"];
    export type RealTimeData = paths["/op/v0/device/real/query"]["post"]["responses"]["200"]["content"]["application/json"]["result"][0];

    // Example call
    export async function getRealTimeData(apiKey: string, options?: GetDeviceRealTimeDataRequest): Promise<RealTimeData[] | undefined> {
        const path: keyof paths = "/op/v0/device/real/query";
        const { data } = await createClient<paths>({ baseUrl: BaseUrl }).POST(path, {
            params: { header: header(path, apiKey) },
            body: options ?? {}
        });

        if (data === undefined) throw new Error(`Did not receive back any data.`);
        if (data.errno !== 0) throw new Error(`Invalid response code: ${data.errno.toString()}`);
        return data.result;
    }
```

## License

Distributed under the GPLv3 License. See [`LICENSE`](./LICENSE) for more information.
