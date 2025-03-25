export default defineEventHandler(async (event) => {
    const { sendMail } = useNodeMailer()
    const runtimeConfig = useRuntimeConfig();
    const mail = runtimeConfig.mail;

    const body = await readBody(event);

    const message=`
    nombre: ${body.name}
    correo: ${body.email}
    titulo: ${body.subject}
    mensaje: ${body.message}
    `

    if (!body.name || !body.email || !body.subject) {
        throw createError({ statusCode: 400, message: 'Missing required fields' });
      }
    
    return sendMail({ subject: body.subject , text: message, to: mail })
  })