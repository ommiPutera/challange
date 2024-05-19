import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: "Gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: "omiputrakarunia@gmail.com",
    pass: process.env.EMAIL_APP_PASS,
  },
});

async function sendEmailVerif({ to, fullName, userId }: { to: string, fullName: string, userId: string }) { 
  const html = `
    <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
    <html>
      <head>
        <meta http-equiv="Content-Type" content="text/html charset=UTF-8" />
        <style type="text/css">
          @font-face {
            font-weight: 500;
            font-style: normal;
            font-display: swap;
          }

          @font-face {
            font-weight: normal;
            font-style: normal;
            font-display: swap;
          }
        </style>
      </head>
      <body style="font-family:ui-sans-serif, sans-serif;">
        <div style="margin: 0 auto; max-width: 450px;">

          <h2 style="text-align: center">Verifikasi alamat email Anda</h2>
          <p style="text-align: center">Hallo ${fullName}, Mohon konfirmasi alamat email Anda untuk melanjutkan proses registrasi</p>
          <br></br>
          <a href="http://localhost:3000/registration/user-verify?id=${userId}" style="display: block; margin: 0 auto; width: 50%; padding: 0.5rem; background: #10172a; border-radius: 7px; border-width: 0; font-size: 0.9rem; text-align: center; font-family: sans-serif; text-decoration: none; color: white">
            Verifikasi
          </a>
        </div>
      </body>
    </html>
  `
  
  return transporter.sendMail({
      from: "omiputrakarunia@gmail.com",
      to,
      subject: "Verifikasi email Anda",
      text: "This is a test email sent using Nodemailer.",
      html
  })
}

export {sendEmailVerif}