import { Component, Input, OnInit, ElementRef, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common'; // Import CommonModule
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { BehaviorSubject } from 'rxjs';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-student-result',
  standalone: true,
  templateUrl: './student-result.component.html',
  styleUrls: ['./student-result.component.scss'],
  imports: [CommonModule], // Ensure CommonModule is listed here
})
export class StudentResultComponent implements OnInit {
  logoUrl: string = '';
  profile_pictureUrl: string = '';
  reg_no: string = '';
  session: string = '';
  surname: string = '';
  firstname: string = '';
  fullName: string = '';
  level: string = '';
  studentResults: any[] = [];
  cumulativeResults: any = {};
  isLoading: boolean = false;
  @Input() student: any;
  showLicenseTemplate$ = new BehaviorSubject<boolean>(false);
  @ViewChild('studentResult', { static: false }) studentResult!: ElementRef;

  constructor(private http: HttpClient, private sanitizer: DomSanitizer) {}

  ngOnInit(): void {
    this.fetchStudentResult();
  }

  fetchStudentResult() {
    this.isLoading = true;
    this.http
      .post<any>(
        'https://test.omniswift.com.ng/api/viewResult/2',
        {},
        {
          headers: { Accept: 'application/json' },
        }
      )
      .subscribe(
        (response) => {
          this.logoUrl = response.logo;
          this.profile_pictureUrl = response.profile_picture;

          console.log('Logo URL:', this.logoUrl);
          console.log('Profile Picture URL:', this.profile_pictureUrl);

          const { firstname, surname, session, reg_no, level } = response.data;
          this.fullName = `${firstname} ${surname}`;
          this.level = level;
          this.session = session;
          this.reg_no = reg_no;
          this.studentResults = response.data.result;
          this.cumulativeResults = response.data.cummulative;
          this.isLoading = false;

          console.log('Logo URL:', this.logoUrl);
          console.log('Profile Picture URL:', this.profile_pictureUrl);
        },
        (error) => {
          console.error('Error fetching student result:', error);
          this.isLoading = false;
        }
      );
  }

  async downloadResult() {
    if (!this.studentResult || !this.student) {
      return;
    }

    // Ensure the element exists
    const element = this.studentResult.nativeElement;
    if (!element) {
      return;
    }
    await this.delay(100);

    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: true,
        backgroundColor: null,
        allowTaint: true,
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF();

      const imgWidth = 190;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);
      pdf.save(`${this.student.id}_Result.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  }

  // Check if the images are rendered and log their URLs
  checkImagesBeforeDownload() {
    const images = this.studentResult.nativeElement.getElementsByTagName('img');
    Array.from(images).forEach((img, index) => {});
  }

  // Function to ensure all images are loaded before capturing
  async waitForImagesToLoad() {
    const images = this.studentResult.nativeElement.getElementsByTagName('img');
    const loadPromises = Array.from(images).map((img) => {
      return new Promise((resolve) => {
        const imageElement = img as HTMLImageElement;
        if (imageElement.complete) {
          console.log('Image already loaded:', imageElement.src);
          resolve(true);
        } else {
          imageElement.onload = () => {
            console.log('Image loaded:', imageElement.src);
            resolve(true);
          };
          imageElement.onerror = (err) => {
            console.error('Error loading image:', err);
            resolve(false); 
          };
        }
      });
    });

    await Promise.all(loadPromises);
  }

  delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
