import { Component, OnInit } from '@angular/core';

declare var L: any;
declare var $: any;

@Component({
  selector: 'app-map-preview-cmp',
  templateUrl: './map-preview-cmp.component.html',
  styleUrls: ['./map-preview-cmp.component.css']
})
export class MapPreviewCmpComponent implements OnInit {
  visible = false;
  visibleAnimate = false;
  mapserviceUrl = '';
  serviceType = '';
  map: any;
  serviceName = '';


  constructor() { }

  ngOnInit() {
  }

  show() {
    console.log('show mapservice', this.mapserviceUrl);
    this.loadMap();
    this.visible = true;
    setTimeout(() => this.visibleAnimate = true);
  }

  hide() {
    this.map.remove();
    this.map = null;
    this.visibleAnimate = false;
    setTimeout(() => this.visible = false, 300);
  }

  loadMap() {
    if (!this.map) {
      this.map = L.map('map', {});
      const initialCoords = [44, -121];
      const initialZoom = 6;
      L.control.scale().addTo(this.map);
      this.map.setView(initialCoords, initialZoom);
      L.tileLayer('http://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png',
        {
          // tslint:disable-next-line:max-line-length
          attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>'
        }).addTo(this.map);
    }
    this.mapserviceUrl = this.mapserviceUrl.replace('arcgis/services', 'arcgis/rest/services').split('/WMSServer?')[0];
    console.log('mapservice url', this.mapserviceUrl);
    if (this.mapserviceUrl.includes('ImageServer')) {
      console.log('surely');
      L.esri.imageMapLayer({
        url: this.mapserviceUrl,
        opacity: 0.7
      }).addTo(this.map);
      // in case being served as a tile layer add
      L.esri.tiledMapLayer({
        url: this.mapserviceUrl,
        opacity: 0.7
      }).addTo(this.map);

    } else {
      let layerid = this.mapserviceUrl.split('MapServer/').length > 1
          ? this.mapserviceUrl.split('MapServer/')[1] 
          : '0';
      let url =  this.mapserviceUrl.split('MapServer/').length > 1 
      ? this.mapserviceUrl.split('MapServer/')[0] + 'MapServer' : this.mapserviceUrl;
      L.esri.dynamicMapLayer({
        url: url,
        layers: [layerid],
        opacity: 0.7
      }).addTo(this.map);
      $('#map').css('height', $(window).height() < 600 ? $(window).height() * .60 + 'px' : '500px');
    }

    L.tileLayer('http://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}.png',
      {
        // tslint:disable-next-line:max-line-length
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>'
      }).addTo(this.map);

    this.refreshMap();
  }

  refreshMap() {
    if (this.isIE()) {
      const evt = document.createEvent('UIEvents');
      evt.initUIEvent('resize', true, false, window, 0);
      window.dispatchEvent(evt);
    } else {
      window.dispatchEvent(new Event('resize'));
    }
  }

  isIE() {
    const ua = window.navigator.userAgent;
    const msie = ua.indexOf('MSIE ');
    if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./)) {
      return true;
    } else {
      return false;
    }
  }
}
