import {fetchData} from ".";
import {token} from "@/constants/variables";
import {saveSecureItem} from "@/utils/function/functions";

export default async function loginUser(email: string, password: string) {
    try {
        const loginResponse = await fetchData<{ token: string }>({
            method: 'POST',
            endpoint: `/login`,
            body: { email, password },
        });
        await saveSecureItem(token, loginResponse.token);
    } catch (error) {
        console.error('Login error:', error);
    }
}