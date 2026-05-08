import { z } from 'zod';

export const settingsPatchSchema = z.object({
  colorPalette: z.string().optional(),
  bgImages: z.string().optional(),
  fontPair: z.string().optional(),
});

export type SettingsPatch = z.infer<typeof settingsPatchSchema>;
