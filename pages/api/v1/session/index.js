import { createRouter } from "next-connect";
import controller from "infra/controller";
import user from "models/user";
import { unauthorizedError } from "infra/errors.js";
import { password } from 'models/password.js'
const router = createRouter();

router.post(postHandler);

export default router.handler(controller.errorHandlers);

async function postHandler(request, response) {
    const userInputValues = request.body;
    try{
        const storedUser = await user.findOneByEmail(userInputValues.email);
        const correctPassowrdMatch = await password.compare(userInputValues.password, storedUser.password)
        console.log(correctPassowrdMatch)

        if(!correctPassowrdMatch){
            throw new unauthorizedError({
                message: "Senha não confere.",
                action: "Verifique se este dado está correto."
            });
        }

    }catch(error){
        throw new unauthorizedError({
            message: "Dados de autenticação não conferem.",
            action: "Verifique se os dados enviados estão correto"
        })
    }
    
    return response.status(201).json({})
}