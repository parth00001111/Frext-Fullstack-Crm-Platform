import z from "zod"; 

const schemaTask = z.object({
    title: z.string(),

    dueDate: z.coerce.date(),

    status: z.enum(["Pending", "In Progress", "Completed"]),
    
    customerId: z.string(),
})
export default schemaTask;