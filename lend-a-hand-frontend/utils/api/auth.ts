import {getEndpoint, HTTP_STATUS_CREATED, token} from "@/constants/variables";
import {saveSecureItem} from "@/utils/function/functions";
import {ApiService} from "@/utils/api/CRUD";

export async function loginUser(email: string, password: string) {
    try {
        const loginResponse = await ApiService.post<{ token: string }>(
            `${await getEndpoint()}/login`, {email: email, password: password});

        await saveSecureItem(token, loginResponse.data.token);
        console.log(loginResponse.data.token);

        return loginResponse.data.token;
    } catch (error) {
        console.error('Login error:', error);
        return null
    }
}

export async function registerUser(
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    phoneNumber: string,
) {
    try {
        const response = await ApiService.post<{ status: string }>(
            `${await getEndpoint()}/registration`, {
                firstName: firstName,
                lastName: lastName,
                email: email,
                password: password,
                phoneNumber: phoneNumber
            });

        if (response.status === HTTP_STATUS_CREATED) {
            console.log("Registration successful!");
        } else {
            console.warn("Registration not successful. Status:", response.status);
        }

        return response.status;
    } catch
        (error) {
        console.error('Registration error:', error);
        return null;
    }
}
