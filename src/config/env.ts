import Constants from 'expo-constants';

interface EnvConfig {
    API_BASE_URL: string;
}

// Get environment variables from app.json extra config
const getEnvConfig = (): EnvConfig => {
    const extra = Constants.expoConfig?.extra;

    // Default to localhost if no config is provided
    const defaultUrl = __DEV__
        ? 'http://192.168.0.199:8090'  // Change this to your computer's IP
        : 'https://expenso-backend-xecz.onrender.com';  // Production API URL

    return {
        API_BASE_URL: extra?.API_BASE_URL || defaultUrl,
    };
};

export const ENV = getEnvConfig();
