# foxess-lib

![node](https://img.shields.io/node/v/foxess-lib)
[![npm](https://img.shields.io/npm/dt/foxess-lib.svg)](https://www.npmjs.com/package/foxess-lib)
[![npm version](https://badge.fury.io/js/foxess-lib.svg)](https://badge.fury.io/js/foxess-lib)
![Node.js CI](https://github.com/teh-hippo/foxess-lib/workflows/Node.js%20CI/badge.svg)

Javascript / Typescript library for working with the FoxESS OpenAPI and all providers that run through FoxESS, such as [Energizer Solar](http://www.energizersolar.com).

## About The Project

FoxESS currently provides documentation for their [Open API](https://www.foxesscloud.com/public/i18n/en/OpenApiDocument.html) endpoint.
The OpenAPI specification is not presently provided.
This project reverses the documentation back into an [API](./foxess-api.json).
[OpenAPI TypeScript](https://openapi-ts.pages.dev/) then transforms the spec into types and a fetch libraries.

Also included are some utilities for common operations, such as signature calculation and common headers.

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

A utility class is provided for basic inverter querying.

```typescript
    import inverter from "foxess";

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
```

### Advanced

```typescript
    // Import
    import createClient from "openapi-fetch";
    import { type paths } from "foxess/lib/api/v1";

    // Map for requests
    export type GetDeviceRealTimeDataRequest = paths["/op/v0/device/real/query"]["post"]["requestBody"]["content"]["application/json"];
    
    // Map to types
    export type Inverter = paths["/op/v0/device/list"]["post"]["responses"]["200"]["content"]["application/json"]["result"]["data"][0];

    export type RealTimeData = paths["/op/v0/device/real/query"]["post"]["responses"]["200"]["content"]["application/json"]["result"][0];

    async function getRealTimeData(apiKey: string, options?: GetDeviceRealTimeDataRequest): Promise<RealTimeData[] | undefined> {
    const path: keyof paths = "/op/v0/device/real/query";
    const { data, error } = await createClient<paths>({ baseUrl: BaseUrl }).POST(path, {
        params: { header: header(path, apiKey) },
        body: options ?? {}
    });
    if (data?.errno !== 0 || !("result" in data)) throw new Error(`Invalid response code: ${data?.errno}: ${error}`);
    return data.result;
    }
```

## License

Distributed under the GPLv3 License. See [`LICENSE`](./LICENSE) for more information.
