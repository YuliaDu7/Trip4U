using ClassLibrary1.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using WebApplication1.DTO;

namespace WebApplication1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SearchController : ControllerBase
    {

        //חיפוש טיול
        Trip4UContext db = new Trip4UContext();
        [HttpPost]
        [Route("Search")]

        public dynamic SearchTrip([FromBody] SearchDTO search)
        {

            List<int> tripIds = db.TblTrips.Where(x => x.IsPublish == 1
                                                       && (x.Area == search.Area || search.Area == null)
                                                       && (x.Season == search.Season || search.Season == null)).Select(x => x.TripId).ToList();

            /* List<int> tripIds = db.TblTrips.Where(x => x.IsPublish == 1 && (x.Area == search.Area || search.Area == null)
                                             && (x.Season == search.Season || search.Season == null)
                                             && (search.PropertyId.Length == 0 || db.TblTripProperties.Where(x => x.PropertyId == search.PropertyId[0]).Select(x => x.TripId).Contains(x.TripId))
                                             && (search.TypeId.Length == 0 || db.TblTripTypes.Where(x => x.TypeId == search.TypeId[0]).Select(x => x.TripId).Contains(x.TripId))).Select(x => x.TripId).ToList();
*/


            List<int> newIdProp = new List<int>();


            foreach (int trip in tripIds)
            {
                bool good = true;

                foreach (var propertyId in search.PropertyId)
                {

                    if (!db.TblTripProperties.Where(x => x.PropertyId == propertyId && x.TripId == trip).Select(x => x.TripId).Contains(trip))
                    {
                        good = false;
                        break;
                    }
                }
                if (good)
                    newIdProp.Add(trip);

            }


            List<int> final = new List<int>();

            foreach (var trip in search.PropertyId.Length == 0 ? tripIds : newIdProp)
            {
                bool good = true;
                foreach (var typeId in search.TypeId)
                {
                    if (!db.TblTripTypes.Where(x => x.TypeId == typeId && x.TripId == trip).Select(x => x.TripId).Contains(trip))
                    {
                        good = false;
                        break;
                    }

                }
                if (good)
                    final.Add(trip);
            }

            return final;
        }

    }
}
