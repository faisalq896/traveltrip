// ============================================
// DATA
// ============================================

const TRIP_DATE = "2026-08-19T13:40:00";
const TMD_PHUKET_URL = "https://www.tmd.go.th/en/weather/province/phuket";
const OPEN_METEO_PHUKET_URL = "https://api.open-meteo.com/v1/forecast?latitude=7.8804&longitude=98.3923&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,rain,weather_code,wind_speed_10m,wind_direction_10m&timezone=Asia%2FBangkok";
const PLACEHOLDER_IMG = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="500"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="%23007AFF"/><stop offset="1" stop-color="%235856D6"/></linearGradient></defs><rect width="800" height="500" fill="url(%23g)"/><text x="400" y="260" text-anchor="middle" font-family="Arial,Helvetica,sans-serif" font-size="64" fill="%23fff">بوكيت 2026</text></svg>';
function safeImage(src) { return src && src.startsWith('http') ? src : PLACEHOLDER_IMG; }
const USER_PHOTO_TYPES = new Set(['image/jpeg', 'image/png', 'image/gif', 'image/webp']);
const USER_PHOTO_DATA_URL = /^data:image\/(?:jpeg|png|gif|webp);base64,[a-z0-9+/=]+$/i;
function isSafeUserPhoto(src) { return typeof src === 'string' && USER_PHOTO_DATA_URL.test(src); }

const scheduleData = [
  {
    day: 1, date: "15 أغسطس", city: "باتونج", hotel: "Oceanfront Beach Resort",
    items: [
      { time: "08:00", title: "الوصول والاستلام", sub: "الفندق", done: false },
      { time: "10:00", title: "فطور في Commune", sub: "مقهى / مطعم", done: false },
      { time: "12:00", title: "تسوق في Central Patong", sub: "مول", done: false },
      { time: "15:00", title: "استرخاء في Fuga Beach Club", sub: "شاطئ", done: false },
      { time: "19:00", title: "عشاء في Layali Beirut", sub: "مطعم لبناني", done: false },
      { time: "21:00", title: "جولة في Bangla Road", sub: "حياة ليلية", done: false },
    ]
  },
  {
    day: 2, date: "16 أغسطس", city: "باتونج / كاثو", hotel: "Oceanfront Beach Resort",
    items: [
      { time: "09:00", title: "ATV Rides", sub: "مغامرة في Big Buddha Hill", done: false },
      { time: "12:00", title: "غداء في Three Monkeys", sub: "مطعم في الغابة", done: false },
      { time: "15:00", title: "Hanuman World (Zipline)", sub: "مغامرة", done: false },
      { time: "18:00", title: "غروب في View Point Cafe", sub: "مقهى بانورامي", done: false },
      { time: "20:00", title: "عشاء في La Gritta", sub: "إيطالي فاخر", done: false },
    ]
  },
  {
    day: 3, date: "17 أغسطس", city: "جزيرة في في", hotel: "Oceanfront Beach Resort",
    items: [
      { time: "07:00", title: "الانطلاق لـ Noah Phi Phi Island", sub: "رحلة بحرية", done: false },
      { time: "09:00", title: "Maya Bay", sub: "شاطئ ذا بيتش", done: false },
      { time: "12:00", title: "غداء على الجزيرة", sub: "بوفيه", done: false },
      { time: "14:00", title: "سنوركل في Coral Island", sub: "غوص حر", done: false },
      { time: "17:00", title: "العودة + استرخاء", sub: "Spa في الفندق", done: false },
    ]
  },
  {
    day: 4, date: "18 أغسطس", city: "Old Town / راواي", hotel: "Oceanfront Beach Resort",
    items: [
      { time: "09:00", title: "قهوة في Rush Coffee", sub: "Old Town", done: false },
      { time: "10:30", title: "جولة في Phuket Old Town", sub: "منطقة تراثية", done: false },
      { time: "12:00", title: "Local Market", sub: "سوق محلي", done: false },
      { time: "14:00", title: "غداء في Juicy Lucy", sub: "برجر", done: false },
      { time: "16:00", title: "قهوة في The 5th", sub: "Roastery", done: false },
      { time: "19:00", title: "عشاء في Day & Night", sub: "ميشلان جايد", done: false },
    ]
  },
  {
    day: 5, date: "19 أغسطس", city: "باتونج", hotel: "Oceanfront Beach Resort",
    items: [
      { time: "08:00", title: "Ma Doo Bua للتصوير", sub: "أشهر مكان للتصوير", done: false },
      { time: "11:00", title: "The Cozy Coffee", sub: "Tri Trang Beach", done: false },
      { time: "14:00", title: "Thai Cooking Experience", sub: "تعلم الطبخ التايلاندي", done: false },
      { time: "17:00", title: "Three Bays للغروب", sub: "Karon Viewpoint", done: false },
      { time: "20:00", title: "عشاء وداعي في Blu Saffron", sub: "عالمي فاخر", done: false },
    ]
  },
];

const hotelsData = [
  {
    id: "hotel1", name: "Oceanfront Beach Resort Phuket", nameTh: "โอเชียนฟร้อนท์ บีช รีสอร์ท",
    address: "Prabaramee Road, Patong, Phuket", addressTh: "ถนนประบารมี ป่าตอง ภูเก็ต",
    phone: "+66 76 340 000", rating: 4.8, map: "Oceanfront+Beach+Resort+Phuket",
    img: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&q=80",
    notes: "إطلالة بانورامية، مسبح لا متناهي، سبا فاخر. 5 دقائق لشاطئ باتونج."
  }
];

// restaurantsData and mallsData moved to data.js

const activitiesData = [
  { id:"a1", name:"Noah Phi Phi Island", nameTh:"ทัวร์เกาะพีพี", company:"Love Andaman", time:"07:00", duration:"يوم كامل", price:"3,500 THB", bring:"نظارة شمس، كريم واقي، منشفة، كاميرا مقاومة للماء", notes:"حجز مسبق ضروري. يناسب الأزواج والعائلات.", img:"https://images.unsplash.com/photo-1540202404-b71188410214?w=600&q=80", map:"Phi+Phi+Islands" },
  { id:"a2", name:"Racha Island Black Pearl", nameTh:"ทัวร์เกาะราชา แบล็คเพิร์ล", company:"Black Pearl Yacht", time:"08:00", duration:"يوم كامل", price:"3,500 THB", bring:"ملابس سباحة، واقي شمس، قبعة", notes:"يخت شراعي فاخر. غوص حر + سنوركل.", img:"https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600&q=80", map:"Racha+Island" },
  { id:"a3", name:"Local Market", nameTh:"ตลาดสดท้องถิ่น", company:"—", time:"08:00", duration:"1-2 ساعة", price:"مجاني", bring:"نقود فكة، كيس", notes:"تفاوض على الأسعار. أفضل وقت الصباح الباكر.", img:"https://images.unsplash.com/photo-1533900298318-6b8da08a523e?w=600&q=80", map:"Phuket+Local+Market" },
  { id:"a4", name:"Thai Cooking Experience", nameTh:"เรียนทำอาหารไทย", company:"Blue Elephant", time:"10:00", duration:"3 ساعات", price:"1,800 THB", bring:"شهية مفتوحة!", notes:"تعلم طبخ أشهر الأطباق التايلاندية.", img:"https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=600&q=80", map:"Blue+Elephant+Phuket" },
  { id:"a5", name:"ATV Rides", nameTh:"ขับรถเอทีวี", company:"Big Buddha ATV", time:"09:00", duration:"1-2 ساعة", price:"1,500 THB", bring:"ملابس رياضية، حذاء مغلق", notes:"مغامرة في الغابة والجبال. +8 سنوات.", img:"https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=600&q=80", map:"ATV+Phuket" },
  { id:"a6", name:"Carnival Magic", nameTh:"คาร์นิวัล เมจิก", company:"Phuket FantaSea", time:"17:30", duration:"~4 ساعات", price:"2,500 THB", bring:"كاميرا، نقود للهدايا", notes:"عرض ترفيهي ثقافي مذهل. ممتاز للعائلات.", img:"https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&q=80", map:"Carnival+Magic+Phuket" },
  { id:"a7", name:"Maya Bay", nameTh:"อ่าวมาหยา", company:"Love Andaman", time:"مع Phi Phi", duration:"ضمن الرحلة", price:"~3,500 THB", bring:"كاميرا، واقي شمس", notes:"موقع فيلم The Beach. مغلق أحياناً للتجديد.", img:"https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600&q=80", map:"Maya+Bay" },
  { id:"a8", name:"Coral Island", nameTh:"เกาะเฮ", company:"—", time:"09:00", duration:"نصف يوم", price:"1,500 THB", bring:"ملابس سباحة، سنوركل", notes:"20 دقيقة بالقارب. رياضات مائية متوفرة.", img:"https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&q=80", map:"Coral+Island+Phuket" },
  { id:"a9", name:"Hanuman World", nameTh:"ฮานูมาน เวิลด์", company:"Hanuman World", time:"09:00", duration:"2-3 ساعات", price:"2,000 THB", bring:"ملابس رياضية، حذاء مغلق", notes:"أكبر زيبلاين في بوكيت. +4 سنوات.", img:"https://cdn-imgix.headout.com/media/images/a7d7b611e197cd0fcc700c51369adedc-11302-thailand-hanuman-world--32-platforms-zipline-adventure-with-round-trip-transfer-15.jpg?auto=compress%2Cformat&crop=faces&fit=crop&q=90", images:["https://cdn-imgix.headout.com/media/images/a7d7b611e197cd0fcc700c51369adedc-11302-thailand-hanuman-world--32-platforms-zipline-adventure-with-round-trip-transfer-15.jpg?auto=compress%2Cformat&crop=faces&fit=crop&q=90","https://cdn-imgix.headout.com/media/images/7cbcfe501d59b9215493bfd0d1c71a51-17881-phuket-hanuman-world-03.jpg?auto=compress%2Cformat&crop=faces&fit=crop&q=90","https://cdn-imgix.headout.com/media/images/65c172318172611a752b713cd8f940da-11302-thailand-hanuman-world--32-platforms-zipline-adventure-with-round-trip-transfer-03.jpg?auto=compress%2Cformat&crop=faces&fit=crop&q=90"], map:"Hanuman+World+Phuket" },
];

const bangkokScheduleData = [
  {
    day: 1, date: '15 أغسطس', city: 'Sukhumvit', hotel: 'Skyline Riverside Hotel',
    items: [
      { time: '09:00', title: 'الوصول وتسجيل الدخول', sub: 'الفندق', done: false },
      { time: '12:00', title: 'Terminal 21', sub: 'تسوق وغداء', done: false },
      { time: '18:00', title: 'Asiatique', sub: 'نهر ومطاعم', done: false }
    ]
  },
  {
    day: 2, date: '16 أغسطس', city: 'Old Bangkok', hotel: 'Skyline Riverside Hotel',
    items: [
      { time: '08:30', title: 'Grand Palace', sub: 'جولة ثقافية', done: false },
      { time: '11:00', title: 'Wat Pho', sub: 'معبد بوذا', done: false },
      { time: '19:00', title: 'Chao Phraya Dinner Cruise', sub: 'عشاء على النهر', done: false }
    ]
  },
  {
    day: 3, date: '17 أغسطس', city: 'Bangkok City', hotel: 'Skyline Riverside Hotel',
    items: [
      { time: '10:00', title: 'ICONSIAM', sub: 'مول فاخر', done: false },
      { time: '14:00', title: 'Chatuchak Market', sub: 'تسوق شعبي', done: false },
      { time: '20:00', title: 'Rooftop at Mahanakhon', sub: 'إطلالة المدينة', done: false }
    ]
  }
];

const bangkokHotelsData = [
  {
    id: 'bh1',
    name: 'Skyline Riverside Hotel',
    nameTh: 'สกายไลน์ ริเวอร์ไซด์ โฮเทล',
    address: 'Chao Phraya Riverside, Bangkok',
    addressTh: 'ริมแม่น้ำเจ้าพระยา กรุงเทพฯ',
    phone: '+66 2 555 1234',
    rating: 4.7,
    map: 'Skyline+Riverside+Hotel+Bangkok',
    img: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80',
    notes: 'موقع ممتاز قريب من المترو النهري والأسواق الليلية.'
  }
];

const bangkokRestaurantsData = [
  { id:'br1', name:'Sorn', nameTh:'ศรณ์', type:'تايلاندي فاخر', halal:false, halalNote:'لا', price:'$$$$', hours:'17:00 - 23:00', rating:4.8, distance:'20 دقيقة', img:'https://images.unsplash.com/photo-1559847844-5315695dadae?w=600&q=80', map:'Sorn+Bangkok' },
  { id:'br2', name:'Krua Apsorn', nameTh:'ครัวอัปษร', type:'تايلاندي محلي', halal:false, halalNote:'لا', price:'$$', hours:'10:00 - 20:00', rating:4.5, distance:'25 دقيقة', img:'https://images.unsplash.com/photo-1534939561126-855b8675edd7?w=600&q=80', map:'Krua+Apsorn+Bangkok' },
  { id:'br3', name:'Yana Restaurant', nameTh:'ยานา', type:'تركي/حلال', halal:true, halalNote:'حلال', price:'$$', hours:'11:00 - 22:00', rating:4.6, distance:'15 دقيقة', img:'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=600&q=80', map:'Yana+Restaurant+Bangkok' }
];

const bangkokCafesData = [
  { id:'bc1', name:'Factory Coffee', nameTh:'แฟคทอรี่ คอฟฟี่', type:'قهوة مختصة', halal:null, halalNote:'غير مؤكد', price:'$$', hours:'08:00 - 18:00', rating:4.7, distance:'18 دقيقة', img:'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&q=80', map:'Factory+Coffee+Bangkok' },
  { id:'bc2', name:'After You', nameTh:'อาฟเตอร์ยู', type:'حلويات ومقهى', halal:null, halalNote:'غير مؤكد', price:'$$', hours:'10:00 - 22:00', rating:4.5, distance:'12 دقيقة', img:'https://images.unsplash.com/photo-1515823064-d6e0c04616a7?w=600&q=80', map:'After+You+Bangkok' }
];

const bangkokMallsData = [
  { id:'bm1', name:'ICONSIAM', nameTh:'ไอคอนสยาม', hours:'10:00 - 22:00', shops:'Luxury brands, fashion, tech', restaurants:'Food hall + riverside dining', distance:'20 دقيقة', img:'https://images.unsplash.com/photo-1519567281028-11a5b85d38cc?w=600&q=80', map:'ICONSIAM+Bangkok' },
  { id:'bm2', name:'Siam Paragon', nameTh:'สยามพารากอน', hours:'10:00 - 22:00', shops:'ماركات عالمية وسينما', restaurants:'مطاعم عالمية', distance:'15 دقيقة', img:'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=600&q=80', map:'Siam+Paragon+Bangkok' }
];

const bangkokActivitiesData = [
  { id:'ba1', name:'Mahanakhon SkyWalk', nameTh:'มหานคร สกายวอล์ค', company:'King Power', time:'18:00', duration:'1-2 ساعة', price:'1,200 THB', bring:'كاميرا', notes:'أفضل وقت عند الغروب.', img:'https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=600&q=80', map:'Mahanakhon+SkyWalk' },
  { id:'ba2', name:'Chao Phraya Cruise', nameTh:'ล่องเรือเจ้าพระยา', company:'White Orchid', time:'19:30', duration:'2 ساعات', price:'1,600 THB', bring:'ملابس أنيقة', notes:'عشاء وإطلالة ليلية.', img:'https://images.unsplash.com/photo-1516490981167-dc990a242afe?w=600&q=80', map:'Chao+Phraya+Dinner+Cruise' }
];

// Verified, place-specific photography for the first featured cards in every category.
const curatedPlaceImages = {
  commune: 'https://thecommunephuket.com/pictures/coffee-closeup-terrace-md.avif',
  jungceylon: 'https://www.jungceylon.com/uploads/Summer_Vespa_Party_Website_Banner_1620x550_ca946ca86c.jpg',
  kruaApsorn: 'https://www.krua-apsorn.com/images/crab-omelette.png',
  factoryCoffee: 'https://factorybkk.com/cdn/shop/files/IMG_8628.png?v=1783580681',
  iconsiam: 'https://dvgrmu8f1ixkk.cloudfront.net/gallery/exterior/content/3/29416e9f-cbae-49df-820a-b1c47d89c8de.jpeg',
  mahanakhon: 'https://www.kingpowermahanakhon.co.th/application/files/1917/7735/0328/glass-skywalk-night-view.jpg'
};

function setCuratedPlaceImage(collection, id, image) {
  const item = collection.find(entry => entry.id === id);
  if (item) item.img = image;
}

setCuratedPlaceImage(cafesData, 'c1', curatedPlaceImages.commune);
setCuratedPlaceImage(mallsData, 'm2', curatedPlaceImages.jungceylon);
setCuratedPlaceImage(bangkokRestaurantsData, 'br2', curatedPlaceImages.kruaApsorn);
setCuratedPlaceImage(bangkokCafesData, 'bc1', curatedPlaceImages.factoryCoffee);
setCuratedPlaceImage(bangkokMallsData, 'bm1', curatedPlaceImages.iconsiam);
setCuratedPlaceImage(bangkokActivitiesData, 'ba1', curatedPlaceImages.mahanakhon);

const CITY_CONFIG = {
  phuket: {
    key: 'phuket',
    label: 'بوكيت',
    tripDate: '2026-08-19T13:40:00',
    heroTitle: 'رحلة بوكيت 2026',
    heroSubtitle: 'جزر وشواطئ وأيام هادئة لا تُنسى',
    heroImage: 'https://images.pexels.com/photos/4159512/pexels-photo-4159512.jpeg?auto=compress&cs=tinysrgb&w=2560',
    weatherLocation: 'بوكيت، تايلند',
    weatherApiUrl: OPEN_METEO_PHUKET_URL,
    tmdUrl: 'https://www.tmd.go.th/en/weather/province/phuket',
    quickMedia: {
      schedule: 'https://images.pexels.com/photos/4159512/pexels-photo-4159512.jpeg?auto=compress&cs=tinysrgb&w=1600',
      hotels: 'https://images.pexels.com/photos/4159512/pexels-photo-4159512.jpeg?auto=compress&cs=tinysrgb&w=1600',
      restaurants: 'https://threemonkeysphuket.com/images/new/threemonkeys057.jpg',
      cafes: 'https://thecommunephuket.com/pictures/coffee-closeup-terrace-md.avif',
      malls: 'https://www.jungceylon.com/uploads/Summer_Vespa_Party_Website_Banner_1620x550_ca946ca86c.jpg',
      activities: 'https://cdn-imgix.headout.com/media/images/a7d7b611e197cd0fcc700c51369adedc-11302-thailand-hanuman-world--32-platforms-zipline-adventure-with-round-trip-transfer-15.jpg?auto=compress%2Cformat&crop=faces&fit=crop&q=90',
      budget: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=900&q=88',
      packing: 'https://images.unsplash.com/photo-1553531889-56cc480ac5cb?auto=format&fit=crop&w=900&q=88'
    }
  },
  bangkok: {
    key: 'bangkok',
    label: 'بانكوك',
    tripDate: '2026-08-25T12:35:00',
    heroTitle: 'رحلة بانكوك 2026',
    heroSubtitle: 'أضواء المدينة وأسواقها ولياليها الجميلة',
    heroImage: 'https://images.pexels.com/photos/20020757/pexels-photo-20020757.jpeg?auto=compress&cs=tinysrgb&w=2560',
    weatherLocation: 'بانكوك، تايلند',
    weatherApiUrl: 'https://api.open-meteo.com/v1/forecast?latitude=13.7563&longitude=100.5018&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,rain,weather_code,wind_speed_10m,wind_direction_10m&timezone=Asia%2FBangkok',
    tmdUrl: 'https://www.tmd.go.th/en/weather/province/bangkok',
    quickMedia: {
      schedule: 'https://images.pexels.com/photos/20020757/pexels-photo-20020757.jpeg?auto=compress&cs=tinysrgb&w=1600',
      hotels: 'https://api.tourismthailand.org/upload/live/content_article/4-2928.png',
      restaurants: 'https://www.krua-apsorn.com/images/crab-omelette.png',
      cafes: 'https://factorybkk.com/cdn/shop/files/IMG_8628.png?v=1783580681',
      malls: 'https://dvgrmu8f1ixkk.cloudfront.net/gallery/exterior/content/3/29416e9f-cbae-49df-820a-b1c47d89c8de.jpeg',
      activities: 'https://www.kingpowermahanakhon.co.th/application/files/1917/7735/0328/glass-skywalk-night-view.jpg',
      budget: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=900&q=88',
      packing: 'https://images.unsplash.com/photo-1553531889-56cc480ac5cb?auto=format&fit=crop&w=900&q=88'
    }
  }
};

const CITY_DATASETS = {
  phuket: {
    schedule: scheduleData,
    hotels: hotelsData,
    restaurants: restaurantsData,
    cafes: cafesData,
    malls: mallsData,
    activities: activitiesData
  },
  bangkok: {
    schedule: bangkokScheduleData,
    hotels: bangkokHotelsData,
    restaurants: bangkokRestaurantsData,
    cafes: bangkokCafesData,
    malls: bangkokMallsData,
    activities: bangkokActivitiesData
  }
};

