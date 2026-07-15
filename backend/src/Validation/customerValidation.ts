import z from "zod"; 

const customerSchema = z.object({
    name: z.string(),
    email: z.email(),
    phone: z.string(),
    company: z.string().optional(),
    status: z.enum(['new', 'contacted', 'closed']),
})
export default customerSchema;