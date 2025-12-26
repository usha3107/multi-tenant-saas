import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

async function test() {
    try {
        console.log('Logging in...');
        const loginRes = await axios.post(`${API_URL}/auth/login`, {
            email: 'admin@demo.com',
            password: 'Demo@123'
        });

        const token = loginRes.data.data.token;
        const tenantId = loginRes.data.data.tenant.id;
        console.log('Login successful. Token:', token.substring(0, 20) + '...');
        console.log('Tenant ID:', tenantId);

        console.log(`Fetching tenant stats for ${tenantId}...`);
        const tenantRes = await axios.get(`${API_URL}/tenants/${tenantId}`, {
            headers: { Authorization: `Bearer ${token}` }
        });

        console.log('Tenant Response Data:', JSON.stringify(tenantRes.data, null, 2));

    } catch (error) {
        console.error('Error:', error.response ? error.response.data : error.message);
    }
}

test();
