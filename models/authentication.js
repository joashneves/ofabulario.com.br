import { unauthorizedError } from "infra/errors";
import password from "./password";
import user from "./user";

async function getAuthenticatedUser(providedEmail, providedPassword) {

    try{
        console.log(`Email fornecido ${providedEmail}`)

        const storedUser = await findUserByEmail(providedEmail)
        await validatePassword(providedPassword, storedUser.password)
   
        return storedUser;
    }catch(error){
        if(error instanceof unauthorizedError){
            throw new unauthorizedError({
                message: "Dados de autenticação não conferem.",
                action: "Verifique se os dados enviados estão correto",
            });
        }
        console.log(error)
        throw error;
    }

    async function findUserByEmail(providedEmail) {
        let storedUser;

        try{
            storedUser = await user.findOneByEmail(providedEmail);
        }catch{
            
                throw new unauthorizedError({
                    message: "Email não confere.",
                    action: "Verifique se os dados enviados estão correto",
                });
            
        }

        return storedUser;
    }

    async function validatePassword(providedPassword, storedPassword) {

        const correctPassowrdMatch = await password.compare(
            providedPassword,
            storedPassword,
        );

        if (!correctPassowrdMatch) {
            throw new unauthorizedError({
                message: "Senha não confere.",
                action: "Verifique se os dados enviados estão correto",
            });

        }
    }
}

const authentication = {
    getAuthenticatedUser,
}

export default authentication;