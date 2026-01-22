import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  app.get(api.conversions.list.path, async (req, res) => {
    const sessionId = req.params.sessionId;
    const history = await storage.getConversions(sessionId);
    res.json(history);
  });

  app.post(api.conversions.create.path, async (req, res) => {
    try {
      const input = api.conversions.create.input.parse(req.body);
      const conversion = await storage.createConversion(input);
      res.status(201).json(conversion);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  app.delete(api.conversions.clear.path, async (req, res) => {
    const sessionId = req.params.sessionId;
    await storage.clearConversions(sessionId);
    res.status(204).send();
  });

  return httpServer;
}
