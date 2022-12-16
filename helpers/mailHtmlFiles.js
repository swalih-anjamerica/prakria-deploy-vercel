
export const addMemberHtmlFile = (first_name, authUrl) => {

    let htmlFile = `<html>

        <head>
            <title></title>
            <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1">
                <meta http-equiv="X-UA-Compatible" content="IE=edge" />
                <style type="text/css">
                    @media screen {
    @font-face {
                        font - family: 'Lato';
                    font-style: normal;
                    font-weight: 400;
                    src: local('Lato Regular'), local('Lato-Regular'), url(https://fonts.gstatic.com/s/lato/v11/qIIYRU-oROkIk8vfvxw6QvesZW2xOQ-xsNqO47m55DA.woff) format('woff');
    }

                    @font-face {
                        font - family: 'Lato';
                    font-style: normal;
                    font-weight: 700;
                    src: local('Lato Bold'), local('Lato-Bold'), url(https://fonts.gstatic.com/s/lato/v11/qdgUG4U09HnJwhYI-uK18wLUuEpTyoUstqEm5AMlJo4.woff) format('woff');
    }

                    @font-face {
                        font - family: 'Lato';
                    font-style: italic;
                    font-weight: 400;
                    src: local('Lato Italic'), local('Lato-Italic'), url(https://fonts.gstatic.com/s/lato/v11/RYyZNoeFgb0l7W3Vu1aSWOvvDin1pK8aKteLpeZ5c0A.woff) format('woff');
    }

                    @font-face {
                        font - family: 'Lato';
                    font-style: italic;
                    font-weight: 700;
                    src: local('Lato Bold Italic'), local('Lato-BoldItalic'), url(https://fonts.gstatic.com/s/lato/v11/HkF_qI1x_noxlxhrhMQYELO3LdcAZYWl9Si6vvxL-qU.woff) format('woff');
    }
}

                    /* CLIENT-SPECIFIC STYLES */
                    body,
                    table,
                    td,
                    a {
                        -webkit - text - size - adjust: 100%;
                    -ms-text-size-adjust: 100%;
}

                    table,
                    td {
                        mso - table - lspace: 0pt;
                    mso-table-rspace: 0pt;
}

                    img {
                        -ms - interpolation - mode: bicubic;
}

                    /* RESET STYLES */
                    img {
                        border: 0;
                    height: auto;
                    line-height: 100%;
                    outline: none;
                    text-decoration: none;
}

                    table {
                        border - collapse: collapse !important;
}

                    body {
                        height: 100% !important;
                    margin: 0 !important;
                    padding: 0 !important;
                    width: 100% !important;
}

                    /* iOS BLUE LINKS */
                    a[x-apple-data-detectors] {
                        color: inherit !important;
                    text-decoration: none !important;
                    font-size: inherit !important;
                    font-family: inherit !important;
                    font-weight: inherit !important;
                    line-height: inherit !important;
}

                    /* MOBILE STYLES */
                    @media screen and (max-width:600px) {
                        h1 {
                        font - size: 32px !important;
                    line-height: 32px !important;
    }
}

                    /* ANDROID CENTER FIX */
                    div[style*="margin: 16px 0;"] {
                        margin: 0 !important;
}
                </style>
        </head>

        <body style="background-color: #f4f4f4; margin: 0 !important; padding: 0 !important;">
            <!-- HIDDEN PREHEADER TEXT -->
            <div
                style="display: none; font-size: 1px; color: #fefefe; line-height: 1px; font-family: 'Lato', Helvetica, Arial, sans-serif; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden;">
                We're thrilled to have you here! Get ready to dive into your new account. </div>
            <table border="0" cellpadding="0" cellspacing="0" width="100%">
                <!-- LOGO -->
                <tr>
                    <td bgcolor="#FFF300" align="center">
                        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                            <tr>
                                <td align="center" valign="top" style="padding: 40px 10px 40px 10px;"> </td>
                            </tr>
                        </table>
                    </td>
                </tr>
                <tr>
                    <td bgcolor="#FFF300" align="center" style="padding: 0px 10px 0px 10px;">
                        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                            <tr>
                                <td bgcolor="#ffffff" align="center" valign="top"
                                    style="padding: 40px 20px 20px 20px; border-radius: 4px 4px 0px 0px; color: #111111; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 48px; font-weight: 400; letter-spacing: 4px; line-height: 48px;">
                                    <h1 style="font-size: 48px; font-weight: 400; margin: 2;">Welcome ${first_name}!</h1>
                                    <img
                                        src="https://www.linkpicture.com/q/logo_509.png" width="125" height="120"
                                        style="display: block; border: 0px;" />
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
                <tr>
                    <td bgcolor="#00FCFF" align="center" style="padding: 0px 10px 0px 10px;">
                        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                            <tr>
                                <td bgcolor="#ffffff" align="left"
                                    style="padding: 20px 30px 40px 30px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;">
                                    <p style="margin: 0;">We're excited to have you get started. First, you need to confirm your
                                        account. Just press the button below.</p>
                                </td>
                            </tr>
                            <tr>
                                <td bgcolor="#ffffff" align="left">
                                    <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                        <tr>
                                            <td bgcolor="#00FCFF" align="center" style="padding: 20px 30px 60px 30px;">
                                                <table border="0" cellspacing="0" cellpadding="0">
                                                    <tr>
                                                        <td align="center" style="border-radius: 3px;" bgcolor="#062BCE">
                                                            <a href="${authUrl}" target="_blank"
                                                                style="font-size: 20px; font-family: Helvetica, Arial, sans-serif; color: #ffffff; text-decoration: none; color: #ffffff; text-decoration: none; padding: 15px 25px; border-radius: 2px; border: 1px solid #FFA73B; display: inline-block;">
                                                                Confirm Account
                                                            </a>
                                                        </td>
                                                    </tr>
                                                </table>
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr> <!-- COPY -->


                        </table>
                    </td>
                </tr>
            </table>
        </body>

    </html>`

    return htmlFile;
}


