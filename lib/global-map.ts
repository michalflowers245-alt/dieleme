
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
  distance: number; // in meters
}

// Global Mock Data (New York, London, Tokyo, etc.)
export const GLOBAL_MOCK_POIS: POI[] = [
  {
    id: "ny-1",
    name: "Frank E. Campbell - The Funeral Chapel",
    type: "Funeral Home",
    location: { lat: 40.7812, lng: -73.9575 },
    address: "1076 Madison Ave, New York, NY 10028, United States",
    tel: "+1 212-288-3500",
    distance: 2500
  },
  {
    id: "ny-2",
    name: "Walter B. Cooke Funeral Home",
    type: "Funeral Home",
    location: { lat: 40.7789, lng: -73.9550 },
    address: "352 E 87th St, New York, NY 10128, United States",
    tel: "+1 212-535-1500",
    distance: 3200
  },
  {
    id: "lon-1",
    name: "Leverton & Sons Ltd",
    type: "Funeral Directors",
    location: { lat: 51.5332, lng: -0.1384 },
    address: "212 Eversholt St, London NW1 1BD, United Kingdom",
    tel: "+44 20 7387 6075",
    distance: 5800
  },
  {
    id: "tok-1",
    name: "Aoyama Funeral Hall",
    type: "Funeral Hall",
    location: { lat: 35.6662, lng: 139.7225 },
    address: "2-33-20 Minamiaoyama, Minato City, Tokyo 107-0062, Japan",
    tel: "+81 3-3401-3300",
    distance: 12000
  }
];

export const searchGlobalNearby = async (lat: number, lng: number): Promise<POI[]> => {
  // In a real app, this would call Google Places API
  // For now, we return mock data sorted by "distance" (simulated)
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(GLOBAL_MOCK_POIS);
    }, 800);
  });
};

export const searchGlobalByKeyword = async (keyword: string): Promise<POI[]> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const lowerKeyword = keyword.toLowerCase();
            const results = GLOBAL_MOCK_POIS.filter(poi => 
                poi.name.toLowerCase().includes(lowerKeyword) || 
                poi.address.toLowerCase().includes(lowerKeyword)
            );
            resolve(results.length > 0 ? results : GLOBAL_MOCK_POIS);
        }, 800);
    });
}
