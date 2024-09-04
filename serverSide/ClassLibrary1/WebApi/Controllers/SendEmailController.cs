using ClassLibrary1.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Net.Mail;
using System.Net;

namespace WebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SendEmailController : ControllerBase
    {
        Trip4UContext db = new Trip4UContext();

        [HttpPost]
        [Route("sendPassword")]
        public async Task<IActionResult> SendEmail([FromBody] string emailRequest)
        {

            var user = db.TblUsers.Where(u => u.Email == emailRequest).FirstOrDefault();
            if (user == null)
            {
                return BadRequest("לא קיים אימייל כזה");
            }

            var email = new MailMessage
            {
                From = new MailAddress("trip4usend@outlook.com"),
                Subject = "Trip4U - שחזור סיסמה",
                Body = "<div style=\"text-align: right; direction: rtl;\">שלום " + user.FirstName + ",<br><br>" +
               "קיבלנו בקשה לשחזור סיסמה עבור חשבונך באתר Trip4u.<br>" +
               "להלן סיסמתך: " + user.Password + "<br><br>" +
               "בברכה,<br>" +
               "צוות Trip4u</div>",
                IsBodyHtml = true,
            };
            email.To.Add(new MailAddress(emailRequest));

            using var smtp = new SmtpClient("smtp-mail.outlook.com", 587)
            {
                Credentials = new NetworkCredential("trip4usend@outlook.com", "111sendtrip4u"),
                EnableSsl = true,
            };

            try
            {
                await smtp.SendMailAsync(email);
                return Ok("Email sent successfully.");
            }
            catch (SmtpException ex)
            {
                return StatusCode((int)HttpStatusCode.InternalServerError, $"Error sending email: {ex.Message}");
            }
        }


    }
}