export const clientVerificationHtmlFile = (authUrl) => {
    let htmlFile = `
        <html>

            <head>
                <title></title>
                <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1">
                    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
                    <style type="text/css">
                        @media screen {
                @font-face {
                            font - family: 'Lato';
                        font-style: normal;
                        font-weight: 400;
                        src: local('Lato Regular'), local('Lato-Regular'), url(https://fonts.gstatic.com/s/lato/v11/qIIYRU-oROkIk8vfvxw6QvesZW2xOQ-xsNqO47m55DA.woff) format('woff');
                }

                        @font-face {
                            font - family: 'Lato';
                        font-style: normal;
                        font-weight: 700;
                        src: local('Lato Bold'), local('Lato-Bold'), url(https://fonts.gstatic.com/s/lato/v11/qdgUG4U09HnJwhYI-uK18wLUuEpTyoUstqEm5AMlJo4.woff) format('woff');
                }

                        @font-face {
                            font - family: 'Lato';
                        font-style: italic;
                        font-weight: 400;
                        src: local('Lato Italic'), local('Lato-Italic'), url(https://fonts.gstatic.com/s/lato/v11/RYyZNoeFgb0l7W3Vu1aSWOvvDin1pK8aKteLpeZ5c0A.woff) format('woff');
                }

                        @font-face {
                            font - family: 'Lato';
                        font-style: italic;
                        font-weight: 700;
                        src: local('Lato Bold Italic'), local('Lato-BoldItalic'), url(https://fonts.gstatic.com/s/lato/v11/HkF_qI1x_noxlxhrhMQYELO3LdcAZYWl9Si6vvxL-qU.woff) format('woff');
                }
            }

                        /* CLIENT-SPECIFIC STYLES */
                        body,
                        table,
                        td,
                        a {
                            -webkit - text - size - adjust: 100%;
                        -ms-text-size-adjust: 100%;
            }

                        table,
                        td {
                            mso - table - lspace: 0pt;
                        mso-table-rspace: 0pt;
            }

                        img {
                            -ms - interpolation - mode: bicubic;
            }

                        /* RESET STYLES */
                        img {
                            border: 0;
                        height: auto;
                        line-height: 100%;
                        outline: none;
                        text-decoration: none;
            }

                        table {
                            border - collapse: collapse !important;
            }

                        body {
                            height: 100% !important;
                        margin: 0 !important;
                        padding: 0 !important;
                        width: 100% !important;
            }

                        /* iOS BLUE LINKS */
                        a[x-apple-data-detectors] {
                            color: inherit !important;
                        text-decoration: none !important;
                        font-size: inherit !important;
                        font-family: inherit !important;
                        font-weight: inherit !important;
                        line-height: inherit !important;
            }

                        /* MOBILE STYLES */
                        @media screen and (max-width:600px) {
                            h1 {
                            font - size: 32px !important;
                        line-height: 32px !important;
                }
            }

                        /* ANDROID CENTER FIX */
                        div[style*="margin: 16px 0;"] {
                            margin: 0 !important;
            }
                    </style>
            </head>

            <body style="background-color: #f4f4f4; margin: 0 !important; padding: 0 !important;">
                <!-- HIDDEN PREHEADER TEXT -->
                <div
                    style="display: none; font-size: 1px; color: #fefefe; line-height: 1px; font-family: 'Lato', Helvetica, Arial, sans-serif; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden;">
                    We're thrilled to have you here! Get ready to dive into your new account. </div>
                <table border="0" cellpadding="0" cellspacing="0" width="100%">
                    <!-- LOGO -->
                    <tr>
                        <td bgcolor="#FFF300" align="center">
                            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                                <tr>
                                    <td align="center" valign="top" style="padding: 40px 10px 40px 10px;"> </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <tr>
                        <td bgcolor="#FFF300" align="center" style="padding: 0px 10px 0px 10px;">
                            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                                <tr>
                                    <td bgcolor="#ffffff" align="center" valign="top"
                                        style="padding: 40px 20px 20px 20px; border-radius: 4px 4px 0px 0px; color: #111111; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 48px; font-weight: 400; letter-spacing: 4px; line-height: 48px;">
                                        <h1 style="font-size: 48px; font-weight: 400; margin: 2;">Validate your account!</h1>
                                        <img
                                            src="https://www.linkpicture.com/q/logo_509.png" width="125" height="120"
                                            style="display: block; border: 0px;" />
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <tr>
                        <td bgcolor="#00FCFF" align="center" style="padding: 0px 10px 0px 10px;">
                            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                                <tr>
                                    <td bgcolor="#ffffff" align="left"
                                        style="padding: 20px 30px 40px 30px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;">
                                        <p style="margin: 0;">hi user, verify your account by clicking the link below.</p>
                                    </td>
                                </tr>
                                <tr>
                                    <td bgcolor="#ffffff" align="left">
                                        <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                            <tr>
                                                <td bgcolor="#00FCFF" align="center" style="padding: 20px 30px 60px 30px;">
                                                    <table border="0" cellspacing="0" cellpadding="0">
                                                        <tr>
                                                            <td align="center" style="border-radius: 3px;" bgcolor="#062BCE">
                                                                <a href="${authUrl}" target="_blank"
                                                                    style="font-size: 20px; font-family: Helvetica, Arial, sans-serif; color: #ffffff; text-decoration: none; color: #ffffff; text-decoration: none; padding: 15px 25px; border-radius: 2px; border: 1px solid #FFA73B; display: inline-block;">
                                                                    Click here to validate your email
                                                                </a>
                                                            </td>
                                                        </tr>
                                                    </table>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr> <!-- COPY -->


                            </table>
                        </td>
                    </tr>
                </table>
            </body>

        </html>`

    return htmlFile;
}

