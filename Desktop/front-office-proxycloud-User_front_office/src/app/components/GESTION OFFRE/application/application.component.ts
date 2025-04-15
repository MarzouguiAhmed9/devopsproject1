import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApplicationControllerService } from '../../../servicesahmed/services/application-controller.service';
import { HttpClient } from '@angular/common/http';
import { Offre } from "../../../servicesahmed/models/offre";
import { Cv } from '../../../servicesahmed/models/cv';
import { Application } from '../../../servicesahmed/models/application';

@Component({
  selector: 'app-application',
  templateUrl: './application.component.html',
  styleUrls: ['./application.component.css']
})
export class ApplicationComponent implements OnInit {
  @Input() selectedOffer: Offre | null = null;
  @Input() cv: Cv | null = null;

  applicationForm: FormGroup;
  uploadedCvName: string = '';
  cvFile: File | null = null;

  constructor(
    private fb: FormBuilder,
    private applicationService: ApplicationControllerService,
    private http: HttpClient
  ) {
    this.applicationForm = this.fb.group({
      motivatedLetter: ['', Validators.required],
      username: ['', Validators.required],
      cvFile: [null, Validators.required]  // Form control for CV file
    });
  }

  ngOnInit(): void {}

  // Handle file selection
  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file && file.type === 'application/pdf') {
      this.applicationForm.patchValue({ cvFile: file });
      this.uploadedCvName = file.name;
      this.cvFile = file;
    } else {
      alert('Please select a valid PDF file.');
    }
  }

  submitApplication(): void {
    if (!this.applicationForm.valid) {
      alert("Please complete all fields.");
      return;
    }

    if (!this.selectedOffer) {
      alert("No offer selected.");
      return;
    }

    const file = this.applicationForm.get('cvFile')?.value;
    const formData = new FormData();
    formData.append('file', file); // File attachment

    // Convert the file to Base64 and send it in the request
    this.convertFileToBase64(file).then((base64File: string) => {
      const application: Application = {
        motivatedlettre: this.applicationForm.value.motivatedLetter,
        username: this.applicationForm.value.username,
        status: 'PENDING',
        offre: { id: this.selectedOffer?.id! },
      };

      // Now submit the application along with the Base64 encoded file content
      this.applicationService.addapplication({ body: application }).subscribe({
        next: () => {
          alert("Application submitted successfully!");
        },
        error: (err) => {
          console.error(err);
          alert("Submission failed.");
        }
      });
    });
  }

  // Utility to convert a file to a Base64 string
  private convertFileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve(reader.result as string);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }


  // Submit the application with the obtained CV ID
  private submitApplicationWithCvId(cvId: number): void {
    const application: Application = {
      motivatedlettre: this.applicationForm.value.motivatedLetter,
      username: this.applicationForm.value.username,
      status: 'PENDING',
      offre: { id: this.selectedOffer?.id! },
      cv: { id: cvId }  // Use the CV ID here
    };

    this.applicationService.addapplication({ body: application }).subscribe({
      next: () => {
        alert("Application submitted successfully!");
      },
      error: (err) => {
        console.error(err);
        alert("Submission failed.");
      }
    });
  }
}
