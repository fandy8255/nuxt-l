//import { createHmac } from 'node:crypto';

export default defineEventHandler(async (event) => {

    try {
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
    
        // Convert the secret key and timestamp to Uint8Array
        const encoder = new TextEncoder();
        const keyData = encoder.encode(secretKey);
        const timestampData = encoder.encode(timestamp);
    
        // Import the key
        const key = await crypto.subtle.importKey(
          'raw',
          keyData,
          { name: 'HMAC', hash: 'SHA-256' },
          false,
          ['sign']
        );
    
        // Generate the HMAC signature
        const signatureBuffer = await crypto.subtle.sign('HMAC', key, timestampData);
        const signatureArray = Array.from(new Uint8Array(signatureBuffer));
        const signatureHex = signatureArray.map(b => b.toString(16).padStart(2, '0')).join('');
    
        return { signature: signatureHex };
      } catch (error) {
        //console.error('Error in HMAC route:', error);
        throw createError({
          statusCode: 500,
          statusMessage: 'Internal Server Error',
        });
      }


});