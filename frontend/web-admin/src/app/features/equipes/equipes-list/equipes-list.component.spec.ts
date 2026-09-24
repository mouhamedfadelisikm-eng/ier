import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { EquipesListComponent } from './equipes-list.component';
import { EquipeService } from '../../../core/services/equipe.service';

describe('EquipesListComponent',()=>{let fixture:ComponentFixture<EquipesListComponent>;let c:EquipesListComponent;let http:HttpTestingController;beforeEach(async()=>{await TestBed.configureTestingModule({imports:[EquipesListComponent],providers:[EquipeService,provideHttpClient(),provideHttpClientTesting(),provideRouter([])]}).compileComponents();fixture=TestBed.createComponent(EquipesListComponent);c=fixture.componentInstance;http=TestBed.inject(HttpTestingController)});afterEach(()=>http.verify());it('charge les équipes',()=>{fixture.detectChanges();const r=http.expectOne(x=>x.url.includes('/equipes'));r.flush({data:[{id:1,nom_equipe:'Alpha'}],meta:{current_page:1,last_page:1,from:1,to:1,total:1,per_page:15}});expect(c.equipes().length).toBe(1);expect(c.isLoading()).toBe(false)});it('gère les erreurs',()=>{fixture.detectChanges();http.expectOne(x=>x.url.includes('/equipes')).flush('err',{status:500,statusText:'Server Error'});expect(c.errorMessage()).toBeTruthy()})});
