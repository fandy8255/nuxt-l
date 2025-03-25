/*
export default defineEventHandler(async (event) => {
   
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

      return true
    
    //return sendMail({ subject: body.subject , text: message, to: mail })
  })*/

import sgMail from '@sendgrid/mail'

export default defineEventHandler(async (event) => {
    sgMail.setApiKey(process.env.SMTP_PASSWORD!)
    const runtimeConfig = useRuntimeConfig();
    const mail = runtimeConfig.mail;

    const body = await readBody(event)

    if (!body.name || !body.email || !body.subject) {
        throw createError({ statusCode: 400, message: 'Missing required fields' });
    }

    const message = `
    nombre: ${body.name}
    correo: ${body.email}
    titulo: ${body.subject}
    mensaje: ${body.message}
    `

    const msg = {
        to: mail, // recipient email
        from: 'support@latinpanty.com',
        subject: body.subject,
        text: message,
    }

    try {
        await sgMail.send(msg)
        return { success: true }
    } catch (error) {
        console.error(error)
        throw createError({ statusCode: 500, message: "Email failed to send" })
    }
})