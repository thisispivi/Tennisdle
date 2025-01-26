export interface Link {
  url: string;
  imageUrl: string;
  key: string;
  pillColor: string;
  pillKey: string;
  githubUrl?: string;
}

export type Links = Link[];

export const links: Link[] = [
  {
    url: "https://app.syrto.ai/",
    imageUrl: "https://pivi-travel-map.b-cdn.net/LinkTree/Projects/Syrto.png",
    key: "syrto",
    pillColor: "#EB9486",
    pillKey: "work",
  },
  {
    url: "https://map.pivi.dev/",
    imageUrl:
      "https://pivi-travel-map.b-cdn.net/LinkTree/Projects/TravelMap.png",
    key: "travelMap",
    pillColor: "#F3DE8A",
    pillKey: "projects",
    githubUrl: "https://github.com/thisispivi/TravelMap",
  },
];
