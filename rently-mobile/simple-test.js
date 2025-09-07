const axios = require('axios');

const BASE_URL = 'http://localhost:3000/api';

const testHealth = async () => {
  try {
    console.log('Testing server health...');
    const response = await axios.get(`${BASE_URL}/health`);
    console.log('✅ Health check successful:', response.data);
  } catch (error) {
    console.error('❌ Health check failed:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    }
  }
};

testHealth(); 