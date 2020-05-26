import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { myVisit, myStatus } from './shared/models';
import { myVisitService } from './shared/services';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy, AfterViewInit {
  title = 'myVisit';
  @ViewChild('inputFullname') inputFullname: ElementRef;
  private ngUnsubscribe = new Subject();
  // @ViewChild('qID') qID: ElementRef;

  modalData: myVisit[] = [];
  modalVisit: myVisit;

  constructor(private _service: myVisitService) { }

  // The add new visit
  onAddVisit() {
    let newVisit = new myVisit();
    let isService = false;
    // start list visits from customer number 100
    let lastQueue = 100;
    // check if input is value
    if (this.inputFullname.nativeElement.value) {
      // if list visits more on 1 then increment customer number
      if (this.modalData.length > 0) {
        let lastVisit: myVisit = this.modalData[this.modalData.length - 1];
        lastQueue = Number(lastVisit.QueueNumber) + 1;
        console.log(lastVisit.QueueNumber);
      }
      // create object new visit
      newVisit.QueueNumber = lastQueue.toString();
      newVisit.FullName = this.inputFullname.nativeElement.value;
      newVisit.QueueDate = new Date().toString();

      // filter from visit list if found visit of status in service
      this.modalData.filter(obj => {
        if (obj.QueueStatus === myStatus.InService) {
          isService = true;
          console.log(obj);
        }
      });

      
      if (isService) {
        // if found status of service to change visit status to waiting
        newVisit.QueueStatus = myStatus.Waiting;
      } else {
        // if not found status of service to change visit status to in service
        newVisit.QueueStatus = myStatus.InService;
      }

      // create new visit in database
      this._service.createVisit(newVisit).subscribe(() => {
        // clear text value
        this.inputFullname.nativeElement.value = "";
        // load visit list after create new visit
        this.onLoad();
      });
    }
  }

  // The load data visits with status waiting
  onLoad() {
    this._service.getAllVisits().subscribe(data => {
      this.modalData = data;
    })
  }

  // The next visit of changes statuses
  // current visit - status complete
  // next visit - status in service
  onNextVisit(visit: myVisit) {
    visit.QueueStatus = myStatus.Complete;
    this._service.updateVisit(visit).subscribe(() => {
      this.modalData.splice(0, 1);
      for (let obj of this.modalData) {
        if (obj.QueueStatus == myStatus.Waiting) {
          obj.QueueStatus = myStatus.InService;
          this._service.updateVisit(obj).subscribe(() => {
            console.log('change status to number 1');
          });
          // if found visit of status waiting after change visit status break from loop
          break;
        }
      }
    });

  }

  ngOnInit(): void {
    this.onLoad();
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  ngAfterViewInit(): void {
    this.onLoad();
  }
}
