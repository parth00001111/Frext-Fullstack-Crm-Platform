import z from  "zod";

const roleEnums = z.enum(['Admin', 'Sales', 'Manager'])

const signupSchema = z.object({

    name: z.string().min(3),

    email: z.email(),

    password: z.string().min(6),

    role: roleEnums,                    

})
const signinSchema = z.object({
    email: z.email(), 
    password: z.string(),
})
export { signupSchema, signinSchema }   ;