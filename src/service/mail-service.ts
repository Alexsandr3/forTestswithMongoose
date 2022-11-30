import {EmailAdapter} from "../adapter/email-adapter";

export class EmailService {
    constructor(protected emailAdapter: EmailAdapter) {
    }
    async sendPasswordRecoveryMessage(email: string, confirmationCode: string) {
        const subject = "Password recovery"
        const link = `${process.env.CLIENT_URL}/password-recovery?recoveryCode=${confirmationCode}`
        const message = `
       <div style="width: 600px; text-align: center; font-family: Tahoma">
    <br/>
    <br/>
        <h2>Thank you for trusting us!</h2>
    <br/>
    <div>
        <p>
            You made the right choice join!🔥
            <br/>
            Please follow the link below to complete your recovery:
        </p>
        <a href="" style="text-align: center">${link}</a>
    </div>
    <br/>
    <hr/>
    <br/>
    <div>
        <img style="width: 300px" src="https://img.freepik.com/free-vector/open-locker_53876-25497.jpg?w=1060&t=st=1669730284~exp=1669730884~hmac=8b2a2001b2dff52867a04116562094e75f66fe64a6f2a092daf24b86d2f0d974">
    </div>
</div>`
        return await this.emailAdapter.sendEmail(email, subject, message)
    }

    async sendEmailConfirmation(email: string, confirmationCode: string) {
        const subject = "Finish registration"
        const link = `${process.env.CLIENT_URL}/registration-confirmation?confirmCode=${confirmationCode}`
        const message = `
       <div style="width: 600px; text-align: center; font-family: Tahoma">
    <br/>
    <br/>
        <h2>Thank you for your registration!</h2>
    <br/>
    <div>
        <p>
            You made the right choice join our team!🔥
            <br/>
            Please follow the link below to complete your registration:
        </p>
        <input type="button" style="background-color: #fdab5d; color: #fff; border: 0px; padding: 10px 20px; border-radius: 8px; font-size: 24px; margin: 15px" onclick="location.href=${link};" value="Confirm registration">
        <a href="" style="text-align: center">${link}</a>
    </div>
    <br/>
    <hr/>
    <br/>
    <div>
        <img style="width: 600px" src="https://img.freepik.com/free-vector/delivery-service-with-masks-concept_23-2148497067.jpg?w=1480&t=st=1669724055~exp=1669724655~hmac=dd73883ed66dbabcc485d55238f4338b9323fee12cd51942d47754c714adc9d6">
    </div>
</div>
`
        return await this.emailAdapter.sendEmail(email, subject, message)
    }
}



