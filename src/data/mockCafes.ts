export interface Cafe {
  id: string;
  title: string;
  description: string;
  address: string;
  image: string;
  rating: number;
  occupancy: string;
  price: string;
  amenities: string[];
  tags: string[];
  coordinates: {
    lat: number;
    lng: number;
  };
}

export const BERLIN_CAFES: Cafe[] = [
  {
    id: "1",
    title: "St. Oberholz",
    description: "Historic coworking cafe with excellent coffee and fast WiFi",
    address: "Rosenthaler Str. 72A, 10119 Berlin",
    image: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?ixlib=rb-4.0.3",
    rating: 4.7,
    occupancy: "75% Full",
    price: "€4/hour",
    amenities: ["wifi", "power", "coffee", "quiet", "phonebooth", "community"],
    tags: ["Historic Building", "Meeting Rooms", "Events"],
    coordinates: {
      lat: 52.529795,
      lng: 13.401590
    }
  },
  {
    id: "2",
    title: "Betahaus Café",
    description: "Cozy cafe inside Berlin's famous coworking space",
    address: "Rudi-Dutschke-Straße 23, 10969 Berlin",
    image: "https://images.unsplash.com/photo-1445116572660-236099ec97a0?ixlib=rb-4.0.3",
    rating: 4.8,
    occupancy: "45% Full",
    price: "€3.50/hour",
    amenities: ["wifi", "power", "coffee", "baby", "podcast-room", "community"],
    tags: ["Coworking", "Community Events", "Workshops"],
    coordinates: {
      lat: 52.507118,
      lng: 13.391737
    }
  },
  {
    id: "3",
    title: "Factory Berlin Mitte",
    description: "Premium workspace with high-end amenities",
    address: "Rheinsberger Str. 76/77, 10115 Berlin",
    image: "https://images.unsplash.com/photo-1521017432531-fbd92d768814?ixlib=rb-4.0.3",
    rating: 4.9,
    occupancy: "60% Full",
    price: "€5/hour",
    amenities: ["wifi", "power", "coffee", "nap-pods", "gym", "community"],
    tags: ["Premium", "Full Service", "Events"],
    coordinates: {
      lat: 52.529671,
      lng: 13.409834
    }
  },
  {
    id: "4",
    title: "The Barn",
    description: "Specialty coffee roasters with workspace areas",
    address: "Schönhauser Allee 8, 10119 Berlin",
    image: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?ixlib=rb-4.0.3",
    rating: 4.9,
    occupancy: "60% Full",
    price: "€5/hour",
    amenities: ["wifi", "power", "coffee"],
    tags: ["Coffee Experts", "Quiet Zone", "Garden"],
    coordinates: {
      lat: 52.529671,
      lng: 13.409834
    }
  },
  {
    id: "5",
    title: "Café Einstein",
    description: "Classic Viennese coffee house with a cozy atmosphere",
    address: "Kurfürstenstraße 58, 10785 Berlin",
    image: "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?ixlib=rb-4.0.3",
    rating: 4.6,
    occupancy: "50% Full",
    price: "€3/hour",
    amenities: ["wifi", "coffee", "quiet"],
    tags: ["Historic", "Coffee House"],
    coordinates: {
      lat: 52.500000,
      lng: 13.370000
    }
  },
  {
    id: "6",
    title: "Silo Coffee",
    description: "A specialty coffee shop with a focus on quality",
    address: "Oberstraße 1, 10249 Berlin",
    image: "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?ixlib=rb-4.0.3",
    rating: 4.8,
    occupancy: "70% Full",
    price: "€3.50/hour",
    amenities: ["wifi", "coffee", "community"],
    tags: ["Specialty Coffee", "Community"],
    coordinates: {
      lat: 52.500000,
      lng: 13.370000
    }
  },
  {
    id: "7",
    title: "Café am Engelbecken",
    description: "Charming café with a beautiful view of the Engelbecken lake",
    address: "Engelbecken, 10999 Berlin",
    image: "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?ixlib=rb-4.0.3",
    rating: 4.5,
    occupancy: "40% Full",
    price: "€3/hour",
    amenities: ["wifi", "coffee", "quiet"],
    tags: ["Scenic", "Relaxing"],
    coordinates: {
      lat: 52.500000,
      lng: 13.370000
    }
  },
  {
    id: "8",
    title: "Café Kranzler",
    description: "Iconic café with a rooftop terrace and stunning views",
    address: "Kurfürstendamm 18, 10719 Berlin",
    image: "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?ixlib=rb-4.0.3",
    rating: 4.4,
    occupancy: "55% Full",
    price: "€4/hour",
    amenities: ["wifi", "coffee", "community"],
    tags: ["Iconic", "Rooftop"],
    coordinates: {
      lat: 52.500000,
      lng: 13.370000
    }
  },
  {
    id: "9",
    title: "House of Small Wonder",
    description: "A unique café with a beautiful interior and great food",
    address: "Johannisstraße 20, 10117 Berlin",
    image: "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?ixlib=rb-4.0.3",
    rating: 4.7,
    occupancy: "65% Full",
    price: "€4.50/hour",
    amenities: ["wifi", "coffee", "quiet"],
    tags: ["Unique", "Cozy"],
    coordinates: {
      lat: 52.500000,
      lng: 13.370000
    }
  },
  {
    id: "10",
    title: "Café Cliché",
    description: "A French-style café with delicious pastries",
    address: "Kreuzbergstraße 30, 10965 Berlin",
    image: "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?ixlib=rb-4.0.3",
    rating: 4.3,
    occupancy: "50% Full",
    price: "€3.50/hour",
    amenities: ["wifi", "coffee", "community"],
    tags: ["French", "Pastries"],
    coordinates: {
      lat: 52.500000,
      lng: 13.370000
    }
  },
  {
    id: "11",
    title: "Café M",
    description: "A modern café with a focus on sustainability",
    address: "Müllerstraße 74, 13349 Berlin",
    image: "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?ixlib=rb-4.0.3",
    rating: 4.6,
    occupancy: "60% Full",
    price: "€4/hour",
    amenities: ["wifi", "coffee", "quiet"],
    tags: ["Sustainable", "Modern"],
    coordinates: {
      lat: 52.500000,
      lng: 13.370000
    }
  },
  {
    id: "12",
    title: "Café am Neuen See",
    description: "A lakeside café with a beautiful terrace",
    address: "Lichtensteinallee 2, 10787 Berlin",
    image: "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?ixlib=rb-4.0.3",
    rating: 4.5,
    occupancy: "70% Full",
    price: "€4/hour",
    amenities: ["wifi", "coffee", "community"],
    tags: ["Lakeside", "Relaxing"],
    coordinates: {
      lat: 52.500000,
      lng: 13.370000
    }
  },
  {
    id: "13",
    title: "Café im Literaturhaus",
    description: "A literary café with a cozy atmosphere",
    address: "Fasanenstraße 23, 10719 Berlin",
    image: "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?ixlib=rb-4.0.3",
    rating: 4.4,
    occupancy: "50% Full",
    price: "€3.50/hour",
    amenities: ["wifi", "coffee", "quiet"],
    tags: ["Literary", "Cozy"],
    coordinates: {
      lat: 52.500000,
      lng: 13.370000
    }
  },
  {
    id: "14",
    title: "Café im Schloss",
    description: "A café located in a historic castle",
    address: "Schlossstraße 1, 10787 Berlin",
    image: "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?ixlib=rb-4.0.3",
    rating: 4.6,
    occupancy: "65% Full",
    price: "€4/hour",
    amenities: ["wifi", "coffee", "community"],
    tags: ["Historic", "Castle"],
    coordinates: {
      lat: 52.500000,
      lng: 13.370000
    }
  },
  {
    id: "15",
    title: "Café im Botanischen Garten",
    description: "A café in the botanical garden with beautiful views",
    address: "Königin-Luise-Straße 6-8, 14195 Berlin",
    image: "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?ixlib=rb-4.0.3",
    rating: 4.5,
    occupancy: "60% Full",
    price: "€4/hour",
    amenities: ["wifi", "coffee", "quiet"],
    tags: ["Botanical", "Relaxing"],
    coordinates: {
      lat: 52.500000,
      lng: 13.370000
    }
  },
  {
    id: "16",
    title: "Café im Museum",
    description: "A café located in a museum with a unique atmosphere",
    address: "Bodestraße 1-3, 10178 Berlin",
    image: "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?ixlib=rb-4.0.3",
    rating: 4.4,
    occupancy: "50% Full",
    price: "€3.50/hour",
    amenities: ["wifi", "coffee", "community"],
    tags: ["Museum", "Unique"],
    coordinates: {
      lat: 52.500000,
      lng: 13.370000
    }
  },
  {
    id: "17",
    title: "Café im Zoo",
    description: "A café located in the zoo with a fun atmosphere",
    address: "Budapester Str. 32, 10787 Berlin",
    image: "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?ixlib=rb-4.0.3",
    rating: 4.5,
    occupancy: "70% Full",
    price: "€4/hour",
    amenities: ["wifi", "coffee", "community"],
    tags: ["Zoo", "Fun"],
    coordinates: {
      lat: 52.500000,
      lng: 13.370000
    }
  },
  {
    id: "18",
    title: "Café im Park",
    description: "A café located in a park with beautiful views",
    address: "Schönhauser Allee 1, 10119 Berlin",
    image: "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?ixlib=rb-4.0.3",
    rating: 4.6,
    occupancy: "60% Full",
    price: "€4/hour",
    amenities: ["wifi", "coffee", "community"],
    tags: ["Park", "Relaxing"],
    coordinates: {
      lat: 52.500000,
      lng: 13.370000
    }
  },
  {
    id: "19",
    title: "Café im Stadion",
    description: "A café located in a stadium with a fun atmosphere",
    address: "Olympiastadion, 14053 Berlin",
    image: "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?ixlib=rb-4.0.3",
    rating: 4.4,
    occupancy: "50% Full",
    price: "€3.50/hour",
    amenities: ["wifi", "coffee", "community"],
    tags: ["Stadium", "Fun"],
    coordinates: {
      lat: 52.500000,
      lng: 13.370000
    }
  },
  {
    id: "20",
    title: "Café im Einkaufszentrum",
    description: "A café located in a shopping center with a fun atmosphere",
    address: "Schönhauser Allee 1, 10119 Berlin",
    image: "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?ixlib=rb-4.0.3",
    rating: 4.5,
    occupancy: "70% Full",
    price: "€4/hour",
    amenities: ["wifi", "coffee", "community"],
    tags: ["Shopping", "Fun"],
    coordinates: {
      lat: 52.500000,
      lng: 13.370000
    }
  },
  {
    id: "21",
    title: "Café im Bahnhof",
    description: "A café located in a train station with a fun atmosphere",
    address: "Hauptbahnhof, 10557 Berlin",
    image: "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?ixlib=rb-4.0.3",
    rating: 4.4,
    occupancy: "50% Full",
    price: "€3.50/hour",
    amenities: ["wifi", "coffee", "community"],
    tags: ["Train Station", "Fun"],
    coordinates: {
      lat: 52.500000,
      lng: 13.370000
    }
  },
  {
    id: "22",
    title: "Café im Flughafen",
    description: "A café located in an airport with a fun atmosphere",
    address: "Flughafen Berlin Brandenburg, 12529 Berlin",
    image: "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?ixlib=rb-4.0.3",
    rating: 4.5,
    occupancy: "70% Full",
    price: "€4/hour",
    amenities: ["wifi", "coffee", "community"],
    tags: ["Airport", "Fun"],
    coordinates: {
      lat: 52.500000,
      lng: 13.370000
    }
  },
  {
    id: "23",
    title: "Café im Hotel",
    description: "A café located in a hotel with a fun atmosphere",
    address: "Kurfürstendamm 1, 10719 Berlin",
    image: "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?ixlib=rb-4.0.3",
    rating: 4.4,
    occupancy: "50% Full",
    price: "€3.50/hour",
    amenities: ["wifi", "coffee", "community"],
    tags: ["Hotel", "Fun"],
    coordinates: {
      lat: 52.500000,
      lng: 13.370000
    }
  },
  {
    id: "24",
    title: "Café im Fitnessstudio",
    description: "A café located in a gym with a fun atmosphere",
    address: "Schönhauser Allee 1, 10119 Berlin",
    image: "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?ixlib=rb-4.0.3",
    rating: 4.5,
    occupancy: "70% Full",
    price: "€4/hour",
    amenities: ["wifi", "coffee", "community"],
    tags: ["Gym", "Fun"],
    coordinates: {
      lat: 52.500000,
      lng: 13.370000
    }
  },
  {
    id: "25",
    title: "Café im Theater",
    description: "A café located in a theater with a fun atmosphere",
    address: "Schönhauser Allee 1, 10119 Berlin",
    image: "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?ixlib=rb-4.0.3",
    rating: 4.4,
    occupancy: "50% Full",
    price: "€3.50/hour",
    amenities: ["wifi", "coffee", "community"],
    tags: ["Theater", "Fun"],
    coordinates: {
      lat: 52.500000,
      lng: 13.370000
    }
  },
  {
    id: "26",
    title: "Café im Kino",
    description: "A café located in a cinema with a fun atmosphere",
    address: "Schönhauser Allee 1, 10119 Berlin",
    image: "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?ixlib=rb-4.0.3",
    rating: 4.5,
    occupancy: "70% Full",
    price: "€4/hour",
    amenities: ["wifi", "coffee", "community"],
    tags: ["Cinema", "Fun"],
    coordinates: {
      lat: 52.500000,
      lng: 13.370000
    }
  },
  {
    id: "27",
    title: "Café im Freizeitpark",
    description: "A café located in an amusement park with a fun atmosphere",
    address: "Schönhauser Allee 1, 10119 Berlin",
    image: "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?ixlib=rb-4.0.3",
    rating: 4.4,
    occupancy: "50% Full",
    price: "€3.50/hour",
    amenities: ["wifi", "coffee", "community"],
    tags: ["Amusement Park", "Fun"],
    coordinates: {
      lat: 52.500000,
      lng: 13.370000
    }
  },
  {
    id: "28",
    title: "Café im Zoo",
    description: "A café located in a zoo with a fun atmosphere",
    address: "Budapester Str. 32, 10787 Berlin",
    image: "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?ixlib=rb-4.0.3",
    rating: 4.5,
    occupancy: "70% Full",
    price: "€4/hour",
    amenities: ["wifi", "coffee", "community"],
    tags: ["Zoo", "Fun"],
    coordinates: {
      lat: 52.500000,
      lng: 13.370000
    }
  },
  {
    id: "29",
    title: "Café im Stadion",
    description: "A café located in a stadium with a fun atmosphere",
    address: "Olympiastadion, 14053 Berlin",
    image: "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?ixlib=rb-4.0.3",
    rating: 4.4,
    occupancy: "50% Full",
    price: "€3.50/hour",
    amenities: ["wifi", "coffee", "community"],
    tags: ["Stadium", "Fun"],
    coordinates: {
      lat: 52.500000,
      lng: 13.370000
    }
  },
  {
    id: "30",
    title: "Café im Einkaufszentrum",
    description: "A café located in a shopping center with a fun atmosphere",
    address: "Schönhauser Allee 1, 10119 Berlin",
    image: "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?ixlib=rb-4.0.3",
    rating: 4.5,
    occupancy: "70% Full",
    price: "€4/hour",
    amenities: ["wifi", "coffee", "community"],
    tags: ["Shopping", "Fun"],
    coordinates: {
      lat: 52.500000,
      lng: 13.370000
    }
  },
  {
    id: "31",
    title: "Café im Bahnhof",
    description: "A café located in a train station with a fun atmosphere",
    address: "Hauptbahnhof, 10557 Berlin",
    image: "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?ixlib=rb-4.0.3",
    rating: 4.4,
    occupancy: "50% Full",
    price: "€3.50/hour",
    amenities: ["wifi", "coffee", "community"],
    tags: ["Train Station", "Fun"],
    coordinates: {
      lat: 52.500000,
      lng: 13.370000
    }
  },
  {
    id: "32",
    title: "Café im Flughafen",
    description: "A café located in an airport with a fun atmosphere",
    address: "Flughafen Berlin Brandenburg, 12529 Berlin",
    image: "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?ixlib=rb-4.0.3",
    rating: 4.5,
    occupancy: "70% Full",
    price: "€4/hour",
    amenities: ["wifi", "coffee", "community"],
    tags: ["Airport", "Fun"],
    coordinates: {
      lat: 52.500000,
      lng: 13.370000
    }
  },
  {
    id: "33",
    title: "Café im Hotel",
    description: "A café located in a hotel with a fun atmosphere",
    address: "Kurfürstendamm 1, 10719 Berlin",
    image: "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?ixlib=rb-4.0.3",
    rating: 4.4,
    occupancy: "50% Full",
    price: "€3.50/hour",
    amenities: ["wifi", "coffee", "community"],
    tags: ["Hotel", "Fun"],
    coordinates: {
      lat: 52.500000,
      lng: 13.370000
    }
  },
  {
    id: "34",
    title: "Café im Fitnessstudio",
    description: "A café located in a gym with a fun atmosphere",
    address: "Schönhauser Allee 1, 10119 Berlin",
    image: "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?ixlib=rb-4.0.3",
    rating: 4.5,
    occupancy: "70% Full",
    price: "€4/hour",
    amenities: ["wifi", "coffee", "community"],
    tags: ["Gym", "Fun"],
    coordinates: {
      lat: 52.500000,
      lng: 13.370000
    }
  },
  {
    id: "35",
    title: "Café im Theater",
    description: "A café located in a theater with a fun atmosphere",
    address: "Schönhauser Allee 1, 10119 Berlin",
    image: "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?ixlib=rb-4.0.3",
    rating: 4.4,
    occupancy: "50% Full",
    price: "€3.50/hour",
    amenities: ["wifi", "coffee", "community"],
    tags: ["Theater", "Fun"],
    coordinates: {
      lat: 52.500000,
      lng: 13.370000
    }
  },
  {
    id: "36",
    title: "Café im Kino",
    description: "A café located in a cinema with a fun atmosphere",
    address: "Schönhauser Allee 1, 10119 Berlin",
    image: "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?ixlib=rb-4.0.3",
    rating: 4.5,
    occupancy: "70% Full",
    price: "€4/hour",
    amenities: ["wifi", "coffee", "community"],
    tags: ["Cinema", "Fun"],
    coordinates: {
      lat: 52.500000,
      lng: 13.370000
    }
  },
  {
    id: "37",
    title: "Café im Freizeitpark",
    description: "A café located in an amusement park with a fun atmosphere",
    address: "Schönhauser Allee 1, 10119 Berlin",
    image: "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?ixlib=rb-4.0.3",
    rating: 4.4,
    occupancy: "50% Full",
    price: "€3.50/hour",
    amenities: ["wifi", "coffee", "community"],
    tags: ["Amusement Park", "Fun"],
    coordinates: {
      lat: 52.500000,
      lng: 13.370000
    }
  },
  {
    id: "38",
    title: "Café im Zoo",
    description: "A café located in a zoo with a fun atmosphere",
    address: "Budapester Str. 32, 10787 Berlin",
    image: "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?ixlib=rb-4.0.3",
    rating: 4.5,
    occupancy: "70% Full",
    price: "€4/hour",
    amenities: ["wifi", "coffee", "community"],
    tags: ["Zoo", "Fun"],
    coordinates: {
      lat: 52.500000,
      lng: 13.370000
    }
  },
  {
    id: "39",
    title: "Café im Stadion",
    description: "A café located in a stadium with a fun atmosphere",
    address: "Olympiastadion, 14053 Berlin",
    image: "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?ixlib=rb-4.0.3",
    rating: 4.4,
    occupancy: "50% Full",
    price: "€3.50/hour",
    amenities: ["wifi", "coffee", "community"],
    tags: ["Stadium", "Fun"],
    coordinates: {
      lat: 52.500000,
      lng: 13.370000
    }
  },
  {
    id: "40",
    title: "Café im Einkaufszentrum",
    description: "A café located in a shopping center with a fun atmosphere",
    address: "Schönhauser Allee 1, 10119 Berlin",
    image: "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?ixlib=rb-4.0.3",
    rating: 4.5,
    occupancy: "70% Full",
    price: "€4/hour",
    amenities: ["wifi", "coffee", "community"],
    tags: ["Shopping", "Fun"],
    coordinates: {
      lat: 52.500000,
      lng: 13.370000
    }
  },
  {
    id: "41",
    title: "Café im Bahnhof",
    description: "A café located in a train station with a fun atmosphere",
    address: "Hauptbahnhof, 10557 Berlin",
    image: "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?ixlib=rb-4.0.3",
    rating: 4.4,
    occupancy: "50% Full",
    price: "€3.50/hour",
    amenities: ["wifi", "coffee", "community"],
    tags: ["Train Station", "Fun"],
    coordinates: {
      lat: 52.500000,
      lng: 13.370000
    }
  },
  {
    id: "42",
    title: "Café im Flughafen",
    description: "A café located in an airport with a fun atmosphere",
    address: "Flughafen Berlin Brandenburg, 12529 Berlin",
    image: "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?ixlib=rb-4.0.3",
    rating: 4.5,
    occupancy: "70% Full",
    price: "€4/hour",
    amenities: ["wifi", "coffee", "community"],
    tags: ["Airport", "Fun"],
    coordinates: {
      lat: 52.500000,
      lng: 13.370000
    }
  },
  {
    id: "43",
    title: "Café im Hotel",
    description: "A café located in a hotel with a fun atmosphere",
    address: "Kurfürstendamm 1, 10719 Berlin",
    image: "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?ixlib=rb-4.0.3",
    rating: 4.4,
    occupancy: "50% Full",
    price: "€3.50/hour",
    amenities: ["wifi", "coffee", "community"],
    tags: ["Hotel", "Fun"],
    coordinates: {
      lat: 52.500000,
      lng: 13.370000
    }
  },
  {
    id: "44",
    title: "Café im Fitnessstudio",
    description: "A café located in a gym with a fun atmosphere",
    address: "Schönhauser Allee 1, 10119 Berlin",
    image: "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?ixlib=rb-4.0.3",
    rating: 4.5,
    occupancy: "70% Full",
    price: "€4/hour",
    amenities: ["wifi", "coffee", "community"],
    tags: ["Gym", "Fun"],
    coordinates: {
      lat: 52.500000,
      lng: 13.370000
    }
  },
  {
    id: "45",
    title: "Café im Theater",
    description: "A café located in a theater with a fun atmosphere",
    address: "Schönhauser Allee 1, 10119 Berlin",
    image: "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?ixlib=rb-4.0.3",
    rating: 4.4,
    occupancy: "50% Full",
    price: "€3.50/hour",
    amenities: ["wifi", "coffee", "community"],
    tags: ["Theater", "Fun"],
    coordinates: {
      lat: 52.500000,
      lng: 13.370000
    }
  },
  {
    id: "46",
    title: "Café im Kino",
    description: "A café located in a cinema with a fun atmosphere",
    address: "Schönhauser Allee 1, 10119 Berlin",
    image: "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?ixlib=rb-4.0.3",
    rating: 4.5,
    occupancy: "70% Full",
    price: "€4/hour",
    amenities: ["wifi", "coffee", "community"],
    tags: ["Cinema", "Fun"],
    coordinates: {
      lat: 52.500000,
      lng: 13.370000
    }
  },
  {
    id: "47",
    title: "Café im Freizeitpark",
    description: "A café located in an amusement park with a fun atmosphere",
    address: "Schönhauser Allee 1, 10119 Berlin",
    image: "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?ixlib=rb-4.0.3",
    rating: 4.4,
    occupancy: "50% Full",
    price: "€3.50/hour",
    amenities: ["wifi", "coffee", "community"],
    tags: ["Amusement Park", "Fun"],
    coordinates: {
      lat: 52.500000,
      lng: 13.370000
    }
  },
  {
    id: "48",
    title: "Café im Zoo",
    description: "A café located in a zoo with a fun atmosphere",
    address: "Budapester Str. 32, 10787 Berlin",
    image: "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?ixlib=rb-4.0.3",
    rating: 4.5,
    occupancy: "70% Full",
    price: "€4/hour",
    amenities: ["wifi", "coffee", "community"],
    tags: ["Zoo", "Fun"],
    coordinates: {
      lat: 52.500000,
      lng: 13.370000
    }
  },
  {
    id: "49",
    title: "Café im Stadion",
    description: "A café located in a stadium with a fun atmosphere",
    address: "Olympiastadion, 14053 Berlin",
    image: "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?ixlib=rb-4.0.3",
    rating: 4.4,
    occupancy: "50% Full",
    price: "€3.50/hour",
    amenities: ["wifi", "coffee", "community"],
    tags: ["Stadium", "Fun"],
    coordinates: {
      lat: 52.500000,
      lng: 13.370000
    }
  },
  {
    id: "50",
    title: "Café im Einkaufszentrum",
    description: "A café located in a shopping center with a fun atmosphere",
    address: "Schönhauser Allee 1, 10119 Berlin",
    image: "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?ixlib=rb-4.0.3",
    rating: 4.5,
    occupancy: "70% Full",
    price: "€4/hour",
    amenities: ["wifi", "coffee", "community"],
    tags: ["Shopping", "Fun"],
    coordinates: {
      lat: 52.500000,
      lng: 13.370000
    }
  }
];
