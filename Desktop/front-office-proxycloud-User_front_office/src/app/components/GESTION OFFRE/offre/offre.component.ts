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
  styleUrls: ['./offre.component.css']
})
export class OffreComponent implements OnInit {

  applications: Offre[] = [];
  cv: Cv | null = null;
  isLoading: boolean = false;
  errorMessage: string = '';

  showForm: boolean = false;
  selectedOffer: Offre | null = null;
  applicationForm: FormGroup;

  constructor(
    private offreservice: OffreControllerService,
    private cvservice: CvControllerService,
    private applicationservice: ApplicationControllerService,
    private fb: FormBuilder,
    private tokenService: TokenService
  ) {
    this.applicationForm = this.fb.group({
      cvRoulant: ['', Validators.required],
      motivatedLetter: ['', Validators.required],
      username: ['', Validators.required]
    });
  }
  showApplicationForm: boolean = false;

  openApplicationForm(offer: Offre): void {
    this.selectedOffer = offer;
    this.showApplicationForm = true;
  }

  ngOnInit(): void {
    this.loadApplications();
    this.loadCv();
  }

  private loadApplications(): void {
    this.isLoading = true;
    this.offreservice.getAllOffres().subscribe({
      next: (data: Offre[]) => {
        this.applications = data;
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Failed to load offres.';
        this.isLoading = false;
      }
    });
  }

  private loadCv(): void {
    this.isLoading = true;
    const token = this.tokenService.getToken();

    if (token) {
      const username = this.decodeJwt(token).sub;
      console.log("Loaded username:", username);

      this.cvservice.getCvByUsername({ username }).subscribe({
        next: (data: Cv) => {
          this.cv = data;
          console.log("CV loaded:", this.cv);
          this.isLoading = false;
        },
        error: () => {
          this.errorMessage = 'Failed to load CV.';
          this.isLoading = false;
        }
      });
    } else {
      this.errorMessage = 'No token found';
      this.isLoading = false;
    }
  }

  private decodeJwt(token: string): any {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace('-', '+').replace('_', '/');
    const jsonPayload = decodeURIComponent(
      atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join('')
    );
    return JSON.parse(jsonPayload);
  }



  submitApplication(): void {
    if (!this.applicationForm.valid) {
      alert("Please complete all fields.");
      return;
    }

    if (!this.selectedOffer || typeof this.selectedOffer.id !== 'number') {
      alert("No offer selected or invalid offer ID.");
      return;
    }

    if (!this.cv || typeof this.cv.id !== 'number') {
      alert("Your CV is not loaded or missing ID.");
      return;
    }

    const application: Application = {
      motivatedlettre: this.applicationForm.value.motivatedLetter,
      cv: { id: this.cv.id }, // Now TypeScript knows it's number
      username: this.applicationForm.value.username,
      status: 'PENDING',
      offre: { id: this.selectedOffer.id }  // Safe, already checked above
    };

    this.applicationservice.addapplication({ body: application }).subscribe({
      next: (response) => {
        alert("Application submitted successfully!");
        console.log("Submitted application:", response);
        this.cancelApplication();
      },
      error: (error) => {
        console.error("Error submitting application:", error);
        alert("Failed to submit application.");
      }
    });
  }


  cancelApplication(): void {
    this.selectedOffer = null;
    this.showForm = false;
  }
}