const defaultPacking = [
  "جواز السفر","تأشيرة تايلاند","تذاكر الطيران","حجز الفندق (مطبوع)",
  "الهاتف + الشاحن","باوربانك","محول كهرباء (تايلاند)","سماعات",
  "ملابس سباحة","ملابس خفيفة (صيف)","حذاء مريح","حذاء ماء",
  "نظارة شمس","كريم واقي SPF 50+","قبعة","مظلة صغيرة",
  "عدسات لاصقة + محلول","أدوية شخصية","مسكنات","لاصقات",
  "كاميرا / GoPro","بطاقات بنك","نقود (بات + دولار)","محفظة صغيرة",
];

// ============================================
// STATE & LOCALSTORAGE
// ============================================

const STORAGE_RECOVERY_KEYS = new Set();
const PHOTO_DATABASE_NAME = 'thailand-trip-guide';
const PHOTO_DATABASE_VERSION = 1;
const PHOTO_STORE_NAME = 'photos';
let storageWarningShown = false;
let photoDatabase;
let photoDatabasePromise;
let photoLibrary = [];
let photoLibraryPromise;
let activePhotoObjectUrls = [];

function cloneStoredValue(value) {
  return value === undefined ? undefined : JSON.parse(JSON.stringify(value));
}

function recordStorageRecovery(key) {
  STORAGE_RECOVERY_KEYS.add(key);
}

function readStoredText(key, fallback = '') {
  try {
    const value = localStorage.getItem(key);
    return value === null ? fallback : value;
  } catch {
    recordStorageRecovery(key);
    return fallback;
  }
}

function readStoredJson(key, fallback) {
  const rawValue = readStoredText(key, null);
  if (rawValue === null) return cloneStoredValue(fallback);
  try {
    return JSON.parse(rawValue);
  } catch {
    try { localStorage.removeItem(key); } catch { /* Storage may be unavailable. */ }
    recordStorageRecovery(key);
    return cloneStoredValue(fallback);
  }
}

function isPlainObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function safeText(value, maxLength = 500) {
  return typeof value === 'string' ? value.slice(0, maxLength) : '';
}

function sanitizeFavorites(value, key) {
  if (!Array.isArray(value)) {
    recordStorageRecovery(key);
    return [];
  }
  const favorites = value.filter(item => (
    isPlainObject(item) && /^[rma]$/.test(item.type) && /^[a-z0-9_-]+$/i.test(item.id)
  )).map(item => ({
    type: item.type,
    id: item.id,
    name: safeText(item.name, 120),
    sub: safeText(item.sub, 160)
  }));
  if (favorites.length !== value.length) recordStorageRecovery(key);
  return favorites;
}

function sanitizePacking(value, key) {
  if (value === null) return null;
  if (!Array.isArray(value)) {
    recordStorageRecovery(key);
    return null;
  }
  const packing = value.filter(item => isPlainObject(item) && typeof item.text === 'string' && item.text.trim()).map(item => ({
    text: safeText(item.text.trim(), 200),
    done: Boolean(item.done)
  }));
  if (packing.length !== value.length) recordStorageRecovery(key);
  return packing;
}

function sanitizeBudget(value, key) {
  if (!isPlainObject(value)) {
    recordStorageRecovery(key);
    return {};
  }
  const allowedFields = ['hotel', 'breakfast', 'food', 'cafe', 'shop', 'gifts', 'tour1', 'tour2', 'trans', 'emer'];
  return allowedFields.reduce((budget, field) => {
    const amount = Number(value[field]);
    if (Number.isFinite(amount) && amount >= 0) budget[field] = amount;
    return budget;
  }, {});
}

function sanitizeTextArray(value, key, maxLength = 200) {
  if (!Array.isArray(value)) {
    recordStorageRecovery(key);
    return [];
  }
  const values = value.filter(item => typeof item === 'string' && item.trim()).map(item => safeText(item.trim(), maxLength));
  if (values.length !== value.length) recordStorageRecovery(key);
  return [...new Set(values)];
}

function sanitizePhotos(value, key) {
  if (!Array.isArray(value)) {
    recordStorageRecovery(key);
    return [];
  }
  const photos = value.filter(isSafeUserPhoto);
  if (photos.length !== value.length) recordStorageRecovery(key);
  return photos;
}

function sanitizeSchedule(value, fallback, key) {
  if (value === null) return deepClone(fallback);
  if (!Array.isArray(value)) {
    recordStorageRecovery(key);
    return deepClone(fallback);
  }
  const schedule = value.filter(day => isPlainObject(day) && Array.isArray(day.items)).map((day, index) => ({
    day: Number.isInteger(day.day) && day.day > 0 ? day.day : index + 1,
    date: safeText(day.date, 80),
    city: safeText(day.city, 100),
    hotel: safeText(day.hotel, 120),
    items: day.items.filter(item => isPlainObject(item) && typeof item.title === 'string').map(item => ({
      time: safeText(item.time, 20),
      title: safeText(item.title, 160),
      sub: safeText(item.sub, 240),
      done: Boolean(item.done),
      estimatedCost: Number.isFinite(Number(item.estimatedCost)) && Number(item.estimatedCost) >= 0 ? Math.round(Number(item.estimatedCost)) : null,
      estimatedCostHigh: Number.isFinite(Number(item.estimatedCostHigh)) && Number(item.estimatedCostHigh) >= 0 ? Math.round(Number(item.estimatedCostHigh)) : null,
      costSource: item.costSource === 'ai' ? 'ai' : item.costSource === 'local' ? 'local' : ''
    }))
  }));
  if (schedule.length !== value.length) recordStorageRecovery(key);
  return schedule;
}

function sanitizeWeather(value, key) {
  if (!isPlainObject(value)) {
    recordStorageRecovery(key);
    return {};
  }
  const cleanWeather = {};
  const numericFields = ['temp', 'code', 'isDay', 'weatherHour', 'apparentTemp', 'precipitation', 'rain', 'humidity'];
  numericFields.forEach(field => {
    if (Number.isFinite(Number(value[field]))) cleanWeather[field] = Number(value[field]);
  });
  ['desc', 'icon', 'weatherTheme', 'timeOfDayTheme', 'wind', 'updatedAt', 'sourceName'].forEach(field => {
    if (typeof value[field] === 'string') cleanWeather[field] = safeText(value[field], 120);
  });
  if (typeof value.sourceUrl === 'string' && value.sourceUrl.startsWith('https://')) cleanWeather.sourceUrl = value.sourceUrl;
  cleanWeather.fetchError = Boolean(value.fetchError);
  return cleanWeather;
}

function sanitizeExchangeRate(value) {
  const rate = Number(value);
  return Number.isFinite(rate) && rate > 0 && rate <= 100000 ? rate : 110;
}

