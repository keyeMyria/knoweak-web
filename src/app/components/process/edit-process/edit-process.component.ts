import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { CrudComponent } from '../../utils/crud/crud.component';
import { CrudService } from '../../utils/crud/crud.service';

@Component({
  selector: 'app-edit-process',
  templateUrl: './edit-process.component.html',
  styleUrls: ['./edit-process.component.scss']
})
export class EditProcessComponent extends CrudComponent<Process> implements OnInit {

  url = CrudService.BaseUrl + '/processes';
  id: number;

  constructor(
    protected _crudService: CrudService,
    private location: Location,
    private route: ActivatedRoute) { 
    
      super(_crudService);
      route.params.subscribe(params => this.id = params['id']);
  }

  ngOnInit() {
    this.getSingleRecord(this.url + `/${this.id}`);
  }

  patchRecord() {
    super.patchRecord(this.url + `/${this.id}`);
  }

  goBack(): void {
    this.location.back();
  }

}
