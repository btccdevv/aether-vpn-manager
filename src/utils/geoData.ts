export const countryMap: Record<string, string> = {
    'al': 'Albania', 'at': 'Austria', 'be': 'Belgium', 'bg': 'Bulgaria', 'hr': 'Croatia',
    'cy': 'Cyprus', 'cz': 'Czechia', 'dk': 'Denmark', 'ee': 'Estonia', 'fi': 'Finland',
    'fr': 'France', 'de': 'Germany', 'gr': 'Greece', 'hu': 'Hungary', 'is': 'Iceland',
    'ie': 'Ireland', 'it': 'Italy', 'lv': 'Latvia', 'lt': 'Lithuania', 'lu': 'Luxembourg',
    'md': 'Moldova', 'nl': 'Netherlands', 'no': 'Norway', 'pl': 'Poland', 'pt': 'Portugal',
    'ro': 'Romania', 'rs': 'Serbia', 'sk': 'Slovakia', 'si': 'Slovenia', 'es': 'Spain',
    'se': 'Sweden', 'ch': 'Switzerland', 'tr': 'Turkey', 'ua': 'Ukraine', 'uk': 'United Kingdom', 'gb': 'United Kingdom',
    'ar': 'Argentina', 'br': 'Brazil', 'ca': 'Canada', 'cl': 'Chile', 'co': 'Colombia',
    'cr': 'Costa Rica', 'mx': 'Mexico', 'pe': 'Peru', 'us': 'United States',
    'au': 'Australia', 'hk': 'Hong Kong', 'in': 'India', 'id': 'Indonesia', 'jp': 'Japan',
    'my': 'Malaysia', 'nz': 'New Zealand', 'sg': 'Singapore', 'kr': 'South Korea', 'th': 'Thailand',
    'vn': 'Vietnam', 'ae': 'UAE', 'il': 'Israel', 'za': 'South Africa'
};

export const cityCoords: Record<string, [number, number]> = {
    'buh': [44.4268, 26.1025], 'buc': [44.4268, 26.1025],
    'beg': [44.7866, 20.4489],
    'sof': [42.6977, 23.3219],
    'bud': [47.4979, 19.0402],
    'vie': [48.2082, 16.3738],
    'bts': [48.1486, 17.1077],
    'prg': [50.0755, 14.4378],
    'waw': [52.2297, 21.0122],
    'kiv': [50.4501, 30.5234],
    'kis': [47.0105, 28.8638],
    'ath': [37.9838, 23.7275],
    'ist': [41.0082, 28.9784],

    'lon': [51.5072, -0.1276], 'man': [53.4808, -2.2426],
    'ams': [52.3676, 4.9041], 'bru': [50.8503, 4.3517],
    'par': [48.8566, 2.3522], 'mrs': [43.2965, 5.3698],
    'fra': [50.1109, 8.6821], 'ber': [52.5200, 13.4050], 'dus': [51.2277, 6.7735], 'mun': [48.1351, 11.5820],
    'mil': [45.4642, 9.1900], 'rom': [41.9028, 12.4964], 'pmo': [38.1157, 13.3615],
    'mad': [40.4168, -3.7038], 'bcn': [41.3851, 2.1734], 'lis': [38.7223, -9.1393],
    'zrh': [47.3769, 8.5417], 'gva': [46.2044, 6.1432],
    'sto': [59.3293, 18.0686], 'osl': [59.9139, 10.7522], 'cph': [55.6761, 12.5683], 'hel': [60.1699, 24.9384],
    'dub': [53.3498, -6.2603],

    'nyc': [40.7128, -74.0060], 'nj': [40.0583, -74.4057],
    'lax': [34.0522, -118.2437], 'sfo': [37.7749, -122.4194], 'sea': [47.6062, -122.3321],
    'chi': [41.8781, -87.6298], 'dal': [32.7767, -96.7970], 'mia': [25.7617, -80.1918],
    'atl': [33.7490, -84.3880], 'den': [39.7392, -104.9903], 'phx': [33.4484, -112.0740],
    'ash': [39.0438, -77.4875],
    'slc': [40.7608, -111.8910],

    'tor': [43.6532, -79.3832], 'mtl': [45.5017, -73.5673], 'yvr': [49.2827, -123.1207],
    'tok': [35.6762, 139.6503], 'sg': [1.3521, 103.8198], 'hk': [22.3193, 114.1694],
    'syd': [-33.8688, 151.2093], 'dxb': [25.276987, 55.296249], 'jnb': [-26.2041, 28.0473],
    'sao': [-23.5505, -46.6333], 'mex': [19.4326, -99.1332]
};

export const cityNameMap: Record<string, string> = {
    'buh': 'Bucharest', 'buc': 'Bucharest',
    'beg': 'Belgrade',
    'sof': 'Sofia',
    'bud': 'Budapest',
    'vie': 'Vienna',
    'prg': 'Prague',
    'waw': 'Warsaw',
    'kis': 'Chisinau',
    'lon': 'London', 'man': 'Manchester',
    'ams': 'Amsterdam',
    'par': 'Paris', 'mrs': 'Marseille',
    'fra': 'Frankfurt', 'ber': 'Berlin', 'dus': 'Dusseldorf', 'mun': 'Munich',
    'mil': 'Milan', 'rom': 'Rome', 'pmo': 'Palermo',
    'mad': 'Madrid', 'bcn': 'Barcelona',
    'zrh': 'Zurich', 'gva': 'Geneva',
    'sto': 'Stockholm', 'osl': 'Oslo', 'cph': 'Copenhagen', 'hel': 'Helsinki',
    'nyc': 'New York', 'nj': 'New Jersey',
    'lax': 'Los Angeles', 'sfo': 'San Francisco', 'sea': 'Seattle',
    'chi': 'Chicago', 'dal': 'Dallas', 'mia': 'Miami', 'atl': 'Atlanta',
    'den': 'Denver', 'phx': 'Phoenix', 'ash': 'Ashburn', 'slc': 'Salt Lake City',
    'tor': 'Toronto', 'mtl': 'Montreal', 'yvr': 'Vancouver',
    'tok': 'Tokyo', 'sg': 'Singapore', 'hk': 'Hong Kong',
    'syd': 'Sydney', 'dxb': 'Dubai', 'jnb': 'Johannesburg', 'sao': 'Sao Paulo', 'mex': 'Mexico City'
};

export const detectCity = (filename: string): { city: string, country: string, code: string } => {
    const parts = filename.toLowerCase().split(/[-_]/);

    let countryName = 'Unknown';
    let cityPretty = 'Unknown';
    let cityCode = '';

    for (const p of parts) {
        if (countryMap[p]) {
            countryName = countryMap[p];
            break;
        }
    }

    for (const p of parts) {
        if (cityCoords[p]) {
            cityCode = p;
            cityPretty = cityNameMap[p] || (p.charAt(0).toUpperCase() + p.slice(1));
            return { city: cityPretty, country: countryName, code: cityCode };
        }
    }

    return { city: 'Unknown', country: countryName, code: 'unknown' };
};