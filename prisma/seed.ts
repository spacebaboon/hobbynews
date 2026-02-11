import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
dotenv.config();

import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }),
});

const themesConfig = [
  {
    name: "Light",
    slug: "light",
    isDefault: true,
    primaryColor: "#3b82f6",
    secondaryColor: "#6366f1",
    backgroundColor: "#f3f4f6",
    surfaceColor: "#ffffff",
    textColor: "#111827",
    textMutedColor: "#6b7280",
    accentColor: "#8b5cf6",
    borderColor: "#e5e7eb",
  },
  {
    name: "Dark",
    slug: "dark",
    isDefault: false,
    primaryColor: "#60a5fa",
    secondaryColor: "#818cf8",
    backgroundColor: "#111827",
    surfaceColor: "#1f2937",
    textColor: "#f9fafb",
    textMutedColor: "#9ca3af",
    accentColor: "#a78bfa",
    borderColor: "#374151",
  },
  {
    name: "Nord",
    slug: "nord",
    isDefault: false,
    primaryColor: "#88c0d0",
    secondaryColor: "#81a1c1",
    backgroundColor: "#2e3440",
    surfaceColor: "#3b4252",
    textColor: "#eceff4",
    textMutedColor: "#d8dee9",
    accentColor: "#b48ead",
    borderColor: "#4c566a",
  },
  {
    name: "Dracula",
    slug: "dracula",
    isDefault: false,
    primaryColor: "#bd93f9",
    secondaryColor: "#ff79c6",
    backgroundColor: "#282a36",
    surfaceColor: "#44475a",
    textColor: "#f8f8f2",
    textMutedColor: "#6272a4",
    accentColor: "#50fa7b",
    borderColor: "#44475a",
  },
  {
    name: "Solarized Light",
    slug: "solarized-light",
    isDefault: false,
    primaryColor: "#268bd2",
    secondaryColor: "#2aa198",
    backgroundColor: "#fdf6e3",
    surfaceColor: "#eee8d5",
    textColor: "#073642",
    textMutedColor: "#586e75",
    accentColor: "#d33682",
    borderColor: "#93a1a1",
  },
  {
    name: "Solarized Dark",
    slug: "solarized-dark",
    isDefault: false,
    primaryColor: "#268bd2",
    secondaryColor: "#2aa198",
    backgroundColor: "#002b36",
    surfaceColor: "#073642",
    textColor: "#fdf6e3",
    textMutedColor: "#839496",
    accentColor: "#d33682",
    borderColor: "#586e75",
  },
  {
    name: "Monokai",
    slug: "monokai",
    isDefault: false,
    primaryColor: "#66d9ef",
    secondaryColor: "#a6e22e",
    backgroundColor: "#272822",
    surfaceColor: "#3e3d32",
    textColor: "#f8f8f2",
    textMutedColor: "#75715e",
    accentColor: "#f92672",
    borderColor: "#49483e",
  },
  {
    name: "GitHub",
    slug: "github",
    isDefault: false,
    primaryColor: "#0969da",
    secondaryColor: "#8250df",
    backgroundColor: "#f6f8fa",
    surfaceColor: "#ffffff",
    textColor: "#1f2328",
    textMutedColor: "#656d76",
    accentColor: "#cf222e",
    borderColor: "#d0d7de",
  },
];

const feedsConfig: Record<string, Record<string, { url: string }>> = {
  "Board Games": {
    Dicebreaker: { url: "https://www.dicebreaker.com/feed/review" },
    "Board Game Quest": { url: "https://www.boardgamequest.com/feed/" },
    "Space-Biff!": { url: "https://www.spacebiff.com/feed/" },
    "Meeple Like Us": { url: "https://www.meeplelikeus.co.uk/feed/" },
  },
  "Heavy Metal": {
    "Invisible Oranges": { url: "https://www.invisibleoranges.com/feed/" },
    "Angry Metal Guy": { url: "https://www.angrymetalguy.com/feed/" },
    "Metal Injection": { url: "https://www.metalinjection.net/feed" },
    MetalSucks: { url: "https://www.metalsucks.net/feed/" },
    "Metal Hammer": { url: "https://www.loudersound.com/feed" },
    "No Clean Singing": { url: "https://www.nocleansinging.com/feed/" },
    "Decibel Magazine": { url: "https://www.decibelmagazine.com/feed/" },
    "Heavy Blog Is Heavy": { url: "https://www.heavyblogisheavy.com/feed" },
    "Metal Storm": { url: "https://metalstorm.net/rss/news.xml" },
    "The Quietus": { url: "https://thequietus.com/feed" },
    "Nine Circles": { url: "https://ninecircles.co/feed/" },
  },
  "Tabletop RPG": {
    "EN World": { url: "https://www.enworld.org/forums/-/index.rss" },
    "Gnome Stew": { url: "https://gnomestew.com/feed/" },
    "Bell of Lost Souls": { url: "https://www.belloflostsouls.net/feed" },
    "Geek Native": { url: "https://www.geeknative.com/feed/" },
    Dicebreaker: { url: "https://www.dicebreaker.com/feed" },
    "RPG.net": { url: "http://dev.rpg.net/index.xml" },
    Wargamer: { url: "https://www.wargamer.com/feed" },
    "Cannibal Halfling Gaming": {
      url: "https://cannibalhalflinggaming.com/feed/",
    },
    "The Alexandrian": { url: "https://thealexandrian.net/feed" },
    "Rascal News": { url: "https://www.rascal.news/rss/" },
    "Ten Foot Pole": { url: "https://tenfootpole.org/ironspike/?feed=rss2" },
    "Questing Beast": { url: "https://questingbeast.substack.com/feed" },
    Tribality: { url: "https://www.tribality.com/feed/" },
  },
  Tech: {
    TechCrunch: { url: "https://feeds.feedburner.com/TechCrunch/" },
  },
};

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

async function main() {
  // Seed themes
  for (const theme of themesConfig) {
    await prisma.theme.upsert({
      where: { slug: theme.slug },
      update: theme,
      create: theme,
    });
  }
  console.log(`Seeded ${themesConfig.length} themes.`);

  // Seed feeds
  for (const [topicName, feeds] of Object.entries(feedsConfig)) {
    const topic = await prisma.topic.upsert({
      where: { slug: slugify(topicName) },
      update: {},
      create: {
        name: topicName,
        slug: slugify(topicName),
      },
    });

    for (const [feedName, { url }] of Object.entries(feeds)) {
      const feed = await prisma.feedSource.upsert({
        where: { url },
        update: {},
        create: {
          url,
          name: feedName,
          status: "APPROVED",
        },
      });

      await prisma.feedTopic.upsert({
        where: { feedId_topicId: { feedId: feed.id, topicId: topic.id } },
        update: {},
        create: { feedId: feed.id, topicId: topic.id },
      });
    }
  }

  console.log("Seed complete.");
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
