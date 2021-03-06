import { Component, OnInit } from '@angular/core';
import { CrudComponent } from '../utils/crud/crud.component';
import { CrudService } from '../utils/crud/crud.service';
import { Analysis } from './analysis';
import { ActivatedRoute } from '../../../../node_modules/@angular/router';

@Component({
  selector: 'app-analysis',
  templateUrl: './analysis.component.html',
  styleUrls: ['./analysis.component.scss']
})
export class AnalysisComponent extends CrudComponent<Analysis> implements OnInit {

  organizationId: number;
  organizationLegalName: string;
  
  constructor(
    protected crudService: CrudService,
    private route: ActivatedRoute) {
      super(crudService);
      route.params.subscribe(params => {
        this.organizationId = params['id'];
        this.url = `${CrudService.BaseUrl}/organizations/${this.organizationId}/analyses`;
      });
  }

  ngOnInit() {
    // Get the organization legal name
    this._crudService
      .get(`${CrudService.BaseUrl}/organizations/${this.organizationId}`)
      .subscribe(
        data => {
          this.organizationLegalName = data['data']['legalName'];
        },
        err => {
          console.log(err);
        }
      );
    
    // List analyses
    this.getRecords(1);
  }

}
