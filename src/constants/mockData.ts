import { Service, Resource, Place, CommunityPost, Tip, Review, SleepLog, UserReview } from '../types';

export const MOCK_PLACES: Place[] = [
  {
    "id": "p1",
    "name": "Denver Health",
    "address": "777 Bannock St, Denver, CO 80204",
    "category": "hospital",
    "lat": 39.7286,
    "lng": -104.9904,
    "source": "Google Places",
    "rating": 3.5,
    "reviewCount": 1245,
    "description": "Denver Health is a comprehensive, integrated organization providing level I care for all, regardless of ability to pay.",
    "hours": "Open 24 hours",
    "phone": "(303) 436-6000",
    "websiteUrl": "https://www.denverhealth.org/",
    "photos": [
      "https://picsum.photos/seed/denverhealth1/800/600"
    ],
    "accessibilityFeatures": [
      "wheelchair",
      "family_restroom"
    ],
    "aggregateStats": {
      "avgCleanliness": 4,
      "avgPrivacy": 4,
      "strollerAccessRate": 1,
      "reviewCount": 1245
    }
  },
  {
    "id": "p2",
    "name": "Children's Hospital Colorado Anschutz Medical Campus",
    "address": "13123 E 16th Ave, Aurora, CO 80045",
    "category": "hospital",
    "lat": 39.7432,
    "lng": -104.8354,
    "source": "Google Places",
    "rating": 4.6,
    "reviewCount": 2310,
    "description": "Top-ranked pediatric hospital providing comprehensive care for children and adolescents.",
    "hours": "Open 24 hours",
    "phone": "(720) 777-1234",
    "websiteUrl": "https://www.childrenscolorado.org/",
    "photos": [
      "https://picsum.photos/seed/childrenshospital1/800/600"
    ],
    "accessibilityFeatures": [
      "wheelchair",
      "family_restroom",
      "nursing_room"
    ],
    "aggregateStats": {
      "avgCleanliness": 4.8,
      "avgPrivacy": 4.5,
      "strollerAccessRate": 1,
      "reviewCount": 2310
    }
  },
  {
    "id": "p3",
    "name": "City Park",
    "address": "2001 Colorado Blvd, Denver, CO 80205",
    "category": "playground",
    "lat": 39.7441,
    "lng": -104.9458,
    "source": "Google Places",
    "rating": 4.7,
    "reviewCount": 8450,
    "description": "Expansive urban park featuring a large, accessible playground, lakes, and views of the mountains.",
    "hours": "5:00 AM - 11:00 PM",
    "phone": "(720) 913-1311",
    "websiteUrl": "https://www.denvergov.org/Government/Agencies-Departments-Offices/Agencies-Departments-Offices-Directory/Parks-Recreation/Parks/City-Park",
    "photos": [
      "https://picsum.photos/seed/citypark1/800/600"
    ],
    "accessibilityFeatures": [
      "wheelchair",
      "stroller_parking"
    ],
    "aggregateStats": {
      "avgCleanliness": 4.2,
      "avgPrivacy": 3.5,
      "strollerAccessRate": 1,
      "reviewCount": 8450
    }
  },
  {
    "id": "p4",
    "name": "Washington Park",
    "address": "S Downing St & E Louisiana Ave, Denver, CO 80209",
    "category": "playground",
    "lat": 39.6995,
    "lng": -104.9668,
    "source": "Google Places",
    "rating": 4.8,
    "reviewCount": 9120,
    "description": "Popular park with two lakes, two flower gardens, and a large, modern playground for children.",
    "hours": "5:00 AM - 11:00 PM",
    "phone": "(720) 913-1311",
    "websiteUrl": "https://www.denvergov.org/Government/Agencies-Departments-Offices/Agencies-Departments-Offices-Directory/Parks-Recreation/Parks/Washington-Park",
    "photos": [
      "https://picsum.photos/seed/washpark1/800/600"
    ],
    "accessibilityFeatures": [
      "wheelchair",
      "stroller_parking"
    ],
    "aggregateStats": {
      "avgCleanliness": 4.5,
      "avgPrivacy": 3.8,
      "strollerAccessRate": 1,
      "reviewCount": 9120
    }
  },
  {
    "id": "p5",
    "name": "Children's Hospital Colorado Urgent Care, Uptown Denver",
    "address": "1830 Franklin St, Denver, CO 80218",
    "category": "pediatric_urgent_care",
    "lat": 39.7447,
    "lng": -104.9686,
    "source": "Google Places",
    "rating": 4.4,
    "reviewCount": 320,
    "description": "Expert pediatric urgent care for illnesses and injuries that need immediate attention but are not life-threatening.",
    "hours": "8:00 AM - 8:00 PM",
    "phone": "(720) 777-1360",
    "websiteUrl": "https://www.childrenscolorado.org/locations/uptown-denver/",
    "photos": [
      "https://picsum.photos/seed/uptownurgentcare1/800/600"
    ],
    "accessibilityFeatures": [
      "wheelchair",
      "family_restroom"
    ],
    "aggregateStats": {
      "avgCleanliness": 4.7,
      "avgPrivacy": 4.5,
      "strollerAccessRate": 1,
      "reviewCount": 320
    }
  },
  {
    "id": "p6",
    "name": "Denver Union Station",
    "address": "1701 Wynkoop St, Denver, CO 80202",
    "category": "bathroom",
    "lat": 39.7529,
    "lng": -104.9998,
    "source": "Google Places",
    "rating": 4.6,
    "reviewCount": 15400,
    "description": "Clean, modern public restrooms located in the historic Great Hall of Denver Union Station.",
    "hours": "6:00 AM - 12:00 AM",
    "phone": "(303) 592-6712",
    "websiteUrl": "https://unionstationindenver.com/",
    "photos": [
      "https://picsum.photos/seed/unionstation1/800/600"
    ],
    "accessibilityFeatures": [
      "wheelchair",
      "changing_table",
      "family_restroom"
    ],
    "aggregateStats": {
      "avgCleanliness": 4.5,
      "avgPrivacy": 3.8,
      "strollerAccessRate": 0.9,
      "reviewCount": 15400
    }
  },
  {
    "id": "p7",
    "name": "Denver Art Museum",
    "address": "100 W 14th Ave Pkwy, Denver, CO 80204",
    "category": "nursing_room",
    "lat": 39.7371,
    "lng": -104.9893,
    "source": "Google Places",
    "rating": 4.7,
    "reviewCount": 12300,
    "description": "Dedicated nursing rooms and family restrooms available for visitors with infants and toddlers.",
    "hours": "10:00 AM - 5:00 PM",
    "phone": "(720) 865-5000",
    "websiteUrl": "https://www.denverartmuseum.org/",
    "photos": [
      "https://picsum.photos/seed/denverartmuseum1/800/600"
    ],
    "accessibilityFeatures": [
      "wheelchair",
      "changing_table",
      "nursing_room",
      "family_restroom"
    ],
    "aggregateStats": {
      "avgCleanliness": 4.9,
      "avgPrivacy": 4.5,
      "strollerAccessRate": 1,
      "reviewCount": 12300
    }
  },
  {
    "id": "p8",
    "name": "Cherry Creek Shopping Center",
    "address": "3000 E 1st Ave, Denver, CO 80206",
    "category": "nursing_room",
    "lat": 39.7162,
    "lng": -104.9532,
    "source": "Google Places",
    "rating": 4.5,
    "reviewCount": 8900,
    "description": "Premium family lounge with private nursing areas, changing stations, and a comfortable seating area.",
    "hours": "10:00 AM - 8:00 PM",
    "phone": "(303) 388-3900",
    "websiteUrl": "https://www.shopcherrycreek.com/",
    "photos": [
      "https://picsum.photos/seed/cherrycreek1/800/600"
    ],
    "accessibilityFeatures": [
      "wheelchair",
      "changing_table",
      "nursing_room",
      "stroller_parking"
    ],
    "aggregateStats": {
      "avgCleanliness": 4.7,
      "avgPrivacy": 4.8,
      "strollerAccessRate": 1,
      "reviewCount": 8900
    }
  },
  {
    "id": "p9",
    "name": "Denver Zoo",
    "address": "2300 Steele St, Denver, CO 80205",
    "category": "changing_station",
    "lat": 39.7501,
    "lng": -104.9489,
    "source": "Google Places",
    "rating": 4.6,
    "reviewCount": 21500,
    "description": "Multiple family-friendly restrooms with changing tables located throughout the zoo grounds.",
    "hours": "10:00 AM - 5:00 PM",
    "phone": "(720) 337-1400",
    "websiteUrl": "https://denverzoo.org/",
    "photos": [
      "https://picsum.photos/seed/denverzoo1/800/600"
    ],
    "accessibilityFeatures": [
      "wheelchair",
      "changing_table",
      "stroller_parking"
    ],
    "aggregateStats": {
      "avgCleanliness": 4.2,
      "avgPrivacy": 3.8,
      "strollerAccessRate": 0.9,
      "reviewCount": 21500
    }
  },
  {
    "id": "p10",
    "name": "Stella's Coffee Haus",
    "address": "1476 S Pearl St, Denver, CO 80210",
    "category": "cafe",
    "lat": 39.6896,
    "lng": -104.9806,
    "source": "Google Places",
    "rating": 4.7,
    "reviewCount": 1800,
    "description": "Cozy, family-friendly coffee shop with a large patio and comfortable seating.",
    "hours": "7:00 AM - 10:00 PM",
    "phone": "(303) 777-1031",
    "websiteUrl": "https://www.stellascoffee.com/",
    "photos": [
      "https://picsum.photos/seed/stellas1/800/600"
    ],
    "accessibilityFeatures": [
      "wheelchair",
      "stroller_parking"
    ],
    "aggregateStats": {
      "avgCleanliness": 4.5,
      "avgPrivacy": 4,
      "strollerAccessRate": 0.8,
      "reviewCount": 1800
    }
  },
  {
    "id": "p11",
    "name": "The Mama 'Hood Denver",
    "address": "2902 Zuni St, Denver, CO 80211",
    "category": "prenatal_class",
    "lat": 39.7588,
    "lng": -105.0153,
    "source": "Google Places",
    "rating": 4.8,
    "reviewCount": 340,
    "description": "Comprehensive center offering prenatal yoga, childbirth education, and new mom support groups.",
    "hours": "9:00 AM - 5:00 PM",
    "phone": "(303) 643-5662",
    "websiteUrl": "https://www.themamahood.com/",
    "photos": [
      "https://picsum.photos/seed/mamahood1/800/600"
    ],
    "accessibilityFeatures": [
      "wheelchair",
      "stroller_parking",
      "nursing_room"
    ],
    "aggregateStats": {
      "avgCleanliness": 4.9,
      "avgPrivacy": 4.8,
      "strollerAccessRate": 1,
      "reviewCount": 340
    }
  },
  {
    "id": "p12",
    "name": "Children's Museum of Denver at Marsico Campus",
    "address": "2121 Children's Museum Dr, Denver, CO 80211",
    "category": "bathroom",
    "lat": 39.7481,
    "lng": -105.0169,
    "source": "Google Places",
    "rating": 4.7,
    "reviewCount": 4500,
    "description": "Designed specifically for families with small children, featuring excellent family restrooms.",
    "hours": "9:00 AM - 4:00 PM",
    "phone": "(303) 433-7444",
    "websiteUrl": "https://www.mychildsmuseum.org/",
    "photos": [
      "https://picsum.photos/seed/childrensmuseum1/800/600"
    ],
    "accessibilityFeatures": [
      "wheelchair",
      "changing_table",
      "nursing_room",
      "family_restroom",
      "stroller_parking"
    ],
    "aggregateStats": {
      "avgCleanliness": 4.8,
      "avgPrivacy": 4.2,
      "strollerAccessRate": 1,
      "reviewCount": 4500
    }
  },
  {
    "id": "p11",
    "name": "City Park Playground",
    "address": "2001 Colorado Blvd, Denver, CO 80205",
    "category": "playground",
    "lat": 39.7436,
    "lng": -104.9416,
    "source": "Google Places",
    "rating": 4.8,
    "reviewCount": 450,
    "description": "A large, inclusive playground with separate areas for toddlers and older children, featuring soft rubber surfacing and plenty of shade.",
    "hours": "Open 24 hours",
    "photos": [
      "https://picsum.photos/seed/cityparkplayground/800/600"
    ],
    "accessibilityFeatures": [
      "wheelchair",
      "stroller_friendly",
      "family_restroom"
    ],
    "aggregateStats": {
      "avgCleanliness": 4.5,
      "avgPrivacy": 3.0,
      "strollerAccessRate": 0.95,
      "reviewCount": 450
    }
  },
  {
    "id": "p12",
    "name": "Washington Park Playground",
    "address": "701 S Franklin St, Denver, CO 80209",
    "category": "playground",
    "lat": 39.7029,
    "lng": -104.9653,
    "source": "Google Places",
    "rating": 4.9,
    "reviewCount": 820,
    "description": "Beautiful park with a large playground, nearby restrooms, and paved paths perfect for strollers.",
    "hours": "Open 24 hours",
    "photos": [
      "https://picsum.photos/seed/washparkplayground/800/600"
    ],
    "accessibilityFeatures": [
      "wheelchair",
      "stroller_friendly",
      "family_restroom"
    ],
    "aggregateStats": {
      "avgCleanliness": 4.6,
      "avgPrivacy": 3.2,
      "strollerAccessRate": 0.98,
      "reviewCount": 820
    }
  },
  {
    "id": "p13",
    "name": "Little Owl Coffee",
    "address": "1555 Blake St, Denver, CO 80202",
    "category": "cafe",
    "lat": 39.7503,
    "lng": -104.9995,
    "source": "Google Places",
    "rating": 4.7,
    "reviewCount": 315,
    "description": "Cozy, modern cafe with excellent coffee and a welcoming atmosphere. Has a clean, accessible restroom with a changing table.",
    "hours": "7:00 AM - 4:00 PM",
    "phone": "(720) 381-1722",
    "websiteUrl": "https://littleowlcoffee.com/",
    "photos": [
      "https://picsum.photos/seed/littleowlcoffee/800/600"
    ],
    "accessibilityFeatures": [
      "wheelchair",
      "stroller_friendly",
      "changing_station"
    ],
    "aggregateStats": {
      "avgCleanliness": 4.9,
      "avgPrivacy": 4.0,
      "strollerAccessRate": 0.85,
      "reviewCount": 315
    }
  },
  {
    "id": "p14",
    "name": "Huckleberry Roasters",
    "address": "4301 Pecos St, Denver, CO 80211",
    "category": "cafe",
    "lat": 39.7766,
    "lng": -105.0063,
    "source": "Google Places",
    "rating": 4.8,
    "reviewCount": 540,
    "description": "Spacious cafe with plenty of room for strollers, comfortable seating, and a dedicated family restroom.",
    "hours": "6:30 AM - 5:00 PM",
    "phone": "(720) 583-6581",
    "websiteUrl": "https://huckleberryroasters.com/",
    "photos": [
      "https://picsum.photos/seed/huckleberryroasters/800/600"
    ],
    "accessibilityFeatures": [
      "wheelchair",
      "stroller_friendly",
      "family_restroom",
      "changing_station"
    ],
    "aggregateStats": {
      "avgCleanliness": 4.8,
      "avgPrivacy": 4.2,
      "strollerAccessRate": 0.95,
      "reviewCount": 540
    }
  }
];

