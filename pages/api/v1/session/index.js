import { createRouter } from "next-connect";
import controller from "infra/controller";
import authentication from "models/authentication";
import session from "models/session";
const router = createRouter();

router.post(postHandler);

export default router.handler(controller.errorHandlers);

async function postHandler(request, response) {
  const userInputValues = JSON.parse(request.body);

  console.log(`Dados fornecidos ${JSON.stringify(userInputValues)}`);

  const authenticationUser = await authentication.getAuthenticatedUser(
    userInputValues.email,
    userInputValues.password,
  );

  const newSession = await session.create(authenticationUser.id)

  return response.status(201).json(newSession);
}