function sanitizeExpenses(value, key) {
  if (!Array.isArray(value)) {
    recordStorageRecovery(key);
    return [];
  }
  const expenses = value.filter(item => isPlainObject(item)).map(item => {
    const amount = Number(item.amount);
    if (!Number.isFinite(amount) || amount < 0 || amount > 10000000) return null;
    return {
      id: safeText(String(item.id || ''), 80) || `expense-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      amount: Math.round(amount * 100) / 100,
      category: safeText(item.category, 40),
      payment: safeText(item.payment, 40),
      note: safeText(item.note, 300),
      city: CITY_CONFIG[item.city] ? item.city : 'phuket',
      date: safeText(item.date, 20)
    };
  }).filter(Boolean);
  if (expenses.length !== value.length) recordStorageRecovery(key);
  return expenses;
}

const legacyFavorites = sanitizeFavorites(readStoredJson('tg_favorites', []), 'tg_favorites');
const savedPacking = sanitizePacking(readStoredJson('tg_packing', null), 'tg_packing');
const savedTheme = readStoredText('tg_theme', 'light');
const savedLanguage = readStoredText('tg_language', 'en');
const languagePreferenceInitialized = readStoredText('tg_language_initialized', '');
const savedCity = readStoredText('tg_city', '');
const savedSection = readStoredText('tg_section', 'home');
const validSections = new Set(['home', 'schedule', 'hotels', 'restaurants', 'cafes', 'malls', 'activities', 'budget', 'packing', 'favorites', 'notes', 'gallery', 'visited', 'search', 'more']);
const placesEndpoint = window.TRAVEL_APP_CONFIG?.placesEndpoint || '';
const PLACE_CACHE_TTL = 1000 * 60 * 60 * 24;

let state = {
  theme: savedTheme === 'dark' ? 'dark' : 'light',
  language: languagePreferenceInitialized ? (savedLanguage === 'ar' ? 'ar' : 'en') : 'en',
  selectedCity: CITY_CONFIG[savedCity] ? savedCity : '',
  currentSection: validSections.has(savedSection) ? savedSection : 'home',
  favorites: [],
  packing: savedPacking || defaultPacking.map(t => ({ text: t, done: false })),
  notes: safeText(readStoredText('tg_notes', ''), 20000),
  budget: sanitizeBudget(readStoredJson('tg_budget', {}), 'tg_budget'),
  budgetLimit: Math.max(0, Number(readStoredText('tg_budget_limit', '0')) || 0),
  expenses: sanitizeExpenses(readStoredJson('tg_expenses', []), 'tg_expenses'),
  weather: {
    temp: null,
    desc: 'جاري التحديث...',
    icon: '⛅',
    apparentTemp: null,
    precipitation: null,
    rain: null,
    humidity: null,
    wind: '',
    updatedAt: '',
    sourceName: 'Open-Meteo',
    sourceUrl: TMD_PHUKET_URL,
    fetchError: false,
    ...sanitizeWeather(readStoredJson('tg_weather', {}), 'tg_weather')
  },
  exchangeRate: sanitizeExchangeRate(readStoredText('tg_rate', '110')),
  photos: sanitizePhotos(readStoredJson('tg_photos', []), 'tg_photos'),
  schedule: [],
  visited: [],
};

function deepClone(value) {
  return JSON.parse(JSON.stringify(value));
}

function currentCityKey() {
  return state.selectedCity || 'phuket';
}

function cityScopedKey(base, cityKey = currentCityKey()) {
  return `${base}_${cityKey}`;
}

function getCityConfig(cityKey = currentCityKey()) {
  return CITY_CONFIG[cityKey] || CITY_CONFIG.phuket;
}

function getCityData(cityKey = currentCityKey()) {
  return CITY_DATASETS[cityKey] || CITY_DATASETS.phuket;
}

function loadCityScopedState(cityKey) {
  const cityData = getCityData(cityKey);
  const favoritesKey = cityScopedKey('tg_favorites', cityKey);
  const scheduleKey = cityScopedKey('tg_schedule', cityKey);
  const visitedKey = cityScopedKey('tg_visited', cityKey);
  const weatherKey = cityScopedKey('tg_weather', cityKey);
  const savedFavorites = readStoredJson(favoritesKey, null);
  state.favorites = savedFavorites === null
    ? (cityKey === 'phuket' ? deepClone(legacyFavorites) : [])
    : sanitizeFavorites(savedFavorites, favoritesKey);
  state.schedule = sanitizeSchedule(readStoredJson(scheduleKey, null), cityData.schedule, scheduleKey);
  state.visited = sanitizeTextArray(readStoredJson(visitedKey, []), visitedKey);
  state.weather = {
    temp: null,
    desc: 'جاري التحديث...',
    icon: '⛅',
    apparentTemp: null,
    precipitation: null,
    rain: null,
    humidity: null,
    wind: '',
    updatedAt: '',
    sourceName: 'Open-Meteo',
    sourceUrl: getCityConfig(cityKey).tmdUrl,
    fetchError: false,
    ...sanitizeWeather(readStoredJson(weatherKey, {}), weatherKey)
  };
}

function updateHomeCounts() {
  const cityData = getCityData();
  const scheduleCount = document.getElementById('homeScheduleCount');
  const hotelsCount = document.getElementById('homeHotelsCount');
  const restaurantsCount = document.getElementById('homeRestaurantsCount');
  const cafesCount = document.getElementById('homeCafesCount');
  const mallsCount = document.getElementById('homeMallsCount');
  const activitiesCount = document.getElementById('homeActivitiesCount');
  if (scheduleCount) scheduleCount.textContent = state.language === 'en' ? `${state.schedule.length} days` : `${state.schedule.length} أيام`;
  if (hotelsCount) hotelsCount.textContent = state.language === 'en' ? `${cityData.hotels.length} hotels` : `${cityData.hotels.length} فندق`;
  if (restaurantsCount) restaurantsCount.textContent = state.language === 'en' ? `${cityData.restaurants.length} restaurants` : `${cityData.restaurants.length} مطعم`;
  if (cafesCount) cafesCount.textContent = state.language === 'en' ? `${cityData.cafes.length} cafés` : `${cityData.cafes.length} مقهى`;
  if (mallsCount) mallsCount.textContent = state.language === 'en' ? `${cityData.malls.length} malls` : `${cityData.malls.length} مول`;
  if (activitiesCount) activitiesCount.textContent = state.language === 'en' ? `${cityData.activities.length} activities` : `${cityData.activities.length} نشاط`;
  updateHomeSummary();
}

function updateHomeSummary() {
  renderTodayCard();
  const cityConfig = getCityConfig();
  const title = document.getElementById('homeWelcomeTitle');
  const cityChip = document.getElementById('heroPlaceChip');
  const nextTitle = document.getElementById('nextStopTitle');
  const nextMeta = document.getElementById('nextStopMeta');
  const scheduledItems = state.schedule.flatMap(day => day.items.map(item => ({ day, item })));
  const nextItem = scheduledItems.find(({ item }) => !item.done);
  if (title) title.textContent = state.language === 'en' ? `Discover ${cityConfig.key === 'bangkok' ? 'Bangkok' : 'Phuket'} your way` : `اكتشف ${cityConfig.label} بطريقتك`;
  if (cityChip) cityChip.textContent = `${cityConfig.label} · Thailand · 2026`;
  if (!nextItem) {
    if (nextTitle) nextTitle.textContent = scheduledItems.length ? ui('أنجزت كل ما خططت له', 'You completed everything you planned') : ui('كل لحظة تستحق أن تُعاش', 'Every moment is worth living');
    if (nextMeta) nextMeta.textContent = scheduledItems.length ? ui('استمتع بما تبقى من رحلتك', 'Enjoy the rest of your trip') : ui('راجع خطتك واختر ما يناسب يومك', 'Review your plan and choose what suits your day');
    return;
  }
  if (nextTitle) nextTitle.textContent = nextItem.item.title;
  if (nextMeta) nextMeta.textContent = `${nextItem.day.date} · ${nextItem.item.time} · ${nextItem.item.sub}`;
}

function applyQuickMedia() {
  const cityConfig = getCityConfig();
  const media = cityConfig.quickMedia || {};
  document.querySelectorAll('.quick-card-icon[data-media]').forEach(el => {
    const key = el.getAttribute('data-media');
    const src = media[key];
    if (src) el.style.backgroundImage = `url('${src}')`;
  });

  const currencyVisual = document.getElementById('currencyVisual');
  if (currencyVisual && media.budget) {
    currencyVisual.style.backgroundImage = `url('${media.budget}')`;
  }
}

function applyCityIdentity() {
  const cityConfig = getCityConfig();
  const english = state.language === 'en';
  const cityName = english ? (cityConfig.key === 'bangkok' ? 'Bangkok' : 'Phuket') : cityConfig.label;
  const cityHeroTitle = english ? `${cityName} Trip 2026` : cityConfig.heroTitle;
  const cityHeroSubtitle = english ? (cityConfig.key === 'bangkok' ? 'City lights, markets, and skyline nights' : 'Islands, beaches, and unforgettable moments') : cityConfig.heroSubtitle;
  const cityWeatherLocation = english ? `${cityName}, Thailand` : cityConfig.weatherLocation;
  document.documentElement.setAttribute('data-city', cityConfig.key);
  document.title = english ? `TravelTrip — ${cityName}` : `TravelTrip — ${cityConfig.label}`;
  const heroTitle = document.getElementById('heroTitle');
  const heroSubtitle = document.getElementById('heroSubtitle');
  const heroImage = document.getElementById('heroImage');
  const weatherLocation = document.getElementById('weatherLocation');
  if (heroTitle) heroTitle.textContent = cityHeroTitle;
  if (heroSubtitle) heroSubtitle.textContent = cityHeroSubtitle;
  if (heroImage) {
    heroImage.src = cityConfig.heroImage;
    heroImage.alt = cityName;
  }
  if (weatherLocation) weatherLocation.textContent = cityWeatherLocation;
  applyQuickMedia();
  updateHomeCounts();
}

function notifyStorageIssue(message) {
  if (storageWarningShown) return;
  storageWarningShown = true;
  alert(message);
}

function writeStoredValue(key, value) {
  try {
    localStorage.setItem(key, value);
    return true;
  } catch {
    return false;
  }
}

function removeStoredValue(key) {
  try {
    localStorage.removeItem(key);
    return true;
  } catch {
    return false;
  }
}

function saveState() {
  const saved = [
    ['tg_theme', state.theme],
    ['tg_language', state.language],
    ['tg_language_initialized', '1'],
    ['tg_city', state.selectedCity || ''],
    ['tg_section', state.currentSection],
    [cityScopedKey('tg_favorites'), JSON.stringify(state.favorites)],
    ['tg_packing', JSON.stringify(state.packing)],
    ['tg_notes', state.notes],
    ['tg_budget', JSON.stringify(state.budget)],
    ['tg_budget_limit', String(state.budgetLimit)],
    ['tg_expenses', JSON.stringify(state.expenses)],
    [cityScopedKey('tg_weather'), JSON.stringify(state.weather)],
    ['tg_rate', String(state.exchangeRate)],
    [cityScopedKey('tg_schedule'), JSON.stringify(state.schedule)],
    [cityScopedKey('tg_visited'), JSON.stringify(state.visited)]
  ].every(([key, value]) => writeStoredValue(key, value));

  if (!saved) notifyStorageIssue('تعذر حفظ بعض التغييرات بسبب امتلاء أو عدم توفر مساحة التخزين المحلية.');
  return saved;
}

// ============================================
// THEME
// ============================================

const UI_TEXT = {
  ar: {
    home: 'الرئيسية', schedule: 'جدول الرحلة', hotels: 'الفنادق', restaurants: 'المطاعم', cafes: 'المقاهي', malls: 'التسوّق', activities: 'الأنشطة', budget: 'الميزانية', packing: 'التجهيز', favorites: 'المفضلة', notes: 'الملاحظات', gallery: 'معرض الصور', visited: 'الأماكن التي زرتها', search: 'البحث', more: 'المزيد', settings: 'الإعدادات والبيانات',
    day: 'اليوم', edit: 'تعديل', delete: 'حذف', addActivity: '+ نشاط', addDay: '+ يوم', tripKicker: 'خطتك، بتفاصيلها الجميلة', smartItinerary: 'مخطط الرحلة الذكي', itineraryTitle: 'خطة رحلتك', itineraryDescription: 'كل يوم، في مكانه ووقته المناسب.',
    hotels: 'الفنادق', restaurants: 'المطاعم', cafes: 'المقاهي', malls: 'المولات', activities: 'الأنشطة', more: 'المزيد', packing: 'تجهيز الرحلة', chooseCity: 'اختيار المدينة', theme: 'الوضع الداكن والفاتح', gallery: 'معرض الصور', notes: 'الملاحظات', visited: 'الأماكن التي زرتها', budget: 'الميزانية', placeDetails: 'تفاصيل المكان',
    searchHotels: 'ابحث في الفنادق...', searchRestaurants: 'ابحث في المطاعم...', searchCafes: 'ابحث في المقاهي...', searchAll: 'ابحث في كل الأقسام...'
  },
  en: {
    home: 'Home', schedule: 'Itinerary', hotels: 'Hotels', restaurants: 'Restaurants', cafes: 'Cafes', malls: 'Shopping', activities: 'Activities', budget: 'Budget', packing: 'Packing', favorites: 'Favorites', notes: 'Notes', gallery: 'Photo Gallery', visited: 'Visited Places', search: 'Search', more: 'More', settings: 'Settings & Data',
    day: 'Day', edit: 'Edit', delete: 'Delete', addActivity: '+ Activity', addDay: '+ Day', tripKicker: 'YOUR TRIP, BEAUTIFULLY PLANNED', smartItinerary: 'SMART ITINERARY', itineraryTitle: 'Your itinerary', itineraryDescription: 'Every day, in the right place at the right time.',
    chooseCity: 'Choose city', theme: 'Dark / Light mode', placeDetails: 'Place details',
    searchHotels: 'Search hotels...', searchRestaurants: 'Search restaurants...', searchCafes: 'Search cafes...', searchAll: 'Search every section...'
  }
};

function t(key) {
  return UI_TEXT[state.language][key] || UI_TEXT.ar[key] || key;
}

// Every new interface string should use this helper (Arabic first, English second).
function ui(arabic, english) {
  return state.language === 'en' ? english : arabic;
}

// App-provided itinerary content is shown in the selected language. User-created text
// is deliberately left unchanged when no approved translation exists.
const ENGLISH_SEEDED_CONTENT = {
  '15 أغسطس': '15 August', '16 أغسطس': '16 August', '17 أغسطس': '17 August', '18 أغسطس': '18 August', '19 أغسطس': '19 August',
  'باتونج': 'Patong', 'باتونج / كاثو': 'Patong / Kathu', 'جزيرة في في': 'Phi Phi Islands', 'Old Town / راواي': 'Old Town / Rawai',
  'الوصول والاستلام': 'Arrival & check-in', 'الفندق': 'Hotel', 'فطور في Commune': 'Breakfast at Commune', 'مقهى / مطعم': 'Café / Restaurant',
  'تسوق في Central Patong': 'Shopping at Central Patong', 'مول': 'Mall', 'استرخاء في Fuga Beach Club': 'Relax at Fuga Beach Club', 'شاطئ': 'Beach',
  'عشاء في Layali Beirut': 'Dinner at Layali Beirut', 'مطعم لبناني': 'Lebanese restaurant', 'جولة في Bangla Road': 'Walk along Bangla Road', 'حياة ليلية': 'Nightlife',
  'مغامرة في Big Buddha Hill': 'Adventure at Big Buddha Hill', 'غداء في Three Monkeys': 'Lunch at Three Monkeys', 'مطعم في الغابة': 'Restaurant in the forest',
  'مغامرة': 'Adventure', 'غروب في View Point Cafe': 'Sunset at View Point Cafe', 'مقهى بانورامي': 'Panoramic café', 'عشاء في La Gritta': 'Dinner at La Gritta', 'إيطالي فاخر': 'Fine Italian dining',
  'الانطلاق لـ Noah Phi Phi Island': 'Depart for Noah Phi Phi Island', 'رحلة بحرية': 'Boat trip', 'شاطئ ذا بيتش': 'The Beach', 'غداء على الجزيرة': 'Lunch on the island', 'بوفيه': 'Buffet',
  'سنوركل في Coral Island': 'Snorkelling at Coral Island', 'غوص حر': 'Snorkelling', 'العودة + استرخاء': 'Return + relax', 'Spa في الفندق': 'Hotel spa',
  'قهوة في Rush Coffee': 'Coffee at Rush Coffee', 'جولة في Phuket Old Town': 'Walk around Phuket Old Town', 'منطقة تراثية': 'Heritage district', 'سوق محلي': 'Local market',
  'غداء في Juicy Lucy': 'Lunch at Juicy Lucy', 'برجر': 'Burgers', 'قهوة في The 5th': 'Coffee at The 5th',
  'للتصوير': 'for photos', 'أشهر مكان للتصوير': 'A popular photo spot', 'تعلم الطبخ التايلندي': 'Learn Thai cooking', 'للغروب': 'for sunset', 'عشاء وداعي في Blu Saffron': 'Farewell dinner at Blu Saffron', 'عالمي فاخر': 'Fine international dining'
  , 'ميشلان جايد': 'Michelin Guide', 'جولة ثقافية': 'Cultural tour', 'معبد بوذا': 'Buddha temple', 'عشاء على النهر': 'Dinner on the river', 'مول فاخر': 'Luxury mall', 'تسوق شعبي': 'Local shopping', 'إطلالة المدينة': 'City views', 'الوصول وتسجيل الدخول': 'Arrival & check-in', 'تسوق وغداء': 'Shopping & lunch', 'نهر ومطاعم': 'River & restaurants'
  , 'يوم كامل': 'Full day', 'نصف يوم': 'Half day', 'ضمن الرحلة': 'Included in the tour', '1-2 ساعة': '1–2 hours', '2-3 ساعات': '2–3 hours', '3 ساعات': '3 hours', '2 ساعات': '2 hours', '4 ساعات': '4 hours',
  'نظارة شمس، كريم واقي، منشفة، كاميرا مقاومة للماء': 'Sunglasses, sunscreen, towel, waterproof camera', 'ملابس سباحة، واقي شمس، قبعة': 'Swimwear, sunscreen, hat', 'نقود فكة، كيس': 'Small cash, bag', 'شهية مفتوحة!': 'Bring your appetite!', 'ملابس رياضية، حذاء مغلق': 'Sportswear, closed shoes', 'كاميرا، نقود للهدايا': 'Camera, cash for gifts', 'كاميرا، واقي شمس': 'Camera, sunscreen', 'ملابس سباحة، سنوركل': 'Swimwear, snorkel', 'كاميرا': 'Camera', 'ملابس أنيقة': 'Smart attire',
  'حجز مسبق ضروري. يناسب الأزواج والعائلات.': 'Advance booking is essential. Suitable for couples and families.', 'يخت شراعي فاخر. غوص حر + سنوركل.': 'Luxury sailing yacht. Snorkelling and free diving.', 'تفاوض على الأسعار. أفضل وقت الصباح الباكر.': 'Negotiate prices. Early morning is best.', 'تعلم طبخ أشهر الأطباق التايلاندية.': 'Learn to cook popular Thai dishes.', 'مغامرة في الغابة والجبال. +8 سنوات.': 'Forest and mountain adventure. Ages 8+.', 'عرض ترفيهي ثقافي مذهل. ممتاز للعائلات.': 'Spectacular cultural entertainment. Excellent for families.', 'موقع فيلم The Beach. مغلق أحياناً للتجديد.': 'The Beach filming location. Sometimes closed for restoration.', '20 دقيقة بالقارب. رياضات مائية متوفرة.': 'Twenty minutes by boat. Water sports available.', 'أكبر زيبلاين في بوكيت. +4 سنوات.': 'Phuket’s largest zipline. Ages 4+.', 'أفضل وقت عند الغروب.': 'Best at sunset.', 'عشاء وإطلالة ليلية.': 'Dinner with night views.'
};

function localizeContent(value) {
  const text = String(value || '');
  if (state.language !== 'en') return text;
  if (ENGLISH_SEEDED_CONTENT[text]) return ENGLISH_SEEDED_CONTENT[text];
  const months = { 'يناير': 'January', 'فبراير': 'February', 'مارس': 'March', 'أبريل': 'April', 'مايو': 'May', 'يونيو': 'June', 'يوليو': 'July', 'أغسطس': 'August', 'سبتمبر': 'September', 'أكتوبر': 'October', 'نوفمبر': 'November', 'ديسمبر': 'December' };
  const translatedDate = text.replace(/(\d{1,2})\s+(يناير|فبراير|مارس|أبريل|مايو|يونيو|يوليو|أغسطس|سبتمبر|أكتوبر|نوفمبر|ديسمبر)/g, (_, day, month) => `${day} ${months[month]}`);
  const translatedUnits = translatedDate
    .replace(/(\d+)\s*دقائق?/g, '$1 min')
    .replace(/(\d+)\s*ساعات?/g, '$1 hours')
    .replace(/(\d+)\s*كم/g, '$1 km');
  const phrases = {
    'عالمي': 'International', 'إيطالي فاخر': 'Fine Italian', 'تايلاندي/عالمي': 'Thai / International', 'عشاء رومانسي': 'Romantic dinner', 'إيطالي': 'Italian', 'هندي': 'Indian', 'برجر أمريكي': 'American burgers', 'تركي': 'Turkish', 'لبناني': 'Lebanese', 'رومانسي': 'Romantic', 'برجر': 'Burgers', 'شاطئي': 'Beachfront',
    'إفطار/مقهى': 'Breakfast / café', 'هندي + مقهى': 'Indian + café', 'مقهى بانورامي': 'Panoramic café', 'قهوة مختصة': 'Specialty coffee', 'روستري ومقهى': 'Roastery & café', 'مقهى شاطئي': 'Beach café', 'مقهى فني': 'Art café', 'مخبز ومقهى': 'Bakery & café', 'مقهى وشاي': 'Café & tea',
    'ماركات عالمية، مطاعم منوعة': 'International brands, varied restaurants', 'مطاعم متنوعة في الطابق العلوي': 'Varied restaurants on the upper floor', 'ماركات عالمية وسينما': 'International brands and cinema', 'مطاعم فاخرة': 'Fine restaurants', 'هدايا تذكارية، ملابس محلية، مقاهي': 'Souvenirs, local clothing, cafés', 'مطاعم محلية وعالمية': 'Local and international restaurants', 'أكل شعبي، حرف يدوية، ملابس': 'Local food, handmade crafts, clothing', 'ستريت فود متنوع': 'Varied street food', 'فواكه استوائية، أعشاب، توابل، مأكولات بحرية': 'Tropical fruit, herbs, spices, seafood'
  };
  return phrases[translatedUnits] || translatedUnits.replace('Ma Doo Bua للتصوير', 'Ma Doo Bua for photos').replace('Three Bays للغروب', 'Three Bays for sunset');
}

const DOM_TRANSLATIONS = {
  'اختر وجهتك': 'Choose your destination', 'إلى أين تأخذك رحلتك؟': 'Where will your journey take you?', 'ابدأ باختيار الدولة، ثم اختر المدينة أو المنطقة التي تناسب خطتك.': 'Start by choosing a country, then select the city or region that fits your plan.',
  'بحر، جزر، ولحظات هادئة': 'Beaches, islands, and calm moments', 'مدينة نابضة لا تنام': 'A vibrant city that never sleeps', 'رحلتك القادمة': 'Your next trip', 'استعد لرحلة استثنائية': 'Get ready for an exceptional trip', 'خطتك جاهزة': 'Your plan is ready',
  'محطتك التالية': 'Your next stop', 'كل لحظة تستحق أن تُعاش': 'Every moment is worth living', 'راجع خطتك واختر ما يناسب يومك': 'Review your plan and choose what fits your day', 'جاري جلب الطقس الحقيقي من الأرصاد التايلندية...': 'Fetching live weather from Thai Meteorological Department...',
  'تحديث مباشر': 'Refresh live data', 'بحث شامل': 'Search everything', 'الفندق الحالي': 'Current hotel', 'حاسبة العملة': 'Currency calculator', 'قائمة الأمتعة': 'Packing list',
  'خطة رحلتك': 'Your itinerary', 'كل يوم، في مكانه ووقته المناسب.': 'Every day, in the right place and at the right time.', 'أيام': 'Days', 'محطات': 'Stops', 'منجز': 'Completed',
  'الفنادق': 'Hotels', 'المطاعم': 'Restaurants', 'المقاهي': 'Cafés', 'المولات': 'Malls', 'التسوّق': 'Shopping', 'الأنشطة': 'Activities', 'الميزانية': 'Budget', 'التجهيز': 'Packing', 'المفضلة': 'Favorites', 'الملاحظات': 'Notes', 'معرض الصور': 'Photo gallery', 'البحث': 'Search', 'المزيد': 'More', 'الإعدادات والبيانات': 'Settings & data',
  'الأماكن التي زرتها': 'Visited places', 'الوضع الداكن والفاتح': 'Dark / light mode', 'اختيار المدينة': 'Choose city', 'تفاصيل المكان': 'Place details', 'تجهيز الرحلة': 'Trip preparation', 'الرئيسية': 'Home', 'الجدول': 'Itinerary',
  'إضافة': 'Add', 'حفظ التغيير': 'Save changes', 'إلغاء': 'Cancel', 'تعديل': 'Edit', 'حذف': 'Delete', 'الوقت': 'Time', 'التاريخ': 'Date', 'المنطقة': 'Area', 'التفاصيل': 'Details', 'اسم النشاط': 'Activity name',
  'العنوان': 'Address', 'التقييم': 'Rating', 'المسافة': 'Distance', 'ساعات العمل': 'Opening hours', 'مغلق الآن': 'Closed now', 'مفتوح الآن': 'Open now', 'غير مؤكد': 'Not confirmed', 'حلال': 'Halal', 'غير حلال': 'Not halal', 'مجاني': 'Free',
  'مطعم تايلاندي': 'Thai restaurant', 'تايلاندي محلي': 'Local Thai', 'تايلاندي فاخر': 'Fine Thai dining', 'تركي/حلال': 'Turkish / halal', 'قهوة مختصة': 'Specialty coffee', 'حلويات ومقهى': 'Desserts & café', 'ماركات عالمية وسينما': 'International brands & cinema', 'مطاعم عالمية': 'International restaurants',
  'منطقة تراثية': 'Heritage district', 'مغامرة في الغابة والجبال.': 'Adventure in the forest and mountains.', 'عرض ترفيهي ثقافي مذهل. ممتاز للعائلات.': 'A spectacular cultural show, excellent for families.', 'تعلم طبخ أشهر الأطباق التايلاندية.': 'Learn to cook iconic Thai dishes.', '20 دقيقة بالقارب. رياضات مائية متوفرة.': 'Twenty minutes by boat. Water sports available.',
  'الفندق': 'Hotel', 'شاطئ': 'Beach', 'مول': 'Mall', 'مقهى بانورامي': 'Panoramic café', 'مطعم في الغابة': 'Restaurant in the forest', 'مطعم لبناني': 'Lebanese restaurant', 'مطعم عالمي فاخر': 'Fine international restaurant',
  'لم تزُر أي مكان بعد': 'You have not visited any place yet', 'لا توجد نتائج': 'No results found', 'جارٍ تحميل الصور...': 'Loading photos...', 'تصدير البيانات': 'Export data', 'استيراد البيانات': 'Import data',
  'الشرطة': 'Police', 'الإسعاف': 'Ambulance', 'الإطفاء': 'Fire department', 'الشرطة السياحية': 'Tourist police', 'الطوارئ': 'Emergency'
  , 'يوم': 'Day', 'ساعة': 'Hour', 'دقيقة': 'Minute', 'ثانية': 'Second', 'استكشف الرحلة': 'Explore your trip', 'بحث شامل': 'Search everything',
  'المال وتحويل العملات': 'Money & currency exchange', 'محول العملات والأموال': 'Money & currency converter', 'بات': 'Thai baht', 'سعر الصرف: 1 د.ك =': 'Exchange rate: 1 KWD =',
  'الإفطار': 'Breakfast', 'الأكل': 'Food', 'الهدايا': 'Gifts', 'الرحلات': 'Tours', 'جزيرة': 'Island', 'مواصلات': 'Transport', 'الإجمالي': 'Total',
  'قائمة التجهيز': 'Packing list', 'أضف عنصر جديد...': 'Add a new item...', 'لا توجد مفضلات': 'No favorites yet', 'اضغط على القلب ❤️ في أي مكان لإضافته هنا': 'Tap the heart on any place to add it here',
  'اكتب ملاحظاتك هنا...': 'Write your notes here...', '+ إضافة': '+ Add', 'نسخة احتياطية للرحلة': 'Trip backup', 'صدّر خطتك، الميزانية، المفضلة، والملاحظات لكل المدن. الصور تبقى محفوظة محلياً على هذا الجهاز.': 'Export your itinerary, budget, favorites, and notes for every city. Photos stay stored locally on this device.',
  'إعادة الضبط': 'Reset', 'يمكنك إعادة بيانات المدينة الحالية إلى الخطة الافتراضية، أو مسح بيانات التطبيق بالكامل من هذا الجهاز.': 'Restore the current city to its default plan, or erase all app data from this device.', 'إعادة ضبط المدينة': 'Reset city', 'مسح كل البيانات': 'Erase all data',
  'الأماكن التي تمت زيارتها': 'Places visited', 'نسبة الزيارة': 'Visit progress', '0 من 0 مكان': '0 of 0 places', 'أرقام الطوارئ': 'Emergency numbers', 'السفارة السعودية — بانكوك': 'Saudi Embassy — Bangkok', 'سفارة الكويت — بانكوك': 'Kuwait Embassy — Bangkok', 'الهاتف': 'Phone', 'الموقع': 'Website', 'اتصال': 'Call', 'خريطة': 'Map', 'فندقك الحالي': 'Your current hotel', 'الاسم': 'Name', 'نسخ': 'Copy',
  'الطقس الحقيقي': 'Live weather', 'مصدر TMD': 'TMD source', 'مشمس ☀️': 'Sunny', 'جاري التحديث...': 'Updating...', 'خطط لحظتك القادمة': 'Plan your next moment'
  , 'صحو': 'Clear', 'صحو ليلاً': 'Clear night', 'غيوم ليلية': 'Cloudy night', 'غائم جزئياً': 'Partly cloudy', 'غائم': 'Cloudy', 'ضباب': 'Fog', 'ضباب كثيف': 'Dense fog', 'رذاذ خفيف': 'Light drizzle', 'رذاذ': 'Drizzle', 'رذاذ كثيف': 'Heavy drizzle', 'مطر خفيف': 'Light rain', 'مطر': 'Rain', 'مطر غزير': 'Heavy rain', 'عاصفة رعدية': 'Thunderstorm', 'طقس متغير': 'Changing weather',
  'المحسوس': 'Feels like', 'الهطول': 'Precipitation', 'الرياح': 'Wind', 'الرطوبة': 'Humidity', 'المطر': 'Rain', 'كم/س': 'km/h', 'مم': 'mm', 'آخر تحديث حي:': 'Last live update:', 'عبر': 'via', 'تعذر تحديث القراءة الحية الآن، المعروض آخر قراءة محفوظة.': 'Live data could not be updated. Showing the last saved reading.', 'جاري جلب الطقس الحقيقي...': 'Fetching live weather...'
  , 'كل ما تحتاجه لرحلة مرتبة في مكان واحد.': 'Everything you need for a well-planned trip in one place.', 'إقامتك المثالية': 'Your ideal stay', 'تجارب مذاق مميزة': 'Memorable dining experiences', 'استراحة بطابع جميل': 'A beautiful break', 'تسوّق واكتشاف': 'Shop and discover', 'لحظات لا تُنسى': 'Unforgettable moments'
};
const ARABIC_DOM_TRANSLATIONS = Object.fromEntries(Object.entries(DOM_TRANSLATIONS).map(([arabic, english]) => [english, arabic]));

function translateUiValue(value, translations) {
  const exact = translations[value];
  if (exact) return exact;
  return Object.entries(translations)
    .sort(([left], [right]) => right.length - left.length)
    .reduce((result, [source, replacement]) => result.includes(source) ? result.replaceAll(source, replacement) : result, value);
}

function translateRenderedInterface(root = document.body) {
  if (!root) return;
  const translations = state.language === 'en' ? DOM_TRANSLATIONS : ARABIC_DOM_TRANSLATIONS;
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      const parent = node.parentElement;
      return parent && !['SCRIPT', 'STYLE', 'TEXTAREA'].includes(parent.tagName) && node.nodeValue.trim()
        ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
    }
  });
  const textNodes = [];
  while (walker.nextNode()) textNodes.push(walker.currentNode);
  textNodes.forEach(node => {
    const source = node.nodeValue.trim();
    const translated = translateUiValue(state.language === 'en' ? localizeContent(source) : source, translations);
    if (translated !== source) node.nodeValue = node.nodeValue.replace(source, translated);
  });
  root.querySelectorAll('input[placeholder], textarea[placeholder]').forEach(field => {
    const translated = translateUiValue(state.language === 'en' ? localizeContent(field.placeholder) : field.placeholder, translations);
    if (translated !== field.placeholder) field.placeholder = translated;
  });
}

function setUiText(selector, value) {
  const element = document.querySelector(selector);
  if (element) element.textContent = value;
}

function setTabLabel(tab, label) {
  const button = document.querySelector(`.tab-item[data-tab="${tab}"]`);
  if (!button) return;
  let labelElement = button.querySelector('.tab-label');
  if (!labelElement) {
    labelElement = document.createElement('span');
    labelElement.className = 'tab-label';
    [...button.childNodes].filter(node => node.nodeType === Node.TEXT_NODE).forEach(node => node.remove());
    button.appendChild(labelElement);
  }
  labelElement.textContent = label;
}

function applyLanguage() {
  const english = state.language === 'en';
  document.documentElement.lang = english ? 'en' : 'ar';
  document.documentElement.dir = english ? 'ltr' : 'rtl';
  document.title = english ? 'Thailand Travel Guide — 2026' : `دليل ${getCityConfig().label} — تايلند 2026`;
  const languageButton = document.getElementById('languageToggle');
  if (languageButton) {
    languageButton.textContent = english ? 'عربي' : 'EN';
    languageButton.setAttribute('aria-label', english ? 'Switch to Arabic' : 'Switch to English');
  }
  setUiText('#sec-hotels .section-header', t('hotels'));
  setUiText('#sec-restaurants .section-header', t('restaurants'));
  setUiText('#sec-cafes .section-header', t('cafes'));
  setUiText('#sec-malls .section-header', t('malls'));
  setUiText('#sec-activities .section-header', t('activities'));
  setUiText('#sec-more > .section-header', t('more'));
  setUiText('#placeDetailTitle', t('placeDetails'));
  setUiText('.itinerary-page-intro .itinerary-kicker', t('tripKicker'));
  setUiText('.itinerary-page-intro .section-header', t('itineraryTitle'));
  setUiText('.itinerary-page-intro p', t('itineraryDescription'));
  setUiText('.itinerary-page-intro .mini-btn', t('addDay'));
  setUiText('.itinerary-sheet .itinerary-kicker', t('smartItinerary'));
  setUiText('#weatherKicker', ui('الطقس المباشر', 'LIVE WEATHER'));
  setUiText('.home-directory-kicker', ui('أساسيات الرحلة', 'TRIP ESSENTIALS'));
  setUiText('.city-picker-kicker', ui('اختر وجهتك', 'Choose your destination'));
  setUiText('.city-picker-title', ui('إلى أين تأخذك رحلتك؟', 'Where will your journey take you?'));
  setUiText('.city-picker-sub', ui('ابدأ باختيار الدولة، ثم اختر المدينة أو المنطقة التي تناسب خطتك.', 'Start by choosing a country, then select the city or region that fits your plan.'));
  const cityCards = document.querySelectorAll('.city-card');
  if (cityCards[0]) { cityCards[0].querySelector('.name').textContent = ui('بوكيت', 'Phuket'); cityCards[0].querySelector('.meta').textContent = ui('بحر، جزر، ولحظات هادئة', 'Beaches, islands, and calm moments'); }
  if (cityCards[1]) { cityCards[1].querySelector('.name').textContent = ui('بانكوك', 'Bangkok'); cityCards[1].querySelector('.meta').textContent = ui('مدينة نابضة لا تنام', 'A vibrant city that never sleeps'); }
  const cityOptions = document.getElementById('cityOptions');
  if (cityOptions) cityOptions.classList.contains('app-hidden') ? showCountryLanding() : showCityOptions();
  document.getElementById('restSearch')?.setAttribute('placeholder', t('searchRestaurants'));
  document.getElementById('cafeSearch')?.setAttribute('placeholder', t('searchCafes'));
  document.getElementById('globalSearch')?.setAttribute('placeholder', t('searchAll'));
  const moreLabels = [t('hotels'), t('restaurants'), t('cafes'), t('malls'), t('activities'), t('budget'), t('packing'), t('visited'), t('gallery'), t('notes'), t('theme'), t('chooseCity'), t('settings')];
  document.querySelectorAll('#sec-more .ios-list-title').forEach((element, index) => { if (moreLabels[index]) element.textContent = moreLabels[index]; });
  setTabLabel('home', ui('الرئيسية', 'Home'));
  setTabLabel('schedule', ui('الجدول', 'Itinerary'));
  setTabLabel('search', ui('البحث', 'Search'));
  setTabLabel('favorites', ui('المفضلة', 'Favorites'));
  setTabLabel('more', ui('المزيد', 'More'));
  applyCityIdentity();
  setCityBadge();
  document.getElementById('navTitle').textContent = t(state.currentSection);
  showSection(state.currentSection);
  translateRenderedInterface();
}

function toggleLanguage() {
  state.language = state.language === 'ar' ? 'en' : 'ar';
  saveState();
  applyLanguage();
}

function applyTheme() {
  document.documentElement.setAttribute('data-theme', state.theme);
}
function toggleTheme() {
  state.theme = state.theme === 'dark' ? 'light' : 'dark';
  applyTheme();
  saveState();
}

// ============================================
// NAVIGATION
// ============================================

function showSection(name) {
  state.currentSection = name;
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  document.getElementById('sec-' + name)?.classList.add('active');
  document.getElementById('navTitle').textContent = t(name);

  document.querySelectorAll('.tab-item').forEach(t => t.classList.remove('active'));
  const tabMap = { home:'home', schedule:'schedule', search:'search', favorites:'favorites', more:'more' };
  if (tabMap[name]) {
    document.querySelector(`.tab-item[data-tab="${tabMap[name]}"]`)?.classList.add('active');
  }

  if (name === 'schedule') renderSchedule();
  if (name === 'hotels') renderHotels();
  if (name === 'restaurants') renderRestaurants();
  if (name === 'cafes') renderCafes();
  if (name === 'malls') renderMalls();
  if (name === 'activities') renderActivities();
  if (name === 'budget') loadBudget();
  if (name === 'packing') renderPacking();
  if (name === 'favorites') renderFavorites();
  if (name === 'visited') renderVisited();
  if (name === 'gallery') renderGallery();

  window.scrollTo({ top: 0, behavior: 'smooth' });
  saveState();
}

function goBack() { showSection('home'); }

function setCityBadge() {
  const badge = document.getElementById('cityBadge');
  if (!badge) return;
  const english = state.language === 'en';
  if (state.selectedCity === 'phuket') badge.textContent = english ? 'Phuket' : 'بوكيت';
  else if (state.selectedCity === 'bangkok') badge.textContent = english ? 'Bangkok' : 'بانكوك';
  else badge.textContent = english ? 'Not selected' : 'غير محدد';
}

function openCityPicker(resetSelection = false) {
  if (resetSelection) saveState();
  document.getElementById('appContainer').classList.add('app-hidden');
  document.getElementById('cityPicker').classList.add('active');
  showCountryLanding();
}

function showCountryLanding() {
  const options = document.getElementById('cityOptions');
  const note = document.getElementById('cityPickerNote');
  const entryButton = document.getElementById('countryEntryBtn');
  if (options) options.classList.add('app-hidden');
  if (entryButton) entryButton.innerHTML = ui('استكشف تايلند <span>←</span>', 'Explore Thailand <span>→</span>');
  if (note) note.textContent = ui('اختر تايلند أولاً، ثم حدّد المنطقة التي تناسب رحلتك.', 'Choose Thailand first, then select the region that suits your trip.');
}

function showCityOptions() {
  const options = document.getElementById('cityOptions');
  const note = document.getElementById('cityPickerNote');
  const entryButton = document.getElementById('countryEntryBtn');
  if (options) options.classList.remove('app-hidden');
  if (entryButton) entryButton.innerHTML = ui('العودة لاختيار دولة <span>→</span>', 'Back to country selection <span>←</span>');
  if (note) note.textContent = ui('اختر منطقتك في تايلند.', 'Choose your region in Thailand.');
}

function handleCountryEntry() {
  const options = document.getElementById('cityOptions');
  if (options?.classList.contains('app-hidden')) showCityOptions();
  else showCountryLanding();
}

function openCityOptionsOnly() {
  saveState();
  document.getElementById('appContainer').classList.add('app-hidden');
  document.getElementById('cityPicker').classList.add('active');
  showCityOptions();
}

function handleCityPickerShortcut() {
  const cityPicker = document.getElementById('cityPicker');
  const appContainer = document.getElementById('appContainer');
  const cityOptions = document.getElementById('cityOptions');

  // First priority: if user is inside any section, go back to Home first.
  if (!cityPicker.classList.contains('active') && state.currentSection !== 'home') {
    showSection('home');
    return;
  }

  // From Home: first press opens city options directly.
  if (!cityPicker.classList.contains('active')) {
    openCityOptionsOnly();
    return;
  }

  // While the city list is open, go back to the country list first.
  if (!cityOptions.classList.contains('app-hidden')) {
    showCountryLanding();
    return;
  }

  // While the country list is open, return to the app home.
  cityPicker.classList.remove('active');
  appContainer.classList.remove('app-hidden');
  showSection('home');
}

function enterCity(city) {
  state.selectedCity = city;
  loadCityScopedState(city);
  applyCityIdentity();
  saveState();
  setCityBadge();
  document.getElementById('cityPicker').classList.remove('active');
  document.getElementById('appContainer').classList.remove('app-hidden');
  renderWeather();
  showSection(state.currentSection || 'home');
  refreshWeather();
}

function selectCity(city) {
  const note = document.getElementById('cityPickerNote');
  if (!CITY_CONFIG[city]) {
    if (note) note.textContent = 'هذا الخيار غير متاح حالياً.';
    return;
  }
  if (note) note.textContent = `تم اختيار ${CITY_CONFIG[city].label}، جاري فتح الدليل...`;
  enterCity(city);
}

// ============================================
// COUNTDOWN
// ============================================

function updateCountdown() {
  const cityConfig = getCityConfig();
  const target = new Date(cityConfig.tripDate || TRIP_DATE);
  const now = new Date();
  const diff = target - now;
  if (diff <= 0) {
    document.getElementById('cd-days').textContent = '0';
    document.getElementById('cd-hours').textContent = '0';
    document.getElementById('cd-minutes').textContent = '0';
    document.getElementById('cd-seconds').textContent = '0';
    return;
  }
  const d = Math.floor(diff / (1000*60*60*24));
  const h = Math.floor((diff / (1000*60*60)) % 24);
  const m = Math.floor((diff / (1000*60)) % 60);
  const s = Math.floor((diff / 1000) % 60);
  document.getElementById('cd-days').textContent = d;
  document.getElementById('cd-hours').textContent = h;
  document.getElementById('cd-minutes').textContent = m;
  document.getElementById('cd-seconds').textContent = s;
}
setInterval(updateCountdown, 1000);
updateCountdown();

// ============================================
// WEATHER
// ============================================

function windDirectionToArabic(deg) {
  if (deg === null || deg === undefined || Number.isNaN(deg)) return '';
  const directions = ['شمال', 'شمال شرقي', 'شرق', 'جنوب شرقي', 'جنوب', 'جنوب غربي', 'غرب', 'شمال غربي'];
  return directions[Math.round(deg / 45) % 8];
}

function mapWeatherCodeToArabic(code, isDay) {
  const night = isDay === 0;
  const mapping = {
    0: { desc: night ? 'صحو ليلاً' : 'صحو', icon: night ? '🌙' : '☀️' },
    1: { desc: night ? 'غيوم ليلية' : 'غائم جزئياً', icon: night ? '☁️' : '🌤️' },
    2: { desc: night ? 'غيوم ليلية' : 'غائم جزئياً', icon: '☁️' },
    3: { desc: night ? 'غيوم ليلية' : 'غائم', icon: '☁️' },
    45: { desc: 'ضباب', icon: '🌫️' },
    48: { desc: 'ضباب كثيف', icon: '🌫️' },
    51: { desc: 'رذاذ خفيف', icon: '🌦️' },
    53: { desc: 'رذاذ', icon: '🌦️' },
    55: { desc: 'رذاذ كثيف', icon: '🌧️' },
    61: { desc: 'مطر خفيف', icon: '🌦️' },
    63: { desc: 'مطر', icon: '🌧️' },
    65: { desc: 'مطر غزير', icon: '🌧️' },
    66: { desc: 'مطر متجمد خفيف', icon: '🌨️' },
    67: { desc: 'مطر متجمد', icon: '🌨️' },
    71: { desc: 'ثلوج خفيفة', icon: '🌨️' },
    73: { desc: 'ثلوج', icon: '🌨️' },
    75: { desc: 'ثلوج كثيفة', icon: '❄️' },
    80: { desc: 'زخات خفيفة', icon: '🌦️' },
    81: { desc: 'زخات مطر', icon: '🌧️' },
    82: { desc: 'زخات غزيرة', icon: '⛈️' },
    95: { desc: 'عاصفة رعدية', icon: '⛈️' },
    96: { desc: 'عاصفة مع برد', icon: '⛈️' },
    99: { desc: 'عاصفة قوية مع برد', icon: '⛈️' }
  };
  return mapping[code] || { desc: 'طقس متغير', icon: '🌤️' };
}

function getWeatherTheme(code, isDay) {
  if ([95, 96, 99].includes(code)) return 'storm';
  if ([51, 53, 55, 61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return 'rain';
  if ([71, 73, 75].includes(code)) return 'mist';
  if ([45, 48].includes(code)) return 'mist';
  if ([1, 2, 3].includes(code)) return isDay === 0 ? 'cloudy-night' : 'cloudy';
  if (code === 0 && isDay === 0) return 'night';
  if (code === 0) return 'sunny';
  return isDay === 0 ? 'night' : 'cloudy';
}

function formatWeatherTemp(value) {
  if (!Number.isFinite(Number(value))) return '--';
  return Number(value).toFixed(1).replace(/\.0$/, '');
}

function formatWeatherUpdatedAt(rawValue) {
  if (!rawValue) return '';
  const withZone = /([zZ]|[+\-]\d{2}:\d{2})$/.test(rawValue) ? rawValue : `${rawValue}+07:00`;
  const date = new Date(withZone);
  if (Number.isNaN(date.getTime())) return String(rawValue).replace('T', ' ');
  return new Intl.DateTimeFormat('ar-KW', {
    timeZone: 'Asia/Bangkok',
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23'
  }).format(date);
}

function getBangkokHourNow() {
  const hourText = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Bangkok',
    hour: '2-digit',
    hourCycle: 'h23'
  }).format(new Date());
  return parseInt(hourText, 10);
}

function parseWeatherHour(rawValue) {
  if (!rawValue || typeof rawValue !== 'string') return null;
  const match = rawValue.match(/T(\d{2}):/);
  return match ? parseInt(match[1], 10) : null;
}

function getTimeOfDayTheme(hour, isDay) {
  const safeHour = Number.isFinite(hour) ? hour : getBangkokHourNow();
  if (isDay === 0 || safeHour < 5 || safeHour >= 18) return 'night';
  if (safeHour < 11) return 'morning';
  return 'noon';
}

function parseOpenMeteoWeather(payload) {
  const current = payload?.current;
  if (!current || typeof current.temperature_2m !== 'number') {
    throw new Error('Open-Meteo current weather not found');
  }

  const mapped = mapWeatherCodeToArabic(current.weather_code, current.is_day);
  const weatherTheme = getWeatherTheme(current.weather_code, current.is_day);
  const weatherHour = parseWeatherHour(current.time);
  const timeOfDayTheme = getTimeOfDayTheme(weatherHour, current.is_day);
  const direction = windDirectionToArabic(current.wind_direction_10m);
  const windParts = [];
  if (direction) windParts.push(direction);
  if (typeof current.wind_speed_10m === 'number') windParts.push(`${current.wind_speed_10m} كم/س`);

  return {
    temp: current.temperature_2m,
    code: current.weather_code,
    isDay: current.is_day,
    weatherHour,
    timeOfDayTheme,
    weatherTheme,
    desc: mapped.desc,
    icon: mapped.icon,
    apparentTemp: typeof current.apparent_temperature === 'number' ? current.apparent_temperature : null,
    precipitation: typeof current.precipitation === 'number' ? current.precipitation : null,
    rain: typeof current.rain === 'number' ? current.rain : null,
    humidity: typeof current.relative_humidity_2m === 'number' ? current.relative_humidity_2m : null,
    wind: windParts.join(' - '),
    updatedAt: formatWeatherUpdatedAt(current.time),
    sourceName: 'Open-Meteo',
    sourceUrl: TMD_PHUKET_URL,
    fetchError: false
  };
}

function renderWeather() {
  const weather = state.weather || {};
  const cityConfig = getCityConfig();
  const weatherCard = document.getElementById('weatherCard');
  const homeSection = document.getElementById('sec-home');
  const temp = formatWeatherTemp(weather.temp);
  const weatherTheme = weather.weatherTheme || getWeatherTheme(weather.code, weather.isDay);
  const timeOfDayTheme = weather.timeOfDayTheme || getTimeOfDayTheme(weather.weatherHour, weather.isDay);

  if (weatherCard) {
    weatherCard.classList.remove('weather-sunny', 'weather-cloudy', 'weather-cloudy-night', 'weather-rain', 'weather-storm', 'weather-mist', 'weather-night');
    weatherCard.classList.add(`weather-${weatherTheme}`);
    weatherCard.classList.remove('tod-morning', 'tod-noon', 'tod-night');
    weatherCard.classList.add(`tod-${timeOfDayTheme}`);
  }

  if (homeSection) {
    homeSection.classList.remove('home-weather-sunny', 'home-weather-cloudy', 'home-weather-cloudy-night', 'home-weather-rain', 'home-weather-storm', 'home-weather-mist', 'home-weather-night');
    homeSection.classList.add(`home-weather-${weatherTheme}`);
    homeSection.classList.remove('home-tod-morning', 'home-tod-noon', 'home-tod-night');
    homeSection.classList.add(`home-tod-${timeOfDayTheme}`);
  }

  document.getElementById('weatherTemp').innerHTML = temp + '<span>°</span>';
  document.getElementById('weatherDesc').textContent = weather.desc || 'جاري التحديث...';
  document.getElementById('weatherIcon').textContent = weather.icon || '⛅';
  document.getElementById('weatherSourceLink').href = weather.sourceUrl || cityConfig.tmdUrl;
  document.getElementById('weatherSourceLink').textContent = `TMD ${cityConfig.label}`;
  document.getElementById('weatherMeta').textContent = weather.fetchError
    ? 'تعذر تحديث القراءة الحية الآن، المعروض آخر قراءة محفوظة.'
    : (weather.updatedAt ? `آخر تحديث حي: ${weather.updatedAt} عبر ${weather.sourceName}` : 'جاري جلب الطقس الحقيقي...');

  const stats = [];
  if (weather.apparentTemp !== null && weather.apparentTemp !== undefined) stats.push(`المحسوس ${formatWeatherTemp(weather.apparentTemp)}°`);
  if (weather.precipitation !== null && weather.precipitation !== undefined) stats.push(`الهطول ${weather.precipitation} مم`);
  if (weather.rain !== null && weather.rain !== undefined) stats.push(`المطر ${weather.rain} مم`);
  if (weather.humidity !== null && weather.humidity !== undefined) stats.push(`الرطوبة ${weather.humidity}%`);
  if (weather.wind) stats.push(`الرياح ${weather.wind}`);
  document.getElementById('weatherStats').innerHTML = stats.map(item => `<span class="weather-pill">${item}</span>`).join('');
}

async function refreshWeather() {
  const refreshBtn = document.getElementById('weatherRefreshBtn');
  if (refreshBtn) {
    refreshBtn.disabled = true;
    refreshBtn.textContent = 'جاري التحديث...';
  }
  document.getElementById('weatherMeta').textContent = 'جاري التحديث الحي...';
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 9000);
    const response = await fetch(getCityConfig().weatherApiUrl, { cache: 'no-store', signal: controller.signal });
    clearTimeout(timeout);
    if (!response.ok) throw new Error('Weather request failed');
    const payload = await response.json();
    const weather = parseOpenMeteoWeather(payload);
    weather.sourceUrl = getCityConfig().tmdUrl;
    state.weather = { ...state.weather, ...weather, fetchError: false };
    saveState();
    renderWeather();
  } catch (error) {
    state.weather = { ...state.weather, fetchError: true };
    saveState();
    renderWeather();
  } finally {
    if (refreshBtn) {
      refreshBtn.disabled = false;
      refreshBtn.textContent = 'تحديث مباشر';
    }
  }
}

function updateWeather() {
  refreshWeather();
}

function getPhuketNowParts() {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Bangkok',
    weekday: 'long',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23'
  }).formatToParts(new Date());

  const values = Object.fromEntries(parts.map(part => [part.type, part.value]));
  const weekdays = {
    Sunday: 0,
    Monday: 1,
    Tuesday: 2,
    Wednesday: 3,
    Thursday: 4,
    Friday: 5,
    Saturday: 6
  };

  return {
    weekday: weekdays[values.weekday] ?? 0,
    minutes: (parseInt(values.hour, 10) * 60) + parseInt(values.minute, 10)
  };
}

function timeStringToMinutes(value) {
  const match = (value || '').match(/^(\d{1,2}):(\d{2})$/);
  if (!match) return null;
  return (parseInt(match[1], 10) * 60) + parseInt(match[2], 10);
}

function formatMinutesToTime(value) {
  const hours = Math.floor(value / 60) % 24;
  const minutes = value % 60;
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
}

function getOpenStatus(hoursText) {
  const raw = (hoursText || '').trim();
  const now = getPhuketNowParts();
  const rangeMatch = raw.match(/(\d{1,2}:\d{2})\s*-\s*(\d{1,2}:\d{2})/);
  const sundayOnly = /(الأحد فقط|فقط يوم الأحد|Sunday\s+only)/i.test(raw);
  const alwaysOpen = /^مفتوح/.test(raw) && !sundayOnly;

  if (alwaysOpen) {
    return {
      isOpen: true,
      className: 'tag-green',
      label: 'Open Now',
      detail: raw || 'Available all day'
    };
  }

  if (rangeMatch) {
    const openMinutes = timeStringToMinutes(rangeMatch[1]);
    const closeMinutes = timeStringToMinutes(rangeMatch[2]);
    if (openMinutes === null || closeMinutes === null) {
      return { isOpen: null, className: 'tag-gray', label: 'Hours Unclear', detail: raw };
    }

    if (sundayOnly && now.weekday !== 0) {
      return {
        isOpen: false,
        className: 'tag-red',
        label: 'Closed Today',
        detail: `Opens Sunday ${rangeMatch[1]} - ${rangeMatch[2]}`
      };
    }

    const overnight = closeMinutes <= openMinutes;
    const isOpen = overnight
      ? now.minutes >= openMinutes || now.minutes < closeMinutes
      : now.minutes >= openMinutes && now.minutes < closeMinutes;

    return {
      isOpen,
      className: isOpen ? 'tag-green' : 'tag-red',
      label: isOpen ? 'Open Now' : 'Closed Now',
      detail: isOpen ? `Closes ${formatMinutesToTime(closeMinutes)}` : `Opens ${formatMinutesToTime(openMinutes)}`
    };
  }

  if (/مفتوح/.test(raw)) {
    return {
      isOpen: true,
      className: 'tag-green',
      label: 'Open Now',
      detail: raw
    };
  }

  return {
    isOpen: null,
    className: 'tag-gray',
    label: 'Check Hours',
    detail: raw || 'No business hours listed'
  };
}

function refreshBusinessStatus() {
  if (state.currentSection === 'restaurants') renderRestaurants(document.getElementById('restSearch')?.value || '');
  if (state.currentSection === 'cafes') renderCafes(document.getElementById('cafeSearch')?.value || '');
  if (state.currentSection === 'malls') renderMalls();
}

// ============================================
// PROGRESS
// ============================================

function updateProgress() {
  const total = state.packing.length;
  const done = state.packing.filter(p => p.done).length;
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;
  const circumference = 2 * Math.PI * 28;
  const offset = circumference - (pct / 100) * circumference;
  document.getElementById('progressRing').style.strokeDashoffset = offset;
  document.getElementById('progressText').textContent = pct + '%';
  document.getElementById('progressSub').textContent = `${done} of ${total} completed`;
}

// ============================================
// SCHEDULE
// ============================================

function renderSchedule() {
  const container = document.getElementById('scheduleList');
  const allItems = state.schedule.flatMap(day => day.items);
  const doneItems = allItems.filter(item => item.done).length;
  document.getElementById('scheduleDaysStat').textContent = state.schedule.length;
  document.getElementById('scheduleActivitiesStat').textContent = allItems.length;
  document.getElementById('scheduleDoneStat').textContent = allItems.length ? `${Math.round((doneItems / allItems.length) * 100)}%` : '0%';
  container.innerHTML = state.schedule.map((day, di) => `
    <div class="day-card">
      <div class="day-header">
        <div class="day-header-top">
          <div>
            <h3>${t('day')} ${escapeHtml(day.day)} — ${escapeHtml(localizeContent(day.date))}</h3>
            <p>${escapeHtml(localizeContent(day.city))} • ${escapeHtml(localizeContent(day.hotel))}</p>
          </div>
          <div class="day-header-actions">
            <button class="mini-btn gray" type="button" onclick="editScheduleDay(${di})">${t('edit')}</button>
            <button class="mini-btn" type="button" onclick="addScheduleItem(${di})">${t('addActivity')}</button>
            <button class="mini-btn gray" type="button" onclick="deleteScheduleDay(${di})">${t('delete')}</button>
          </div>
        </div>
      </div>
      <div class="day-body">
        ${day.items.map((item, ii) => `
          <div class="day-item">
            <div class="day-content">
              <div class="day-time">${escapeHtml(item.time)}</div>
              <div class="day-content-title">${escapeHtml(localizeContent(item.title))}</div>
              <div class="day-content-sub">${escapeHtml(localizeContent(item.sub))}</div>
              ${item.estimatedCost !== null && item.estimatedCost !== undefined ? `<div class="day-item-price">${ui('تقريباً', 'Estimated')} ${Number(item.estimatedCost).toLocaleString()}${item.estimatedCostHigh && item.estimatedCostHigh !== item.estimatedCost ? `–${Number(item.estimatedCostHigh).toLocaleString()}` : ''} THB</div>` : ''}
              <div class="day-item-actions">
                <button class="mini-btn gray" type="button" onclick="editScheduleItem(${di},${ii})">${t('edit')}</button>
                <button class="mini-btn gray" type="button" onclick="deleteScheduleItem(${di},${ii})">${t('delete')}</button>
              </div>
            </div>
            <div class="day-check ${item.done ? 'checked' : ''}" onclick="toggleSchedule(${di},${ii})"></div>
          </div>
        `).join('')}
      </div>
    </div>
  `).join('');
  renderTripMap();
  refreshTravelAssistant();
  updateHomeSummary();
}

function renderTodayCard() {
  const meta = document.getElementById('todayMeta'), list = document.getElementById('todayItems'); if (!meta || !list) return;
  const today = new Date(); const day = state.schedule.find(entry => scheduleDateToIso(entry.date) === today.toISOString().slice(0,10));
  meta.textContent = `${today.toLocaleDateString(state.language === 'en' ? 'en-GB' : 'ar-KW')} · ${state.language === 'en' ? getCityConfig().key : getCityConfig().label}`;
  if (!day?.items?.length) { list.innerHTML = `<div class="today-empty">لا توجد أنشطة مضافة لهذا اليوم <button type="button" onclick="addScheduleDay()">إضافة نشاط</button></div>`; return; }
  list.innerHTML = day.items.slice().sort((a,b) => a.time.localeCompare(b.time)).map(item => `<div class="today-item"><b>${escapeHtml(item.time)}</b><span>${escapeHtml(item.title)}<small>${escapeHtml(item.sub || '')}</small></span><button type="button" onclick="openMap('${escapeHtml(item.title)}')">خريطة</button></div>`).join('');
}
function startMyDay() { const first = getPlannedStops().find(item => !item.done); alert(first ? `طقس اليوم: ${state.weather.desc || 'جارٍ التحميل'}\nأول نشاط: ${first.title} — ${first.time}\nخذ معك: ${state.weather.rain > 0 ? 'مظلة خفيفة' : 'ماء وواقي شمس'}` : 'أضف نشاطاً أولاً إلى جدولك.'); }
function showRainPlan() { const indoor = [...malls, ...cafes, ...restaurants].slice(0,3); alert(`الخطة البديلة للمطر:\n${indoor.map(item => `• ${item.name}`).join('\n')}\nلن يتم تغيير جدولك إلا بعد اختيارك.`); }
function showNowSuggestions() { const picks = [...restaurants, ...cafes, ...malls, ...activities].filter(item => getOpenStatus(item.hours || '').isOpen !== false).sort((a,b) => (b.rating || 0) - (a.rating || 0)).slice(0,5); alert(`وين نروح الحين؟\n${picks.map(item => `• ${item.name} — ${item.type || item.company || 'مكان مقترح'}`).join('\n')}`); }

function getPlannedStops() {
  return state.schedule.flatMap(day => day.items.map(item => ({ ...item, day: day.day }))).filter(item => item.title);
}

function refreshTripMap() {
  const cityName = state.selectedCity === 'bangkok' ? 'Bangkok' : 'Phuket';
  const stops = getPlannedStops();
  const frame = document.getElementById('tripMapFrame');
  const chips = document.getElementById('tripMapChips');
  const meta = document.getElementById('tripMapMeta');
  if (!frame || !chips || !meta) return;
  const featured = stops.filter(stop => !stop.done).slice(0, 5);
  const query = featured.length ? `${featured[0].title}, ${cityName}, Thailand` : `${cityName}, Thailand`;
  frame.src = `https://www.google.com/maps?q=${encodeURIComponent(query)}&output=embed`;
  chips.innerHTML = featured.length
    ? featured.map(stop => `<button type="button" data-map-stop="${escapeHtml(stop.title)}">${escapeHtml(stop.title)}</button>`).join('')
    : `<span>${ui('أضف محطة إلى الجدول لتظهر هنا.', 'Add a stop to your itinerary to see it here.')}</span>`;
  chips.querySelectorAll('[data-map-stop]').forEach(button => button.addEventListener('click', () => {
    frame.src = `https://www.google.com/maps?q=${encodeURIComponent(`${button.dataset.mapStop}, ${cityName}, Thailand`)}&output=embed`;
  }));
  meta.textContent = featured.length
    ? ui(`${featured.length} محطات قادمة — اضغط أي محطة لعرضها.`, `${featured.length} upcoming stops — tap a stop to view it.`)
    : ui('خريطة تفاعلية جاهزة لرحلتك.', 'Your interactive trip map is ready.');
}

function getAssistantSuggestion() {
  const cityName = state.selectedCity === 'bangkok' ? 'Bangkok' : 'Phuket';
  const weather = state.weather || {};
  const planned = getPlannedStops();
  const catalog = [...activities, ...restaurants, ...cafes, ...malls];
  const alreadyPlanned = new Set(planned.map(item => item.title));
  const pool = catalog.filter(item => !alreadyPlanned.has(item.name));
  const rainy = Number(weather.rain) > 0 || [51, 53, 55, 61, 63, 65, 80, 81, 82, 95].includes(Number(weather.code));
  const preferred = rainy ? [...malls, ...cafes, ...restaurants] : [...activities, ...restaurants, ...cafes, ...malls];
  const place = preferred.find(item => !alreadyPlanned.has(item.name)) || pool[0];
  const weatherHint = rainy
    ? ui('الطقس يميل للمطر، لذلك رشّحت لك محطة مريحة داخلية أو قريبة.', 'Rain is likely, so this suggestion is comfortable indoors or nearby.')
    : ui('الجو مناسب للاستكشاف، لذلك رشّحت لك محطة تضيف تجربة جديدة ليومك.', 'The weather suits exploring, so this adds a fresh experience to your day.');
  return { place, text: place ? `${weatherHint} ${ui(`اقتراحي في ${cityName}: ${place.name}.`, `My ${cityName} pick: ${place.name}.`)}` : ui('أضف بيانات إلى خطتك لنصنع اقتراحاً جديداً.', 'Add trip details so I can make a fresh suggestion.') };
}

function refreshTravelAssistant() {
  const result = getAssistantSuggestion();
  const text = document.getElementById('travelAiText');
  const action = document.getElementById('travelAiAction');
  if (!text || !action) return;
  text.textContent = result.text;
  action.disabled = !result.place;
  action.dataset.placeName = result.place?.name || '';
  action.dataset.placeSub = result.place?.type || result.place?.company || '';
}

function applyAssistantSuggestion() {
  const button = document.getElementById('travelAiAction');
  const title = button?.dataset.placeName;
  if (!title) return;
  if (!state.schedule.length) state.schedule.push({ day: 1, date: suggestedScheduleDate(), city: getCityConfig().label, hotel: '', items: [] });
  const targetDay = state.schedule.find(day => day.items.length < 5) || state.schedule.at(-1);
  targetDay.items.push({ time: '16:00', title, sub: button.dataset.placeSub || '', done: false });
  sortScheduleItems(targetDay);
  saveState();
  renderSchedule();
}

function toggleSchedule(dayIdx, itemIdx) {
  state.schedule[dayIdx].items[itemIdx].done = !state.schedule[dayIdx].items[itemIdx].done;
  saveState();
  renderSchedule();
}

function renumberScheduleDays() {
  state.schedule.forEach((day, index) => {
    day.day = index + 1;
  });
}

let scheduleEditorState = null;

function sortScheduleItems(day) {
  day.items.sort((a, b) => (timeStringToMinutes(a.time) ?? 1440) - (timeStringToMinutes(b.time) ?? 1440));
}

function scheduleDateToIso(value) {
  if (/^\d{4}-\d{2}-\d{2}$/.test(value || '')) return value;
  const months = { 'يناير': 1, 'فبراير': 2, 'مارس': 3, 'أبريل': 4, 'مايو': 5, 'يونيو': 6, 'يوليو': 7, 'أغسطس': 8, 'سبتمبر': 9, 'أكتوبر': 10, 'نوفمبر': 11, 'ديسمبر': 12 };
  const match = String(value || '').match(/(\d{1,2})\s+([^\s]+)/);
  const month = match ? months[match[2]] : null;
  if (!match || !month) return '';
  const year = new Date(getCityConfig().tripDate).getFullYear();
  return `${year}-${String(month).padStart(2, '0')}-${String(match[1]).padStart(2, '0')}`;
}

function formatScheduleDate(value) {
  const match = String(value || '').match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return value;
  const months = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
  return `${Number(match[3])} ${months[Number(match[2]) - 1]}`;
}

function suggestedScheduleDate() {
  const lastDay = state.schedule.at(-1);
  const lastDate = scheduleDateToIso(lastDay?.date);
  const date = lastDate ? new Date(`${lastDate}T12:00:00`) : new Date(getCityConfig().tripDate);
  if (lastDate) date.setDate(date.getDate() + 1);
  return date.toISOString().slice(0, 10);
}

function closeScheduleEditor(event) {
  if (!event || event.target === document.getElementById('scheduleEditorModal')) {
    document.getElementById('scheduleEditorModal').classList.remove('active');
    scheduleEditorState = null;
    document.body.classList.remove('modal-open');
  }
}

function openScheduleEditor(kind, dayIdx, itemIdx = null) {
  const modal = document.getElementById('scheduleEditorModal');
  const title = document.getElementById('scheduleEditorTitle');
  const fields = document.getElementById('scheduleEditorFields');
  const form = document.getElementById('scheduleEditorForm');
  const day = Number.isInteger(dayIdx) ? state.schedule[dayIdx] : null;
  const item = day && Number.isInteger(itemIdx) ? day.items[itemIdx] : null;
  scheduleEditorState = { kind, dayIdx, itemIdx };
  title.textContent = kind === 'day' ? (day ? ui('تعديل يوم الرحلة', 'Edit travel day') : ui('إضافة يوم جديد', 'Add a new day')) : (item ? ui('تعديل النشاط', 'Edit activity') : ui('إضافة نشاط', 'Add activity'));

  if (kind === 'day') {
    const { hotels } = getCityData();
    const hotelChoices = hotels.map(hotel => `
      <button class="itinerary-hotel-choice ${day?.hotel === hotel.name ? 'selected' : ''}" type="button" data-hotel-id="${hotel.id}" onclick="selectScheduleHotel('${hotel.id}', this)">
        <span class="itinerary-hotel-icon" aria-hidden="true"></span><span><strong>${escapeHtml(hotel.name)}</strong><small>${escapeHtml(hotel.address || 'فندق الرحلة')}</small></span><span class="itinerary-choice-check" aria-hidden="true"></span>
      </button>`).join('');
    fields.innerHTML = `
      <div class="itinerary-editor-section"><div class="itinerary-section-title">${ui('متى وأين؟', 'When and where?')}</div>
        <label class="itinerary-field">${ui('التاريخ', 'Date')}<input name="date" type="date" required value="${escapeHtml(scheduleDateToIso(day?.date) || suggestedScheduleDate())}"></label>
        <label class="itinerary-field">${ui('المنطقة', 'Area')}<input name="city" required value="${escapeHtml(day?.city || ui(getCityConfig().label, getCityConfig().key === 'bangkok' ? 'Bangkok' : 'Phuket'))}" placeholder="${ui('مثال: باتونج', 'Example: Patong')}"></label>
      </div>
      <div class="itinerary-editor-section"><div class="itinerary-section-heading"><div class="itinerary-section-title">${ui('إقامتك في هذا اليوم', 'Stay for this day')} <span>${ui('اختياري', 'Optional')}</span></div><button class="itinerary-skip-hotel" type="button" onclick="clearScheduleHotel()">${ui('تحديد لاحقاً', 'Decide later')}</button></div>
        <div class="itinerary-hotel-choices">${hotelChoices}</div>
        <label class="itinerary-field itinerary-manual-hotel">${ui('اسم الفندق أو ملاحظة', 'Hotel name or note')} <span>${ui('اختياري', 'Optional')}</span><input name="hotel" value="${escapeHtml(day?.hotel || '')}" placeholder="${ui('اتركه فارغاً إذا لم تحدد الفندق بعد', 'Leave blank if you have not chosen a hotel yet')}"></label>
      </div>`;
  } else {
    const { restaurants, cafes, malls, activities } = getCityData();
    const tripIds = new Set(['a1', 'a2', 'a7', 'a8']);
    const places = [
      ...activities.filter(place => tripIds.has(place.id)).map(place => ({ type: 'activity', category: 'trip', place })),
      ...activities.filter(place => !tripIds.has(place.id)).map(place => ({ type: 'activity', category: 'experience', place })),
      ...restaurants.map(place => ({ type: 'restaurant', category: 'restaurant', place })), ...cafes.map(place => ({ type: 'cafe', category: 'cafe', place })),
      ...malls.map(place => ({ type: 'mall', category: 'mall', place }))
    ];
    const categoryMeta = state.language === 'en'
      ? { trip: 'Tour or excursion', experience: 'Activity & experience', restaurant: 'Restaurant', cafe: 'Café', mall: 'Shopping' }
      : { trip: 'رحلة أو جولة', experience: 'نشاط وتجربة', restaurant: 'مطعم', cafe: 'مقهى', mall: 'تسوّق' };
    const placeCards = places.map(({ type, category, place }) => {
      const label = categoryMeta[category];
      return `<button class="itinerary-place-card" type="button" data-category="${category}" data-search="${escapeHtml(place.name.toLowerCase())}" onclick="selectSchedulePlace('${type}', '${place.id}', this)"><span class="itinerary-place-icon" data-kind="${category}"></span><span><strong>${escapeHtml(place.name)}</strong><small>${label}${place.address ? ` · ${escapeHtml(place.address)}` : ''}</small></span><span class="itinerary-place-add" aria-hidden="true"></span></button>`;
    }).join('');
    const dayOptions = state.schedule.map((scheduleDay, index) => `<option value="${index}" ${index === dayIdx ? 'selected' : ''}>${t('day')} ${scheduleDay.day} — ${escapeHtml(scheduleDay.date)}</option>`).join('');
    fields.innerHTML = `
      <div class="itinerary-place-picker">
        <div class="itinerary-picker-heading"><div><div class="itinerary-picker-label">${ui('أضف محطة إلى يومك', 'Add a stop to your day')}</div><p>${ui('اختر من دليلك أو أضف نشاطاً مخصصاً أدناه', 'Choose from your guide or add a custom activity below')}</p></div><span class="itinerary-picker-count">${places.length} ${ui('خيار', 'options')}</span></div>
        <div class="itinerary-picker-tabs"><button type="button" class="active" onclick="filterSchedulePlaces('all', this)">${ui('الكل', 'All')}</button><button type="button" onclick="filterSchedulePlaces('trip', this)">${ui('رحلات', 'Tours')}</button><button type="button" onclick="filterSchedulePlaces('experience', this)">${ui('أنشطة', 'Activities')}</button><button type="button" onclick="filterSchedulePlaces('restaurant', this)">${ui('مطاعم', 'Restaurants')}</button><button type="button" onclick="filterSchedulePlaces('cafe', this)">${ui('مقاهي', 'Cafés')}</button><button type="button" onclick="filterSchedulePlaces('mall', this)">${ui('مولات', 'Malls')}</button></div>
        <label class="itinerary-place-search"><span class="itinerary-search-glyph" aria-hidden="true"></span><input id="schedulePlaceSearch" type="search" oninput="searchSchedulePlaces(this.value)" placeholder="${ui('ابحث باسم المكان', 'Search by place name')}"></label>
        <div id="schedulePlaceCards" class="itinerary-place-cards">${placeCards}</div>
        <div id="schedulePlaceEmpty" class="itinerary-place-empty app-hidden">${ui('لا توجد نتائج مطابقة.', 'No matching results.')}</div>
      </div>
      <div class="itinerary-field-row"><label class="itinerary-field">${ui('الوقت', 'Time')}<input name="time" type="time" required value="${escapeHtml(item?.time || '12:00')}"></label><label class="itinerary-field">${t('day')}<select name="targetDay">${dayOptions}</select></label></div>
      <label class="itinerary-field">${ui('اسم النشاط', 'Activity name')}<input name="title" required value="${escapeHtml(item?.title || '')}" placeholder="${ui('ماذا تريد أن تفعل؟', 'What would you like to do?')}"></label>
      <label class="itinerary-field">${ui('التفاصيل', 'Details')}<textarea name="sub" rows="3" placeholder="${ui('المكان أو ملاحظة سريعة', 'Place or a quick note')}">${escapeHtml(item?.sub || '')}</textarea></label>
      <input type="hidden" name="estimatedCost" value="${Number(item?.estimatedCost) || ''}">
      <input type="hidden" name="estimatedCostHigh" value="${Number(item?.estimatedCostHigh) || ''}">
      <input type="hidden" name="costSource" value="${escapeHtml(item?.costSource || '')}">
      <div id="schedulePriceEstimate" class="schedule-price-estimate" aria-live="polite">${item?.estimatedCost ? renderSchedulePriceEstimate({ low: item.estimatedCost, high: item.estimatedCostHigh || item.estimatedCost, source: item.costSource }) : ui('اختر مكاناً لإظهار السعر التقريبي.', 'Choose a place to see an estimated price.')}</div>`;
  }
  form.onsubmit = saveScheduleEditor;
  modal.classList.add('active');
  document.body.classList.add('modal-open');
}

function selectSchedulePlace(type, id, button) {
  const place = getPlaceByTypeAndId(type, id);
  const form = document.getElementById('scheduleEditorForm');
  if (!place) return;
  form.elements.title.value = place.name;
  form.elements.sub.value = place.type || place.company || place.address || '';
  document.querySelectorAll('.itinerary-place-card').forEach(card => card.classList.toggle('selected', card === button));
  estimateSchedulePlacePrice(place, type);
}

function getLocalPriceEstimate(place, type) {
  const directPrice = String(place?.price || '').match(/([\d,]+)\s*(?:THB|฿|بات)/i);
  if (directPrice) {
    const value = Number(directPrice[1].replaceAll(',', ''));
    if (Number.isFinite(value) && value > 0) return { low: Math.round(value * .9), high: Math.round(value * 1.15), source: 'local' };
  }
  const priceLevel = String(place?.price || '').replace(/[^$]/g, '').length;
  const bands = {
    restaurant: [[180, 380], [350, 700], [650, 1400], [1200, 2800]],
    cafe: [[90, 180], [150, 320], [280, 550], [450, 900]],
    mall: [[0, 0]],
    activity: [[500, 1200], [1200, 2600], [2500, 5000], [4500, 8500]]
  };
  const options = bands[type] || bands.activity;
  const [low, high] = options[Math.max(0, Math.min((priceLevel || 2) - 1, options.length - 1))];
  return { low, high, source: 'local' };
}

function renderSchedulePriceEstimate({ low, high, source, note }) {
  if (!low && !high) return ui('الدخول أو التسوق لا يملك سعراً ثابتاً. أضف ميزانيتك المتوقعة يدوياً.', 'Entry or shopping has no fixed price. Add your expected budget manually.');
  const range = low === high ? `${low.toLocaleString()} THB` : `${low.toLocaleString()}–${high.toLocaleString()} THB`;
  const label = source === 'ai' ? ui('تقدير المساعد الذكي', 'AI estimate') : ui('تقدير مبدئي', 'Starting estimate');
  return `<span>${label}</span><strong>${range}</strong>${note ? `<small>${escapeHtml(note)}</small>` : ''}`;
}

async function estimateSchedulePlacePrice(place, type) {
  const form = document.getElementById('scheduleEditorForm');
  const display = document.getElementById('schedulePriceEstimate');
  if (!form || !display) return;
  const localEstimate = getLocalPriceEstimate(place, type);
  const applyEstimate = estimate => {
    form.elements.estimatedCost.value = estimate.low || '';
    form.elements.estimatedCostHigh.value = estimate.high || '';
    form.elements.costSource.value = estimate.source || 'local';
    display.innerHTML = renderSchedulePriceEstimate(estimate);
  };
  applyEstimate(localEstimate);

  const endpoint = window.TRAVELTRIP_CONFIG?.aiPriceEndpoint || './api/travel-price';
  if (!navigator.onLine || !endpoint) return;
  display.innerHTML = `${renderSchedulePriceEstimate(localEstimate)}<small>${ui('جارٍ تحسين التقدير…', 'Refining estimate…')}</small>`;
  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ place: place.name, city: getCityConfig().label, category: type, priceHint: place.price || '' })
    });
    if (!response.ok) throw new Error('Price estimate unavailable');
    const data = await response.json();
    const low = Number(data.low);
    const high = Number(data.high);
    if (!Number.isFinite(low) || !Number.isFinite(high) || low < 0 || high < low) throw new Error('Invalid price estimate');
    applyEstimate({ low: Math.round(low), high: Math.round(high), source: 'ai', note: data.note || '' });
  } catch {
    applyEstimate(localEstimate);
  }
}

