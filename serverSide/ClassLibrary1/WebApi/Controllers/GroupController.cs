using ClassLibrary1.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using WebApi.DTO;


namespace WebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class GroupController : ControllerBase
    {
        Trip4UContext db = new Trip4UContext();

        [HttpGet]
        [Route("GroupDetails")]

        public dynamic GroupDetails(int groupId)
        {

            return db.TblGroups.Where(x => x.GroupId == groupId).Select(x => new
            {
                x.Manager,
                x.GroupName,
                trips = db.TblTrips.Where(y => y.GroupId == groupId).Select(y => new
                {
                    y.TripDate,
                    y.TripId,
                    y.TripTitle

                }).ToList(),
                Users = db.TblPartOfGroups.Where(y => y.GroupId == groupId).Select(y => y.UserName).ToList()

            }).ToList();


        }






        [HttpPost]
        [Route("AddGroup")]
        public void AddGroup(NewGroupDTO obj)

        {
            TblGroup newGroup = new TblGroup();

            newGroup.GroupName = obj.GroupName;
            newGroup.Manager = obj.Manager;

            db.TblGroups.Add(newGroup);
            db.SaveChanges();

            TblPartOfGroup partOfGroup = new TblPartOfGroup();
            partOfGroup.GroupId = newGroup.GroupId;
            foreach (var item in obj.userNames)
            {
                partOfGroup.UserName = item;
                db.TblPartOfGroups.Add(partOfGroup);
                db.SaveChanges();

            }

        }


        [HttpGet]
        [Route("GetAllUserGroups")]
        public dynamic AddGroup(string userName)

        {

            return db.TblPartOfGroups.Where(x => x.UserName == userName).Select(x =>


            new
            {
                numOfUsers = db.TblPartOfGroups.Where(y => y.GroupId == x.GroupId).Count(),
                x.GroupId,
                GroupName = db.TblGroups.Where(y => y.GroupId == x.GroupId).Select(x => x.GroupName).FirstOrDefault(),
                isManger = db.TblGroups.Any(y => y.GroupId == x.GroupId && y.Manager == userName)
            }
                ).ToList();

        }


        [HttpPost]
        [Route("LeaveGroup")]
        public void LeaveGroup(LeaveGroupDTO obj)
        {
            TblGroup? group = db.TblGroups.Where(x => x.GroupId == obj.GroupId).FirstOrDefault();
            if (group.Manager == obj.UserName)
            {
                group.Manager = db.TblPartOfGroups.Where(x => x.GroupId == obj.GroupId && x.UserName != obj.UserName).Select(x => x.UserName).FirstOrDefault();
            }
            TblPartOfGroup delete = db.TblPartOfGroups.Where(x => x.GroupId == obj.GroupId && x.UserName == obj.UserName).FirstOrDefault();

            db.TblPartOfGroups.Remove(delete);

            db.SaveChanges();

        }



        [HttpDelete]
        [Route("DeleteGroup")]
        public void Delete(int groupId)
        {
            TblGroup? group = db.TblGroups.Where(x => x.GroupId == groupId).FirstOrDefault();

            db.TblGroups.Remove(group);

            db.SaveChanges();

        }

        [HttpDelete]
        [Route("DeleteTrip")]
        public void DeleteTrip(int tripId)
        {
            TblTrip? trip = db.TblTrips.Where(x => x.TripId == tripId).FirstOrDefault();

            db.TblTrips.Remove(trip);

            db.SaveChanges();

        }


        [HttpGet]
        [Route("GetAllUsersInGroup")]
        public dynamic GetAllUsersInGroup(int GroupId)

        {
            return db.TblPartOfGroups.Where(x => x.GroupId == GroupId).Select(x => x.UserName).ToList();
        }


        [HttpGet]
        [Route("GetFollowUserNames")]
        public dynamic getUserNames(string userName)
        {

            return db.TblFollows.Where(x => x.UserName == userName).Select(x => x.FollowingUserName).ToList();

        }

        [HttpGet]
        [Route("AddGroupTrip")]
        public dynamic AddTrip(int groupId)
        {

            TblTrip trip = new TblTrip();

            trip.IsTop3 = 0;
            trip.IsPublish = 0;
            trip.PublishDate = DateTime.Now;
            trip.GroupId = groupId;

            db.TblTrips.Add(trip);
            db.SaveChanges();

            return trip.TripId;
        }

        [HttpGet]
        [Route("GetGroupTrip")]
        public dynamic GetTrip(int tripId)
        {

            List<short> placeId = db.TblVisitsIns.Where(x => x.TripId == tripId).Select(x => x.PlaceId).ToList();
            List<short> restId = db.TblEatsIns.Where(x => x.TripId == tripId).Select(x => x.RestaurantId).ToList();

            return db.TblTrips.Where(x => x.TripId == tripId).Select(x =>
             new
             {
                 trip = new
                 {
                     x.TripId,
                     x.TripTitle,
                     x.Area,
                     x.TripDescription,
                     x.TripDate,
                     x.Season,
                     places = db.TblPlaces.Where(y => placeId.Contains(y.PlaceId)).Select(y =>
                         new
                         {
                             y.PlaceId,
                             y.PlaceName,
                             y.PlaceDescription,
                             y.PlaceMap,


                         }

                          ).ToList(),

                     rests = db.TblRestaurants.Where(y => restId.Contains(y.RestaurantId)).Select(y =>
                          new
                          {
                              y.RestaurantId,
                              y.RestName,
                              y.RestDescription,
                              y.RestMap,


                          }

                          ).ToList(),


                 },
                 AllPlaces = db.TblPlaces.Select(x => new { x.PlaceId, x.PlaceName }).ToList(),
                 AllRestuarnet = db.TblRestaurants.Select(x => new { x.RestaurantId, x.RestName }).ToList(),
                 Manger = db.TblGroups.Where(y => y.GroupId == x.GroupId).Select(y => y.Manager).FirstOrDefault()
             }

            ).First();



        }

        [HttpPost]
        [Route("updateGroupTrip")]
        public dynamic update(UpdateGroupTripDTO obj)
        {
            // עדכון פרטי הטיול
            TblTrip trip = db.TblTrips.Where(x => x.TripId == obj.TripId).FirstOrDefault();
            if (trip == null)
            {
                return NotFound("Trip not found");
            }
            trip.TripTitle = obj.TripTitle;
            trip.TripDate = obj.TripDate;
            trip.TripDescription = obj.TripDescription;
            trip.Area = obj.Area;

            db.SaveChanges();


            // עדכון ביקורים בטיול
            List<short> currentVisitsInTrip = db.TblVisitsIns.Where(y => y.TripId == obj.TripId).Select(x => x.PlaceId).ToList();
            foreach (var visit in obj.PlacesInTrip)
            {
                if (!currentVisitsInTrip.Contains(visit.PlaceId))
                {
                    TblVisitsIn newVisit = new TblVisitsIn
                    {
                        TripId = obj.TripId,
                        PlaceId = visit.PlaceId,
                    };
                    db.TblVisitsIns.Add(newVisit);
                    db.SaveChanges();
                }
            }

            var visitsToRemove = db.TblVisitsIns.Where(x => x.TripId == obj.TripId && !obj.PlacesInTrip.Select(p => p.PlaceId).Contains(x.PlaceId)).ToList();
            foreach (var visit in visitsToRemove)
            {
                db.TblVisitsIns.Remove(visit);
                db.SaveChanges();
            }

            // עדכון ארוחות בטיול
            List<short> currentEatsInTrip = db.TblEatsIns.Where(y => y.TripId == obj.TripId).Select(x => x.RestaurantId).ToList();
            foreach (var eat in obj.RestInTrip)
            {
                if (!currentEatsInTrip.Contains(eat.RestaurantId))
                {
                    TblEatsIn newEat = new TblEatsIn
                    {
                        TripId = obj.TripId,
                        RestaurantId = eat.RestaurantId,
                    };
                    db.TblEatsIns.Add(newEat);
                    db.SaveChanges();
                }
            }

            var eatsToRemove = db.TblEatsIns.Where(x => x.TripId == obj.TripId && !obj.RestInTrip.Select(p => p.RestaurantId).Contains(x.RestaurantId)).ToList();
            foreach (var eat in eatsToRemove)
            {
                db.TblEatsIns.Remove(eat);
                db.SaveChanges();
            }

            return Ok();
        }
    }
}
