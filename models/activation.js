import email from 'infra/email.js'

async function sendEmailToUser(user) {
    await email.send({
    from: "FinTab <contato@fintab.com.br>",
    to: user.email,
    subject: "Ative seu cadastro!",
    text: `${user.username}, clique no link abaixo para abitar seu cadastro
https://link

Atenciosamente,
Equipe`

})
}

const activation = {
    sendEmailToUser,
}

export default activation