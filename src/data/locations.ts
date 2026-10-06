export const locations = {
  'Kigali City': [
    'Gasabo',
    'Kicukiro',
    'Nyarugenge',
  ],

  'Northern Province': [
    'Burera',
    'Gakenke',
    'Gicumbi',
    'Musanze',
    'Rulindo',
  ],

  'Southern Province': [
    'Gisagara',
    'Huye',
    'Kamonyi',
    'Muhanga',
    'Nyamagabe',
    'Nyanza',
    'Nyaruguru',
    'Ruhango',
  ],

  'Eastern Province': [
    'Bugesera',
    'Gatsibo',
    'Kayonza',
    'Kirehe',
    'Ngoma',
    'Nyagatare',
    'Rwamagana',
  ],

  'Western Province': [
    'Karongi',
    'Ngororero',
    'Nyabihu',
    'Nyamasheke',
    'Rubavu',
    'Rusizi',
    'Rutsiro',
  ],
} as const;

export type Province = keyof typeof locations;

export type District =
  (typeof locations)[Province][number];

export const provinces =
  Object.keys(locations) as Province[];