export const MOCK_SERVICES: Service[] = [
  {
    "id": "s1",
    "name": "Pediatrics 5280",
    "category": "pediatrician",
    "description": "Comprehensive pediatric care from newborns to young adults, focusing on preventive medicine and wellness.",
    "rating": 4.9,
    "reviewCount": 450,
    "phone": "(303) 779-5437",
    "email": "info@pediatrics5280.com",
    "websiteUrl": "https://www.pediatrics5280.com/",
    "hours": "8:00 AM - 5:00 PM",
    "address": "8671 S Quebec St #120, Highlands Ranch, CO 80130",
    "coordinates": {
      "lat": 39.5591,
      "lng": -104.9023
    },
    "specializations": [
      "Newborn Care",
      "Preventive Medicine",
      "Adolescent Health"
    ],
    "languages": [
      "English",
      "Spanish"
    ],
    "insuranceAccepted": [
      "Aetna",
      "Blue Cross Blue Shield",
      "Cigna",
      "UnitedHealthcare"
    ],
    "pricing": {
      "range": "$"
    },
    "availability": "Accepting New Patients",
    "verificationBadges": [
      "Board Certified"
    ],
    "imageUrl": "https://picsum.photos/seed/pediatrics5280/800/600",
    "createdDate": "2023-01-15T08:00:00Z",
    "photos": [
      "https://picsum.photos/seed/pediatrics5280/800/600"
    ]
  },
  {
    "id": "s2",
    "name": "Every Child Pediatrics",
    "category": "pediatrician",
    "description": "Providing comprehensive, affordable healthcare to all children, regardless of their family's insurance status or ability to pay.",
    "rating": 4.7,
    "reviewCount": 320,
    "phone": "(303) 450-3690",
    "email": "contact@everychildpediatrics.org",
    "websiteUrl": "https://everychildpediatrics.org/",
    "hours": "8:00 AM - 5:00 PM",
    "address": "3300 Buchtel Blvd S, Denver, CO 80210",
    "coordinates": {
      "lat": 39.6841,
      "lng": -104.9482
    },
    "specializations": [
      "General Pediatrics",
      "Behavioral Health",
      "Dental Care"
    ],
    "languages": [
      "English",
      "Spanish"
    ],
    "insuranceAccepted": [
      "Medicaid",
      "CHP+",
      "Most Private Insurances"
    ],
    "pricing": {
      "range": "$"
    },
    "availability": "Accepting New Patients",
    "verificationBadges": [
      "Non-Profit",
      "Board Certified"
    ],
    "imageUrl": "https://picsum.photos/seed/everychildpediatrics/800/600",
    "createdDate": "2023-02-20T09:30:00Z",
    "photos": [
      "https://picsum.photos/seed/everychildpediatrics/800/600"
    ]
  },
  {
    "id": "s3",
    "name": "Denver Lactation",
    "category": "lactation",
    "description": "Expert lactation consulting services providing in-home and virtual support for breastfeeding families.",
    "rating": 5,
    "reviewCount": 150,
    "phone": "(720) 507-1001",
    "email": "support@denverlactation.com",
    "websiteUrl": "https://www.denverlactation.com/",
    "hours": "9:00 AM - 6:00 PM",
    "address": "1234 S Gilpin St, Denver, CO 80210",
    "coordinates": {
      "lat": 39.6934,
      "lng": -104.9673
    },
    "specializations": [
      "Breastfeeding Support",
      "Pumping Consultations",
      "Weaning"
    ],
    "languages": [
      "English"
    ],
    "insuranceAccepted": [
      "Aetna",
      "UnitedHealthcare",
      "Self-Pay"
    ],
    "pricing": {
      "range": "$"
    },
    "availability": "Available this week",
    "verificationBadges": [
      "IBCLC Certified"
    ],
    "imageUrl": "https://picsum.photos/seed/denverlactation/800/600",
    "createdDate": "2023-03-10T10:15:00Z",
    "photos": [
      "https://picsum.photos/seed/denverlactation/800/600"
    ]
  },
  {
    "id": "s4",
    "name": "Postpartum Wellness Center of Boulder",
    "category": "therapist",
    "description": "Specialized therapy and psychiatric services for women experiencing perinatal mood and anxiety disorders.",
    "rating": 4.8,
    "reviewCount": 210,
    "phone": "(303) 586-1564",
    "email": "info@pwcboulder.com",
    "websiteUrl": "https://www.pwcboulder.com/",
    "hours": "8:00 AM - 6:00 PM",
    "address": "3000 Center Green Dr #210, Boulder, CO 80301",
    "coordinates": {
      "lat": 40.0274,
      "lng": -105.2519
    },
    "specializations": [
      "Postpartum Depression",
      "Anxiety",
      "Birth Trauma"
    ],
    "languages": [
      "English"
    ],
    "insuranceAccepted": [
      "Out of Network",
      "Self-Pay"
    ],
    "pricing": {
      "range": "$$"
    },
    "availability": "Waitlist",
    "verificationBadges": [
      "Licensed Therapist"
    ],
    "imageUrl": "https://picsum.photos/seed/pwcboulder/800/600",
    "createdDate": "2023-04-05T11:45:00Z",
    "photos": [
      "https://picsum.photos/seed/pwcboulder/800/600"
    ]
  },
  {
    "id": "s5",
    "name": "FIT4MOM Denver",
    "category": "exercise",
    "description": "Fitness classes for moms at every stage of motherhood, including Stroller Strides and Body Well programs.",
    "rating": 4.9,
    "reviewCount": 380,
    "phone": "(303) 555-0199",
    "email": "denver@fit4mom.com",
    "websiteUrl": "https://denver.fit4mom.com/",
    "hours": "9:00 AM - 12:00 PM",
    "address": "Washington Park, Denver, CO 80209",
    "coordinates": {
      "lat": 39.7,
      "lng": -104.9667
    },
    "specializations": [
      "Prenatal Fitness",
      "Postnatal Fitness",
      "Stroller Workouts"
    ],
    "languages": [
      "English"
    ],
    "insuranceAccepted": [
      "Not Applicable"
    ],
    "pricing": {
      "range": "$"
    },
    "availability": "Classes Available",
    "verificationBadges": [
      "Certified Instructors"
    ],
    "imageUrl": "https://picsum.photos/seed/fit4mom/800/600",
    "createdDate": "2023-05-12T14:20:00Z",
    "photos": [
      "https://picsum.photos/seed/fit4mom/800/600"
    ]
  },
  {
    "id": "s6",
    "name": "Night Owl Nanny Care",
    "category": "babysitting",
    "description": "Professional overnight newborn care, sleep training, and daytime nanny services for Colorado families.",
    "rating": 4.8,
    "reviewCount": 190,
    "phone": "(303) 717-1841",
    "email": "info@nightowlnannycare.com",
    "websiteUrl": "https://www.nightowlnannycare.com/",
    "hours": "Open 24 hours",
    "address": "1550 Wewatta St, Denver, CO 80202",
    "coordinates": {
      "lat": 39.7525,
      "lng": -105.0007
    },
    "specializations": [
      "Overnight Newborn Care",
      "Sleep Training",
      "Nanny Placement"
    ],
    "languages": [
      "English",
      "Spanish"
    ],
    "insuranceAccepted": [
      "Self-Pay"
    ],
    "pricing": {
      "range": "$$"
    },
    "availability": "Booking for next month",
    "verificationBadges": [
      "Background Checked",
      "CPR Certified"
    ],
    "imageUrl": "https://picsum.photos/seed/nightowlnanny/800/600",
    "createdDate": "2023-06-18T16:00:00Z",
    "photos": [
      "https://picsum.photos/seed/nightowlnanny/800/600"
    ]
  },
  {
    "id": "s7",
    "name": "Sleep Baby Sleep Consulting",
    "category": "sleep_consultant",
    "description": "Certified pediatric sleep consultants helping families establish healthy sleep habits for their babies and toddlers.",
    "rating": 4.9,
    "reviewCount": 220,
    "phone": "(720) 443-1024",
    "email": "hello@sleepbabysleep.com",
    "websiteUrl": "https://www.sleepbabysleep.com/",
    "hours": "9:00 AM - 5:00 PM",
    "address": "2000 S Colorado Blvd, Denver, CO 80222",
    "coordinates": {
      "lat": 39.68,
      "lng": -104.94
    },
    "specializations": [
      "Newborn Sleep",
      "Toddler Sleep Training",
      "Nap Transitions"
    ],
    "languages": [
      "English"
    ],
    "insuranceAccepted": [
      "Self-Pay"
    ],
    "pricing": {
      "range": "$"
    },
    "availability": "Available this week",
    "verificationBadges": [
      "Certified Sleep Consultant"
    ],
    "imageUrl": "https://picsum.photos/seed/sleepbabysleep/800/600",
    "createdDate": "2023-07-22T09:00:00Z",
    "photos": [
      "https://picsum.photos/seed/sleepbabysleep/800/600"
    ]
  },
  {
    "id": "s8",
    "name": "Doulas of Denver",
    "category": "birth_services",
    "description": "Providing professional birth doula support, postpartum care, and placenta encapsulation services.",
    "rating": 5,
    "reviewCount": 175,
    "phone": "(720) 310-0120",
    "email": "info@doulasofdenver.com",
    "websiteUrl": "https://www.doulasofdenver.com/",
    "hours": "Open 24 hours",
    "address": "383 Corona St, Denver, CO 80218",
    "coordinates": {
      "lat": 39.7225,
      "lng": -104.9733
    },
    "specializations": [
      "Birth Doula",
      "Postpartum Doula",
      "Placenta Encapsulation"
    ],
    "languages": [
      "English",
      "Spanish"
    ],
    "insuranceAccepted": [
      "Self-Pay",
      "HSA/FSA"
    ],
    "pricing": {
      "range": "$$"
    },
    "availability": "Accepting clients for Fall",
    "verificationBadges": [
      "DONA Certified"
    ],
    "imageUrl": "https://picsum.photos/seed/doulasofdenver/800/600",
    "createdDate": "2023-08-30T10:30:00Z",
    "photos": [
      "https://picsum.photos/seed/doulasofdenver/800/600"
    ]
  }
];

