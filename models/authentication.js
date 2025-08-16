import { UnauthorizedError } from "infra/errors";
import password from "./password";
import user from "./user";

async function getAuthenticatedUser(providedEmail, providedPassword) {
  try {
    console.log(`Email fornecido ${providedEmail}`);

    const storedUser = await findUserByEmail(providedEmail);
    await validatePassword(providedPassword, storedUser.password);

    return storedUser;
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      throw new UnauthorizedError({
        message: "Dados de autenticação não conferem.",
        action: "Verifique se os dados enviados estão corretos",
      });
    }
    console.log(error);
    throw error;
  }

  async function findUserByEmail(providedEmail) {
    let storedUser;

    try {
      storedUser = await user.findOneByEmail(providedEmail);
    } catch {
      throw new UnauthorizedError({
        message: "Email não confere.",
        action: "Verifique se os dados enviados estão corretos",
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
      throw new UnauthorizedError({
        message: "Senha não confere.",
        action: "Verifique se os dados enviados estão corretos",
      });
    }
  }
}

const authentication = {
  getAuthenticatedUser,
};

export default authentication;
