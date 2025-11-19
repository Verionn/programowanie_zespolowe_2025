import { EmergencyTypeEnum } from "@/utils/types/types";

export const endpoint = 'http://10.0.2.2:8080/'

export const emergencyTypeTranslations: Record<EmergencyTypeEnum, string> = {
    CLEANUP_ASSISTANCE: "Pomoc w sprzątaniu",
    FOOD_SUPPLY: "Dostawa żywności",
    WATER_SUPPLY: "Dostawa wody",
    MEDICINE_SUPPLY: "Dostawa leków",
    HYGIENE_PRODUCTS: "Produkty higieniczne",
    REPAIR_ASSISTANCE: "Pomoc w naprawie",
    USER_LOCATION: "Twoja lokalizacja",
  };

