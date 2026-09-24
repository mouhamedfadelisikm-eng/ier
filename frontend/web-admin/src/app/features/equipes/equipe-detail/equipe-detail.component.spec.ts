import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { EquipeDetailComponent } from './equipe-detail.component';
import { EquipeService } from '../../../core/services/equipe.service';

describe('EquipeDetailComponent',()=>{let fixture:ComponentFixture<EquipeDetailComponent>;let c:EquipeDetailComponent;let http:HttpTestingController;beforeEach(async()=>{await TestBed.configureTestingModule({imports:[EquipeDetailComponent],providers:[EquipeService,provideHttpClient(),provideHttpClientTesting(),provideRouter([]),{provide:ActivatedRoute,useValue:{snapshot:{paramMap:{get:()=> '1'}}}}]}).compileComponents();fixture=TestBed.createComponent(EquipeDetailComponent);c=fixture.componentInstance;http=TestBed.inject(HttpTestingController)});afterEach(()=>http.verify());it('charge une équipe',()=>{fixture.detectChanges();const r=http.expectOne(x=>x.url.endsWith('/equipes/1'));r.flush({data:{id:1,nom_equipe:'Alpha',agents:[]}});expect(c.equipe()?.id).toBe(1);expect(c.name()).toBe('Alpha');const a=http.expectOne(x=>x.url.includes('/users?role=agent'));a.flush({data:[]})})});
