import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import { CommonModule } from '@angular/common';
import * as L from 'leaflet';
import { MapPoint } from '../../../core/models/map.model';

@Component({
  selector: 'app-map-shell',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './map-shell.component.html',
})
export class MapShellComponent implements AfterViewInit, OnChanges, OnDestroy {
  @Input() points: MapPoint[] = [];
  @Input() fitToPoints = true;
  @Output() pointSelected = new EventEmitter<MapPoint>();

  @ViewChild('mapHost', { static: true })
  private readonly mapHost?: ElementRef<HTMLDivElement>;

  private map?: any;
  private markerLayer?: any;
  private hasFittedInitialPoints = false;

  ngAfterViewInit(): void {
    this.initMap();
    this.renderPoints();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['points'] && this.map) {
      this.renderPoints();
    }
  }

  ngOnDestroy(): void {
    this.map?.remove();
    this.map = undefined;
    this.markerLayer = undefined;
  }

  zoomIn(): void {
    this.map?.zoomIn();
  }

  zoomOut(): void {
    this.map?.zoomOut();
  }

  resetView(): void {
    if (!this.map) return;

    if (this.points.length > 0) {
      this.fitPoints();
      return;
    }

    this.map.setView([14.7167, -17.4677], 12);
  }

  private initMap(): void {
    const host = this.mapHost?.nativeElement;
    if (!host) return;

    this.map = L.map(host, {
      zoomControl: false,
      attributionControl: true,
      preferCanvas: true
    }).setView([14.7167, -17.4677], 12);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(this.map);

    this.markerLayer = L.layerGroup().addTo(this.map);
  }

  private renderPoints(): void {
    if (!this.map || !this.markerLayer) return;

    this.markerLayer.clearLayers();

    for (const point of this.points) {
      if (!Number.isFinite(point.latitude) || !Number.isFinite(point.longitude)) continue;

      const marker = L.marker([point.latitude, point.longitude], {
        icon: this.createPointIcon(point)
      });

      marker.on('click', () => this.pointSelected.emit(point));
      marker.addTo(this.markerLayer);
    }

    if (this.fitToPoints && this.points.length > 0 && !this.hasFittedInitialPoints) {
      this.fitPoints();
      this.hasFittedInitialPoints = true;
    }
  }

  private fitPoints(): void {
    if (!this.map) return;

    const validPoints = this.points.filter(
      point => Number.isFinite(point.latitude) && Number.isFinite(point.longitude)
    );

    if (validPoints.length === 0) return;

    const bounds = L.latLngBounds(
      validPoints.map(point => [point.latitude, point.longitude] as [number, number])
    );

    this.map.fitBounds(bounds, {
      padding: [60, 60],
      maxZoom: validPoints.length === 1 ? 15 : 14
    });
  }

  private createPointIcon(point: MapPoint): any {
    const emphasisClass = point.isNew
      ? 'ier-map-marker--new'
      : 'ier-map-marker--' + point.kind;

    return L.divIcon({
      className: '',
      html: '<span class="ier-map-marker ' + emphasisClass + '"><span class="ier-map-marker__core"></span></span>',
      iconSize: [24, 24],
      iconAnchor: [12, 12]
    });
  }
}