function filterSchedulePlaces(category, button) {
  const picker = document.getElementById('schedulePlaceCards');
  if (!picker) return;
  picker.dataset.category = category;
  applySchedulePlaceFilters();
  document.querySelectorAll('.itinerary-picker-tabs button').forEach(tab => tab.classList.toggle('active', tab === button));
}

function searchSchedulePlaces(query) {
  const picker = document.getElementById('schedulePlaceCards');
  if (!picker) return;
  picker.dataset.query = query.trim().toLowerCase();
  applySchedulePlaceFilters();
}

function applySchedulePlaceFilters() {
  const picker = document.getElementById('schedulePlaceCards');
  const empty = document.getElementById('schedulePlaceEmpty');
  if (!picker) return;
  const category = picker.dataset.category || 'all';
  const query = picker.dataset.query || '';
  let visible = 0;
  picker.querySelectorAll('.itinerary-place-card').forEach(card => {
    const matches = (category === 'all' || card.dataset.category === category) && (!query || card.dataset.search.includes(query));
    card.hidden = !matches;
    if (matches) visible += 1;
  });
  empty?.classList.toggle('app-hidden', visible !== 0);
}

function selectScheduleHotel(hotelId, button) {
  const hotel = getCityData().hotels.find(item => item.id === hotelId);
  const form = document.getElementById('scheduleEditorForm');
  if (hotel && form?.elements.hotel) form.elements.hotel.value = hotel.name;
  document.querySelectorAll('.itinerary-hotel-choice').forEach(choice => choice.classList.toggle('selected', choice === button));
}

