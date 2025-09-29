import { Loader } from '@googlemaps/js-api-loader';

export interface WeddingLocation {
  name: string;
  address: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  phoneNumber?: string;
  description?: string;
  parkingInfo?: string;
  accessibilityInfo?: string;
}

export const CONSTABLE_GALERIE: WeddingLocation = {
  name: 'Constable Galerie',
  address: 'Rua Coronel Francisco Flávio Carneiro, 200 - Eng. Luciano Cavalcante, Fortaleza - CE, 60813-690',
  coordinates: {
    lat: -3.779415667711433,
    lng: -38.4891699439423
  },
  description: 'Salão de Festas do Prédio - Um local elegante e aconchegante para nossa celebração especial.',
  parkingInfo: 'Estacionamento disponível no prédio para convidados.',
  accessibilityInfo: 'Local com acesso para pessoas com deficiência.'
};

export class GoogleMapsService {
  private loader: Loader | null = null;
  private mapInstance: google.maps.Map | null = null;
  private apiKey: string | null = null;

  constructor() {
    // API key will be loaded securely from our API route
  }

  private async getApiKey(): Promise<string> {
    if (this.apiKey) {
      return this.apiKey;
    }

    try {
      const response = await fetch('/api/maps/config');
      if (!response.ok) {
        throw new Error('Failed to get Google Maps configuration');
      }

      const config = await response.json();
      this.apiKey = config.apiKey;

      return this.apiKey;
    } catch (error) {
      throw new Error('Google Maps API key not available');
    }
  }

  private async initializeLoader(): Promise<void> {
    if (this.loader) {
      return;
    }

    const apiKey = await this.getApiKey();

    this.loader = new Loader({
      apiKey: apiKey,
      version: 'weekly',
      libraries: ['places', 'geometry'],
      language: 'pt-BR',
      region: 'BR'
    });
  }

  async loadGoogleMaps(): Promise<google.maps.Map | null> {
    try {
      await this.initializeLoader();
      if (!this.loader) {
        throw new Error('Google Maps loader not initialized');
      }
      await this.loader.load();
      return Promise.resolve(google.maps as any);
    } catch (error) {
      return null;
    }
  }

  async createMap(
    element: HTMLElement,
    location: WeddingLocation,
    options?: google.maps.MapOptions
  ): Promise<google.maps.Map | null> {
    try {
      await this.loadGoogleMaps();

      const defaultOptions: google.maps.MapOptions = {
        center: location.coordinates,
        zoom: 16,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        styles: this.getWeddingMapStyles(),
        disableDefaultUI: false,
        zoomControl: true,
        streetViewControl: true,
        fullscreenControl: true,
        mapTypeControl: false,
        gestureHandling: 'cooperative',
        ...options
      };

      this.mapInstance = new google.maps.Map(element, defaultOptions);

      // Add wedding venue marker
      this.addWeddingMarker(this.mapInstance, location);

      return this.mapInstance;
    } catch (error) {
      return null;
    }
  }

