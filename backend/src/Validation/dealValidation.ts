import z from "zod"; 

const dealSchema = z.object({
    title: z.string(),
    
    value: z.number(),

    stage: z.enum(["Lead", "Qualified", "Proposal", "Won", "Lost"]),
    
    customerId: z.string()

})
export default dealSchema;