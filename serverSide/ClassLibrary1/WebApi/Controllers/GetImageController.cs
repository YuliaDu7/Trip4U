using ClassLibrary1.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace WebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class GetImageController : ControllerBase
    {
        Trip4UContext db = new Trip4UContext();
        [HttpGet]
        [Route("GetUserPic")]
        public dynamic GetUserPic(string primaryKey)
        {
            var imagesPath = Path.Combine(Directory.GetCurrentDirectory(), "userPic");
            var file = Directory.GetFiles(imagesPath, $"{primaryKey}.*").FirstOrDefault();

            if (file == null)
            {
                return NotFound();
            }

            var fileType = Path.GetExtension(file).ToLower();

            // Determine the content type based on the file extension.
            var contentType = fileType switch
            {
                ".jpg" => "image/jpeg",
                ".jpeg" => "image/jpeg",
                ".png" => "image/png",
                _ => "application/octet-stream",
            };

            var image = System.IO.File.OpenRead(file);
            return File(image, contentType);
        }

        [HttpGet]
        [Route("GetMainPic")]
        public dynamic GetMainPic(string tripid)
        {
            var imagesPath = Path.Combine(Directory.GetCurrentDirectory(), "tripMainPic");
            var file = Directory.GetFiles(imagesPath, $"{tripid}.*").FirstOrDefault();

            if (file == null)
            {
                return NotFound();
            }

            var fileType = Path.GetExtension(file).ToLower();

            // Determine the content type based on the file extension.
            var contentType = fileType switch
            {
                ".jpg" => "image/jpeg",
                ".jpeg" => "image/jpeg",
                ".png" => "image/png",
                ".gif" => "image/gif",
                _ => "application/octet-stream",
            };

            var image = System.IO.File.OpenRead(file);
            return File(image, contentType);
        }

        [HttpGet]
        [Route("GetTripPic1")]
        public dynamic GetTripPic1(string tripid)
        {
            var imagesPath = Path.Combine(Directory.GetCurrentDirectory(), "tripPic1");
            var file = Directory.GetFiles(imagesPath, $"{tripid}.*").FirstOrDefault();

            if (file == null)
            {
                return NotFound();
            }

            var fileType = Path.GetExtension(file).ToLower();

            // Determine the content type based on the file extension.
            var contentType = fileType switch
            {
                ".jpg" => "image/jpeg",
                ".jpeg" => "image/jpeg",
                ".png" => "image/png",
                _ => "application/octet-stream",
            };

            var image = System.IO.File.OpenRead(file);
            return File(image, contentType);
        }


        [HttpGet]
        [Route("GetTripPic2")]
        public dynamic GetTripPic2(string tripid)
        {
            var imagesPath = Path.Combine(Directory.GetCurrentDirectory(), "tripPic2");
            var file = Directory.GetFiles(imagesPath, $"{tripid}.*").FirstOrDefault();

            if (file == null)
            {
                return NotFound();
            }

            var fileType = Path.GetExtension(file).ToLower();

            // Determine the content type based on the file extension.
            var contentType = fileType switch
            {
                ".jpg" => "image/jpeg",
                ".jpeg" => "image/jpeg",
                ".png" => "image/png",
                _ => "application/octet-stream",
            };

            var image = System.IO.File.OpenRead(file);
            return File(image, contentType);
        }
    }
}