  private addWeddingMarker(map: google.maps.Map, location: WeddingLocation): void {
    // Custom wedding marker icon
    const weddingIcon = {
      url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="16" cy="16" r="15" fill="#EC4899" stroke="white" stroke-width="2"/>
          <path d="M16 8l2 6h6l-5 4 2 6-5-4-5 4 2-6-5-4h6l2-6z" fill="white"/>
        </svg>
      `),
      scaledSize: new google.maps.Size(32, 32),
      anchor: new google.maps.Point(16, 32)
    };

    const marker = new google.maps.Marker({
      position: location.coordinates,
      map: map,
      icon: weddingIcon,
      title: location.name,
      animation: google.maps.Animation.DROP
    });

    // Create info window
    const infoWindow = new google.maps.InfoWindow({
      content: this.createInfoWindowContent(location)
    });

    marker.addListener('click', () => {
      infoWindow.open(map, marker);
    });

    // Auto-open info window for wedding venue
    setTimeout(() => {
      infoWindow.open(map, marker);
    }, 1000);
  }

  private createInfoWindowContent(location: WeddingLocation): string {
    return `
      <div class="p-4 max-w-sm">
        <h3 class="font-bold text-lg text-gray-800 mb-2">${location.name}</h3>
        <p class="text-sm text-gray-600 mb-3">${location.address}</p>
        ${location.description ? `<p class="text-sm text-gray-700 mb-3">${location.description}</p>` : ''}
        <div class="flex flex-col gap-2">
          <button
            onclick="window.open('https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(location.address)}', '_blank')"
            class="bg-rose-500 hover:bg-rose-600 text-white text-sm px-3 py-2 rounded-lg transition-colors duration-200"
          >
            Como Chegar
          </button>
          <button
            onclick="window.open('https://maps.google.com/?q=${location.coordinates.lat},${location.coordinates.lng}', '_blank')"
            class="bg-purple-500 hover:bg-purple-600 text-white text-sm px-3 py-2 rounded-lg transition-colors duration-200"
          >
            Abrir no Google Maps
          </button>
        </div>
      </div>
    `;
  }

  private getWeddingMapStyles(): google.maps.MapTypeStyle[] {
    return [
      {
        featureType: 'water',
        elementType: 'geometry',
        stylers: [{ color: '#e9e9e9' }, { lightness: 17 }]
      },
      {
        featureType: 'landscape',
        elementType: 'geometry',
        stylers: [{ color: '#f5f5f5' }, { lightness: 20 }]
      },
      {
        featureType: 'road.highway',
        elementType: 'geometry.fill',
        stylers: [{ color: '#ffffff' }, { lightness: 17 }]
      },
      {
        featureType: 'road.highway',
        elementType: 'geometry.stroke',
        stylers: [{ color: '#ffffff' }, { lightness: 29 }, { weight: 0.2 }]
      },
      {
        featureType: 'road.arterial',
        elementType: 'geometry',
        stylers: [{ color: '#ffffff' }, { lightness: 18 }]
      },
      {
        featureType: 'road.local',
        elementType: 'geometry',
        stylers: [{ color: '#ffffff' }, { lightness: 16 }]
      },
      {
        featureType: 'poi',
        elementType: 'geometry',
        stylers: [{ color: '#f5f5f5' }, { lightness: 21 }]
      },
      {
        featureType: 'poi.park',
        elementType: 'geometry',
        stylers: [{ color: '#dedede' }, { lightness: 21 }]
      },
      {
        elementType: 'labels.text.stroke',
        stylers: [{ visibility: 'on' }, { color: '#ffffff' }, { lightness: 16 }]
      },
      {
        elementType: 'labels.text.fill',
        stylers: [{ saturation: 36 }, { color: '#333333' }, { lightness: 40 }]
      },
      {
        elementType: 'labels.icon',
        stylers: [{ visibility: 'off' }]
      },
      {
        featureType: 'transit',
        elementType: 'geometry',
        stylers: [{ color: '#f2f2f2' }, { lightness: 19 }]
      },
      {
        featureType: 'administrative',
        elementType: 'geometry.fill',
        stylers: [{ color: '#fefefe' }, { lightness: 20 }]
      },
      {
        featureType: 'administrative',
        elementType: 'geometry.stroke',
        stylers: [{ color: '#fefefe' }, { lightness: 17 }, { weight: 1.2 }]
      }
    ];
  }

  // Utility methods for Brazilian location features
  static generateDirectionsUrl(destination: string): string {
    return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destination)}`;
  }

  static generateGoogleMapsUrl(lat: number, lng: number): string {
    return `https://maps.google.com/?q=${lat},${lng}`;
  }

  static generateWhatsAppLocationMessage(location: WeddingLocation): string {
    const message = encodeURIComponent(
      `📍 Local do Casamento de Hel & Ylana\n\n` +
      `${location.name}\n` +
      `${location.address}\n\n` +
      `🗺️ Ver no Google Maps:\n` +
      `${this.generateGoogleMapsUrl(location.coordinates.lat, location.coordinates.lng)}\n\n` +
      `📅 20 de Novembro de 2025\n` +
      `⏰ 10:30h\n\n` +
      `Não vemos a hora de celebrar com você! 💕`
    );

    return `https://wa.me/?text=${message}`;
  }

  static getDistanceFromFortaleza(location: WeddingLocation): string {
    // Approximate distance from Fortaleza city center
    // Eng. Luciano Cavalcante is about 12-15km from downtown Fortaleza
    return 'Aproximadamente 15 km do centro de Fortaleza';
  }

  static getNearbyLandmarks(): string[] {
    return [
      'Shopping Iguatemi Fortaleza (5 min)',
      'North Shopping Fortaleza (10 min)',
      'Aeroporto Internacional de Fortaleza (25 min)',
      'Praia do Futuro (20 min)',
      'Centro de Fortaleza (25 min)'
    ];
  }

  static getPublicTransportInfo(): string[] {
    return [
      'Linhas de ônibus: 051, 066, 077',
      'Ponto de referência: Rua Coronel Francisco Flávio Carneiro',
      'Aplicativos: Uber, 99, Cabify disponíveis',
      'Estacionamento gratuito no local'
    ];
  }
}

export default GoogleMapsService;