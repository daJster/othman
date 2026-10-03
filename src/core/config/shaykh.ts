export interface Shaykh {
  name: string;
  englishName: string;
  language: 'ar' | 'en' | 'fr';
  format: 'audio';
  type: 'translation' | 'versebyverse';
  identifier: string;
  direction: string | null;
  url_path: string;
}

export interface ShaykhListConfig {
  defaultReader: Shaykh;
  reciters: Shaykh[];
  translators: Shaykh[];
}

export function createShaykhListConfig(): ShaykhListConfig {
  const defaultReader: Shaykh = {
    identifier: 'ar.minshawi',
    language: 'ar',
    name: 'م.م. محمد صديق المنشاوي',
    englishName: 'Minshawy',
    format: 'audio',
    type: 'translation',
    direction: null,
    url_path: '/quran/audio/64/ar.minshawi/',
  };

  const reciters: Shaykh[] = [
    {
      identifier: 'ar.minshawi',
      language: 'ar',
      name: 'م.م. محمد صديق المنشاوي',
      englishName: 'Minshawy',
      format: 'audio',
      type: 'translation',
      direction: null,
      url_path: '/quran/audio/64/ar.minshawi/',
    },
    {
      identifier: 'ar.minshawimujawwad',
      language: 'ar',
      name: 'م.م. محمد صديق المنشاوي (مجود)',
      englishName: 'Minshawy (Mujawwad)',
      format: 'audio',
      type: 'translation',
      direction: null,
      url_path: '/quran/audio/64/ar.minshawimujawwad/',
    },
    {
      identifier: 'ar.muhammadayyoub',
      language: 'ar',
      name: 'م.د. محمد أيوب',
      englishName: 'Muhammad Ayyoub',
      format: 'audio',
      type: 'versebyverse',
      direction: null,
      url_path: '/quran/audio/128/ar.muhammadayyoub/',
    },
    {
      identifier: 'ar.muhammadjibreel',
      language: 'ar',
      name: 'م.د. محمد جبريل',
      englishName: 'Muhammad Jibreel',
      format: 'audio',
      type: 'versebyverse',
      direction: null,
      url_path: '/quran/audio/128/ar.muhammadjibreel/',
    },
    {
      identifier: 'fr.leclerc',
      language: 'fr',
      name: 'Yannick Leclerc',
      englishName: 'Yannick Leclerc',
      format: 'audio',
      type: 'versebyverse',
      direction: null,
      url_path: '/quran/audio/128/fr.leclerc/',
    },
    {
      identifier: 'en.walk',
      language: 'en',
      name: 'Ibrahim Walk',
      englishName: 'Ibrahim Walk',
      format: 'audio',
      type: 'versebyverse',
      direction: null,
      url_path: '/quran/audio/128/en.walk/',
    },
    {
      identifier: 'ar.husary',
      language: 'ar',
      name: 'م.م. محمود خليل الحصري',
      englishName: 'Husary',
      format: 'audio',
      type: 'translation',
      direction: null,
      url_path: '/quran/audio/128/ar.husary/',
    },
    {
      identifier: 'ar.husarymujawwad',
      language: 'ar',
      name: 'م.م. محمود خليل الحصري (مجود)',
      englishName: 'Husary (Mujawwad)',
      format: 'audio',
      type: 'translation',
      direction: null,
      url_path: '/quran/audio/128/ar.husarymujawwad/',
    },
    {
      identifier: 'ar.abdulbasitmurattal',
      language: 'ar',
      name: 'م.م. عبد الباسط عبد الصمد',
      englishName: 'Abdul Basit',
      format: 'audio',
      type: 'translation',
      direction: null,
      url_path: '/quran/audio/128/ar.abdulbasitmurattal/',
    },
    {
      identifier: 'ar.abdulbasitmurattal2',
      language: 'ar',
      name: 'م.م. عبد الباسط عبد الصمد (مجود)',
      englishName: 'Abdul Basit (Mujawwad)',
      format: 'audio',
      type: 'translation',
      direction: null,
      url_path: '/quran/audio/32/ar.abdulbasitmurattal2/',
    },
    {
      identifier: 'ar.abdullahbasfar',
      language: 'ar',
      name: 'م.د. عبدالله بصفر',
      englishName: 'Abdullah Basfar',
      format: 'audio',
      type: 'versebyverse',
      direction: null,
      url_path: '/quran/audio/192/ar.abdullahbasfar/',
    },
    {
      identifier: 'ar.abdurrahmaansudais',
      language: 'ar',
      name: 'م.د. عبد الرحمن السديس',
      englishName: 'Abdurrahmaan As-Sudais',
      format: 'audio',
      type: 'versebyverse',
      direction: null,
      url_path: '/quran/audio/128/ar.abdurrahmaansudais/',
    },
    {
      identifier: 'ar.abdulsamad',
      language: 'ar',
      name: 'م.م. عبد الباسط عبد الصمد',
      englishName: 'Abdul Samad',
      format: 'audio',
      type: 'versebyverse',
      direction: null,
      url_path: '/quran/audio/64/ar.abdulsamad/',
    },
    {
      identifier: 'ar.ahmedali',
      language: 'ar',
      name: 'م.د. أحمد علي',
      englishName: 'Ahmed Ali',
      format: 'audio',
      type: 'versebyverse',
      direction: null,
      url_path: '/quran/audio/128/ar.ahmedali/',
    },
  ];

  const translators: Shaykh[] = [];

  return {
    defaultReader,
    reciters,
    translators,
  };
}
