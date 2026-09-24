import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ReferenceService } from '../../core/services/reference.service';
import { ZonesComponent } from './zones.component';

describe('ZonesComponent', () => {
  let fixture: ComponentFixture<ZonesComponent>;
  let component: ZonesComponent;
  let http: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ZonesComponent],
      providers: [ReferenceService, provideHttpClient(), provideHttpClientTesting()]
    }).compileComponents();

    fixture = TestBed.createComponent(ZonesComponent);
    component = fixture.componentInstance;
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('charge les zones', () => {
    fixture.detectChanges();

    http.expectOne(r => r.url.includes('/zones')).flush({
      data: [{ id: 1, nom_zone: 'Plateau' }],
      meta: { current_page: 1, last_page: 1 }
    });

    expect(component.zones().length).toBe(1);
  });

  it('crée une zone', () => {
    component.openCreate();
    component.name.set('Mermoz');
    component.save();

    http.expectOne(r => r.url.endsWith('/zones')).flush({
      data: { id: 2, nom_zone: 'Mermoz' }
    });

    const reload = http.expectOne(r => r.url.includes('/zones?page=1'));
    reload.flush({
      data: [{ id: 2, nom_zone: 'Mermoz' }],
      meta: { current_page: 1, last_page: 1 }
    });

    expect(component.successMessage()).toBe('Zone créée.');
    expect(component.zones()[0].nom_zone).toBe('Mermoz');
  });
});
