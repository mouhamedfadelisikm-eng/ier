import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService, AdminNotification } from '../../core/services/notification.service';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page">
      <div class="head">
        <div>
          <h1>Notifications</h1>
          <p>{{ unreadCount() }} non lue(s) sur cette page.</p>
        </div>
        <button class="btn" (click)="load(meta()?.current_page || 1)">Actualiser</button>
      </div>

      @if (error()) {
        <div class="alert">{{ error() }}</div>
      }

      <div class="card">
        @if (loading()) {
          <div class="state">Chargement...</div>
        } @else if (items().length === 0) {
          <div class="state">Aucune notification.</div>
        } @else {
          @for (n of items(); track n.id) {
            <article class="notification" [class.unread]="!n.read_at">
              <div class="icon">{{ n.read_at ? '✓' : '!' }}</div>
              <div class="content">
                <div class="top">
                  <b>{{ n.type }}</b>
                  <small>{{ n.created_at | date:'dd/MM/yyyy HH:mm' }}</small>
                </div>
                <p>{{ notificationMessage(n) }}</p>
                @if (!n.read_at) {
                  <button class="btn small" (click)="markRead(n)">Marquer comme lue</button>
                }
              </div>
            </article>
          }

          @if (meta()?.last_page > 1) {
            <div class="pager">
              <button class="btn small" [disabled]="meta().current_page === 1" (click)="load(meta().current_page - 1)">Précédent</button>
              <span>Page {{ meta().current_page }} / {{ meta().last_page }}</span>
              <button class="btn small" [disabled]="meta().current_page === meta().last_page" (click)="load(meta().current_page + 1)">Suivant</button>
            </div>
          }
        }
      </div>
    </div>
  `,
  styles: [`
    .page{display:flex;flex-direction:column;gap:1.2rem}
    .head{display:flex;justify-content:space-between;align-items:flex-start}
    .head h1{font-size:1.75rem;color:var(--slate-900)}
    .head p{color:var(--slate-500)}
    .btn{padding:.6rem .9rem;background:#fff;border:1px solid var(--slate-200);border-radius:var(--radius-sm);cursor:pointer}
    .small{font-size:.8rem}
    .card{background:#fff;border:1px solid var(--slate-200);border-radius:var(--radius-md);overflow:hidden}
    .notification{display:flex;gap:1rem;padding:1rem 1.2rem;border-bottom:1px solid var(--slate-100)}
    .notification.unread{background:var(--primary-50)}
    .icon{width:34px;height:34px;border-radius:50%;background:var(--slate-100);display:grid;place-items:center;font-weight:700;flex:none}
    .unread .icon{background:var(--primary-100);color:var(--primary-800)}
    .content{flex:1}
    .top{display:flex;justify-content:space-between;gap:1rem}
    .top small{color:var(--slate-500)}
    .content p{margin:.45rem 0 .7rem;color:var(--slate-600)}
    .pager{display:flex;justify-content:center;gap:.75rem;align-items:center;padding:1rem;background:var(--slate-50)}
    .state{padding:4rem;text-align:center;color:var(--slate-500)}
    .alert{padding:.75rem;background:var(--danger-50);color:var(--danger-700);border-radius:var(--radius-sm)}
  `]
})
export class NotificationsComponent implements OnInit {
  private readonly service = inject(NotificationService);
  items = signal<AdminNotification[]>([]);
  meta = signal<any>(undefined);
  loading = signal(true);
  error = signal<string | null>(null);

  ngOnInit(): void {
    this.load(1);
  }

  load(page: number): void {
    this.loading.set(true);
    this.service.getAll(page).subscribe({
      next: response => {
        this.items.set(response.data || []);
        this.meta.set(response.meta);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.error.set('Impossible de charger les notifications.');
      }
    });
  }

  markRead(notification: AdminNotification): void {
    if (notification.read_at) return;

    this.service.markRead(notification.id).subscribe({
      next: response => {
        this.items.update(list =>
          list.map(item => item.id === notification.id
            ? { ...item, read_at: response.data.read_at }
            : item
          )
        );
      },
      error: () => this.error.set('Impossible de marquer la notification comme lue.')
    });
  }

  notificationMessage(notification: AdminNotification): string {
    const data = notification.data;
    const message = typeof data['message'] === 'string' ? data['message'] : null;
    const description = typeof data['description'] === 'string' ? data['description'] : null;
    return message || description || 'Notification système';
  }

  unreadCount(): number {
    return this.items().filter(item => !item.read_at).length;
  }
}
