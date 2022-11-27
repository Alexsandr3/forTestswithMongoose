import nodemailer from "nodemailer";

export class EmailAdapter {
    async sendEmail(email: string, subject: string, message: string) {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: 'forexperienceinincubatore@gmail.com', // generated ethereal user //forexperienceinincubatore@gmail.com
                pass: 'nbhygxjlzivnxxjh', // generated ethereal password //hyTgi1-nohwaw-gansab
            },
        });
        const info = await transporter.sendMail({
            from: '"Free help 🔐" <forexperienceinincubatore@gmail.com>', // sender address
            to: email, // list of receivers
            subject, // Subject line
            html: message // html body
        });
        return info.envelope
    }
}