export const MOCK_COMMUNITY_POSTS: CommunityPost[] = [
  {
    id: 'cp1',
    title: 'Best stroller-friendly trails?',
    content: 'Looking for something paved and relatively flat for a long walk this weekend! Any suggestions near Wash Park?',
    authorId: 'u1',
    authorName: 'Sarah M.',
    authorAvatar: 'S',
    authorColor: 'bg-blue-400',
    category: 'Outdoors',
    upvotes: 24,
    downvotes: 2,
    comments: [],
    createdDate: '2026-03-14T10:00:00Z',
    updatedDate: '2026-03-14T10:00:00Z',
    isModerated: false,
    flags: []
  },
  {
    id: 'cp2',
    title: 'Pediatrician recommendations?',
    content: 'We just moved to Capitol Hill and need to find someone great for our 6-month-old. Any favorites?',
    authorId: 'u2',
    authorName: 'Jessica L.',
    authorAvatar: 'J',
    authorColor: 'bg-purple-400',
    category: 'Health',
    upvotes: 15,
    downvotes: 1,
    comments: [],
    createdDate: '2026-03-15T08:00:00Z',
    updatedDate: '2026-03-15T08:00:00Z',
    isModerated: false,
    flags: []
  }
];

export const MOCK_SLEEP_TIPS: Tip[] = [
  {
    id: 't1',
    title: 'Establish a Routine',
    content: 'Consistency is key. A simple routine like bath, book, and song helps signal to your baby that it\'s time for sleep.'
  },
  {
    id: 't2',
    title: 'Watch Wake Windows',
    content: 'Prevent overtiredness by following age-appropriate wake windows. For newborns, this is often only 60-90 minutes.'
  },
  {
    id: 't3',
    title: 'Safe Sleep Environment',
    content: 'Always place your baby on their back on a firm, flat sleep surface in a crib or bassinet free of blankets or toys.'
  },
  {
    id: 't4',
    title: 'Use White Noise',
    content: 'A consistent low-frequency sound can mask household noises and mimic the comforting sounds of the womb.'
  }
];