function clearScheduleHotel() {
  const form = document.getElementById('scheduleEditorForm');
  if (form?.elements.hotel) form.elements.hotel.value = '';
  document.querySelectorAll('.itinerary-hotel-choice').forEach(choice => choice.classList.remove('selected'));
}

function saveScheduleEditor(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const data = new FormData(form);
  const editor = scheduleEditorState;
  if (!editor) return;
  if (editor.kind === 'day') {
    const date = formatScheduleDate(data.get('date'));
    const city = data.get('city').trim();
    if (!date || !city) return;
    if (editor.dayIdx === null) state.schedule.push({ day: state.schedule.length + 1, date, city, hotel: data.get('hotel').trim(), items: [] });
    else Object.assign(state.schedule[editor.dayIdx], { date, city, hotel: data.get('hotel').trim() });
    renumberScheduleDays();
  } else {
    const targetDayIdx = Number(data.get('targetDay'));
    const time = data.get('time');
    const title = data.get('title').trim();
    const sub = data.get('sub').trim();
    const conflict = state.schedule[targetDayIdx]?.items.some((entry, index) => entry.time === time && !(editor.dayIdx === targetDayIdx && editor.itemIdx === index));
    const warning = document.getElementById('scheduleConflict');
    if (!title || !time || !state.schedule[targetDayIdx]) return;
    if (conflict) { warning.hidden = false; warning.textContent = 'يوجد نشاط آخر في الوقت نفسه. عدّل الوقت قبل الحفظ.'; return; }
    const editedItem = editor.itemIdx !== null ? state.schedule[editor.dayIdx].items[editor.itemIdx] : null;
    if (editedItem) state.schedule[editor.dayIdx].items.splice(editor.itemIdx, 1);
    const estimatedCost = Number(data.get('estimatedCost'));
    const estimatedCostHigh = Number(data.get('estimatedCostHigh'));
    state.schedule[targetDayIdx].items.push({
      time, title, sub, done: editedItem?.done || false,
      estimatedCost: Number.isFinite(estimatedCost) && estimatedCost >= 0 ? Math.round(estimatedCost) : null,
      estimatedCostHigh: Number.isFinite(estimatedCostHigh) && estimatedCostHigh >= 0 ? Math.round(estimatedCostHigh) : null,
      costSource: data.get('costSource') === 'ai' ? 'ai' : data.get('costSource') === 'local' ? 'local' : ''
    });
    sortScheduleItems(state.schedule[targetDayIdx]);
    if (editor.dayIdx !== targetDayIdx && state.schedule[editor.dayIdx]) sortScheduleItems(state.schedule[editor.dayIdx]);
  }
  saveState();
  closeScheduleEditor();
  renderSchedule();
}

