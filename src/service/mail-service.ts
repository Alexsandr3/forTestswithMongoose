import {emailAdapter} from "../adapter/email-adapter";

class EmailService {
    async sendEmailRecoveryMessage(email: string, confirmationCode: string) {
        const subject = "Finish password recovery"
        //const link = `${process.env.API_URL}/registration-confirmation?code=${confirmationCode}`
        const link = `https://somesite.com/registration-confirmation?code=${confirmationCode}`
        const message = `
        <h1>Password recovery</h1>
       <p>To finish password recovery please follow the link below:
          <a href='${link}'>recovery password</a>
      </p>`
        return await emailAdapter.sendEmail(email, subject, message)
    }
    async sendPasswordRecoveryMessage(email: string, confirmationCode: string) {
        const subject = "Password recovery"
        //const link = `${process.env.API_URL}/new-password?code=${confirmationCode}`
        const link = `https://somesite.com/password-recovery?recoveryCode=${confirmationCode}`
        const message = `
        <h1>Password recovery</h1>
       <p>To finish password recovery please follow the link below:
          <a href='${link}'>recovery password</a>
      </p>`
        return await emailAdapter.sendEmail(email, subject, message)
    }
    async sendEmailConfirmation(email: string, confirmationCode: string) {
        const subject = "Finish registration"
        // const link = `${process.env.API_URL}/registration-confirmation?code=${confirmationCode}`
        const link = `https://somesite.com/registration-confirmationa${confirmationCode}`
        const message = `
        <h1>Thank for your registration</h1>
       <p>To finish registration please follow the link below:
          <a href='${link}'>complete registration</a>
      </p>`
        return await emailAdapter.sendEmail(email, subject, message)
    }
}


export const emailService = new  EmailService()
