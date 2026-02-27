export interface Country {
  name: string;
  prefix: string;
  region: 'america' | 'europa' | 'asia' | 'africa';
}

export const COUNTRIES: Country[] = [
  // América — Hispanic countries keep Spanish name; others use English
  { name: 'Argentina',            prefix: '+54',  region: 'america' },
  { name: 'Bolivia',              prefix: '+591', region: 'america' },
  { name: 'Brasil',               prefix: '+55',  region: 'america' },
  { name: 'Canada',               prefix: '+1',   region: 'america' },
  { name: 'Chile',                prefix: '+56',  region: 'america' },
  { name: 'Colombia',             prefix: '+57',  region: 'america' },
  { name: 'Costa Rica',           prefix: '+506', region: 'america' },
  { name: 'Cuba',                 prefix: '+53',  region: 'america' },
  { name: 'Ecuador',              prefix: '+593', region: 'america' },
  { name: 'El Salvador',          prefix: '+503', region: 'america' },
  { name: 'Guatemala',            prefix: '+502', region: 'america' },
  { name: 'Honduras',             prefix: '+504', region: 'america' },
  { name: 'Jamaica',              prefix: '+1',   region: 'america' },
  { name: 'México',               prefix: '+52',  region: 'america' },
  { name: 'Nicaragua',            prefix: '+505', region: 'america' },
  { name: 'Panamá',               prefix: '+507', region: 'america' },
  { name: 'Paraguay',             prefix: '+595', region: 'america' },
  { name: 'Peru',                 prefix: '+51',  region: 'america' },
  { name: 'República Dominicana', prefix: '+1',   region: 'america' },
  { name: 'Trinidad and Tobago',  prefix: '+1',   region: 'america' },
  { name: 'United States',        prefix: '+1',   region: 'america' },
  { name: 'Uruguay',              prefix: '+598', region: 'america' },
  { name: 'Venezuela',            prefix: '+58',  region: 'america' },
  // Europa — España and Portugal keep their name; rest in English
  { name: 'Austria',              prefix: '+43',  region: 'europa' },
  { name: 'Belgium',              prefix: '+32',  region: 'europa' },
  { name: 'Bulgaria',             prefix: '+359', region: 'europa' },
  { name: 'Croatia',              prefix: '+385', region: 'europa' },
  { name: 'Czech Republic',       prefix: '+420', region: 'europa' },
  { name: 'Denmark',              prefix: '+45',  region: 'europa' },
  { name: 'España',               prefix: '+34',  region: 'europa' },
  { name: 'Estonia',              prefix: '+372', region: 'europa' },
  { name: 'Finland',              prefix: '+358', region: 'europa' },
  { name: 'France',               prefix: '+33',  region: 'europa' },
  { name: 'Germany',              prefix: '+49',  region: 'europa' },
  { name: 'Greece',               prefix: '+30',  region: 'europa' },
  { name: 'Hungary',              prefix: '+36',  region: 'europa' },
  { name: 'Ireland',              prefix: '+353', region: 'europa' },
  { name: 'Italy',                prefix: '+39',  region: 'europa' },
  { name: 'Latvia',               prefix: '+371', region: 'europa' },
  { name: 'Lithuania',            prefix: '+370', region: 'europa' },
  { name: 'Luxembourg',           prefix: '+352', region: 'europa' },
  { name: 'Netherlands',          prefix: '+31',  region: 'europa' },
  { name: 'Norway',               prefix: '+47',  region: 'europa' },
  { name: 'Poland',               prefix: '+48',  region: 'europa' },
  { name: 'Portugal',             prefix: '+351', region: 'europa' },
  { name: 'Romania',              prefix: '+40',  region: 'europa' },
  { name: 'Russia',               prefix: '+7',   region: 'europa' },
  { name: 'Slovakia',             prefix: '+421', region: 'europa' },
  { name: 'Sweden',               prefix: '+46',  region: 'europa' },
  { name: 'Switzerland',          prefix: '+41',  region: 'europa' },
  { name: 'Turkey',               prefix: '+90',  region: 'europa' },
  { name: 'Ukraine',              prefix: '+380', region: 'europa' },
  { name: 'United Kingdom',       prefix: '+44',  region: 'europa' },
  // Asia & Oceania — all in English
  { name: 'Australia',            prefix: '+61',  region: 'asia' },
  { name: 'Bangladesh',           prefix: '+880', region: 'asia' },
  { name: 'China',                prefix: '+86',  region: 'asia' },
  { name: 'Hong Kong',            prefix: '+852', region: 'asia' },
  { name: 'India',                prefix: '+91',  region: 'asia' },
  { name: 'Indonesia',            prefix: '+62',  region: 'asia' },
  { name: 'Israel',               prefix: '+972', region: 'asia' },
  { name: 'Japan',                prefix: '+81',  region: 'asia' },
  { name: 'Kuwait',               prefix: '+965', region: 'asia' },
  { name: 'Malaysia',             prefix: '+60',  region: 'asia' },
  { name: 'New Zealand',          prefix: '+64',  region: 'asia' },
  { name: 'Pakistan',             prefix: '+92',  region: 'asia' },
  { name: 'Philippines',          prefix: '+63',  region: 'asia' },
  { name: 'Qatar',                prefix: '+974', region: 'asia' },
  { name: 'Saudi Arabia',         prefix: '+966', region: 'asia' },
  { name: 'Singapore',            prefix: '+65',  region: 'asia' },
  { name: 'South Korea',          prefix: '+82',  region: 'asia' },
  { name: 'Sri Lanka',            prefix: '+94',  region: 'asia' },
  { name: 'Taiwan',               prefix: '+886', region: 'asia' },
  { name: 'Thailand',             prefix: '+66',  region: 'asia' },
  { name: 'United Arab Emirates', prefix: '+971', region: 'asia' },
  { name: 'Vietnam',              prefix: '+84',  region: 'asia' },
  // Africa & Middle East — all in English
  { name: 'Algeria',              prefix: '+213', region: 'africa' },
  { name: 'Egypt',                prefix: '+20',  region: 'africa' },
  { name: 'Ethiopia',             prefix: '+251', region: 'africa' },
  { name: 'Ghana',                prefix: '+233', region: 'africa' },
  { name: 'Iran',                 prefix: '+98',  region: 'africa' },
  { name: 'Iraq',                 prefix: '+964', region: 'africa' },
  { name: 'Jordan',               prefix: '+962', region: 'africa' },
  { name: 'Kenya',                prefix: '+254', region: 'africa' },
  { name: 'Lebanon',              prefix: '+961', region: 'africa' },
  { name: 'Morocco',              prefix: '+212', region: 'africa' },
  { name: 'Nigeria',              prefix: '+234', region: 'africa' },
  { name: 'Senegal',              prefix: '+221', region: 'africa' },
  { name: 'South Africa',         prefix: '+27',  region: 'africa' },
  { name: 'Tanzania',             prefix: '+255', region: 'africa' },
  { name: 'Tunisia',              prefix: '+216', region: 'africa' },
  { name: 'Uganda',               prefix: '+256', region: 'africa' },
];

export const REGION_LABELS: Record<string, string> = {
  america: 'América',
  europa:  'Europa',
  asia:    'Asia & Oceania',
  africa:  'Africa & Middle East',
};

export const REGIONS = ['america', 'europa', 'asia', 'africa'] as const;

export function getCountryPrefix(countryName: string): string {
  return COUNTRIES.find((c) => c.name === countryName)?.prefix ?? '+';
}

/** Countries with full address hierarchy support (ubigeo data available) */
export const UBIGEO_COUNTRIES = ['Peru', 'Brasil', 'Colombia', 'Ecuador'] as const;
export type UbigeoCountry = typeof UBIGEO_COUNTRIES[number];

export function hasUbigeo(country: string): country is UbigeoCountry {
  return (UBIGEO_COUNTRIES as readonly string[]).includes(country);
}
