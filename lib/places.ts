// Where the house is, and what is around it, on foot. [lng, lat].
// Walking times are rounded up, through the Medina lanes, not as the crow flies.
export const HOUSE: [number, number] = [-7.9915523, 31.6272937];

export const NEARBY: { name: string; at: [number, number]; walk: string }[] = [
  { name: "Jemaa el-Fna", at: [-7.98935, 31.6258], walk: "about 5 minutes" },
  { name: "The Koutoubia", at: [-7.9936, 31.62375], walk: "about 7 minutes" },
  { name: "Le Jardin Secret", at: [-7.98886, 31.6304], walk: "about 7 minutes" },
  { name: "Ben Youssef Madrasa", at: [-7.98625, 31.6324], walk: "about 12 minutes" },
];
