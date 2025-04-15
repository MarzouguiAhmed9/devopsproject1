export interface Cv {
  id?: number;
  name?: string;
  skills?: string;
  experiences?: string[];  // Array of strings for experiences
  educations?: string[];  // Array of strings for educations
  projects?: string[];  // Array of strings for projects
  languages?: string[];  // Array of strings for languages
  hobbies?: string[];  // Array of strings for hobbies
  contactinfo?: string;
  pdfDownloadLink?: string;
  photoUrl?: string;  // Photo URL as string (can be a path or URL)
  email?: string;
  phoneNumber?: string;
  address?: string;
  linkedinProfile?: string;
  certificate?: string;
  createdBy?: string;
  username?: string;  // Assuming the backend will have a username field associated with the CV
}
