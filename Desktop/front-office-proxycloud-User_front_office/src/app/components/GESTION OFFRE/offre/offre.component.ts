import { Component, OnInit } from '@angular/core';
import { Offre } from "../../../servicesahmed/models/offre";
import { OffreControllerService } from "../../../servicesahmed/services/offre-controller.service";
import { ApplicationControllerService } from "../../../servicesahmed/services/application-controller.service";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Application } from "../../../servicesahmed/models/application";
import { CvControllerService } from "../../../servicesahmed/services/cv-controller.service";
import { Cv } from "../../../servicesahmed/models/cv";
import { TokenService } from "../../../servicesahmed/token/token.service";

@Component({
  selector: 'app-offre',
  templateUrl: './offre.component.html',
  styleUrls: ['./offre.component.css'] // optional, if you have styles
})
export class OffreComponent implements OnInit {

  applications: Offre[] = [];
  cv: Cv | null = null;  // Change to hold a single CV instead of an array

  isLoading: boolean = false;
  errorMessage: string = '';
  offre: Offre = { skills: '', description: '', title: '' };
  isEditing: boolean = false;
  selectedOffreId: number | null = null;

  // New properties for form
  showForm: boolean = false; // Toggle visibility of form
  selectedOffre: Offre | null = null; // Store selected offer for application
  applicationForm: FormGroup; // FormGroup to handle application data

  constructor(
      private offreservice: OffreControllerService,
      private cvservice: CvControllerService,
      private applicationservice: ApplicationControllerService,
      private fb: FormBuilder, // Injecting FormBuilder for form handling
      private tokenService: TokenService // Inject TokenService to get the token
  ) {
    // Initialize the form
    this.applicationForm = this.fb.group({
      cvRoulant: ['', Validators.required], // CV (file or string)
      motivatedLetter: ['', Validators.required], // Motivational letter
      username: ['', Validators.required], // Username
    });
  }

  ngOnInit(): void {
    this.loadApplications();  // Load applications initially
    this.loadCv();  // Load CV based on username
  }

  private loadApplications(): void {
    this.isLoading = true;
    this.offreservice.getAllOffres().subscribe({
      next: (data: Offre[]) => {  // Ensure it's typed as Offre[]
        this.applications = data;
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Failed to load offres.';
        this.isLoading = false;
      }
    });
  }

  private loadCv(): void {
    this.isLoading = true;

    // Get the token from the TokenService
    const token = this.tokenService.getToken();  // Assuming TokenService is imported and available

    if (token) {
      // Decode the token and extract the username
      const username = this.decodeJwt(token).sub;  // Assuming 'sub' is the username field in the token
console.log(username)
      // Now use the extracted username to load the CV
      this.cvservice.getCvByUsername(username).subscribe({
        next: (data: Cv) => {  // Expect a single Cv object now
          this.cv = data;  // Store the single CV
          this.isLoading = false;
        },
        error: (error) => {
          this.errorMessage = 'Failed to load CV.';
          this.isLoading = false;
        }
      });
    } else {
      this.errorMessage = 'No token found';
      this.isLoading = false;
    }
  }

  // Extract the username from the token and log it to the console
  private getUsernameFromToken(): void {
    const token = this.tokenService.getToken();  // Get the token from localStorage
    if (token) {
      const username = this.decodeJwt(token);  // Decode the token to get the username
      console.log('Username from token:', username.sub);  // Assuming 'sub' is the username field
    } else {
      console.log('No token found');
    }
  }

  // Decode the JWT token and return its payload
  private decodeJwt(token: string): any {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace('-', '+').replace('_', '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
  }

  // Method to show the form for the selected offer
  openApplicationForm(offre: Offre): void {
    this.selectedOffre = offre; // Store selected offer
    this.showForm = true; // Show the form
  }

  // Method to submit the application form
  submitApplication(): void {
    if (this.applicationForm.invalid) {
      alert("Please fill in all required fields.");
      return;
    }

    const application: Application = {
      motivatedlettre: this.applicationForm.value.motivatedLetter,  // from form input
      cv: { name: this.applicationForm.value.cvRoulant },  // Assuming it's a string or object
      username: this.applicationForm.value.username,  // Username or student info
      status: 'PENDING'                      // Default status
    };

    // Make the request to submit the application
    this.applicationservice.addapplication({ body: application }).subscribe({
      next: (response) => {
        alert("Application added successfully!");
        console.log("Application added successfully:", response);
        this.cancelApplication(); // Reset form after submission
      },
      error: (error) => {
        console.error("Failed to add application:", error);
        alert("An error occurred while submitting the application.");
      }
    });
  }

  // Method to cancel the application form
  cancelApplication(): void {
    this.showForm = false; // Close the form without submission
    this.applicationForm.reset(); // Reset the form
  }
}
