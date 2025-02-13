import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ComponentFactoryResolver,
  ComponentRef,
  ElementRef,
  OnInit,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  FormsModule,
} from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { HttpClient } from '@angular/common/http';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator'; // Optional for pagination
import { MatSortModule } from '@angular/material/sort'; // Optional for sorting
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { StudentResultComponent } from '../student-result/student-result.component';

@Component({
  selector: 'app-student-list',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatFormFieldModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    FormsModule, // <-- Add FormsModule here
  ],
  templateUrl: './student-list.component.html',
  styleUrls: ['./student-list.component.scss'],
})
export class StudentListComponent implements OnInit, AfterViewInit {
  title = 'Student Data Table';
  form: FormGroup;
  isLoading: boolean = false;
  showStudentResult: boolean = true;

  states: any[] = []; // Store fetched states
  ages: any[] = [];
  levels: any[] = [];
  genders: any[] = [];
  studentData: any[] = [];
  filteredData: any[] = [];

  displayedColumns: string[] = [
    'serialNumber',
    'surname',
    'firstName',
    'age',
    'gender',
    'level',
    'state',
    'action',
  ];

  pageIndex: number = 0; // Current page index
  pageSize: number = 10; // Number of items per page
  selectedStudent: any; // Store the selected student

  dataSource = new MatTableDataSource<any>(); // Initialize as MatTableDataSource

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild('studentResultContainer', { read: ViewContainerRef })
  container!: ViewContainerRef;
  private componentRef!: ComponentRef<StudentResultComponent>;

  studentResultComponent!: StudentResultComponent;
  filteredStudents = [...this.studentData];

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
    private resolver: ComponentFactoryResolver
  ) {
    this.form = this.fb.group({
      state: [''],
      age: [''],
      level: [''],
      gender: [''],
    });
  }

  ngAfterViewInit(): void {
    if (!this.studentResultComponent) {
      console.error('Child component not initialized.');
    } else {
      console.log('Child component initialized.');
    }
  }
  ngOnInit(): void {
    this.fetchStudentData();
  }

  // This method will be used to apply filters dynamically
  applyFilter() {
    const filters = this.form.value;
    this.filteredData = this.studentData.filter((student) =>
      Object.keys(filters).every((key) => {
        const value = filters[key];
        return value
          ? String(student[key]).toLowerCase() === String(value).toLowerCase()
          : true;
      })
    );
  }

  fetchStates() {
    if (this.states.length === 0) {
      this.isLoading = true;
      this.http
        .get<any>('https://test.omniswift.com.ng/api/viewAllStates', {
          headers: { Accept: 'application/json' },
        })
        .subscribe(
          (response) => {
            this.states = response.data;
            this.isLoading = false;
          },
          (error) => {
            console.error('Error fetching states:', error);
            this.isLoading = false;
          }
        );
    }
  }

  fetchAges() {
    if (this.ages.length === 0) {
      this.isLoading = true;
      this.http
        .get<any>('https://test.omniswift.com.ng/api/viewAllAges', {
          headers: { Accept: 'application/json' },
        })
        .subscribe(
          (response) => {
            this.ages = response.data;
            this.isLoading = false;
          },
          (error) => {
            console.error('Error fetching states:', error);
            this.isLoading = false;
          }
        );
    }
  }

  fetchLevels() {
    if (this.levels.length === 0) {
      // Fetch only if not already loaded
      this.isLoading = true;
      this.http
        .get<any>('https://test.omniswift.com.ng/api/viewAllLevels', {
          headers: { Accept: 'application/json' },
        })
        .subscribe(
          (response) => {
            this.levels = response.data;
            this.isLoading = false;
          },
          (error) => {
            console.error('Error fetching levels:', error);
            this.isLoading = false;
          }
        );
    }
  }

  fetchGender() {
    if (this.genders.length === 0) {
      this.isLoading = true;
      this.http
        .get<any>('https://test.omniswift.com.ng/api/viewAllGender', {
          headers: { Accept: 'application/json' },
        })
        .subscribe(
          (response) => {
            this.genders = response.data;
            this.isLoading = false;
          },
          (error) => {
            console.error('Error fetching genders:', error);
            this.isLoading = false;
          }
        );
    }
  }

  fetchStudentData() {
    this.http
      .get<any>('https://test.omniswift.com.ng/api/viewAllData')
      .subscribe((response) => {
        if (
          response &&
          response.data &&
          Array.isArray(response.data.students)
        ) {
          this.studentData = response.data.students;
        } else {
          this.studentData = [];
        }

        this.filteredData = [...this.studentData];
      });
  }

  // selectStudent(student: any) {
  //   this.selectedStudent = student;
  // }

  async downloadStudentResult(student: any) {
    // Clear previous instance
    this.container.clear();

    // Dynamically create the StudentResultComponent
    const factory = this.resolver.resolveComponentFactory(
      StudentResultComponent
    );
    this.componentRef = this.container.createComponent(factory);

    // Pass student data
    this.componentRef.instance.student = student;

    // Wait for component to initialize
    setTimeout(() => {
      this.componentRef.instance.downloadResult();

      // Destroy component after download
      setTimeout(() => this.componentRef.destroy(), 100);
    }, 500);
  }
}
