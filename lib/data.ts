import { getTableData, getAllSettings, convertDriveUrl } from "./riadSupabase";

// ============================================================
// Server-side data fetching for SSR pages
// Replaces client-side fetch("/api/sheets/...") calls
// ============================================================

/** Process image URLs and remap keys to PascalCase for frontend */
function toFrontend(obj: Record<string, any>): Record<string, any> {
  const MAP: Record<string, string> = {
    room_id: "Room_ID", name: "Name", description: "Description",
    price_eur: "Price_EUR", features: "Features", image_url: "Image_URL",
    widget_id: "Widget_ID", ical_url: "iCal_URL", order: "Order",
    bookable: "Bookable", section: "Section", title: "Title",
    subtitle: "Subtitle", body: "Body", button_text: "Button_Text",
    button_link: "Button_Link", content: "Content", question: "Question",
    answer: "Answer", amenity_id: "Amenity_ID",
    testimonial_id: "Testimonial_ID", guest_name: "Guest_Name",
    quote: "Quote", source: "Source", date: "Date", featured: "Featured",
    property_id: "Property_ID", tagline: "Tagline", link: "Link",
    intro: "Intro", location: "Location", paragraph: "Paragraph",
    package_id: "Package_ID", extra_person_eur: "Extra_Person_EUR",
    single_supplement_eur: "Single_Supplement_EUR",
    duration: "Duration", includes: "Includes", min_guests: "Min_Guests",
    tent_id: "Tent_ID", level: "Level", produce_id: "Produce_ID",
    season: "Season", image_id: "Image_ID", caption: "Caption",
    category: "Category", keywords: "Keywords",
  };

  const result: Record<string, any> = {};
  for (const [k, v] of Object.entries(obj)) {
    if (k === "id") continue;
    const mappedKey = MAP[k] || k;
    result[mappedKey] = k === "image_url" ? convertDriveUrl(v || "") : v;
  }
  return result;
}

// Tables that don't have an "order" column
const NO_ORDER = new Set([
  "amenities_hero", "rooms_hero", "douaria_hero", "kasbah_hero",
  "desert_hero", "farm_hero", "beyond_the_walls_hero", "journeys_page",
]);

// ============================================================
// Sectioned content (the-riad, philosophy, home)
// ============================================================

export async function getSections(table: string): Promise<Record<string, any>> {
  const orderBy = NO_ORDER.has(table) ? undefined : "order";
  const data = await getTableData(table, orderBy);
  const sections: Record<string, any> = {};
  data.forEach((item: any) => {
    if (item.section) {
      sections[item.section] = toFrontend(item);
    }
  });
  return sections;
}

// ============================================================
// Hero data (single row)
// ============================================================

export async function getHero(table: string): Promise<any> {
  const data = await getTableData(table);
  if (data.length === 0) return null;
  return toFrontend(data[0]);
}

// ============================================================
// Generic list data
// ============================================================

export async function getList(table: string): Promise<any[]> {
  const orderBy = NO_ORDER.has(table) ? undefined : "order";
  const data = await getTableData(table, orderBy);
  return data.map(toFrontend);
}

// ============================================================
// Rooms (with features split + bookable conversion)
// ============================================================

const ROOM_PHOTOS: Record<string, string> = { love: "/rooms/love.jpg", joy: "/rooms/joy.jpg", bliss: "/rooms/bliss.jpg" };

export async function getRooms(table: string): Promise<any[]> {
  const data = await getTableData(table, "order");
  return data.map((room: any) => {
    const mapped = toFrontend(room);
    // Jacqueline's own upright photos of the Douaria rooms (2 Nov 2026) replace the Airbnb ones.
    const own = ROOM_PHOTOS[String(mapped.Name || "").trim().toLowerCase()];
    if (own) mapped.Image_URL = own;
    mapped.features = room.features
      ? room.features.split(",").map((f: string) => f.trim())
      : [];
    // Convert boolean bookable to string (frontend expects "Yes"/"No")
    if (typeof room.bookable === "boolean") {
      mapped.Bookable = room.bookable ? "Yes" : "No";
    }
    return mapped;
  });
}

// ============================================================
// Settings (flat key-value)
// ============================================================

export async function getSettings(): Promise<Record<string, string>> {
  return getAllSettings();
}