export const forgotPasswordHtmlFile = (authUrl) => {
    const htmlFile = `
        <html>

            <head>
                <title></title>
                <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1">
                    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
                    <style type="text/css">
                        @media screen {
                @font-face {
                            font - family: 'Lato';
                        font-style: normal;
                        font-weight: 400;
                        src: local('Lato Regular'), local('Lato-Regular'), url(https://fonts.gstatic.com/s/lato/v11/qIIYRU-oROkIk8vfvxw6QvesZW2xOQ-xsNqO47m55DA.woff) format('woff');
                }

                        @font-face {
                            font - family: 'Lato';
                        font-style: normal;
                        font-weight: 700;
                        src: local('Lato Bold'), local('Lato-Bold'), url(https://fonts.gstatic.com/s/lato/v11/qdgUG4U09HnJwhYI-uK18wLUuEpTyoUstqEm5AMlJo4.woff) format('woff');
                }

                        @font-face {
                            font - family: 'Lato';
                        font-style: italic;
                        font-weight: 400;
                        src: local('Lato Italic'), local('Lato-Italic'), url(https://fonts.gstatic.com/s/lato/v11/RYyZNoeFgb0l7W3Vu1aSWOvvDin1pK8aKteLpeZ5c0A.woff) format('woff');
                }

                        @font-face {
                            font - family: 'Lato';
                        font-style: italic;
                        font-weight: 700;
                        src: local('Lato Bold Italic'), local('Lato-BoldItalic'), url(https://fonts.gstatic.com/s/lato/v11/HkF_qI1x_noxlxhrhMQYELO3LdcAZYWl9Si6vvxL-qU.woff) format('woff');
                }
            }

                        /* CLIENT-SPECIFIC STYLES */
                        body,
                        table,
                        td,
                        a {
                            -webkit - text - size - adjust: 100%;
                        -ms-text-size-adjust: 100%;
            }

                        table,
                        td {
                            mso - table - lspace: 0pt;
                        mso-table-rspace: 0pt;
            }

                        img {
                            -ms - interpolation - mode: bicubic;
            }

                        /* RESET STYLES */
                        img {
                            border: 0;
                        height: auto;
                        line-height: 100%;
                        outline: none;
                        text-decoration: none;
            }

                        table {
                            border - collapse: collapse !important;
            }

                        body {
                            height: 100% !important;
                        margin: 0 !important;
                        padding: 0 !important;
                        width: 100% !important;
            }

                        /* iOS BLUE LINKS */
                        a[x-apple-data-detectors] {
                            color: inherit !important;
                        text-decoration: none !important;
                        font-size: inherit !important;
                        font-family: inherit !important;
                        font-weight: inherit !important;
                        line-height: inherit !important;
            }

                        /* MOBILE STYLES */
                        @media screen and (max-width:600px) {
                            h1 {
                            font - size: 32px !important;
                        line-height: 32px !important;
                }
            }

                        /* ANDROID CENTER FIX */
                        div[style*="margin: 16px 0;"] {
                            margin: 0 !important;
            }
                    </style>
            </head>

            <body style="background-color: #f4f4f4; margin: 0 !important; padding: 0 !important;">
                <!-- HIDDEN PREHEADER TEXT -->
                <div
                    style="display: none; font-size: 1px; color: #fefefe; line-height: 1px; font-family: 'Lato', Helvetica, Arial, sans-serif; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden;">
                    We're thrilled to have you here! Get ready to dive into your new account. </div>
                <table border="0" cellpadding="0" cellspacing="0" width="100%">
                    <!-- LOGO -->
                    <tr>
                        <td bgcolor="#FFF300" align="center">
                            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                                <tr>
                                    <td align="center" valign="top" style="padding: 40px 10px 40px 10px;"> </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <tr>
                        <td bgcolor="#FFF300" align="center" style="padding: 0px 10px 0px 10px;">
                            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                                <tr>
                                    <td bgcolor="#ffffff" align="center" valign="top"
                                        style="padding: 40px 20px 20px 20px; border-radius: 4px 4px 0px 0px; color: #111111; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 48px; font-weight: 400; letter-spacing: 4px; line-height: 48px;">
                                        <h1 style="font-size: 48px; font-weight: 400; margin: 2;">Validate your account!</h1>
                                        <img
                                            src="https://www.linkpicture.com/q/logo_509.png" width="125" height="120"
                                            style="display: block; border: 0px;" />
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <tr>
                        <td bgcolor="#00FCFF" align="center" style="padding: 0px 10px 0px 10px;">
                            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                                <tr>
                                    <td bgcolor="#ffffff" align="left"
                                        style="padding: 20px 30px 40px 30px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;">
                                        <p style="margin: 0;">hi user, reset your account by clicking the link below.</p>
                                    </td>
                                </tr>
                                <tr>
                                    <td bgcolor="#ffffff" align="left">
                                        <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                            <tr>
                                                <td bgcolor="#00FCFF" align="center" style="padding: 20px 30px 60px 30px;">
                                                    <table border="0" cellspacing="0" cellpadding="0">
                                                        <tr>
                                                            <td align="center" style="border-radius: 3px;" bgcolor="#062BCE">
                                                                <a href="${authUrl}" target="_blank"
                                                                    style="font-size: 20px; font-family: Helvetica, Arial, sans-serif; color: #ffffff; text-decoration: none; color: #ffffff; text-decoration: none; padding: 15px 25px; border-radius: 2px; border: 1px solid #FFA73B; display: inline-block;">
                                                                    Click here to reset your password
                                                                </a>
                                                            </td>
                                                        </tr>
                                                    </table>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr> <!-- COPY -->


                            </table>
                        </td>
                    </tr>
                </table>
            </body>

        </html>`

    return htmlFile;
}

