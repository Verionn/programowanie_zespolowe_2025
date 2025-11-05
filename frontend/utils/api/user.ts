import { fetchData } from ".";

async function deleteUser(userId: string) {
    try {
      await fetchData<void>({
        method: 'DELETE',
        endpoint: `/user/${userId}`,
      });
      console.log('User deleted');
    } catch (error) {
      console.error('Delete error:', error);
    }
  }
  
  async function updateUserDetails(userId: string, userData: { name: string; email: string }) {
    try {
      const updateResponse = await fetchData<{ success: boolean }>({
        method: 'PUT',
        endpoint: `/user/${userId}`,
        body: userData,
      });
      console.log('Update response:', updateResponse);
    } catch (error) {
      console.error('Update error:', error);
    }
  }
  
async function getUserData() {
  try {
    const user = await fetchData<{ name: string; email: string }>({
      method: 'GET',
      endpoint: '/user',
    });
    console.log(user);
  } catch (error) {
    console.error('Error fetching user data:', error);
  }
}
