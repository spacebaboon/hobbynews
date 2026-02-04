import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }),
});

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
