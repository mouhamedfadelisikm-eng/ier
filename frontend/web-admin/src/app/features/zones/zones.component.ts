import {Component,OnInit,computed,inject,signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {HttpErrorResponse} from '@angular/common/http';
import {ReferenceService} from '../../core/services/reference.service';
import {ZoneAdmin} from '../../core/models/reference.model';

@Component({selector:'app-zones',standalone:true,imports:[CommonModule,FormsModule],templateUrl:'./zones.component.html',styleUrls:['./zones.component.css']})
export class ZonesComponent implements OnInit{
 private readonly service=inject(ReferenceService);
 zones=signal<ZoneAdmin[]>([]);meta=signal<ZoneAdmin extends never?never:{current_page:number;from:number;last_page:number;per_page:number;to:number;total:number}|undefined>(undefined);
 search=signal('');isLoading=signal(true);errorMessage=signal<string|null>(null);successMessage=signal<string|null>(null);showForm=signal(false);showDelete=signal(false);editing=signal<ZoneAdmin|null>(null);name=signal('');description=signal('');action=signal(false);formError=signal<string|null>(null);selected=signal<ZoneAdmin|null>(null);
 filtered=computed(()=>{const q=this.search().trim().toLowerCase();return this.zones().filter(z=>!q||[z.nom_zone,z.description||''].join(' ').toLowerCase().includes(q));});
 ngOnInit(){this.load(1)}
 load(page:number){this.isLoading.set(true);this.service.getZones(page).subscribe({next:r=>{this.zones.set(r.data||[]);this.meta.set(r.meta as never);this.isLoading.set(false)},error:()=>{this.isLoading.set(false);this.errorMessage.set('Impossible de charger les zones.')}})}
 openCreate(){this.editing.set(null);this.name.set('');this.description.set('');this.formError.set(null);this.showForm.set(true)}
 openEdit(z:ZoneAdmin){this.editing.set(z);this.name.set(z.nom_zone);this.description.set(z.description||'');this.formError.set(null);this.showForm.set(true)}
 closeForm(){this.showForm.set(false)}
 save(){if(!this.name().trim()){this.formError.set('Le nom de zone est obligatoire.');return}this.action.set(true);const body={nom_zone:this.name().trim(),description:this.description()||null};const req=this.editing()?this.service.updateZone(this.editing()!.id,body):this.service.createZone(body);req.subscribe({next:()=>{this.action.set(false);this.showForm.set(false);this.successMessage.set(this.editing()?'Zone mise à jour.':'Zone créée.');this.load(this.meta()?.current_page||1)},error:(e:HttpErrorResponse)=>{this.action.set(false);this.formError.set(e.error?.message||'Opération impossible.')}})}
 confirmDelete(z:ZoneAdmin){this.selected.set(z);this.showDelete.set(true)}cancelDelete(){this.showDelete.set(false);this.selected.set(null)}
 delete(){const z=this.selected();if(!z)return;this.service.deleteZone(z.id).subscribe({next:()=>{this.showDelete.set(false);this.selected.set(null);this.successMessage.set('Zone supprimée.');this.load(1)},error:(e:HttpErrorResponse)=>this.errorMessage.set(e.error?.message||'Suppression impossible.')}})
}
