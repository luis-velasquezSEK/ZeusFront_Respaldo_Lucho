import {Component, Input, OnInit} from '@angular/core';
import {HttpEventType, HttpResponse} from '@angular/common/http';
import {Observable} from 'rxjs';
import {FileService} from "@services/utils/file.service";
import {AppService} from "@services/app.service";

@Component({
  selector: 'app-upload-files',
  templateUrl: './upload-files.component.html',
  styleUrls: ['./upload-files.component.css']
})
export class UploadFilesComponent implements OnInit {
  @Input() proceso: string;

  selectedFiles: FileList;
  progressInfos = [];
  message = '';
  fileInfos: Observable<any>;

  constructor(private uploadService: FileService,public appService: AppService,) {
  }

  ngOnInit() {
    this.fileInfos = this.uploadService.getFiles();
  }

  selectFiles(event) {
    this.progressInfos = [];
    this.selectedFiles = event.target.files;
  }

  upload(idx, file) {
    this.progressInfos[idx] = {value: 0, fileName: file.name};
    let nombre = this.appService.removeSpecialCharacters(file.name);

    this.uploadService.uploadSingleFile(file, this.proceso,nombre).subscribe(
      event => {
        if (event.type === HttpEventType.UploadProgress) {
          this.progressInfos[idx].value = Math.round(100 * event.loaded / event.total);
        } else if (event instanceof HttpResponse) {
          this.fileInfos = this.uploadService.getFiles();
        }
      },
      err => {
        this.progressInfos[idx].value = 0;
        this.message = 'Could not upload the file:' + file.name;
      });
  }

  uploadFiles() {
    this.message = '';

    for (let i = 0; i < this.selectedFiles.length; i++) {
      this.upload(i, this.selectedFiles[i]);
    }
  }
}
