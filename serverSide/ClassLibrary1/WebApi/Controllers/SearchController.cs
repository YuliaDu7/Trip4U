using ClassLibrary1.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using WebApi.DTO;

namespace WebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SearchController : ControllerBase
    {
        //חיפוש משתמש
        [HttpGet]
        [Route("SearchUserName")]
        public dynamic SearchUserName(string obj)
        {
            return db.TblUsers.Where(x => x.UserName.ToLower().Contains(obj.ToLower())).OrderByDescending(x => x.UserName).Select(x => x.UserName).Take(4).ToList();
        }

        //חיפוש טיול
        Trip4UContext db = new Trip4UContext();
        [HttpPost]
        [Route("Search")]

        public dynamic SearchTrip([FromBody] SearchDTO search)
        {

            List<int> tripIds = db.TblTrips.Where(x => x.IsPublish == 1
                                                       && (x.Area == search.Area || search.Area == null)
                                                       && (x.Season == search.Season || search.Season == null)).Select(x => x.TripId).ToList();

            List<TblTripProperty> props = db.TblTripProperties.ToList();

            List<int> newIdProp = new List<int>();


            if (search.PropertyId.Length != 0)
            {
                foreach (var trip in tripIds)
                {
                    bool good = true;

                    foreach (var propertyId in search.PropertyId)
                    {

                        if (props.Where(x => x.TripId == trip && x.PropertyId == propertyId).FirstOrDefault() == null)
                        {
                            good = false;
                            break;
                        }
                    }
                    if (good)
                        newIdProp.Add(trip);

                }
            }

            List<TblTripType> types = db.TblTripTypes.ToList();

            List<int> final = new List<int>();

            if (search.TypeId.Length != 0)
            {
                //אם הוא לא בחר מאפיינים הוא עובר על תוצאות של הטיול שיצא בהתחלה
                foreach (var trip in search.PropertyId.Length == 0 ? tripIds : newIdProp)
                {
                    bool good = true;
                    foreach (var typeId in search.TypeId)
                    {
                        if (types.Where(x => x.TypeId == typeId && x.TripId == trip).FirstOrDefault() == null)
                        {
                            good = false;
                            break;
                        }

                    }
                    if (good)
                        final.Add(trip);
                }
            }
            else if (search.PropertyId.Length == 0)
                final = tripIds;
            else
                final = newIdProp;

            var results = db.TblTrips.Where(x => final.Contains(x.TripId)).Select(x => new ResultsDTO
            {
                TripId = x.TripId,
                UserName = x.UserName,
                TripTitle = x.TripTitle,
                Tags = db.TblTags.Where(z => x.TblTripTags.Where(y => y.TripId == x.TripId).
                                  Select(t => t.TagId).Contains(z.TagId)).Select(x => x.TagName).ToList(),
                FavoriteSum = x.FavoriteSum
            }).ToList();

            return results;
        }
    }
}
