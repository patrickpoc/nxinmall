export interface Country {
  name: string;
  prefix: string;
  region: 'america' | 'europa' | 'asia' | 'africa';
}

export const COUNTRIES: Country[] = [
  // América
  { name: 'Argentina',           prefix: '+54',  region: 'america' },
  { name: 'Bolivia',             prefix: '+591', region: 'america' },
  { name: 'Brasil',              prefix: '+55',  region: 'america' },
  { name: 'Canada',              prefix: '+1',   region: 'america' },
  { name: 'Chile',               prefix: '+56',  region: 'america' },
  { name: 'Colombia',            prefix: '+57',  region: 'america' },
  { name: 'Costa Rica',          prefix: '+506', region: 'america' },
  { name: 'Cuba',                prefix: '+53',  region: 'america' },
  { name: 'Ecuador',             prefix: '+593', region: 'america' },
  { name: 'El Salvador',         prefix: '+503', region: 'america' },
  { name: 'Estados Unidos',      prefix: '+1',   region: 'america' },
  { name: 'Guatemala',           prefix: '+502', region: 'america' },
  { name: 'Honduras',            prefix: '+504', region: 'america' },
  { name: 'Jamaica',             prefix: '+1',   region: 'america' },
  { name: 'México',              prefix: '+52',  region: 'america' },
  { name: 'Nicaragua',           prefix: '+505', region: 'america' },
  { name: 'Panamá',              prefix: '+507', region: 'america' },
  { name: 'Paraguay',            prefix: '+595', region: 'america' },
  { name: 'Peru',                prefix: '+51',  region: 'america' },
  { name: 'República Dominicana',prefix: '+1',   region: 'america' },
  { name: 'Trinidad y Tobago',   prefix: '+1',   region: 'america' },
  { name: 'Uruguay',             prefix: '+598', region: 'america' },
  { name: 'Venezuela',           prefix: '+58',  region: 'america' },
  // Europa
  { name: 'Alemania',            prefix: '+49',  region: 'europa' },
  { name: 'Austria',             prefix: '+43',  region: 'europa' },
  { name: 'Bélgica',             prefix: '+32',  region: 'europa' },
  { name: 'Bulgaria',            prefix: '+359', region: 'europa' },
  { name: 'Croacia',             prefix: '+385', region: 'europa' },
  { name: 'Dinamarca',           prefix: '+45',  region: 'europa' },
  { name: 'Eslovaquia',          prefix: '+421', region: 'europa' },
  { name: 'España',              prefix: '+34',  region: 'europa' },
  { name: 'Estonia',             prefix: '+372', region: 'europa' },
  { name: 'Finlandia',           prefix: '+358', region: 'europa' },
  { name: 'Francia',             prefix: '+33',  region: 'europa' },
  { name: 'Grecia',              prefix: '+30',  region: 'europa' },
  { name: 'Hungría',             prefix: '+36',  region: 'europa' },
  { name: 'Irlanda',             prefix: '+353', region: 'europa' },
  { name: 'Italia',              prefix: '+39',  region: 'europa' },
  { name: 'Letonia',             prefix: '+371', region: 'europa' },
  { name: 'Lituania',            prefix: '+370', region: 'europa' },
  { name: 'Luxemburgo',          prefix: '+352', region: 'europa' },
  { name: 'Noruega',             prefix: '+47',  region: 'europa' },
  { name: 'Países Bajos',        prefix: '+31',  region: 'europa' },
  { name: 'Polonia',             prefix: '+48',  region: 'europa' },
  { name: 'Portugal',            prefix: '+351', region: 'europa' },
  { name: 'Reino Unido',         prefix: '+44',  region: 'europa' },
  { name: 'República Checa',     prefix: '+420', region: 'europa' },
  { name: 'Rumanía',             prefix: '+40',  region: 'europa' },
  { name: 'Rusia',               prefix: '+7',   region: 'europa' },
  { name: 'Suecia',              prefix: '+46',  region: 'europa' },
  { name: 'Suiza',               prefix: '+41',  region: 'europa' },
  { name: 'Turquía',             prefix: '+90',  region: 'europa' },
  { name: 'Ucrania',             prefix: '+380', region: 'europa' },
  // Asia y Oceanía
  { name: 'Arabia Saudita',        prefix: '+966', region: 'asia' },
  { name: 'Australia',             prefix: '+61',  region: 'asia' },
  { name: 'Bangladesh',            prefix: '+880', region: 'asia' },
  { name: 'China',                 prefix: '+86',  region: 'asia' },
  { name: 'Corea del Sur',         prefix: '+82',  region: 'asia' },
  { name: 'Emiratos Árabes Unidos',prefix: '+971', region: 'asia' },
  { name: 'Filipinas',             prefix: '+63',  region: 'asia' },
  { name: 'Hong Kong',             prefix: '+852', region: 'asia' },
  { name: 'India',                 prefix: '+91',  region: 'asia' },
  { name: 'Indonesia',             prefix: '+62',  region: 'asia' },
  { name: 'Israel',                prefix: '+972', region: 'asia' },
  { name: 'Japón',                 prefix: '+81',  region: 'asia' },
  { name: 'Kuwait',                prefix: '+965', region: 'asia' },
  { name: 'Malasia',               prefix: '+60',  region: 'asia' },
  { name: 'Nueva Zelanda',         prefix: '+64',  region: 'asia' },
  { name: 'Pakistán',              prefix: '+92',  region: 'asia' },
  { name: 'Qatar',                 prefix: '+974', region: 'asia' },
  { name: 'Singapur',              prefix: '+65',  region: 'asia' },
  { name: 'Sri Lanka',             prefix: '+94',  region: 'asia' },
  { name: 'Tailandia',             prefix: '+66',  region: 'asia' },
  { name: 'Taiwan',                prefix: '+886', region: 'asia' },
  { name: 'Vietnam',               prefix: '+84',  region: 'asia' },
  // África y Medio Oriente
  { name: 'Argelia',    prefix: '+213', region: 'africa' },
  { name: 'Egipto',     prefix: '+20',  region: 'africa' },
  { name: 'Etiopía',    prefix: '+251', region: 'africa' },
  { name: 'Ghana',      prefix: '+233', region: 'africa' },
  { name: 'Irak',       prefix: '+964', region: 'africa' },
  { name: 'Irán',       prefix: '+98',  region: 'africa' },
  { name: 'Jordania',   prefix: '+962', region: 'africa' },
  { name: 'Kenia',      prefix: '+254', region: 'africa' },
  { name: 'Líbano',     prefix: '+961', region: 'africa' },
  { name: 'Marruecos',  prefix: '+212', region: 'africa' },
  { name: 'Nigeria',    prefix: '+234', region: 'africa' },
  { name: 'Senegal',    prefix: '+221', region: 'africa' },
  { name: 'Sudáfrica',  prefix: '+27',  region: 'africa' },
  { name: 'Tanzania',   prefix: '+255', region: 'africa' },
  { name: 'Túnez',      prefix: '+216', region: 'africa' },
  { name: 'Uganda',     prefix: '+256', region: 'africa' },
];

export const REGION_LABELS: Record<string, string> = {
  america: 'América',
  europa: 'Europa',
  asia: 'Asia y Oceanía',
  africa: 'África y Medio Oriente',
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
