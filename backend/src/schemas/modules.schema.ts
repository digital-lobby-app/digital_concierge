import { z } from "zod";

export const aboutModulePatchSchema = z.object({
  hotelName: z.string().optional(),
  content: z.object({
    welcomeMessage: z.string(),
    checkIn: z.string(),
    checkOut: z.string(),
    breakfast: z.string(),
    wifiName: z.string(),
    wifiPassword: z.string(),
    receptionPhone: z.string(),
  }),
});

export type AboutModulePatch = z.infer<typeof aboutModulePatchSchema>;