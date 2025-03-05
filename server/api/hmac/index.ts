import { createHmac } from 'node:crypto';

export default defineEventHandler(async (event) => {
    const runtimeConfig = useRuntimeConfig();
    const secretKey = runtimeConfig.secretApiKey;

    
    // Get the timestamp from the query parameters
    const { timestamp } = getQuery(event);

    if (!timestamp || typeof timestamp !== 'string') {
        throw createError({
            statusCode: 400,
            statusMessage: 'Timestamp is required',
        });
    }

    // Generate the HMAC signature
    const hmac = createHmac('sha256', secretKey);
    hmac.update(timestamp);
    const signature = hmac.digest('hex');

    return { signature };

    //return secretKey
});