function addScheduleDay() {
  openScheduleEditor('day', null);
}

function editScheduleDay(dayIdx) {
  openScheduleEditor('day', dayIdx);
}

function deleteScheduleDay(dayIdx) {
  if (!confirm('حذف هذا اليوم كاملًا من الجدول؟')) return;
  state.schedule.splice(dayIdx, 1);
  renumberScheduleDays();
  saveState();
  renderSchedule();
}

function buildScheduleSuggestions() {
  const { restaurants, cafes, malls, activities } = getCityData();
  return {
    restaurants: restaurants.map(item => ({
      title: item.name,
      sub: `مطعم • ${item.type}`
    })),
    cafes: cafes.map(item => ({
      title: item.name,
      sub: `مقهى • ${item.type}`
    })),
    malls: malls.map(item => ({
      title: item.name,
      sub: `مول • ${item.shops}`
    })),
    activities: activities.map(item => ({
      title: item.name,
      sub: item.company ? `رحلة • ${item.company}` : 'رحلة'
    }))
  };
}

function pickSuggestionItem(list, label) {
  if (!list.length) return null;
  const lines = list.map((item, idx) => `${idx + 1}. ${item.title}`).join('\n');
  const input = prompt(`اختر ${label} بالرقم:\n${lines}`);
  if (!input) return null;
  const index = parseInt(input, 10) - 1;
  if (Number.isNaN(index) || index < 0 || index >= list.length) {
    alert('الاختيار غير صحيح.');
    return null;
  }
  return list[index];
}

function pickScheduleSuggestion() {
  const source = prompt(
    'اختر مصدر النشاط:\n1) المطاعم\n2) المقاهي\n3) المولات\n4) الرحلات\n5) إدخال يدوي',
    '1'
  );
  if (!source) return null;
  if (source.trim() === '5') return { manual: true };

  const suggestions = buildScheduleSuggestions();
  if (source.trim() === '1') return pickSuggestionItem(suggestions.restaurants, 'مطعم');
  if (source.trim() === '2') return pickSuggestionItem(suggestions.cafes, 'مقهى');
  if (source.trim() === '3') return pickSuggestionItem(suggestions.malls, 'مول');
  if (source.trim() === '4') return pickSuggestionItem(suggestions.activities, 'رحلة');

  alert('الاختيار غير صحيح.');
  return null;
}

function addScheduleItem(dayIdx) {
  openScheduleEditor('item', dayIdx);
}

function editScheduleItem(dayIdx, itemIdx) {
  openScheduleEditor('item', dayIdx, itemIdx);
}

function deleteScheduleItem(dayIdx, itemIdx) {
  if (!confirm('حذف هذا النشاط من الجدول؟')) return;
  state.schedule[dayIdx]?.items.splice(itemIdx, 1);
  saveState();
  renderSchedule();
}

// ============================================
// HOTELS
// ============================================

function renderHotels() {
  const container = document.getElementById('hotelsList');
  const { hotels } = getCityData();
  container.innerHTML = hotels.map(h => {
    const imgUrl = safeImage(h.img);
    const mapQuery = h.map || `${h.name}, ${h.address}`;
    return `
    <div class="detail-card">
      <img src="${imgUrl}" alt="${h.name}" class="detail-card-img clickable" onerror="this.style.display='none'" onclick="openPlaceDetails('hotel','${h.id}')">
      <div class="detail-card-body">
        <div class="detail-card-title">${h.name}</div>
        <div class="detail-card-sub">${h.nameTh}</div>
        <div class="detail-row"><span class="detail-row-label">Rating</span><span class="detail-row-value">⭐ ${h.rating}</span></div>
        <div class="detail-row"><span class="detail-row-label">Address</span><span class="detail-row-value">${h.address}</span></div>
        <div class="detail-row"><span class="detail-row-label">Thai Address</span><span class="detail-row-value" style="font-size:13px">${h.addressTh}</span></div>
        <div class="detail-row"><span class="detail-row-label">Phone</span><span class="detail-row-value">${h.phone}</span></div>
        <div class="detail-row"><span class="detail-row-label">Notes</span><span class="detail-row-value" style="font-size:13px">${escapeHtml(localizeContent(h.notes))}</span></div>
        <div class="action-row">
          <button class="action-btn orange" onclick="openPlaceDetails('hotel','${h.id}')">📸 Details</button>
          <button class="action-btn blue" onclick="callNumber('${h.phone.replace(/[^0-9+]/g,'')}')">📞 Call</button>
          <button class="action-btn green" onclick="copyText('${h.name}, ${h.address}')">📋 Copy</button>
          <button class="action-btn gray" onclick="openMap('${mapQuery}')">🗺️ Map</button>
        </div>
      </div>
    </div>
    `;
  }).join('');
}
// ============================================
// RESTAURANTS
// ============================================

function renderRestaurants(filter = '') {
  const container = document.getElementById('restaurantsList');
  const { restaurants } = getCityData();
  let items = restaurants;
  if (filter) {
    const q = filter.toLowerCase();
    items = items.filter(r => r.name.toLowerCase().includes(q) || r.type.includes(q) || (r.halalNote && r.halalNote.includes(q)));
  }
  container.innerHTML = items.map(r => {
    const imgUrl = safeImage(r.img);
    const status = getOpenStatus(r.hours);
    return `
    <div class="detail-card">
      <img src="${imgUrl}" alt="${r.name}" class="detail-card-img clickable" onerror="this.style.display='none'" onclick="openPlaceDetails('restaurant','${r.id}')">
      <div class="detail-card-body">
        <div style="display:flex;justify-content:space-between;align-items:flex-start">
          <div>
            <div class="detail-card-title">${r.name}</div>
            <div class="detail-card-sub-row">
              <div class="detail-card-sub">${r.nameTh}</div>
              <button class="sub-copy-btn" onclick="copyText('${r.nameTh}')">Copy Thai</button>
            </div>
          </div>
          <button class="fav-btn ${isFav('r', r.id) ? 'active' : ''}" onclick="toggleFav('r','${r.id}')">${isFav('r', r.id) ? '❤️' : '🤍'}</button>
        </div>
        <div style="margin:8px 0">
          ${r.halal === true ? '<span class="tag-pill tag-green">✅ Halal</span>' : r.halal === false ? '<span class="tag-pill tag-red">❌ Not Halal</span>' : '<span class="tag-pill tag-gray">⚪ Unconfirmed</span>'}
          <span class="tag-pill ${status.className}">${status.label}</span>
          <span class="tag-pill tag-blue">${escapeHtml(localizeContent(r.type))}</span>
          <span class="tag-pill tag-orange">${r.price}</span>
          ${r.rating ? `<span class="tag-pill tag-gray">⭐ ${r.rating}</span>` : ''}
        </div>
        <div class="detail-row"><span class="detail-row-label">Hours</span><span class="detail-row-value">${r.hours}</span></div>
        <div class="detail-row"><span class="detail-row-label">Now</span><span class="detail-row-value">${status.detail} <span class="tag-pill ${status.className}">${status.label}</span></span></div>
        <div class="detail-row"><span class="detail-row-label">Distance</span><span class="detail-row-value">${escapeHtml(localizeContent(r.distance))}</span></div>
        <div class="action-row">
          <button class="action-btn orange" onclick="openPlaceDetails('restaurant','${r.id}')">📸 Details</button>
          <button class="action-btn gray" onclick="openMap('${r.map}')">🗺️ Map</button>
          <button class="action-btn ${isVisited(r.name) ? 'green' : 'blue'}" onclick="toggleVisit('${r.name}')">${isVisited(r.name) ? '✅ Visited' : '✓ Visit'}</button>
        </div>
      </div>
    </div>
    `;
  }).join('');
}

function filterRestaurants() {
  renderRestaurants(document.getElementById('restSearch').value);
}

function renderCafes(filter = '') {
  const container = document.getElementById('cafesList');
  const { cafes } = getCityData();
  let items = cafes;
  if (filter) {
    const q = filter.toLowerCase();
    items = items.filter(r => r.name.toLowerCase().includes(q) || r.type.toLowerCase().includes(q) || (r.halalNote && r.halalNote.toLowerCase().includes(q)));
  }
  container.innerHTML = items.map(r => {
    const imgUrl = safeImage(r.img);
    const status = getOpenStatus(r.hours);
    return `
    <div class="detail-card">
      <img src="${imgUrl}" alt="${r.name}" class="detail-card-img clickable" onerror="this.style.display='none'" onclick="openPlaceDetails('cafe','${r.id}')">
      <div class="detail-card-body">
        <div style="display:flex;justify-content:space-between;align-items:flex-start">
          <div>
            <div class="detail-card-title">${r.name}</div>
            <div class="detail-card-sub-row">
              <div class="detail-card-sub">${r.nameTh}</div>
              <button class="sub-copy-btn" onclick="copyText('${r.nameTh}')">Copy Thai</button>
            </div>
          </div>
          <button class="fav-btn ${isFav('r', r.id) ? 'active' : ''}" onclick="toggleFav('r','${r.id}')">${isFav('r', r.id) ? '❤️' : '🤍'}</button>
        </div>
        <div style="margin:8px 0">
          ${r.halal === true ? '<span class="tag-pill tag-green">✅ Halal</span>' : r.halal === false ? '<span class="tag-pill tag-red">❌ Not Halal</span>' : '<span class="tag-pill tag-gray">⚪ Unconfirmed</span>'}
          <span class="tag-pill ${status.className}">${status.label}</span>
          <span class="tag-pill tag-blue">${escapeHtml(localizeContent(r.type))}</span>
          <span class="tag-pill tag-orange">${r.price}</span>
          ${r.rating ? `<span class="tag-pill tag-gray">⭐ ${r.rating}</span>` : ''}
        </div>
        <div class="detail-row"><span class="detail-row-label">Hours</span><span class="detail-row-value">${r.hours}</span></div>
        <div class="detail-row"><span class="detail-row-label">Now</span><span class="detail-row-value">${status.detail} <span class="tag-pill ${status.className}">${status.label}</span></span></div>
        <div class="detail-row"><span class="detail-row-label">Distance</span><span class="detail-row-value">${escapeHtml(localizeContent(r.distance))}</span></div>
        <div class="action-row">
          <button class="action-btn orange" onclick="openPlaceDetails('cafe','${r.id}')">📸 Details</button>
          <button class="action-btn gray" onclick="openMap('${r.map}')">🗺️ Map</button>
          <button class="action-btn ${isVisited(r.name) ? 'green' : 'blue'}" onclick="toggleVisit('${r.name}')">${isVisited(r.name) ? '✅ Visited' : '✓ Visit'}</button>
        </div>
      </div>
    </div>
    `;
  }).join('');
}

function filterCafes() {
  renderCafes(document.getElementById('cafeSearch').value);
}

// ============================================
// MALLS
// ============================================

function renderMalls() {
  const container = document.getElementById('mallsList');
  const { malls } = getCityData();
  container.innerHTML = malls.map(m => {
    const imgUrl = safeImage(m.img);
    const status = getOpenStatus(m.hours);
    return `
    <div class="detail-card">
      <img src="${imgUrl}" alt="${m.name}" class="detail-card-img clickable" onerror="this.style.display='none'" onclick="openPlaceDetails('mall','${m.id}')">
      <div class="detail-card-body">
        <div style="display:flex;justify-content:space-between;align-items:flex-start">
          <div>
            <div class="detail-card-title">${m.name}</div>
            <div class="detail-card-sub">${m.nameTh}</div>
          </div>
          <button class="fav-btn ${isFav('m', m.id) ? 'active' : ''}" onclick="toggleFav('m','${m.id}')">${isFav('m', m.id) ? '❤️' : '🤍'}</button>
        </div>
        <div style="margin:8px 0">
          <span class="tag-pill ${status.className}">${status.label}</span>
        </div>
        <div class="detail-row"><span class="detail-row-label">Hours</span><span class="detail-row-value">${m.hours}</span></div>
        <div class="detail-row"><span class="detail-row-label">Now</span><span class="detail-row-value">${status.detail} <span class="tag-pill ${status.className}">${status.label}</span></span></div>
        <div class="detail-row"><span class="detail-row-label">Shops</span><span class="detail-row-value" style="font-size:13px">${escapeHtml(localizeContent(m.shops))}</span></div>
        <div class="detail-row"><span class="detail-row-label">Restaurants</span><span class="detail-row-value" style="font-size:13px">${escapeHtml(localizeContent(m.restaurants))}</span></div>
        <div class="detail-row"><span class="detail-row-label">Distance</span><span class="detail-row-value">${escapeHtml(localizeContent(m.distance))}</span></div>
        <div class="action-row">
          <button class="action-btn orange" onclick="openPlaceDetails('mall','${m.id}')">📸 Details</button>
          <button class="action-btn gray" onclick="openMap('${m.map}')">🗺️ Map</button>
          <button class="action-btn ${isVisited(m.name) ? 'green' : 'blue'}" onclick="toggleVisit('${m.name}')">${isVisited(m.name) ? '✅ Visited' : '✓ Visit'}</button>
        </div>
      </div>
    </div>
    `;
  }).join('');
}

// ============================================
// ACTIVITIES
// ============================================

function renderActivities() {
  const container = document.getElementById('activitiesList');
  const { activities } = getCityData();
  container.innerHTML = activities.map(a => {
    const imgUrl = safeImage(a.img);
    return `
    <div class="detail-card">
      <img src="${imgUrl}" alt="${a.name}" class="detail-card-img clickable" onerror="this.style.display='none'" onclick="openPlaceDetails('activity','${a.id}')">
      <div class="detail-card-body">
        <div style="display:flex;justify-content:space-between;align-items:flex-start">
          <div>
            <div class="detail-card-title">${a.name}</div>
            <div class="detail-card-sub">${a.nameTh}</div>
          </div>
          <button class="fav-btn ${isFav('a', a.id) ? 'active' : ''}" onclick="toggleFav('a','${a.id}')">${isFav('a', a.id) ? '❤️' : '🤍'}</button>
        </div>
        <div class="detail-row"><span class="detail-row-label">Company</span><span class="detail-row-value">${a.company}</span></div>
        <div class="detail-row"><span class="detail-row-label">Departure</span><span class="detail-row-value">${a.time}</span></div>
        <div class="detail-row"><span class="detail-row-label">Duration</span><span class="detail-row-value">${escapeHtml(localizeContent(a.duration))}</span></div>
        <div class="detail-row"><span class="detail-row-label">Price</span><span class="detail-row-value" style="color:var(--ios-green);font-weight:700">${a.price}</span></div>
        <div class="detail-row"><span class="detail-row-label">Bring</span><span class="detail-row-value" style="font-size:13px">${escapeHtml(localizeContent(a.bring))}</span></div>
        <div class="detail-row"><span class="detail-row-label">Notes</span><span class="detail-row-value" style="font-size:13px">${escapeHtml(localizeContent(a.notes))}</span></div>
        <div class="action-row">
          <button class="action-btn orange" onclick="openPlaceDetails('activity','${a.id}')">📸 Details</button>
          <button class="action-btn gray" onclick="openMap('${a.map}')">🗺️ Map</button>
          <button class="action-btn ${isVisited(a.name) ? 'green' : 'blue'}" onclick="toggleVisit('${a.name}')">${isVisited(a.name) ? '✅ Done' : '✓ Mark Done'}</button>
        </div>
      </div>
    </div>
    `;
  }).join('');
}

// ============================================
// BUDGET
// ============================================