export const requestQuoteHtml = (params) => {
    let { email, message } = params;
    return `
    <!doctype html>
    <html>

    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body> 
       <section style="background: rgba(255, 255, 255, 0.8); font-size: 20px; width: 500px; margin:auto; font-family: sans-serif;">
                <h1 style="text-align: center;">Request query</h1>
                <p style="font-weight: bold; ">Email</p>
                <p style="color:#333;">${email}</p>
                <hr>
                <p style="font-weight: bold; ">Message</p>
                <p style="color:#333;">${message}</p>
                <hr>
     </section>
    </body>
    </html>
    `
}

export const joinOurTeamHtml = (params) => {
    const { email, experienceLevel = "", message = "", name, phone, position, valueWithPrakria = "" } = params;

    return `
    <!DOCTYPE html>
    <html>

    <head>

    </head>

    <body>
        <section style="background: rgba(255, 255, 255, 0.8); font-size: 20px; width: 500px; margin:auto; font-family: sans-serif;">
            <h1 style="text-align: center;">Join Our Team</h1>
            <p style="font-weight: bold; ">Name</p>
            <p style="color:#333;">${name}</p>
            <hr>
            <p style="font-weight: bold; ">Experience Level</p>
            <p style="color:#333;">${experienceLevel}</p>
            <hr>
            <p style="font-weight: bold; ">What position are you applying for?</p>
            <p style="color:#333;">${position}</p>
            <hr>
            <p style="font-weight: bold; ">How can you add value with your abilities at PRAKRIA?</p>
            <p style="color:#333;">${valueWithPrakria}</p>
            <hr>
            <p style="font-weight: bold; ">Phone</p>
            <p style="color:#333;">${phone}</p>
            <hr>
            <p style="font-weight: bold; ">Email</p>
            <p style="color:#333;">${email}</p>
            <hr>
            <p style="font-weight: bold; ">Write a message</p>
            <p style="color:#333;">${message}</p>
            <hr/>
        </section>
    </body>

    </html>
    `
}

