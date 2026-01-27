// import AMapLoader from '@amap/amap-jsapi-loader';

// Define the shape of a Point of Interest (POI)
export interface POI {
  id: string;
  name: string;
  type: string;
  location: {
    lat: number;
    lng: number;
  };
  address: string;
  tel: string;
  distance: number;
}

// Mock Data for fallback when location fails or keys are missing
export const MOCK_POIS: POI[] = [
  {
    id: "mock-1",
    name: "上海市龙华殡仪馆",
    type: "殡仪馆",
    location: { lat: 31.176, lng: 121.448 },
    address: "上海市徐汇区漕溪路210号",
    tel: "021-64380000",
    distance: 2500
  },
  {
    id: "mock-2",
    name: "上海市宝兴殡仪馆",
    type: "殡仪馆",
    location: { lat: 31.282, lng: 121.481 },
    address: "上海市虹口区西宝兴路833号",
    tel: "021-56629007",
    distance: 5800
  },
  {
    id: "mock-3",
    name: "上海市益善殡仪馆",
    type: "殡仪馆",
    location: { lat: 31.115, lng: 121.365 },
    address: "上海市闵行区老沪闵路1500号",
    tel: "021-54821444",
    distance: 12000
  }
];

let aMapInstance: any = null;

// Replace with your actual AMap API Key and Security Code
// See: https://console.amap.com/
const AMAP_KEY = 'YOUR_AMAP_KEY_HERE'; 
const AMAP_SECURITY_CODE = 'YOUR_AMAP_SECURITY_CODE_HERE';

export const loadAMap = async () => {
  if (typeof window === 'undefined') return null;
  if (aMapInstance) return aMapInstance;

  // Check if keys are placeholders
  if (AMAP_KEY === 'YOUR_AMAP_KEY_HERE') {
    console.warn('AMap Key is missing. Using Mock Data mode.');
    return null; // Return null to trigger mock data fallback
  }

  try {
    const AMapLoader = (await import('@amap/amap-jsapi-loader')).default;

    (window as any)._AMapSecurityConfig = {
      securityJsCode: AMAP_SECURITY_CODE,
    };

    const AMap = await AMapLoader.load({
      key: AMAP_KEY,
      version: '2.0',
      plugins: ['AMap.PlaceSearch', 'AMap.Geolocation'],
    });
    aMapInstance = AMap;
    return AMap;
  } catch (e) {
    console.error('Failed to load AMap:', e);
    throw e;
  }
};

export const searchNearby = async (lat: number, lng: number, keyword: string = '殡仪馆'): Promise<POI[]> => {
  try {
    const AMap = await loadAMap();
    // Fallback to mock data if AMap fails to load or keys are missing
    if (!AMap) {
      console.log('Returning mock data for searchNearby');
      return MOCK_POIS;
    }
    
    return new Promise((resolve, reject) => {    AMap.plugin(['AMap.PlaceSearch'], () => {
        const placeSearch = new AMap.PlaceSearch({
          pageSize: 10,
          pageIndex: 1,
          extensions: 'base',
          // type: '公共设施', // Optional: filter by type
        });

        // Note: AMap uses [lng, lat] order for LngLat constructor
        const center = new AMap.LngLat(lng, lat);
        
        // Search within 50km (50000 meters)
        placeSearch.searchNearBy(keyword, center, 50000, (status: string, result: any) => {
          if (status === 'complete' && result.info === 'OK') {
            const pois = result.poiList.pois.map((p: any) => ({
              id: p.id,
              name: p.name,
              type: p.type,
              location: {
                lat: p.location.lat,
                lng: p.location.lng,
              },
              address: Array.isArray(p.address) ? p.address.join('') : p.address,
              tel: p.tel || '', // Ensure tel is not null
              distance: p.distance,
            }));
            resolve(pois);
          } else if (status === 'no_data') {
            resolve([]);
          } else {
            console.error('AMap PlaceSearch error:', result);
            reject(new Error(result.info || 'Search failed'));
          }
        });
      });
    });
  } catch (error) {
    console.error('Error in searchNearby:', error);
    return [];
  }
};

// Helper to perform a text search (for manual input)
export const searchByKeyword = async (keyword: string, city?: string): Promise<POI[]> => {
    try {
      const AMap = await loadAMap();
      
      // Fallback to mock data if AMap fails to load or keys are missing
      if (!AMap) {
        console.log('Returning mock data for searchByKeyword');
        return MOCK_POIS.filter(p => p.name.includes(keyword) || p.address.includes(keyword) || keyword.includes('殡仪馆'));
      }
      
      return new Promise((resolve, reject) => {
        AMap.plugin(['AMap.PlaceSearch'], () => {
          const placeSearch = new AMap.PlaceSearch({
            pageSize: 10,
            pageIndex: 1,
            extensions: 'base',
            city: city || '全国', // Default to nationwide if no city provided
          });
  
          placeSearch.search(keyword, (status: string, result: any) => {
            if (status === 'complete' && result.info === 'OK') {
              const pois = result.poiList.pois.map((p: any) => ({
                id: p.id,
                name: p.name,
                type: p.type,
                location: {
                  lat: p.location.lat,
                  lng: p.location.lng,
                },
                address: Array.isArray(p.address) ? p.address.join('') : p.address,
                tel: p.tel || '',
                distance: -1, // Distance is unknown/irrelevant for keyword search unless relative to something
              }));
              resolve(pois);
            } else if (status === 'no_data') {
              resolve([]);
            } else {
              reject(new Error(result.info || 'Search failed'));
            }
          });
        });
      });
    } catch (error) {
      console.error('Error in searchByKeyword:', error);
      return [];
    }
  };
