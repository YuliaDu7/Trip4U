using ClassLibrary1.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Runtime.CompilerServices;
using WebApi.DTO;
using WebApi.ShowTripDTO;

namespace WebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TripDataController : ControllerBase
    {
        Trip4UContext db = new Trip4UContext();


        [HttpGet]
        [Route("GetHomePageData")]
        public dynamic GetHomePageData(string userName)
        {

            List<string> followUsers = db.TblFollows.Where(x => x.UserName == userName).Select(x => x.FollowingUserName).ToList();
            var followTrips = db.TblTrips.Where(x => followUsers.Contains(x.UserName)).Select(x => new {
                TripId = x.TripId,
                UserName = x.UserName, //בשביל לגשת לתמונה
                Tags = db.TblTags.Where(z => x.TblTripTags.Where(y => y.TripId == x.TripId).
                                  Select(t => t.TagId).
                                  Contains(z.TagId)).Select(x => x.TagName).Take(2).ToList(),
                TripDate = x.TripDate,
                TripTitle = x.TripTitle
            }).OrderByDescending(x => x.TripDate).ToList();

            List<Top3DTO> top3 = db.TblTrips.Where(x => x.IsTop3 == 1).Select(x => new Top3DTO()
            {
                TripId = x.TripId,
                UserName = x.UserName, //בשביל לגשת לתמונה
                Tags = db.TblTags.Where(z => x.TblTripTags.Where(y => y.TripId == x.TripId).
                                  Select(t => t.TagId).
                                  Contains(z.TagId)).Select(x => x.TagName).Take(2).ToList(),
                TripTitle = x.TripTitle
            }).ToList();

            List<string> influancer = db.TblUsers.Where(x => x.IsInfluencer == 1 && x.UserName != userName).OrderBy(x => Guid.NewGuid()).Select(x => x.UserName).Take(3).ToList();

            return new { top3 = top3, influancers = influancer, followTrips = followTrips };
            //    return Ok(new object[] { new { name = "roni", email = "r@r.com" }, new { name = "dani", email = "d@d.com" } });

        }


        [HttpPost]
        [Route("AddTrip")]
        public dynamic AddTrip(TripDTO obj)
        {

            TblTrip trip = new TblTrip();

            trip.TripTitle = obj.TripTitle;
            trip.Area = obj.Area;
            trip.TripDescription = obj.TripDescription;
            trip.TripDate = obj.TripDate;
            trip.IsTop3 = 0;
            trip.IsPublish = 1;
            trip.Season = obj.Season;
            trip.Tips = obj.Tips;
            trip.PublishDate = DateTime.Now;
            trip.GroupId = obj.GroupId;
            trip.UserName = obj.UserName;
            trip.FavoriteSum = 0;

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


            foreach (var item in obj.TypeID)
            {
                tripType.TypeId = item;
                db.TblTripTypes.Add(tripType);

                db.SaveChanges();

            }

            // להוסיף מאפייני טיול
            TblTripProperty tripProp = new TblTripProperty();
            tripProp.TripId = trip.TripId;


            foreach (var item in obj.PropID)
            {
                tripProp.PropertyId = item;
                db.TblTripProperties.Add(tripProp);

                db.SaveChanges();
            }

            //להוסיף תגיות 
            TblTripTag tripTag = new TblTripTag();
            tripTag.TripId = trip.TripId;

            foreach (var tag in obj.TagId)
            {

                tripTag.TagId = tag;
                db.TblTripTags.Add(tripTag);
                db.SaveChanges();
            }

            return trip.TripId;
        }


        //הכנסת תגיות
        [HttpPost]
        [Route("AddTags")]
        public dynamic AddTags(List<string> tags)
        {
            List<int> tagsId = new List<int>();

            foreach (var t in tags)
            {
                var tag = new TblTag()
                {
                    TagName = t
                };
                db.TblTags.Add(tag);
                db.SaveChanges();
                tagsId.Add(tag.TagId);
            }


            return tagsId;
        }

        [HttpGet]
        [Route("GetPandRid")]

        // קבלת אי דיי של מקומות ומסעדות ואזהרות ותגיות לצורף הוספת טיול  
        public dynamic GetPandRid()
        {
            return new
            {
                places = db.TblPlaces.Select(x => new PlaceIdDTO() { PlaceId = x.PlaceId, PlaceName = x.PlaceName }).ToList(),
                rest = db.TblRestaurants.Select(x => new RestaurantIdDTO() { RestaurantId = x.RestaurantId, RestName = x.RestName }).ToList(),
                warnings = db.TblWarnings.Select(x => new { x.WarningId, x.WarnDescription }).ToList(),
                tags = db.TblTags.Select(x => new { TagId = x.TagId, TagName = x.TagName }).ToList()
            };
        }

        //הכנסת מסעדה חדשה   

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
            rest.RestRating = obj.RestRating;
            rest.RestDescription = obj.RestDescription;


            db.TblRestaurants.Add(rest);
            db.SaveChanges();
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
        [HttpPut]
        [Route("EditTrip")]
        public void EditTrip(EditTripDTO obj)
        {

            TblTrip? trip = db.TblTrips.Where(x => x.TripId == obj.TripId).FirstOrDefault();

            trip.TripTitle = obj.TripTitle;
            trip.Area = obj.Area;
            trip.TripDescription = obj.TripDescription;
            trip.TripDate = obj.TripDate;
            trip.Season = obj.Season;
            trip.PublishDate = DateTime.Now;
            trip.Tips = obj.Tips;
            db.SaveChanges();



            //עדכון מאפיינים
            TblTripProperty tripProperty = new TblTripProperty();
            tripProperty.TripId = obj.TripId;
            List<short> tblTripProperties = db.TblTripProperties.Where(y => y.TripId == obj.TripId).Select(x => x.PropertyId).ToList();
            foreach (var item in obj.PropID)
            {
                if (!tblTripProperties.Contains(item))
                {

                    tripProperty.PropertyId = item;
                    db.TblTripProperties.Add(tripProperty);
                    db.SaveChanges();
                }
            }

            var interestsToRemove = db.TblTripProperties.Where(x => x.TripId == obj.TripId && !obj.PropID.Contains(x.PropertyId)).ToList();
            foreach (var item in interestsToRemove)
            {

                db.TblTripProperties.Remove(item);
                db.SaveChanges();
            }


            //עדכון סוגים 
            TblTripType tripType = new TblTripType();
            tripType.TripId = obj.TripId;
            List<short> tblTripType = db.TblTripTypes.Where(y => y.TripId == obj.TripId).Select(x => x.TypeId).ToList();
            foreach (var item in obj.TypeID)
            {
                if (!tblTripType.Contains(item))
                {
                    tripType.TypeId = item;
                    db.TblTripTypes.Add(tripType);
                    db.SaveChanges();
                }
            }
            var wantsToRemove = db.TblTripTypes.Where(x => x.TripId == obj.TripId && !obj.TypeID.Contains(x.TypeId)).ToList();
            foreach (var item in wantsToRemove)
            {

                db.TblTripTypes.Remove(item);
                db.SaveChanges();
            }


            //עדכון תגיות
            TblTripTag tripTag = new TblTripTag();
            tripTag.TripId = obj.TripId;
            List<short> tblTripTag = db.TblTripTags.Where(y => y.TripId == obj.TripId).Select(x => x.TagId).ToList();
            foreach (var item in obj.TagId)
            {
                if (!tblTripTag.Contains(item))
                {
                    tripTag.TagId = item;
                    db.TblTripTags.Add(tripTag);
                    db.SaveChanges();
                }
            }
            var tagToRemove = db.TblTripTags.Where(x => x.TripId == obj.TripId && !obj.TagId.Contains(x.TagId)).ToList();
            foreach (var item in tagToRemove)
            {

                db.TblTripTags.Remove(item);
                db.SaveChanges();
            }


        }


        // לפרופיל החזרת כל הטיולים של משתמש
        //צפייה בטיולים שלי
        [HttpGet]
        [Route("GetUserTrips")]
        public dynamic GetUserTrips(string userName)
        {
            return db.TblTrips.Where(x => x.UserName == userName).Select(x => new {
                TripID = x.TripId,
                UserName = x.UserName,
                TripTitle = x.TripTitle,
                FavoriteSum = x.FavoriteSum
            }).ToList();
        }

        [HttpGet]
        [Route("GetTags")]
        //קבלת תגיות לעריכת טיול
        public dynamic GetTags()
        {
            return db.TblTags.Select(x => new { TagId = x.TagId, TagName = x.TagName }).ToList();
        }

        //בשביל עריכת טיול - מחזיר פרטים על הטיול
        [HttpGet]
        [Route("GetTripforEdit")]
        public dynamic GetTripforEdit(int tripID)
        {
            return db.TblTrips.Where(x => x.TripId == tripID).Select(obj => new
            {
                TripId = tripID,
                TripTitle = obj.TripTitle,
                Area = obj.Area,
                TripDescription = obj.TripDescription,
                TripDate = obj.TripDate,
                Season = obj.Season,
                Tips = obj.Tips,
                Tags = obj.TblTripTags.Where(x => x.TripId == tripID).Select(x => db.TblTags.Where(z => z.TagId == x.TagId).Select(z => new { z.TagId, z.TagName }).FirstOrDefault()).ToArray(),
                PropID = obj.TblTripProperties.Where(x => x.TripId == tripID).Select(x =>
                                  db.TblProperties.Where(z => z.PropertyId == x.PropertyId).Select(z => z.PropertyId).FirstOrDefault()).ToArray(),
                TypeID = obj.TblTripTypes.Where(x => x.TripId == tripID).Select(x => db.TblTypes.Where(z => z.TypeId == x.TypeId).Select(z => z.TypeId).FirstOrDefault()).ToArray()

            }).First();
        }

        //מחזיר פרטי טיול לפי ID ושם משתמש שצופה בטיול
        [HttpGet]
        [Route("GetTripDetails")]
        public FullTripDTO GetTripDetails(int tripID, string user)
        {
            //החזרת מקומות בטיול 
            //כל המקומות בטיול 
            List<VisitsInDTO> visitsIns = db.TblVisitsIns.Where(x => x.TripId == tripID).Select(x => new VisitsInDTO()
            {
                PlaceId = x.PlaceId,
                PlacePlaceInTrip = x.PlacePlaceInTrip
            }).ToList();

            List<PlaceDTO> places = new List<PlaceDTO>();

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

            //הצגת מסעדות 
            List<RestDTO> restaurants = new List<RestDTO>();
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

            //מחזירות את הטיול 
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
                //החזרת תגובות
                CommentsOnTrip = obj.TblActions.Where(x => x.TripId == tripID && x.Comment != null).Select(x => new CommentDTO
                {
                    UserName = x.UserName,
                    Comment = x.Comment,
                    IsInfluencer = db.TblUsers.Where(y => y.UserName == x.UserName).Select(x => x.IsInfluencer).First(),

                }).ToList(),
                //החזרת מאפייני טיול  
                TripProperties = obj.TblTripProperties.Where(x => x.TripId == tripID).Select(x =>
                                  db.TblProperties.Where(z => z.PropertyId == x.PropertyId).Select(z => z.PropDescription).FirstOrDefault()).ToList(),
                Tags = obj.TblTripTags.Where(x => x.TripId == tripID).Select(x =>
                db.TblTags.Where(y => y.TagId == x.TagId).Select(x => x.TagName).FirstOrDefault()).ToList(),

                //AvgRating = totalRate,
                InstagramUrl = db.TblUsers.Where(x => x.UserName == obj.UserName).Select(x => x.InstagramUrl).FirstOrDefault(),
                isInfluencer = db.TblUsers.Where(x => x.UserName == obj.UserName).Select(x => x.IsInfluencer.HasValue ? (bool?)(x.IsInfluencer == 1) : null).First(),
                IsFavorite = db.TblSavedBies.Where(x => x.UserName == user && x.TripId == tripID).FirstOrDefault() != null
            }).First();

        }


    }
}