function toggleExpenseForm() { document.getElementById('expenseForm')?.toggleAttribute('hidden'); }
function saveExpense(event) {
  event.preventDefault(); const data = new FormData(event.target); const amount = Number(data.get('amount'));
  if (!Number.isFinite(amount) || amount <= 0) return;
  state.expenses.unshift({ id: `${Date.now()}_${Math.random().toString(36).slice(2)}`, amount, category: String(data.get('category')), payment: String(data.get('payment')), note: safeText(String(data.get('note')), 120), city: currentCityKey(), date: new Date().toISOString().slice(0,10) });
  event.target.reset(); event.target.hidden = true; saveState(); renderExpenses();
}
function deleteExpense(id) { state.expenses = state.expenses.filter(item => item.id !== id); saveState(); renderExpenses(); }
function renderExpenses() {
  const list = document.getElementById('expenseList'), summary = document.getElementById('expenseSummary'); if (!list || !summary) return;
  const expenses = state.expenses.filter(item => item.city === currentCityKey()); const total = expenses.reduce((sum, item) => sum + Number(item.amount || 0), 0);
  summary.innerHTML = `<div class="expense-total">المصروف: <strong>${total.toLocaleString()} بات</strong>${state.budgetLimit ? ` · المتبقي: ${Math.max(0,state.budgetLimit-total).toLocaleString()} بات` : ''}</div>`;
  list.innerHTML = expenses.slice(0,12).map(item => `<div class="expense-item"><span><strong>${escapeHtml(item.category)}</strong> · ${escapeHtml(item.note || item.payment)}<small>${escapeHtml(item.date)}</small></span><b>${Number(item.amount).toLocaleString()} بات</b><button type="button" aria-label="حذف المصروف" onclick="deleteExpense('${item.id}')">×</button></div>`).join('');
}

function loadBudget() {
  const b = state.budget;
  if (b.hotel) document.getElementById('b-hotel').value = b.hotel;
  if (b.breakfast) document.getElementById('b-breakfast').value = b.breakfast;
  if (b.food) document.getElementById('b-food').value = b.food;
  if (b.cafe) document.getElementById('b-cafe').value = b.cafe;
  if (b.shop) document.getElementById('b-shop').value = b.shop;
  if (b.gifts) document.getElementById('b-gifts').value = b.gifts;
  if (b.tour1) document.getElementById('b-tour1').value = b.tour1;
  if (b.tour2) document.getElementById('b-tour2').value = b.tour2;
  if (b.trans) document.getElementById('b-trans').value = b.trans;
  if (b.emer) document.getElementById('b-emer').value = b.emer;
  document.getElementById('budgetLimit').value = state.budgetLimit || '';
  document.getElementById('rateInput').value = state.exchangeRate;
  calcBudget();
  renderExpenses();
  renderBudgetHealth(Object.values(state.budget).reduce((sum, amount) => sum + (Number(amount) || 0), 0));
}

function calcBudget() {
  const fields = ['hotel','breakfast','food','cafe','shop','gifts','tour1','tour2','trans','emer'];
  let total = 0;
  fields.forEach(f => {
    const val = parseFloat(document.getElementById('b-' + f)?.value) || 0;
    state.budget[f] = val;
    total += val;
  });
  document.getElementById('budgetTotal').textContent = total.toLocaleString() + ' بات';
  saveState();
}

function setBudgetLimit(value) {
  state.budgetLimit = Math.max(0, Number(value) || 0);
  renderBudgetHealth(Object.values(state.budget).reduce((sum, amount) => sum + (Number(amount) || 0), 0));
  saveState();
}

function renderBudgetHealth(total) {
  const health = document.getElementById('budgetHealth');
  if (!health) return;
  if (!state.budgetLimit) {
    health.className = 'budget-health';
    health.textContent = ui('ضع سقفاً للميزانية لتتابع المتبقي لحظياً.', 'Set a budget limit to track what remains in real time.');
    return;
  }
  const remaining = state.budgetLimit - total;
  const ratio = Math.min(100, Math.round((total / state.budgetLimit) * 100));
  health.className = `budget-health ${remaining < 0 ? 'over' : ratio > 80 ? 'warning' : 'healthy'}`;
  health.innerHTML = `<div><strong>${ratio}%</strong><span>${remaining >= 0 ? ui(`${remaining.toLocaleString()} بات متبقية`, `${remaining.toLocaleString()} THB remaining`) : ui(`${Math.abs(remaining).toLocaleString()} بات فوق السقف`, `${Math.abs(remaining).toLocaleString()} THB over limit`)}</span></div><i><b style="width:${ratio}%"></b></i>`;
}

function convertCurrency() {
  const thb = parseFloat(document.getElementById('thbInput').value) || 0;
  const kwd = thb / state.exchangeRate;
  document.getElementById('kwdInput').value = kwd > 0 ? kwd.toFixed(3) : '';
}
function convertCurrencyReverse() {
  const kwd = parseFloat(document.getElementById('kwdInput').value) || 0;
  const thb = kwd * state.exchangeRate;
  document.getElementById('thbInput').value = thb > 0 ? Math.round(thb) : '';
}
function saveRate() {
  state.exchangeRate = parseFloat(document.getElementById('rateInput').value) || 110;
  saveState();
}

// ============================================
// PACKING
// ============================================

function renderPacking() {
  const container = document.getElementById('packingList');
  container.innerHTML = state.packing.map((item, i) => `
    <div class="check-item" onclick="togglePacking(${i})">
      <div class="check-box ${item.done ? 'checked' : ''}"></div>
      <div class="check-text ${item.done ? 'done' : ''}">${escapeHtml(item.text)}</div>
      <div class="check-delete" onclick="event.stopPropagation();deletePacking(${i})">🗑️</div>
    </div>
  `).join('');
  updateProgress();
}

function togglePacking(i) {
  state.packing[i].done = !state.packing[i].done;
  saveState();
  renderPacking();
}

function deletePacking(i) {
  state.packing.splice(i, 1);
  saveState();
  renderPacking();
}

function addPackingItem() {
  const input = document.getElementById('packingInput');
  const text = input.value.trim();
  if (!text) return;
  state.packing.push({ text, done: false });
  input.value = '';
  saveState();
  renderPacking();
}

// ============================================
// FAVORITES
// ============================================

function isFav(type, id) {
  return state.favorites.some(f => f.type === type && f.id === id);
}

function toggleFav(type, id) {
  const idx = state.favorites.findIndex(f => f.type === type && f.id === id);
  const { restaurants, cafes, malls, activities } = getCityData();
  if (idx >= 0) {
    state.favorites.splice(idx, 1);
  } else {
    let item;
    if (type === 'r') item = restaurants.find(r => r.id === id) || cafes.find(r => r.id === id);
    else if (type === 'm') item = malls.find(m => m.id === id);
    else if (type === 'a') item = activities.find(a => a.id === id);
    if (item) state.favorites.push({ type, id, name: item.name, sub: item.type || item.company || '' });
  }
  saveState();
  if (state.currentSection === 'restaurants') renderRestaurants(document.getElementById('restSearch')?.value || '');
  if (state.currentSection === 'cafes') renderCafes(document.getElementById('cafeSearch')?.value || '');
  if (state.currentSection === 'malls') renderMalls();
  if (state.currentSection === 'activities') renderActivities();
  if (state.currentSection === 'favorites') renderFavorites();
}

