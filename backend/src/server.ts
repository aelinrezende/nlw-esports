import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import {
  convertHourStringToMinutes,
  convertMinutesToHoursString,
} from "./utils/date";

const app = express();

app.use(express.json());
app.use(cors());

const prisma = new PrismaClient({
  log: ["query", "info", "warn"],
});

app.get("/games", async (req, res) => {
  const games = await prisma.game.findMany();

  res.json(games);
});

app.get("/games/:id/ads", async (req, res) => {
  const { id: gameId } = req.params;

  const ads = await prisma.ad.findMany({
    select: {
      id: true,
      name: true,
      weekDays: true,
      userVoiceChannel: true,
      yearsPlaying: true,
      hourStart: true,
      hourEnd: true,
    },
    where: {
      gameId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  res.json(
    ads.map((ad) => ({
      ...ad,
      weekDays: ad.weekDays.split(","),
      hourStart: convertMinutesToHoursString(ad.hourStart),
      hourEnd: convertMinutesToHoursString(ad.hourEnd),
    }))
  );
});

app.post("/games/:id/ads", async (req, res) => {
  const { id: gameId } = req.params;
  const { body: dto } = req;

  const ad = await prisma.ad.create({
    data: {
      ...dto,
      gameId,
      weekDays: dto.weekDays.join(","),
      hourStart: convertHourStringToMinutes(dto.hourStart),
      hourEnd: convertHourStringToMinutes(dto.hourEnd),
    },
  });

  res.status(201).json(ad);
});

app.get("/ads/:id/discord", async (req, res) => {
  const { id } = req.params;

  const ad = await prisma.ad.findUniqueOrThrow({
    select: {
      discord: true,
    },
    where: {
      id,
    },
  });

  res.json(ad);
});

app.listen(8090, () => {
  console.log("Server started on port 8090");
});
