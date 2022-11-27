import {EmailAdapter} from "../adapter/email-adapter";

export class EmailService {
    constructor(protected emailAdapter: EmailAdapter) {
    }
    async sendPasswordRecoveryMessage(email: string, confirmationCode: string) {
        const subject = "Password recovery"
        const link = `${process.env.CLIENT_URL}/password-recovery?recoveryCode=${confirmationCode}`
        const message = `
        <h1>Password recovery</h1>
       <p>To finish password recovery please follow the link below:
          <a href='${link}'>"${link}"</a>
      </p>`
        return await this.emailAdapter.sendEmail(email, subject, message)
    }
    async sendEmailConfirmation(email: string, confirmationCode: string) {
        const subject = "Finish registration"
        const link = `${process.env.CLIENT_URL}/registration-confirmation?confirmCode=${confirmationCode}`
        const message = `
        <h1>Thank for your registration</h1>
       <p>To finish registration please follow the link below:
          <a href='${link}'>"${link}"</a>
      </p>`
        return await this.emailAdapter.sendEmail(email, subject, message)
    }
}