export const cardDeclineHtmlFile = (authUrl) => {
    return `
    <html lang="en">

    <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Document</title>
    </head>

    <body style="font-family:sans-serif;">
        <header style="display:flex; align-items: center; justify-content: center; gap: 10px;">
            <div>
                <svg xmlns="http://www.w3.org/2000/svg" style="color:red; width: 50px;" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round"
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            </div>
            <div>
                <h1>Prakria Card Declined</h1>
            </div>
        </header>
        <section style="margin-left:10vw;margin-right:10vw; text-align: center;">
            <p style="font-size: 16px;">Dear user, your card has been declined. We cannot renew subscription using this card. So, please add another card and help us to renew your subscription</p>
            <h2 style="margin-top:20px;"><a href="${authUrl}" style="color:darkblue; font-weight:500;">Click here to add new card</a></h2>
        </section>
    </body>
    </html>
    `
}

export const notificationEmailTemplate = (message, path, username) => {
    let notificationUrl = process.env.NOTIFICATION_URL || "http://localhost:3000";
    let authUrl = notificationUrl + "/account?tab=notifications";
    let htmlTemplate = `
    <!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link
        href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,400;0,500;0,600;1,400;1,700&display=swap"
        rel="stylesheet">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <style>
        @media screen {
            @font-face {
                font-family: 'Montserrat';
                font-style: italic;
                font-weight: 300;
                src: local('Montserrat Light Italic'), local('Montserrat-LightItalic'), url(https://fonts.gstatic.com/s/montserrat/v10/zhwB3-BAdyKDf0geWr9Ft04GofcKVZz6wtzX_QUIqsI.woff2) format('woff2');
                unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2212, U+2215;
              }
              
              @font-face {
                font-family: 'Montserrat';
                font-style: italic;
                font-weight: 400;
                src: local('Montserrat Italic'), local('Montserrat-Italic'), url(https://fonts.gstatic.com/s/montserrat/v10/-iqwlckIhsmvkx0N6rwPmugdm0LZdjqr5-oayXSOefg.woff2) format('woff2');
                unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2212, U+2215;
              }
              
              @font-face {
                font-family: 'Montserrat';
                font-style: italic;
                font-weight: 700;
                src: local('Montserrat Bold Italic'), local('Montserrat-BoldItalic'), url(https://fonts.gstatic.com/s/montserrat/v10/zhwB3-BAdyKDf0geWr9Ft3NuWYKPzoeKl5tYj8yhly0.woff2) format('woff2');
                unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2212, U+2215;
              }
              
              @font-face {
                font-family: 'Montserrat';
                font-style: normal;
                font-weight: 300;
                src: local('Montserrat Light'), local('Montserrat-Light'), url(https://fonts.gstatic.com/s/montserrat/v10/IVeH6A3MiFyaSEiudUMXE8u2Q0OS-KeTAWjgkS85mDg.woff2) format('woff2');
                unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2212, U+2215;
              }
              
              @font-face {
                font-family: 'Montserrat';
                font-style: normal;
                font-weight: 400;
                src: local('Montserrat Regular'), local('Montserrat-Regular'), url(https://fonts.gstatic.com/s/montserrat/v10/zhcz-_WihjSQC0oHJ9TCYPk_vArhqVIZ0nv9q090hN8.woff2) format('woff2');
                unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2212, U+2215;
              }
              
              @font-face {
                font-family: 'Montserrat';
                font-style: normal;
                font-weight: 700;
                src: local('Montserrat Bold'), local('Montserrat-Bold'), url(https://fonts.gstatic.com/s/montserrat/v10/IQHow_FEYlDC4Gzy_m8fcoWiMMZ7xLd792ULpGE4W_Y.woff2) format('woff2');
                unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2212, U+2215;
              }
        }
       
        * {
            padding: 0;
            margin: 0;
            font-family: 'Montserrat';
        }

        .h2{
            color:#000;
        }

        @media screen and (max-width:600px) {
            td {
                padding: 0 !important;
            }

            .img {
                width: 80px !important;
                margin-bottom: -4px !important;
            }

            .leftLine {
                width: 50px !important;
            }

            .h2 {
                margin-left: 10px !important;
                margin-top: 30px !important;
                font-size: 18px !important;
            }

            .h2-first{
                margin-bottom:5px !important;
            }
        }
    </style>
</head>

<body style="background-color: #fff; max-width: 1200px; margin: auto;">
    <table border="0" cellpadding="0" cellspacing="0" width="100%">
        <tr>
            <td bgcolor="#000">
                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 1200px;">
                    <tr>
                        <td style="padding: 20px 0 0 50px">
                            <img class="img" src="https://www.linkpicture.com/q/Prakria-Direct-Logo_Final_01-27-2.png"
                                style="width:150px;" />
                        </td>

                        <td align="end">
                            <img class="img" src="https://www.linkpicture.com/q/Shape-1_1.png" style="width:150px;" />
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 20px 0 50px 50px">
                            <h1
                                style="color:white;font-size:min(35px,5vw);margin-left: 10px;font-weight: 500; width: 100%;">
                                No spammy nonsense,<br />Just <i><b>Direct</b></i> talk
                            </h1>
                        </td>
                        <td align="end">
                            <img class="img" style="margin-bottom: -4px;"
                                src="https://www.linkpicture.com/q/Group-177.png" width="150px" />
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
        <tr>
            <td bgcolor="#fff" style="padding-top:20px; padding-bottom:20px;">
                <table>
                    
                    ${username ?
            `<tr>
                <h2 class="h2 h2-first" style="margin: 50px 10px 0px 50px; font-weight: 500;">Hi ${username},</h2>
            </tr>`
            :
            ""
        }
                    <tr>
                        ${path ? `<a href="${path}" style="color:#000;text-decoration:none">` : ""} 
                        <h2 class="h2" style="margin: 15px 10px 15px 50px; font-weight: 500;">
                        ${message}
                        </h2>
                        ${path ? `<a/>` : ""}
                    </tr>
                </table>
            </td>
        </tr>
        <tr>
            <td bgcolor="#0ADEA9">
                <table style="width:100%;">
                    <tr>
                        <td align="left">
                            <img class="leftLine" src="https://www.linkpicture.com/q/lines-circle-1.png"
                                style="width:80px; margin-bottom: 100px;" />
                        </td>
                        <td align="center">
                            <h3 style="text-align: center;font-weight: 400; font-size: min(20px,3vw); color:black;">
                                Sent by your design team that works</br> directly on your fingertips!
                            </h3>
                            
                            <h6 style="font-size: min(13px,2vw);margin-top: 30px;font-weight: 400; color:black;">
                                Trying to get rid of mails you don't want?
                                <a href="${authUrl}" style="color:black;">
                                <u>Manage your preferences here.</u>
                                </a>
                            </h6>
                        </td>
                        <td align="right">
                            <img class="leftLine" src="https://www.linkpicture.com/q/Shape-2.png"
                                style="width:80px ;margin-top: 40px; font-size: max(10px,1vw);" />
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>

</html>`
    return htmlTemplate;
}