function renderFavorites() {
  const container = document.getElementById('favoritesList');
  if (state.favorites.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">❤️</div>
        <div class="empty-state-title">لا توجد مفضلات</div>
        <div class="empty-state-sub">اضغط على القلب 🤍 في أي مكان لإضافته هنا</div>
      </div>`;
    return;
  }
  container.innerHTML = `<div class="ios-list">` + state.favorites.map(f => {
    const type = /^[a-z]$/i.test(f.type) ? f.type : '';
    const id = /^[a-z0-9_-]+$/i.test(f.id) ? f.id : '';
    return `
    <div class="ios-list-item" onclick="removeFav('${type}','${id}')">
      <div class="ios-list-icon" style="background:rgba(255,45,85,0.12)">❤️</div>
      <div class="ios-list-content">
        <div class="ios-list-title">${escapeHtml(f.name)}</div>
        <div class="ios-list-sub">${escapeHtml(f.sub)}</div>
      </div>
      <div class="ios-list-chevron" style="color:var(--ios-red)">✕</div>
    </div>
  `;
  }).join('') + `</div>`;
}

function removeFav(type, id) {
  toggleFav(type, id);
}

// ============================================
// VISITED
// ============================================

function isVisited(name) {
  return state.visited.includes(name);
}

function toggleVisit(name) {
  const idx = state.visited.indexOf(name);
  if (idx >= 0) state.visited.splice(idx, 1);
  else state.visited.push(name);
  saveState();
  if (state.currentSection === 'restaurants') renderRestaurants(document.getElementById('restSearch')?.value || '');
  if (state.currentSection === 'cafes') renderCafes(document.getElementById('cafeSearch')?.value || '');
  if (state.currentSection === 'malls') renderMalls();
  if (state.currentSection === 'activities') renderActivities();
  if (state.currentSection === 'visited') renderVisited();
}

function renderVisited() {
  const container = document.getElementById('visitedList');
  const { restaurants, cafes, malls, activities } = getCityData();
  const allPlaces = [
    ...restaurants.map(r => r.name),
    ...cafes.map(c => c.name),
    ...malls.map(m => m.name),
    ...activities.map(a => a.name)
  ];
  const total = allPlaces.length;
  const visitedPlaces = state.visited.filter(name => allPlaces.includes(name));
  const done = visitedPlaces.length;
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;
  const circumference = 2 * Math.PI * 28;
  document.getElementById('visitRing').style.strokeDashoffset = circumference - (pct / 100) * circumference;
  document.getElementById('visitText').textContent = pct + '%';
  document.getElementById('visitSub').textContent = `${done} من ${total} مكان`;

  if (visitedPlaces.length === 0) {
    container.innerHTML = `<div class="empty-state"><div class="empty-state-icon">📍</div><div>لم تزُر أي مكان بعد</div></div>`;
    return;
  }
  container.innerHTML = `<div class="ios-list">` + visitedPlaces.map(v => `
    <div class="ios-list-item">
      <div class="ios-list-icon" style="background:rgba(52,199,89,0.12)">✅</div>
      <div class="ios-list-content"><div class="ios-list-title">${escapeHtml(v)}</div></div>
    </div>
  `).join('') + `</div>`;
}

// ============================================
// SEARCH
// ============================================

function matchesSearch(query, ...values) {
  return values.some(value => String(value || '').toLowerCase().includes(query));
}

function openSearchResult(section, placeType = '', id = '') {
  showSection(section);
  if (placeType && id) openPlaceDetails(placeType, id);
}

function doGlobalSearch() {
  const q = document.getElementById('globalSearch').value.trim().toLowerCase();
  const container = document.getElementById('searchResults');
  if (!q) { container.innerHTML = ''; return; }

  const { hotels, restaurants, cafes, malls, activities } = getCityData();
  const results = [];
  hotels.forEach(h => {
    if (matchesSearch(q, h.name, h.nameTh, h.address, h.addressTh, h.notes))
      results.push({ section: 'hotels', placeType: 'hotel', id: h.id, type: 'فندق', name: h.name, sub: h.address, icon: '🏨' });
  });
  restaurants.forEach(r => {
    if (matchesSearch(q, r.name, r.nameTh, r.type, r.halalNote))
      results.push({ section: 'restaurants', placeType: 'restaurant', id: r.id, type: 'مطعم', name: r.name, sub: r.type, icon: '🍽️' });
  });
  cafes.forEach(c => {
    if (matchesSearch(q, c.name, c.nameTh, c.type, c.halalNote))
      results.push({ section: 'cafes', placeType: 'cafe', id: c.id, type: 'مقهى', name: c.name, sub: c.type, icon: '☕' });
  });
  malls.forEach(m => {
    if (matchesSearch(q, m.name, m.nameTh, m.shops, m.restaurants))
      results.push({ section: 'malls', placeType: 'mall', id: m.id, type: 'مول', name: m.name, sub: m.shops.substring(0, 40) + '...', icon: '🛍️' });
  });
  activities.forEach(a => {
    if (matchesSearch(q, a.name, a.nameTh, a.company, a.notes))
      results.push({ section: 'activities', placeType: 'activity', id: a.id, type: 'نشاط', name: a.name, sub: a.company, icon: '🏝️' });
  });
  state.schedule.forEach(day => {
    day.items.forEach(item => {
      if (matchesSearch(q, day.date, day.city, day.hotel, item.time, item.title, item.sub))
        results.push({ section: 'schedule', type: 'الجدول', name: item.title, sub: `${day.date} • ${item.time} • ${item.sub}`, icon: '🗓️' });
    });
  });
  state.packing.forEach(item => {
    if (matchesSearch(q, item.text))
      results.push({ section: 'packing', type: 'التجهيز', name: item.text, sub: item.done ? 'مكتمل' : 'غير مكتمل', icon: '🧳' });
  });
  if (matchesSearch(q, state.notes)) results.push({ section: 'notes', type: 'الملاحظات', name: 'ملاحظات الرحلة', sub: state.notes.slice(0, 80), icon: '📝' });

  if (results.length === 0) {
    container.innerHTML = `<div class="empty-state"><div class="empty-state-icon">🔍</div><div>لا توجد نتائج</div></div>`;
    return;
  }
  container.innerHTML = `<div class="ios-list">` + results.map(r => `
    <div class="ios-list-item" onclick="openSearchResult('${r.section}','${r.placeType || ''}','${r.id || ''}')">
      <div class="ios-list-icon" style="background:var(--ios-gray5)">${r.icon}</div>
      <div class="ios-list-content">
        <div class="ios-list-title">${escapeHtml(r.name)}</div>
        <div class="ios-list-sub">${escapeHtml(r.sub)}</div>
      </div>
      <div class="ios-list-chevron">›</div>
    </div>
  `).join('') + `</div>`;
}

// ============================================
// EMERGENCY MODAL
// ============================================

function openEmergency() {
  document.getElementById('emergencyModal').classList.add('active');
  document.body.classList.add('modal-open');
}
function closeEmergency(e) {
  if (!e || e.target === document.getElementById('emergencyModal')) {
    document.getElementById('emergencyModal').classList.remove('active');
    document.body.classList.remove('modal-open');
  }
}

function getPlaceTypeConfig(type) {
  const cityLabel = getCityConfig().label;
  const configs = {
    hotel: {
      title: 'Hotel',
      fallbackQueries: [
        `${cityLabel} luxury hotel exterior`,
        `${cityLabel} hotel lobby interior`,
        `${cityLabel} hotel room`
      ]
    },
    restaurant: {
      title: 'Restaurant',
      fallbackQueries: [
        `${cityLabel} restaurant exterior`,
        `${cityLabel} restaurant interior`,
        `${cityLabel} food dishes`
      ]
    },
    cafe: {
      title: 'Cafe',
      fallbackQueries: [
        `${cityLabel} cafe exterior`,
        `${cityLabel} cafe interior`,
        `${cityLabel} coffee specialty`
      ]
    },
    mall: {
      title: 'Mall',
      fallbackQueries: [
        `${cityLabel} shopping mall exterior`,
        `${cityLabel} mall interior`,
        `${cityLabel} shopping stores`
      ]
    },
    activity: {
      title: 'Activity',
      fallbackQueries: [
        `${cityLabel} activity location`,
        `${cityLabel} travel experience`,
        `${cityLabel} attraction landscape`
      ]
    }
  };
  return configs[type];
}

function getPlaceByTypeAndId(type, id) {
  const cityData = getCityData();
  const buckets = {
    hotel: cityData.hotels,
    restaurant: cityData.restaurants,
    cafe: cityData.cafes,
    mall: cityData.malls,
    activity: cityData.activities
  };
  const list = buckets[type] || [];
  return list.find(item => item.id === id) || null;
}

function buildPlaceGallery(item, type) {
  const preset = Array.isArray(item.images) ? item.images.filter(Boolean) : [];
  return [...new Set([...preset, item.img].filter(Boolean))].slice(0, 3);
}

function escapeHtml(text) {
  return String(text ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function getPlaceCacheKey(item) {
  return `tg_place_live_${state.selectedCity}_${String(item.id || item.name).replace(/[^a-z0-9_-]/gi, '_')}`;
}

async function refreshPlaceIntelligence(type, id) {
  const item = getPlaceByTypeAndId(type, id);
  if (!item || !placesEndpoint) return;
  const button = document.querySelector('[data-refresh-place]');
  if (button) { button.disabled = true; button.textContent = ui('جارٍ التحديث…', 'Refreshing…'); }
  try {
    const response = await fetch(`${placesEndpoint}?query=${encodeURIComponent(`${item.name}, ${getCityConfig().label}, Thailand`)}`, { headers: { Accept: 'application/json' } });
    if (!response.ok) throw new Error('Place provider error');
    const live = await response.json();
    if (!isPlainObject(live)) throw new Error('Invalid place response');
    const safeLive = {
      rating: Number.isFinite(Number(live.rating)) ? Number(live.rating) : item.rating,
      hours: typeof live.hours === 'string' ? safeText(live.hours, 120) : item.hours,
      images: Array.isArray(live.images) ? live.images.filter(safeImage).slice(0, 3) : item.images,
      updatedAt: Date.now()
    };
    Object.assign(item, safeLive);
    writeStoredValue(getPlaceCacheKey(item), JSON.stringify(safeLive));
    openPlaceDetails(type, id);
  } catch {
    if (button) { button.disabled = false; button.textContent = ui('تعذر التحديث', 'Could not refresh'); }
  }
}

function hydrateCachedPlaceIntelligence(item) {
  const cached = readStoredJson(getPlaceCacheKey(item), null);
  if (!isPlainObject(cached) || Date.now() - Number(cached.updatedAt) > PLACE_CACHE_TTL) return false;
  Object.assign(item, cached);
  return true;
}

function openPlaceDetails(type, id) {
  const item = getPlaceByTypeAndId(type, id);
  if (!item) return;
  const cached = hydrateCachedPlaceIntelligence(item);

  const modal = document.getElementById('placeDetailModal');
  const titleEl = document.getElementById('placeDetailTitle');
  const subEl = document.getElementById('placeDetailSub');
  const bodyEl = document.getElementById('placeDetailBody');
  if (!modal || !titleEl || !subEl || !bodyEl) return;

  const cfg = getPlaceTypeConfig(type);
  const gallery = buildPlaceGallery(item, type);
  const galleryHtml = `
    <div class="place-gallery-head"><span>${ui('صور المكان', 'Place photos')}</span><small>${gallery.length} / 3</small></div>
    <div class="place-gallery">
      ${gallery.map((src, idx) => `<img src="${escapeHtml(safeImage(src))}" alt="${escapeHtml(item.name)} ${idx + 1}" onerror="this.style.display='none'">`).join('')}
    </div>
  `;

  let rows = '';
  if (type === 'hotel') {
    rows += `<div class="detail-row"><span class="detail-row-label">Rating</span><span class="detail-row-value">⭐ ${item.rating ?? '-'}</span></div>`;
    rows += `<div class="detail-row"><span class="detail-row-label">Address</span><span class="detail-row-value">${escapeHtml(item.address || '-')}</span></div>`;
    rows += `<div class="detail-row"><span class="detail-row-label">Phone</span><span class="detail-row-value">${escapeHtml(item.phone || '-')}</span></div>`;
    rows += `<div class="detail-row"><span class="detail-row-label">Notes</span><span class="detail-row-value">${escapeHtml(item.notes || '-')}</span></div>`;
  }
  if (type === 'restaurant' || type === 'cafe') {
    const status = getOpenStatus(item.hours || '');
    rows += `<div class="detail-row"><span class="detail-row-label">Type</span><span class="detail-row-value">${escapeHtml(item.type || '-')}</span></div>`;
    rows += `<div class="detail-row"><span class="detail-row-label">Rating</span><span class="detail-row-value">⭐ ${item.rating ?? '-'}</span></div>`;
    rows += `<div class="detail-row"><span class="detail-row-label">Hours</span><span class="detail-row-value">${escapeHtml(item.hours || '-')}</span></div>`;
    rows += `<div class="detail-row"><span class="detail-row-label">Now</span><span class="detail-row-value">${escapeHtml(status.label)} • ${escapeHtml(status.detail)}</span></div>`;
    rows += `<div class="detail-row"><span class="detail-row-label">Distance</span><span class="detail-row-value">${escapeHtml(item.distance || '-')}</span></div>`;
    rows += `<div class="detail-row"><span class="detail-row-label">Price</span><span class="detail-row-value">${escapeHtml(item.price || '-')}</span></div>`;
  }
  if (type === 'mall') {
    const status = getOpenStatus(item.hours || '');
    rows += `<div class="detail-row"><span class="detail-row-label">Hours</span><span class="detail-row-value">${escapeHtml(item.hours || '-')}</span></div>`;
    rows += `<div class="detail-row"><span class="detail-row-label">Now</span><span class="detail-row-value">${escapeHtml(status.label)} • ${escapeHtml(status.detail)}</span></div>`;
    rows += `<div class="detail-row"><span class="detail-row-label">Shops</span><span class="detail-row-value">${escapeHtml(item.shops || '-')}</span></div>`;
    rows += `<div class="detail-row"><span class="detail-row-label">Restaurants</span><span class="detail-row-value">${escapeHtml(item.restaurants || '-')}</span></div>`;
    rows += `<div class="detail-row"><span class="detail-row-label">Distance</span><span class="detail-row-value">${escapeHtml(item.distance || '-')}</span></div>`;
  }
  if (type === 'activity') {
    rows += `<div class="detail-row"><span class="detail-row-label">Company</span><span class="detail-row-value">${escapeHtml(item.company || '-')}</span></div>`;
    rows += `<div class="detail-row"><span class="detail-row-label">Start</span><span class="detail-row-value">${escapeHtml(item.time || '-')}</span></div>`;
    rows += `<div class="detail-row"><span class="detail-row-label">Duration</span><span class="detail-row-value">${escapeHtml(item.duration || '-')}</span></div>`;
    rows += `<div class="detail-row"><span class="detail-row-label">Price</span><span class="detail-row-value">${escapeHtml(item.price || '-')}</span></div>`;
    rows += `<div class="detail-row"><span class="detail-row-label">Bring</span><span class="detail-row-value">${escapeHtml(item.bring || '-')}</span></div>`;
    rows += `<div class="detail-row"><span class="detail-row-label">Notes</span><span class="detail-row-value">${escapeHtml(item.notes || '-')}</span></div>`;
  }

  const mapButton = item.map ? `<button class="action-btn gray" type="button" data-map-query="${escapeHtml(item.map)}">🗺️ Map</button>` : '';
  const copyNameButton = '<button class="action-btn green" type="button" data-copy-place-name>📋 Copy</button>';

  titleEl.textContent = item.name || 'Place Details';
  subEl.textContent = `${cfg?.title || 'Place'} • ${item.nameTh || getCityConfig().label}`;
  const liveControl = placesEndpoint ? `<button class="action-btn blue" type="button" data-refresh-place>${ui('تحديث بيانات المكان', 'Refresh place data')}</button>` : `<span class="place-data-status">${cached ? ui('بيانات محفوظة للعمل دون إنترنت', 'Cached for offline use') : ui('بيانات المكان محلية — اربط مزود الأماكن للتحديث الحي.', 'Local place data — connect a provider for live updates.')}</span>`;
  bodyEl.innerHTML = `${galleryHtml}<div class="detail-card" style="margin-bottom:0"><div class="detail-card-body" style="padding:0">${rows}<div class="action-row">${copyNameButton}${mapButton}${liveControl}</div></div></div>`;
  bodyEl.querySelector('[data-copy-place-name]')?.addEventListener('click', () => copyText(item.name));
  bodyEl.querySelector('[data-map-query]')?.addEventListener('click', event => openMap(event.currentTarget.dataset.mapQuery));
  bodyEl.querySelector('[data-refresh-place]')?.addEventListener('click', () => refreshPlaceIntelligence(type, id));

  modal.classList.add('active');
  document.body.classList.add('modal-open');
}

function closePlaceDetails(e) {
  if (!e || e.target === document.getElementById('placeDetailModal')) {
    document.getElementById('placeDetailModal').classList.remove('active');
    document.body.classList.remove('modal-open');
  }
}

// ============================================
// UTILITIES
// ============================================

function callNumber(num) {
  window.location.href = 'tel:' + num;
}
function copyText(text) {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text).then(() => alert('تم النسخ: ' + text));
  } else {
    const ta = document.createElement('textarea');
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
    alert('تم النسخ: ' + text);
  }
}
function openMap(query) {
  window.open('https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(query), '_blank');
}

// ============================================
// NOTES
// ============================================

function saveNotes() {
  state.notes = document.getElementById('notesArea').value;
  saveState();
}

// ============================================
// GALLERY
// ============================================

const TRIP_EXPORT_VERSION = 1;
const MAX_IMPORT_FILE_BYTES = 2 * 1024 * 1024;

function getCitySnapshot(cityKey) {
  if (cityKey === currentCityKey()) {
    return {
      favorites: state.favorites,
      schedule: state.schedule,
      visited: state.visited,
      weather: state.weather
    };
  }

  const cityData = getCityData(cityKey);
  const favoritesKey = cityScopedKey('tg_favorites', cityKey);
  const scheduleKey = cityScopedKey('tg_schedule', cityKey);
  const visitedKey = cityScopedKey('tg_visited', cityKey);
  const weatherKey = cityScopedKey('tg_weather', cityKey);
  const savedFavorites = readStoredJson(favoritesKey, null);
  return {
    favorites: savedFavorites === null ? [] : sanitizeFavorites(savedFavorites, favoritesKey),
    schedule: sanitizeSchedule(readStoredJson(scheduleKey, null), cityData.schedule, scheduleKey),
    visited: sanitizeTextArray(readStoredJson(visitedKey, []), visitedKey),
    weather: sanitizeWeather(readStoredJson(weatherKey, {}), weatherKey)
  };
}

function buildTripExport() {
  const cities = Object.keys(CITY_CONFIG).reduce((snapshot, cityKey) => {
    snapshot[cityKey] = getCitySnapshot(cityKey);
    return snapshot;
  }, {});

  return {
    version: TRIP_EXPORT_VERSION,
    exportedAt: new Date().toISOString(),
    includesPhotos: false,
    global: {
      theme: state.theme,
      language: state.language,
      selectedCity: state.selectedCity,
      currentSection: state.currentSection,
      packing: state.packing,
      notes: state.notes,
      budget: state.budget,
      budgetLimit: state.budgetLimit,
      expenses: state.expenses,
      exchangeRate: state.exchangeRate
    },
    cities
  };
}

function exportTripData() {
  const exportBlob = new Blob([JSON.stringify(buildTripExport(), null, 2)], { type: 'application/json' });
  const downloadUrl = URL.createObjectURL(exportBlob);
  const downloadLink = document.createElement('a');
  const date = new Date().toISOString().slice(0, 10);
  downloadLink.href = downloadUrl;
  downloadLink.download = `thailand-trip-backup-${date}.json`;
  document.body.appendChild(downloadLink);
  downloadLink.click();
  downloadLink.remove();
  URL.revokeObjectURL(downloadUrl);
}

function normalizeImportedCityState(value, cityKey) {
  if (!isPlainObject(value)) return null;
  const cityData = getCityData(cityKey);
  return {
    favorites: sanitizeFavorites(value.favorites, `import_favorites_${cityKey}`),
    schedule: sanitizeSchedule(value.schedule, cityData.schedule, `import_schedule_${cityKey}`),
    visited: sanitizeTextArray(value.visited, `import_visited_${cityKey}`),
    weather: sanitizeWeather(value.weather, `import_weather_${cityKey}`)
  };
}

function normalizeImportedGlobalState(value) {
  if (!isPlainObject(value)) return null;
  const packing = sanitizePacking(value.packing, 'import_packing') || defaultPacking.map(text => ({ text, done: false }));
  const selectedCity = CITY_CONFIG[value.selectedCity] ? value.selectedCity : state.selectedCity;
  const section = validSections.has(value.currentSection) ? value.currentSection : 'home';
  return {
    theme: value.theme === 'dark' ? 'dark' : 'light',
    language: value.language === 'ar' ? 'ar' : 'en',
    selectedCity,
    currentSection: section,
    packing,
    notes: safeText(value.notes, 20000),
    budget: sanitizeBudget(value.budget, 'import_budget'),
    budgetLimit: Math.max(0, Number(value.budgetLimit) || 0),
    expenses: sanitizeExpenses(value.expenses, 'import_expenses'),
    exchangeRate: sanitizeExchangeRate(value.exchangeRate)
  };
}

function writeCitySnapshot(cityKey, snapshot) {
  return [
    [cityScopedKey('tg_favorites', cityKey), JSON.stringify(snapshot.favorites)],
    [cityScopedKey('tg_schedule', cityKey), JSON.stringify(snapshot.schedule)],
    [cityScopedKey('tg_visited', cityKey), JSON.stringify(snapshot.visited)],
    [cityScopedKey('tg_weather', cityKey), JSON.stringify(snapshot.weather)]
  ].every(([key, value]) => writeStoredValue(key, value));
}

async function importTripData(input) {
  const file = input.files[0];
  input.value = '';
  if (!file) return;
  if (file.size > MAX_IMPORT_FILE_BYTES) {
    alert('ملف النسخة الاحتياطية كبير جداً. الحد الأقصى المسموح هو 2 ميغابايت.');
    return;
  }

  let importedData;
  try {
    importedData = JSON.parse(await file.text());
  } catch {
    alert('تعذر قراءة الملف. اختر نسخة احتياطية بصيغة JSON صحيحة.');
    return;
  }

  if (!isPlainObject(importedData) || importedData.version !== TRIP_EXPORT_VERSION || !isPlainObject(importedData.cities)) {
    alert('هذا الملف ليس نسخة احتياطية متوافقة مع التطبيق.');
    return;
  }

  const globalState = normalizeImportedGlobalState(importedData.global);
  if (!globalState) {
    alert('بيانات الإعدادات في الملف غير صالحة. لم يتم تغيير أي شيء.');
    return;
  }
  const citySnapshots = Object.keys(CITY_CONFIG).reduce((snapshots, cityKey) => {
    const snapshot = normalizeImportedCityState(importedData.cities[cityKey], cityKey);
    if (snapshot) snapshots[cityKey] = snapshot;
    return snapshots;
  }, {});
  if (!Object.keys(citySnapshots).length) {
    alert('لا يحتوي الملف على بيانات مدينة صالحة للاستيراد.');
    return;
  }
  if (!confirm('سيتم استبدال بيانات الرحلة الحالية. الصور المحفوظة على هذا الجهاز لن تتأثر. هل تريد المتابعة؟')) return;

  const globalSaved = [
    ['tg_theme', globalState.theme],
    ['tg_language', globalState.language],
    ['tg_language_initialized', '1'],
    ['tg_city', globalState.selectedCity || ''],
    ['tg_section', globalState.currentSection],
    ['tg_packing', JSON.stringify(globalState.packing)],
    ['tg_notes', globalState.notes],
    ['tg_budget', JSON.stringify(globalState.budget)],
    ['tg_budget_limit', String(globalState.budgetLimit)],
    ['tg_expenses', JSON.stringify(globalState.expenses)],
    ['tg_rate', String(globalState.exchangeRate)]
  ].every(([key, value]) => writeStoredValue(key, value));
  const citiesSaved = Object.entries(citySnapshots).every(([cityKey, snapshot]) => writeCitySnapshot(cityKey, snapshot));
  if (!globalSaved || !citiesSaved) {
    notifyStorageIssue('تعذر حفظ النسخة الاحتياطية بالكامل بسبب مشكلة في التخزين المحلي.');
    return;
  }

  state.theme = globalState.theme;
  state.language = globalState.language;
  state.selectedCity = globalState.selectedCity;
  state.currentSection = globalState.currentSection;
  state.packing = globalState.packing;
  state.notes = globalState.notes;
  state.budget = globalState.budget;
  state.budgetLimit = globalState.budgetLimit;
  state.expenses = globalState.expenses;
  state.exchangeRate = globalState.exchangeRate;
  loadCityScopedState(state.selectedCity || 'phuket');
  applyTheme();
  applyLanguage();
  applyCityIdentity();
  setCityBadge();
  document.getElementById('notesArea').value = state.notes;
  showSection('settings');
  alert('تم استيراد بيانات الرحلة بنجاح. الصور المحلية لم تتغير.');
}

function resetCurrentCityData() {
  const cityKey = currentCityKey();
  if (!confirm(`سيتم حذف مفضلاتك وجدولك والأماكن المزارة وبيانات الطقس المحفوظة لمدينة ${getCityConfig(cityKey).label}. هل تريد المتابعة؟`)) return;

  const removed = [
    cityScopedKey('tg_favorites', cityKey),
    cityScopedKey('tg_schedule', cityKey),
    cityScopedKey('tg_visited', cityKey),
    cityScopedKey('tg_weather', cityKey)
  ].every(removeStoredValue);
  if (!removed) {
    notifyStorageIssue('تعذر حذف بعض بيانات المدينة من تخزين الجهاز.');
    return;
  }
  loadCityScopedState(cityKey);
  state.expenses = state.expenses.filter(expense => expense.city !== cityKey);
  saveState();
  applyCityIdentity();
  renderWeather();
  showSection('settings');
  alert('تمت إعادة بيانات المدينة إلى الخطة الافتراضية.');
}

async function resetAllAppData() {
  if (!confirm('سيؤدي هذا إلى حذف جميع خطط الرحلة والملاحظات والصور من هذا الجهاز. هل تريد المتابعة؟')) return;
  if (!confirm('تأكيد أخير: لا يمكن التراجع عن مسح جميع بيانات التطبيق.')) return;

  const cityKeys = Object.keys(CITY_CONFIG).flatMap(cityKey => [
    cityScopedKey('tg_favorites', cityKey),
    cityScopedKey('tg_schedule', cityKey),
    cityScopedKey('tg_visited', cityKey),
    cityScopedKey('tg_weather', cityKey)
  ]);
  const globalKeys = ['tg_theme', 'tg_language', 'tg_language_initialized', 'tg_city', 'tg_section', 'tg_favorites', 'tg_packing', 'tg_notes', 'tg_budget', 'tg_budget_limit', 'tg_expenses', 'tg_weather', 'tg_rate', 'tg_photos'];
  const stateRemoved = [...globalKeys, ...cityKeys].every(removeStoredValue);
  try {
    await clearPhotoLibrary();
  } catch {
    notifyStorageIssue('تم مسح بيانات الرحلة، لكن تعذر حذف بعض الصور من تخزين الجهاز.');
  }
  if (!stateRemoved) notifyStorageIssue('تمت إعادة ضبط التطبيق، لكن تعذر حذف بعض البيانات من تخزين الجهاز.');

  state.theme = 'light';
  state.language = 'en';
  state.selectedCity = '';
  state.currentSection = 'home';
  state.favorites = [];
  state.packing = defaultPacking.map(text => ({ text, done: false }));
  state.notes = '';
  state.budget = {};
  state.budgetLimit = 0;
  state.expenses = [];
  state.weather = {};
  state.exchangeRate = 110;
  state.photos = [];
  state.schedule = [];
  state.visited = [];
  applyTheme();
  applyLanguage();
  document.getElementById('notesArea').value = '';
  openCityPicker();
  alert('تم مسح جميع بيانات التطبيق من هذا الجهاز.');
}

function createPhotoId() {
  if (window.crypto?.randomUUID) return window.crypto.randomUUID();
  return `photo-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function getLegacyPhotoId(photo, index) {
  let hash = 5381;
  for (let position = 0; position < photo.length; position += 1) hash = ((hash << 5) + hash) ^ photo.charCodeAt(position);
  return `legacy-${index}-${(hash >>> 0).toString(36)}`;
}

function dataUrlToBlob(dataUrl) {
  return fetch(dataUrl).then(response => response.blob());
}

function openPhotoDatabase() {
  if (photoDatabasePromise) return photoDatabasePromise;
  if (!('indexedDB' in window)) return Promise.reject(new Error('IndexedDB is unavailable.'));

  photoDatabasePromise = new Promise((resolve, reject) => {
    const request = indexedDB.open(PHOTO_DATABASE_NAME, PHOTO_DATABASE_VERSION);
    request.onupgradeneeded = () => {
      const database = request.result;
      if (!database.objectStoreNames.contains(PHOTO_STORE_NAME)) {
        database.createObjectStore(PHOTO_STORE_NAME, { keyPath: 'id' });
      }
    };
    request.onsuccess = () => {
      photoDatabase = request.result;
      resolve(photoDatabase);
    };
    request.onerror = () => reject(request.error || new Error('Unable to open the photo database.'));
  });

  return photoDatabasePromise;
}

async function listPhotoRecords() {
  const database = await openPhotoDatabase();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(PHOTO_STORE_NAME, 'readonly');
    const request = transaction.objectStore(PHOTO_STORE_NAME).getAll();
    request.onsuccess = () => resolve(request.result.filter(photo => photo?.id && photo.blob instanceof Blob).sort((a, b) => b.createdAt - a.createdAt));
    request.onerror = () => reject(request.error || new Error('Unable to read saved photos.'));
  });
}

async function savePhotoRecord(photo) {
  const database = await openPhotoDatabase();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(PHOTO_STORE_NAME, 'readwrite');
    transaction.objectStore(PHOTO_STORE_NAME).put(photo);
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error || new Error('Unable to save the photo.'));
    transaction.onabort = () => reject(transaction.error || new Error('Photo storage was aborted.'));
  });
}

async function deletePhotoRecord(id) {
  const database = await openPhotoDatabase();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(PHOTO_STORE_NAME, 'readwrite');
    transaction.objectStore(PHOTO_STORE_NAME).delete(id);
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error || new Error('Unable to delete the photo.'));
    transaction.onabort = () => reject(transaction.error || new Error('Photo deletion was aborted.'));
  });
}

async function clearPhotoLibrary() {
  releasePhotoObjectUrls();
  if (photoDatabase) photoDatabase.close();
  photoDatabase = undefined;
  photoDatabasePromise = undefined;
  photoLibraryPromise = undefined;
  photoLibrary = [];
  if (!('indexedDB' in window)) return true;

  return new Promise((resolve, reject) => {
    const request = indexedDB.deleteDatabase(PHOTO_DATABASE_NAME);
    request.onsuccess = () => resolve(true);
    request.onerror = () => reject(request.error || new Error('Unable to clear photo storage.'));
    request.onblocked = () => reject(new Error('Photo storage is open in another tab.'));
  });
}

async function loadPhotoLibrary() {
  if (photoLibraryPromise) return photoLibraryPromise;

  photoLibraryPromise = (async () => {
    const legacyPhotos = state.photos;
    const existingPhotos = await listPhotoRecords();
    if (legacyPhotos.length) {
      for (const [index, legacyPhoto] of legacyPhotos.entries()) {
        const blob = await dataUrlToBlob(legacyPhoto);
        await savePhotoRecord({
          id: getLegacyPhotoId(legacyPhoto, index),
          blob,
          createdAt: Date.now() - index,
          type: blob.type
        });
      }
      if (!removeStoredValue('tg_photos')) notifyStorageIssue('تم نقل الصور، لكن تعذر حذف النسخة المحلية القديمة.');
      state.photos = [];
    }
    photoLibrary = legacyPhotos.length ? await listPhotoRecords() : existingPhotos;
    return photoLibrary;
  })().catch(error => {
    photoLibraryPromise = undefined;
    throw error;
  });

  return photoLibraryPromise;
}

function releasePhotoObjectUrls() {
  activePhotoObjectUrls.forEach(url => URL.revokeObjectURL(url));
  activePhotoObjectUrls = [];
}

function createPhotoSource(photo) {
  const url = URL.createObjectURL(photo.blob);
  activePhotoObjectUrls.push(url);
  return url;
}

async function deletePhoto(id) {
  if (!confirm('حذف الصورة؟')) return;
  try {
    await deletePhotoRecord(id);
    photoLibrary = photoLibrary.filter(photo => photo.id !== id);
    renderGallery();
  } catch {
    alert('تعذر حذف الصورة من تخزين الجهاز.');
  }
}

async function renderGallery() {
  const grid = document.getElementById('photoGrid');
  grid.innerHTML = '<div class="empty-state">جارٍ تحميل الصور...</div>';
  try {
    const photos = await loadPhotoLibrary();
    releasePhotoObjectUrls();
    const photoItems = photos.map(photo => `
      <button class="photo-grid-item" type="button" data-photo-id="${escapeHtml(photo.id)}">
        <img src="${createPhotoSource(photo)}" alt="صورة من الرحلة">
      </button>
    `).join('');
    grid.innerHTML = `${photoItems}<label class="photo-grid-item photo-add"><span>+</span><input type="file" accept="image/jpeg,image/png,image/gif,image/webp" onchange="addPhoto(this)"></label>`;
    grid.querySelectorAll('[data-photo-id]').forEach(button => {
      button.addEventListener('click', () => deletePhoto(button.dataset.photoId));
    });
  } catch {
    grid.innerHTML = '<div class="empty-state"><div class="empty-state-icon">📷</div><div>تعذر فتح معرض الصور على هذا الجهاز.</div></div>';
  }
}

async function addPhoto(input) {
  const file = input.files[0];
  if (!file) return;
  if (!USER_PHOTO_TYPES.has(file.type)) {
    alert('يرجى اختيار صورة بصيغة JPEG أو PNG أو GIF أو WebP.');
    input.value = '';
    return;
  }
  input.value = '';
  try {
    await loadPhotoLibrary();
    await savePhotoRecord({
      id: createPhotoId(),
      blob: file,
      createdAt: Date.now(),
      type: file.type
    });
    photoLibrary = await listPhotoRecords();
    renderGallery();
  } catch {
    alert('تعذر حفظ الصورة. تحقق من مساحة تخزين الجهاز ثم حاول مرة أخرى.');
  }
}

// ============================================
// INIT
// ============================================

applyTheme();
applyLanguage();
new MutationObserver(() => translateRenderedInterface()).observe(document.body, { childList: true, subtree: true });
setCityBadge();
document.getElementById('notesArea').value = state.notes;
updateProgress();
if (STORAGE_RECOVERY_KEYS.size) {
  setTimeout(() => notifyStorageIssue('تمت استعادة البيانات المحلية التالفة إلى حالة آمنة. قد تحتاج إلى إعادة إدخال بعض المعلومات.'), 0);
}
setInterval(refreshWeather, 10 * 60 * 1000);
setInterval(refreshBusinessStatus, 60 * 1000);

if (!state.selectedCity) {
  openCityPicker();
} else {
  enterCity(state.selectedCity);
}

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./sw.js').catch(() => {});
}

document.addEventListener('input', event => {
  if (event.target.closest('#sec-budget')) {
    queueMicrotask(() => renderBudgetHealth(Object.values(state.budget).reduce((sum, amount) => sum + (Number(amount) || 0), 0)));
  }
});

document.addEventListener('keydown', event => {
  if (event.key !== 'Escape') return;
  closeEmergency();
  closePlaceDetails();
  closeScheduleEditor();
});
