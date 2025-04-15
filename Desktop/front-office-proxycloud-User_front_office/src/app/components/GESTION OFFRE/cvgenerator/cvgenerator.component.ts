import { Component } from '@angular/core';
import { CvControllerService } from "../../../servicesahmed/services/cv-controller.service";
import { FormBuilder, Validators } from "@angular/forms";
import { Cv } from "../../../servicesahmed/models/cv";

@Component({
  selector: 'app-cvgenerator',
  templateUrl: './cvgenerator.component.html',
  styleUrls: ['./cvgenerator.component.css']
})
export class CvgeneratorComponent {
  cvForm = this.fb.group({
    name: ['', Validators.required],
    skills: ['', Validators.required],
    experiences: ['', Validators.required],  // Expecting a comma-separated list of experiences
    education: ['', Validators.required],    // Expecting a comma-separated list of education
    contactinfo: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phoneNumber: [''],
    address: [''],
    linkedinProfile: [''],
    certificate: [''],
    languages: [''],
    hobbies: [''],
    photo: [null as File | null]  // Allowing File type or null
  });

  uploadedPhotoUrl: string | undefined;
  selectedLanguages: string[] = [];
  selectedSkills: string[] = [];
  allSkills: string[] = [
    'Java', 'Spring Boot', 'Angular', 'React', 'SQL', 'Docker', 'Kubernetes',
    'CAO/DAO', 'SolidWorks', 'Catia', 'Autodesk Inventor', 'Mécanique Générale',
    'Arduino', 'Raspberry Pi', 'Conception PCB', 'Circuits numériques', 'Altium Designer'
  ];

  experienceInputs: string[] = ["", "", ""];  // holds the individual inputs for experiences

  constructor(
    private cvservice: CvControllerService,
    private fb: FormBuilder
  ) {}

  // Handle toggling of skills in the selectedSkills array
  onSkillToggle(skill: string) {
    if (this.selectedSkills.includes(skill)) {
      this.selectedSkills = this.selectedSkills.filter(s => s !== skill);
    } else {
      this.selectedSkills.push(skill);
    }
    // Update the form field for skills here
    this.cvForm.patchValue({
      skills: this.selectedSkills.join(', ')
    });
  }

  // Handle language selection
  onLanguageChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.checked) {
      this.selectedLanguages.push(input.value);
    } else {
      this.selectedLanguages = this.selectedLanguages.filter(lang => lang !== input.value);
    }

    this.cvForm.patchValue({
      languages: this.selectedLanguages.join(', ')
    });
  }

  // Update experiences array as the user inputs data
  combineExperiences(event: Event, index: number): string {
    const input = (event.target as HTMLInputElement).value;
    this.experienceInputs[index] = input;  // Store the input value at the correct index
    return this.experienceInputs.filter(e => e.trim() !== "").join(", ");  // Combine non-empty experiences into a comma-separated list
  }

  // Handle file input for photo selection
  onFileSelected($event: Event) {
    const input = $event.target as HTMLInputElement;
    if (input && input.files) {
      const file = input.files[0];
      if (file) {
        this.cvForm.patchValue({ photo: file });
      }
    }
  }

  // Upload photo to backend after CV creation
  uploadPhoto(cvId: number) {
    if (this.cvForm.value.photo) {
      const photoFile = this.cvForm.value.photo;
      const formData = new FormData();
      formData.append('file', photoFile, photoFile.name);

      this.cvservice.uploadCvPhoto(cvId, formData).subscribe(
        (response) => {
          console.log('Photo uploaded successfully:', response);
          this.uploadedPhotoUrl = response.photoUrl;  // Store the URL for the photo

          // Update Cv's photoUrl field in the backend
          const updateData = {
            id: cvId,
            photoUrl: response.photoUrl
          };

          this.cvservice.updateCvPhotoUrl(updateData).subscribe(
            () => {
              console.log('CV updated with photo URL successfully!');
              alert('Photo path saved to CV!');
            },
            (error) => {
              console.error('Error updating CV with photo URL:', error);
            }
          );
        },
        (error) => {
          console.error('Error uploading photo:', error);
        }
      );
    }
  }

  // Generate CV and submit data to backend
  generateCv() {
    if (this.cvForm.valid) {
      const cvData: Cv = {
        name: this.cvForm.value.name ?? undefined,
        skills: this.cvForm.value.skills ?? undefined,
        experiences: this.experienceInputs.filter(exp => exp.trim() !== ""),  // Filter out empty experiences
        educations: this.cvForm.value.education ? [this.cvForm.value.education] : undefined,
        contactinfo: this.cvForm.value.contactinfo ?? undefined,
        email: this.cvForm.value.email ?? undefined,
        phoneNumber: this.cvForm.value.phoneNumber ?? undefined,
        address: this.cvForm.value.address ?? undefined,
        linkedinProfile: this.cvForm.value.linkedinProfile ?? undefined,
        certificate: this.cvForm.value.certificate ?? undefined,
        languages: this.cvForm.value.languages ? [this.cvForm.value.languages] : undefined,
        hobbies: this.cvForm.value.hobbies ? [this.cvForm.value.hobbies] : undefined
      };

      const params = { body: cvData };

      this.cvservice.addCv(params).subscribe(
        (response: any) => {
          console.log('CV generated:', response);
          alert('CV generated successfully!');

          // If photo is selected, upload it after CV creation
          if (this.cvForm.value.photo) {
            this.uploadPhoto(response);  // response = cvId
          }
        },
        (error) => {
          console.error('Error generating CV:', error);
          alert('Error generating CV');
        }
      );
    } else {
      console.log('Form is invalid');
    }
  }
}
