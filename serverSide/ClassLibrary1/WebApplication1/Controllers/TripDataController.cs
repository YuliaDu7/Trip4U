using ClassLibrary1.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using WebApplication1.DTO;
using WebApplication1.ShowTripDTO;

namespace WebApplication1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TripDataController : ControllerBase
    {
        Trip4UContext db = new Trip4UContext();


        [HttpGet]
        [Route("GetTop3")]
        public dynamic GetTop3()
        {
            List<Top3DTO> top3 = db.TblTrips.Where(x => x.IsTop3 == 1).Select(x => new Top3DTO()
            {
                TripId = x.TripId,
                UserName = x.UserName, //בשביל לגשת לתמונה
                Tags = db.TblTags.Where(z => db.TblTripTags.Where(y => y.TripId == x.TripId).
                                  Select(t => t.TagId).
                                  Contains(z.TagId)).Select(x => x.TagName).Take(2).ToList()
            }).ToList();

            List<String> influancer = db.TblUsers.Where(x => x.IsInfluencer == 1).OrderBy(x => Guid.NewGuid()).Select(x => x.UserName).Take(3).ToList();

            return new { top3 = top3, influancers = influancer };
            //    return Ok(new object[] { new { name = "roni", email = "r@r.com" }, new { name = "dani", email = "d@d.com" } });

        }


        //הוספת טיול
        [HttpPost]
        [Route("AddTrip")]
        public void AddTrip(TripDTO obj)
        {

            TblTrip trip = new TblTrip();

            trip.TripTitle = obj.TripTitle;
            trip.Area = obj.Area;
            trip.TripDescription = obj.TripDescription;
            trip.TripDate = obj.TripDate;
            trip.IsTop3 = obj.IsTop3;
            trip.TripMainPic = obj.TripMainPic;
            trip.IsPublish = obj.IsPublish;
            trip.Season = obj.Season;
            trip.Tips = obj.Tips;
            trip.Pic1 = obj.Pic1;
            trip.Pic2 = obj.Pic2;
            trip.PublishDate = obj.PublishDate;
            trip.GroupId = obj.GroupId;
            trip.UserName = obj.UserName;


            db.TblTrips.Add(trip);
            db.SaveChanges();

            //  return trip.TripId.ToString(); // מחזיר לי את האיי די של הטיול החדש שנוצר




            //להוסיף מקומות לטיול
            foreach (var place in obj.PlacesInTrip)
            {
                TblVisitsIn visitsIn = new TblVisitsIn();
                visitsIn.TripId = trip.TripId;
                visitsIn.PlaceId = place.PlaceId;
                visitsIn.PlacePlaceInTrip = place.PlacePlaceInTrip;
                db.TblVisitsIns.Add(visitsIn);
                db.SaveChanges();
            }

            //להוסיף מסעדות לטיול
            foreach (var rest in obj.RestInTrip)
            {
                TblEatsIn eatsIn = new TblEatsIn();
                eatsIn.TripId = trip.TripId;
                eatsIn.RestaurantId = rest.RestaurantId;
                eatsIn.RestPlaceInTrip = rest.RestPlaceInTrip;
                db.TblEatsIns.Add(eatsIn);
                db.SaveChanges();
            }
            // להוסיף סוג טיול
            TblTripType tripType = new TblTripType();
            tripType.TripId = trip.TripId;


            foreach (var item in obj.propID)
            {
                tripType.TypeId = item;
                db.TblTripTypes.Add(tripType);

                db.SaveChanges();

            }

            // להוסיף מאפייני טיול
            TblTripProperty tripProp = new TblTripProperty();
            tripProp.TripId = trip.TripId;


            foreach (var item in obj.TypeID)
            {
                tripProp.PropertyId = item;
                db.TblTripProperties.Add(tripProp);

                db.SaveChanges();
            }

            // להוסיף סוג טיול
            // ולהוסיף תגיות
        }


        [HttpGet]
        [Route("GetPandRid")]

        // קבלת אי דיי של מקומות ומסעדות 
        public dynamic GetPandRid()
        {
            return new
            {
                places = db.TblPlaces.Select(x => new PlaceIdDTO() { PlaceId = x.PlaceId, PlaceName = x.PlaceName }).ToList(),
                rest = db.TblRestaurants.Select(x => new RestaurantIdDTO() { RestaurantId = x.RestaurantId, RestName = x.RestName }).ToList()
            };
        }

        //הכנסת מסעדה חדשה   
        // לעשות כפתור שמירה בריאקט כדי להוסיף את זה לכאן ולקבל ID?

        [HttpPost]
        [Route("AddNewRest")]

        public dynamic AddNewRest(AddRestDTO obj)
        {
            TblRestaurant rest = new TblRestaurant();
            rest.RestName = obj.RestName;
            rest.AvgCost = obj.AvgCost;
            rest.RestUrl = obj.RestUrl;
            rest.RestMap = obj.RestMap;
            rest.IsKosher = obj.IsKosher;
            rest.RestPic = obj.RestPic;
            rest.RestRating = obj.RestRating;

            db.TblRestaurants.Add(rest);

            //מחזיר כדי לדעת מה האי די של המסעדה כדי לשלוח אחר כך לטיול
            return rest.RestaurantId;
        }

        //הכנסת מקום חדש
        [HttpPost]
        [Route("AddNewPlace")]

        public dynamic AddNewPlace(AddPlaceDTO obj)
        {
            TblPlace place = new TblPlace();
            place.PlaceName = obj.PlaceName;
            place.PlaceDescription = obj.PlaceDescription;
            place.PlacePic = obj.PlacePic;
            place.PlaceMap = obj.PlaceMap;
            place.PlaceCost = obj.PlaceCost;
            place.ChildCost = obj.ChildCost;
            place.RecommendedTime = obj.RecommendedTime;

            db.TblPlaces.Add(place);
            db.SaveChanges();

            TblContain contain = new TblContain();
            contain.PlaceId = place.PlaceId;
            contain.ReceiveDate = DateTime.Now;

            foreach (var warning in obj.WarningId)
            {
                contain.WarningId = warning;
                db.TblContains.Add(contain);
                db.SaveChanges();
            }

            return place.PlaceId;
        }


        ////קבלת אזהרות לצורך הוספת מקום חדש

        //[HttpGet]
        //[Route("GetWarningID")]

        //public dynamic GetWarningID()
        //{
        //   return db.TblWarnings.Select(x => new { x.WarningId , x.WarnDescription}).ToList();   
        //}



        //מחיקת טיול

        [HttpDelete]
        [Route("DeleteTrip")]
        public dynamic DeleteTrip(int tripId)
        {
            TblTrip? trip = db.TblTrips.Where(x => x.TripId == tripId).FirstOrDefault();


            if (trip != null)
            {

                db.TblTrips.Remove(trip);
                db.SaveChanges();
                return Ok("");

            }
            else
            {
                return NotFound("faild to delete");

            }
        }



        // עדכון טיול
        //להחליט האם מאפשרים לשנות מקומות?
        //הוספת טיול
        [HttpPost]
        [Route("EditTrip")]

        public void EditTrip(TblTrip obj)
        {

            TblTrip? trip = db.TblTrips.Where(x => x.TripId == obj.TripId).FirstOrDefault();

            trip.TripTitle = obj.TripTitle;
            trip.Area = obj.Area;
            trip.TripDescription = obj.TripDescription;
            trip.TripDate = obj.TripDate;
            trip.TripMainPic = obj.TripMainPic;
            trip.IsPublish = obj.IsPublish;
            trip.Season = obj.Season;
            trip.Tips = obj.Tips;
            trip.Pic1 = obj.Pic1;
            trip.Pic2 = obj.Pic2;
            trip.PublishDate = obj.PublishDate;
            trip.GroupId = obj.GroupId;
            trip.UserName = obj.UserName;

            db.SaveChanges();




        }


        // לפרופיל החזרת כל הטיולים של משתמש
        [HttpGet]
        [Route("GetUserTrips")]
        public dynamic GetUserTrips(string userName)
        {

            //אולי נחזיר רק חלק מהנתונים? בשביל מה את כל הטיול
            return db.TblTrips.Where(x => x.UserName == userName).ToList();
        }




        //מחזיר פרטי טיול לפי ID
        [HttpGet]
        [Route("GetTripDetails")]
        public FullTripDTO GetTripDetails(int tripID)
        {
            List<PlaceDTO> places = new List<PlaceDTO>();
            List<RestDTO> restaurants = new List<RestDTO>();

            //טבלת קשר
            List<VisitsInDTO> visitsIns = db.TblVisitsIns.Where(x => x.TripId == tripID).Select(x => new VisitsInDTO()
            {
                PlaceId = x.PlaceId,
                PlacePlaceInTrip = x.PlacePlaceInTrip
            }).ToList();

            //לכל שורה להוציא פרטי טיול
            foreach (var visitInfo in visitsIns)
            {
                PlaceDTO p = db.TblPlaces.Where(x => x.PlaceId == visitInfo.PlaceId).Select(obj => new PlaceDTO()
                {

                    PlaceName = obj.PlaceName,
                    PlaceDescription = obj.PlaceDescription,
                    PlaceMap = obj.PlaceMap,
                    PlaceCost = obj.PlaceCost,
                    ChildCost = obj.ChildCost,
                    RecommendedTime = obj.RecommendedTime,
                    WarnDescription = db.TblContains.Where(x => x.PlaceId == visitInfo.PlaceId).Select(x =>
                                      db.TblWarnings.Where(y => y.WarningId == x.WarningId).Select(y => y.WarnDescription).First()).ToList(),
                    PlacePlaceInTrip = visitInfo.PlacePlaceInTrip,
                    ReceiveDate = db.TblContains.Where(x => x.PlaceId == visitInfo.PlaceId).Select(x => x.ReceiveDate).First()

                }).First();
                places.Add(p);
            }


            List<EatsInDTO> eatsIn = db.TblEatsIns.Where(x => x.TripId == tripID).Select(x => new EatsInDTO()
            {
                RestaurantId = x.RestaurantId,
                RestPlaceInTrip = x.RestPlaceInTrip
            }).ToList();

            foreach (var eatsInfo in eatsIn)
            {

                //הוספת פרטי מסעדות למערך מסעדות
                RestDTO r = db.TblRestaurants.Where(x => x.RestaurantId == eatsInfo.RestaurantId).Select(obj => new RestDTO()
                {
                    RestName = obj.RestName,
                    AvgCost = obj.AvgCost,
                    RestUrl = obj.RestUrl,
                    RestMap = obj.RestMap,
                    IsKosher = obj.IsKosher,
                    RestRating = obj.RestRating,
                    RestPlaceInTrip = eatsInfo.RestPlaceInTrip,
                    RestDescription = obj.RestDescription

                }).First();

                restaurants.Add(r);
            }

            return db.TblTrips.Where(x => x.TripId == tripID).Select(obj => new FullTripDTO()
            {

                TripTitle = obj.TripTitle,
                Area = obj.Area,
                TripDescription = obj.TripDescription,
                FavoriteSum = obj.FavoriteSum,
                TripDate = obj.TripDate,
                Season = obj.Season,
                Tips = obj.Tips,
                PublishDate = obj.PublishDate,
                UserName = obj.UserName,
                PlacesInTrip = places,
                RestInTrip = restaurants,
                CommentsOnTrip = db.TblActions.Where(x => x.TripId == tripID).Select(x => new CommentDTO
                {
                    UserName = x.UserName,
                    Comment = x.Comment,
                    IsInfluencer = db.TblUsers.Where(y => y.UserName == x.UserName).Select(x => x.IsInfluencer).First(),

                }).ToList(),
                TripProperties = db.TblTripProperties.Where(x => x.TripId == tripID).Select(x =>
                                  db.TblProperties.Where(z => z.PropertyId == x.PropertyId).Select(z => z.PropDescription).FirstOrDefault()).ToList(),

                Tags = db.TblTripTags.Where(x => x.TripId == tripID).Select(x =>
                db.TblTags.Where(y => y.TagId == x.TagId).Select(x => x.TagName).FirstOrDefault()).ToList(),
                //AvgRating = totalRate,
                InstagramUrl = db.TblUsers.Where(x => x.UserName == obj.UserName).Select(x => x.InstagramUrl).First()

            }).First();

        }

    }
}
