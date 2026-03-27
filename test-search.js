const { z } = require('zod');
const searchSchema = z.object({
  specialty: z.string().optional(),
  insurance: z.union([z.array(z.string()), z.string()]).optional(),
  location: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  appointment_type: z.enum(["in_person", "virtual", "either"]).optional(),
  urgency: z.enum(["asap", "two_weeks", "month", "flexible"]).optional(),
});
console.log(searchSchema.safeParse({}).success);
