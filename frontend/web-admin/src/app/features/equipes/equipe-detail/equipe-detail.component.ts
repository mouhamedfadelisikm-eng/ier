import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { EquipeService } from '../../../core/services/equipe.service';
import { Equipe } from '../../../core/models/equipe.model';
import { User } from '../../../core/models/user.model';

@Component({selector:'app-equipe-detail',standalone:true,imports:[CommonModule,RouterLink,FormsModule],templateUrl:'./equipe-detail.component.html',styleUrls:['./equipe-detail.component.css']})
export class EquipeDetailComponent implements OnInit{
  private readonly route=inject(ActivatedRoute);private readonly router=inject(Router);private readonly service=inject(EquipeService);
  equipe=signal<Equipe|null>(null);agents=signal<User[]>([]);selectedAgents=signal<number[]>([]);
  name=signal('');description=signal('');isLoading=signal(true);isSaving=signal(false);errorMessage=signal<string|null>(null);successMessage=signal<string|null>(null);showDelete=signal(false);

  ngOnInit(){this.load();}
  load(){const id=Number(this.route.snapshot.paramMap.get('id'));if(!Number.isFinite(id)){this.errorMessage.set('Identifiant d’équipe invalide.');this.isLoading.set(false);return;}this.isLoading.set(true);this.service.getById(id).subscribe({next:r=>{this.equipe.set(r.data);this.name.set(r.data.nom_equipe);this.description.set(r.data.description||'');this.selectedAgents.set((r.data.agents||[]).map(a=>a.id));this.isLoading.set(false);this.service.getAgents().subscribe({next:x=>this.agents.set(x.data||[])});},error:(e:HttpErrorResponse)=>{this.isLoading.set(false);this.errorMessage.set(e.status===404?'Équipe introuvable.':'Impossible de charger l’équipe.');}});}
  isSelected(id:number){return this.selectedAgents().includes(id);}
  toggleAgent(id:number){this.selectedAgents.update(list=>list.includes(id)?list.filter(x=>x!==id):[...list,id]);}
  save(){const item=this.equipe();if(!item)return;this.isSaving.set(true);this.errorMessage.set(null);this.service.update(item.id,{nom_equipe:this.name().trim(),description:this.description()||null,agent_ids:this.selectedAgents()}).subscribe({next:r=>{this.equipe.set(r.data);this.selectedAgents.set((r.data.agents||[]).map(a=>a.id));this.isSaving.set(false);this.successMessage.set('Équipe mise à jour.');},error:(e:HttpErrorResponse)=>{this.isSaving.set(false);this.errorMessage.set(e.error?.message||'Mise à jour impossible.');}});}
  promptDelete(){this.showDelete.set(true)} cancelDelete(){this.showDelete.set(false)}
  delete(){const item=this.equipe();if(!item)return;this.service.delete(item.id).subscribe({next:()=>this.router.navigate(['/admin/equipes']),error:(e:HttpErrorResponse)=>this.errorMessage.set(e.error?.message||'Suppression impossible.')});}
}
