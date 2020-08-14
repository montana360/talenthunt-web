import { Injectable, ViewContainerRef } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})

export class AlertService {
  constructor(private toastr: ToastrService) {
    this.toastr.toastrConfig.timeOut = 5000;
    this.toastr.toastrConfig.positionClass = 'toast-bottom-right';
    this.toastr.toastrConfig.closeButton = true;
    this.toastr.toastrConfig.progressBar = true;
    this.toastr.toastrConfig.preventDuplicates = true;
  }
  success(message: string) {
    this.toastr.success(message);
  }
  info(message: string) {
    this.toastr.info(message);
  }
  warning(message: string) {
    this.toastr.warning(message);
  }
  error(message: string) {
    this.toastr.error(message);
  }
}
