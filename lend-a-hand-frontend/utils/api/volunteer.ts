import { getEndpoint, token } from "@/constants/variables";
import { getSecureItem, getUserId } from "../function/functions";
import { ApiService } from "./CRUD";
import { faker } from "@faker-js/faker/.";

export const handleVolunteering = async (id: string, signup: boolean) => {
  try {
    if (!token) throw Error("Couldn't find token");

    const localToken = await getSecureItem(token);
    if (!localToken) {
      throw new Error("Invalid token or missing userId");
    }
    const userId = await getUserId(localToken);

    if (!userId) {
      throw new Error("Failed to retrieve user ID from token");
    }
    const endpoint = `${await getEndpoint()}/emergencies/${id}/${
      signup ? "signup" : "resign"
    }`;
    if (signup) {
      const response = await ApiService.post<{ emergency: any }>(
        endpoint,
        { id: faker.string.uuid() },
        { Authorization: `Bearer ${localToken}` }
      );

      console.log("Successfully signed up for the event:", response.data);
      alert("Pomyślnie dołączyłeś/aś do wydarzenia.");
    } else {
      const response = await ApiService.delete<void>(endpoint, {
        Authorization: `Bearer ${localToken}`,
      });

      console.log("Successfully resigned from the event.");

      alert("Pomyślnie zrezygnowałeś/aś z wydarzenia.");
    }
  } catch (e: any) {
    console.error("Error while joining the event:", e.message);
    console.log(`Error: ${e.message}`);
    alert("Musisz być zalogowanie");
  }
};

export const checkVolunteeringStatus = async (id: string): Promise<boolean> => {
  try {
    if (!token) throw Error("Couldn't find token");

    const localToken = await getSecureItem(token);

    if (!localToken) {
      console.log("Invalid token or missing userId");
      return false;
    }
    const userId = await getUserId(localToken);

    if (!userId) {
      console.log("Failed to retrieve user ID from token");
    }
    const endpoint = `${await getEndpoint()}/emergencies/${id}/status`;
    console.log("Endpoint : ", endpoint);
    const response = await ApiService.get<boolean>(endpoint, {
      Authorization: `Bearer ${localToken}`,
    });
    console.log("Did I join this event ? ", response.data);

    return response.data;
  } catch (e: any) {
    console.error("Error while getting the status:", e.message);
    return false;
  }
};
