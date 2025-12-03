import { fetchData } from ".";

async function loginUser(email: string, password: string) {
    try {
      const loginResponse = await fetchData<{ token: string }>({
        method: 'POST',
        endpoint: '/auth/login',
        body: { email, password },
      });
      console.log('Login successful, token:', loginResponse.token);
    } catch (error) {
      console.error('Login error:', error);
    }
  }
  