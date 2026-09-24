import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { NotificationService } from '../../core/services/notification.service';
import { NotificationsComponent } from './notifications.component';

describe('NotificationsComponent', () => {
  let fixture: ComponentFixture<NotificationsComponent>;
  let http: HttpTestingController;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotificationsComponent],
      providers: [NotificationService, provideHttpClient(), provideHttpClientTesting()]
    }).compileComponents();
    fixture = TestBed.createComponent(NotificationsComponent);
    http = TestBed.inject(HttpTestingController);
  });
  afterEach(() => http.verify());
  it('charge et marque une notification comme lue', () => {
    fixture.detectChanges();
    http.expectOne(r => r.url.includes('/notifications')).flush({
      data: [{ id: 'a', type: 'Test', data: { message: 'Bonjour' }, read_at: null, created_at: '2026-09-24T10:00:00Z' }],
      meta: { current_page: 1, last_page: 1, total: 1 }
    });
    expect(fixture.componentInstance.unreadCount()).toBe(1);
    fixture.componentInstance.markRead(fixture.componentInstance.items()[0]);
    const req = http.expectOne(r => r.url.endsWith('/notifications/a/read'));
    expect(req.request.method).toBe('POST');
    req.flush({ data: { id: 'a', read_at: '2026-09-24T11:00:00Z' } });
    expect(fixture.componentInstance.unreadCount()).toBe(0);
  });
});
