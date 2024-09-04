using ClassLibrary1.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace WebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UploadImageController : ControllerBase
    {
        Trip4UContext db = new Trip4UContext();


        [HttpPost("UploadUserImage")]
        public async Task<IActionResult> UploadUserImage(IFormFile file, string userName)
        {
            if (file == null || file.Length == 0)
                return BadRequest("No file uploaded");

            var ProfilePath = Path.Combine(Directory.GetCurrentDirectory(), "userPic");

            if (!Directory.Exists(ProfilePath))
            {
                Directory.CreateDirectory(ProfilePath);
            }
            var fileName = string.IsNullOrEmpty(userName) // שומר את זה בתור 8941.png
                ? file.FileName
                : $"{userName}{Path.GetExtension(file.FileName)}";
            var filePath = Path.Combine(ProfilePath, fileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }
            return Ok(new { fileName = fileName, filePath = filePath });
        }

        [HttpPost("UploadMainPic")]

        public async Task<IActionResult> UploadMainPic(IFormFile file, int tripId)
        {
            if (file == null || file.Length == 0)
                return BadRequest("No file uploaded");

            var mainPicPath = Path.Combine(Directory.GetCurrentDirectory(), "tripMainPic");

            if (!Directory.Exists(mainPicPath))
            {
                Directory.CreateDirectory(mainPicPath);
            }

            // Use the custom file name provided by the client
            var fileName = string.IsNullOrEmpty(tripId.ToString()) // שומר את זה בתור 8941.png
                ? file.FileName
                : $"{tripId}{Path.GetExtension(file.FileName)}";
            var filePath = Path.Combine(mainPicPath, fileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            TblTrip trip = db.TblTrips.Where(x => x.TripId == tripId).First();
            trip.TripMainPic = "~/TripMainPic/" + fileName;
            db.SaveChanges();

            return Ok(new { fileName = fileName, filePath = filePath });
        }

        [HttpPost("UploadTripPic1")]

        public async Task<IActionResult> UploadTripPic1(IFormFile file, int tripId)
        {
            if (file == null || file.Length == 0)
                return BadRequest("No file uploaded");

            var mainPicPath = Path.Combine(Directory.GetCurrentDirectory(), "TripPic1");

            if (!Directory.Exists(mainPicPath))
            {
                Directory.CreateDirectory(mainPicPath);
            }

            // Use the custom file name provided by the client
            var fileName = string.IsNullOrEmpty(tripId.ToString()) // שומר את זה בתור 8941.png
                ? file.FileName
                : $"{tripId}{Path.GetExtension(file.FileName)}";
            var filePath = Path.Combine(mainPicPath, fileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            TblTrip trip = db.TblTrips.Where(x => x.TripId == tripId).First();
            trip.Pic1 = "~/TripPic1/" + fileName;
            db.SaveChanges();

            return Ok(new { fileName = fileName, filePath = filePath });
        }

        [HttpPost("UploadTripPic2")]

        public async Task<IActionResult> UploadTripPic2(IFormFile file, int tripId)
        {
            if (file == null || file.Length == 0)
                return BadRequest("No file uploaded");

            var mainPicPath = Path.Combine(Directory.GetCurrentDirectory(), "TripPic2");

            if (!Directory.Exists(mainPicPath))
            {
                Directory.CreateDirectory(mainPicPath);
            }

            // Use the custom file name provided by the client
            var fileName = string.IsNullOrEmpty(tripId.ToString()) // שומר את זה בתור 8941.png
                ? file.FileName
                : $"{tripId}{Path.GetExtension(file.FileName)}";
            var filePath = Path.Combine(mainPicPath, fileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            TblTrip trip = db.TblTrips.Where(x => x.TripId == tripId).First();
            trip.Pic2 = "~/TripPic2/" + fileName;
            db.SaveChanges();

            return Ok(new { fileName = fileName, filePath = filePath });
        }
    }
}
