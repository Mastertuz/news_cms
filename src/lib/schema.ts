import { z } from "zod";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(7, "Password must be at least 7 characters long"),
});

type Schema = z.infer<typeof schema>;

export { schema, type Schema };