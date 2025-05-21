export interface UserProfileData {
  firstName?: string;
  lastName?: string;
  phone?: string;
  city?: string;
  street?: string;
  postalCode?: string;
  country?: string;
  birthDate?: string;
  idNumber?: string;
  [key: string]: unknown;
}
