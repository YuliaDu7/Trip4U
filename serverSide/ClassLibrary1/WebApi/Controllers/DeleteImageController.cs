using ClassLibrary1.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace WebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DeleteImageController : ControllerBase
    {
       
            Trip4UContext db = new Trip4UContext();

            [HttpDelete]
            [Route("DeleteMainPic")]
            public dynamic DeleteMainPic(int tripId)
            {
                if (tripId <= 0)
                    return BadRequest("Invalid trip ID");

                var mainPicPath = Path.Combine(Directory.GetCurrentDirectory(), "tripMainPic");

                if (!Directory.Exists(mainPicPath))
                {
                    return NotFound("Directory does not exist");
                }

                var validExtensions = new[] { ".jpg", ".jpeg" };
                var filePath = validExtensions
                    .Select(ext => Path.Combine(mainPicPath, $"{tripId}{ext}"))
                    .FirstOrDefault(path => System.IO.File.Exists(path));

                if (filePath == null)
                {
                    return NotFound("File with .jpg or .jpeg extension does not exist");
                }

                try
                {
                    System.IO.File.Delete(filePath);
                }
                catch (Exception ex)
                {
                    return StatusCode(500, $"Internal server error: {ex.Message}");
                }

                return Ok(new { message = "File deleted successfully", fileName = Path.GetFileName(filePath) });
            }


            [HttpDelete]
            [Route("DeleteTripPic1")]
            public dynamic DeleteTripPic1(int tripId)
            {
                if (tripId <= 0)
                    return BadRequest("Invalid trip ID");

                var tripPic1Path = Path.Combine(Directory.GetCurrentDirectory(), "TripPic1");

                if (!Directory.Exists(tripPic1Path))
                {
                    return NotFound("Directory does not exist");
                }

                var validExtensions = new[] { ".jpg", ".jpeg" };
                var filePath = validExtensions
                    .Select(ext => Path.Combine(tripPic1Path, $"{tripId}{ext}"))
                    .FirstOrDefault(path => System.IO.File.Exists(path));

                if (filePath == null)
                {
                    return NotFound("File with .jpg or .jpeg extension does not exist");
                }

                try
                {
                    System.IO.File.Delete(filePath);
                }
                catch (Exception ex)
                {
                    return StatusCode(500, $"Internal server error: {ex.Message}");
                }

                return Ok(new { message = "File deleted successfully", fileName = Path.GetFileName(filePath) });
            }

            [HttpDelete]
            [Route("DeleteTripPic2")]
            public dynamic DeleteTripPic2(int tripId)
            {
                if (tripId <= 0)
                    return BadRequest("Invalid trip ID");

                var tripPic2Path = Path.Combine(Directory.GetCurrentDirectory(), "TripPic2");

                if (!Directory.Exists(tripPic2Path))
                {
                    return NotFound("Directory does not exist");
                }

                var validExtensions = new[] { ".jpg", ".jpeg" };
                var filePath = validExtensions
                    .Select(ext => Path.Combine(tripPic2Path, $"{tripId}{ext}"))
                    .FirstOrDefault(path => System.IO.File.Exists(path));

                if (filePath == null)
                {
                    return NotFound("File with .jpg or .jpeg extension does not exist");
                }

                try
                {
                    System.IO.File.Delete(filePath);
                }
                catch (Exception ex)
                {
                    return StatusCode(500, $"Internal server error: {ex.Message}");
                }

                return Ok(new { message = "File deleted successfully", fileName = Path.GetFileName(filePath) });
            }

            [HttpDelete]
            [Route("DeleteUserImage")]
            public dynamic DeleteUserImage(string userName)
            {
                if (string.IsNullOrEmpty(userName))
                    return BadRequest("Invalid user name");

                var userPicPath = Path.Combine(Directory.GetCurrentDirectory(), "userPic");

                if (!Directory.Exists(userPicPath))
                {
                    return NotFound("Directory does not exist");
                }

                var validExtensions = new[] { ".jpg", ".jpeg" };
                var filePath = validExtensions
                    .Select(ext => Path.Combine(userPicPath, $"{userName}{ext}"))
                    .FirstOrDefault(path => System.IO.File.Exists(path));

                if (filePath == null)
                {
                    return NotFound("File with .jpg or .jpeg extension does not exist");
                }

                try
                {
                    System.IO.File.Delete(filePath);
                }
                catch (Exception ex)
                {
                    return StatusCode(500, $"Internal server error: {ex.Message}");
                }

                return Ok(new { message = "File deleted successfully", fileName = Path.GetFileName(filePath) });
            }

        }
    }
