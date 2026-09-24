import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { EquipeService } from '../../../core/services/equipe.service';
import { Equipe } from '../../../core/models/equipe.model';

@Component({
  selector:'app-equipes-list',standalone:true,imports:[CommonModule,RouterLink,FormsModule],
  templateUrl:'./equipes-list.component.html',styleUrls:['./equipes-list.component.css']
})
export class EquipesListComponent implements OnInit{
  private readonly service=inject(EquipeService);
  equipes=signal<Equipe[]>([]);
  meta=signal<Equipe['id'] extends never ? never : {current_page:number;from:number;last_page:number;per_page:number;to:number;total:number}|undefined>(undefined);
  search=signal('');
  isLoading=signal(true);
  errorMessage=signal<string|null>(null);
  successMessage=signal<string|null>(null);
  showCreate=signal(false);
  name=signal(''); description=signal(''); actionInProgress=signal(false); formError=signal<string|null>(null);

  filtered=computed(()=>{const q=this.search().trim().toLowerCase(); return this.equipes().filter(e=>!q||[e.nom_equipe,e.description||''].join(' ').toLowerCase().includes(q));});

  ngOnInit(){this.load(1);}
  load(page:number){this.isLoading.set(true);this.errorMessage.set(null);this.service.getAll(page).subscribe({next:r=>{this.equipes.set(r.data||[]);this.meta.set(r.meta as never);this.isLoading.set(false);},error:()=>{this.isLoading.set(false);this.errorMessage.set('Impossible de charger les équipes.');}});}
  openCreate(){this.name.set('');this.description.set('');this.formError.set(null);this.showCreate.set(true);}
  closeCreate(){this.showCreate.set(false);}
  create(){if(!this.name().trim()){this.formError.set('Le nom de l’équipe est obligatoire.');return;}this.actionInProgress.set(true);this.service.create({nom_equipe:this.name().trim(),description:this.description()||null,agent_ids:[]}).subscribe({next:()=>{this.actionInProgress.set(false);this.showCreate.set(false);this.successMessage.set('Équipe créée.');this.load(this.meta()?.current_page||1);},error:(e:HttpErrorResponse)=>{this.actionInProgress.set(false);this.formError.set(e.error?.message||'Création impossible.');}});}
  onPageChange(page:number){const m=this.meta();if(m&&page>=1&&page<=m.last_page)this.load(page);}
}