export const MOCK_REVIEWS: Review[] = [
  {
    id: 'r1',
    placeId: 'p1',
    authorUid: 'u1',
    authorName: 'MamaBear88',
    rating: 5,
    cleanliness: 5,
    privacy: 4,
    strollerAccess: true,
    notes: 'Incredibly clean for a public station. The family restroom is a lifesaver!',
    createdAt: '2026-02-15T10:00:00Z',
    helpfulCount: 12
  },
  {
    id: 'r2',
    placeId: 'p1',
    authorUid: 'u2',
    authorName: 'DenverDad',
    rating: 4,
    cleanliness: 4,
    privacy: 3,
    strollerAccess: true,
    notes: 'Good facilities, but can get busy during peak travel times.',
    createdAt: '2026-03-01T14:30:00Z',
    helpfulCount: 5
  },
  {
    id: 'r3',
    placeId: 'p3',
    authorUid: 'u3',
    authorName: 'StrollerQueen',
    rating: 5,
    cleanliness: 5,
    privacy: 5,
    strollerAccess: true,
    notes: 'The best nursing lounge in Denver! So many private stalls and even a play area for older siblings.',
    createdAt: '2026-03-10T11:15:00Z',
    helpfulCount: 28
  }
];

export const MOCK_RESOURCES: Resource[] = [
  {
    id: 'r1',
    title: 'Hospital Bag Essentials',
    category: 'first_timer',
    description: 'Everything you actually need for the big day.',
    content: 'Full checklist including snacks, long charging cables, and baby outfits...',
    imageUrl: 'https://picsum.photos/seed/bag/400/300'
  },
  {
    id: 'r2',
    title: 'Newborn Sleep 101',
    category: 'sleep',
    description: 'Understanding wake windows and sleep cycles.',
    content: 'A guide to the first 12 weeks of sleep patterns...',
    imageUrl: 'https://picsum.photos/seed/sleep/400/300'
  },
  {
    id: 'r3',
    title: 'Safe Sleep Guidelines',
    category: 'sleep',
    description: 'The ABCs of safe sleep for your baby.',
    content: 'Alone, on their Back, in a Crib. These are the gold standards for safe infant sleep...',
    imageUrl: 'https://picsum.photos/seed/safesleep/400/300'
  },
  {
    id: 'r4',
    title: 'Postpartum Recovery',
    category: 'recovery',
    description: 'Physical and emotional healing after birth.',
    content: 'What to expect in the first 6 weeks of recovery...',
    imageUrl: 'https://picsum.photos/seed/recovery/400/300'
  }
];

export const MOCK_SLEEP_LOGS: SleepLog[] = [
  {
    id: 'sl1',
    userId: 'u1',
    babyName: 'Leo',
    startTime: '2026-03-15T19:00:00Z',
    endTime: '2026-03-15T21:30:00Z',
    duration: 150,
    quality: 4,
    notes: 'Went down easily after bath.'
  }
];

export const MOCK_USER_REVIEWS: UserReview[] = [
  {
    id: 'ur1',
    serviceId: 's6',
    userId: 'u1',
    userName: 'Sarah M.',
    rating: 5,
    title: 'Amazing Pediatrician',
    text: 'Dr. Chen is so patient and knowledgeable. She helped us so much with our latching issues.',
    helpfulCount: 15,
    verifiedBooking: true,
    createdDate: '2026-02-10T10:00:00Z'
  }
];
