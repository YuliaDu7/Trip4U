using ClassLibrary1.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using WebApi.DTO;

namespace WebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DataController : ControllerBase
    {
        Trip4UContext db = new Trip4UContext();

        //הוספת משתמש
        [HttpPost]
        [Route("signUp")]
        public void AddUser(UserDTO obj)
        {
            TblUser user = new TblUser();
            user.UserName = obj.UserName;
            user.Password = obj.Password;
            user.FirstName = obj.FirstName;
            user.InstagramUrl = obj.InstagramUrl;
            user.BirthDate = obj.BirthDate;
            user.Email = obj.Email;
            user.IsInfluencer = 0;

            db.TblUsers.Add(user);

            TblInterested interested = new TblInterested();
            interested.UserName = obj.UserName;

            //הוספת סוגי טיול ליוזר 

            foreach (var item in obj.propID)
            {
                interested.PropertyId = item;
                db.TblInteresteds.Add(interested);

                db.SaveChanges();
            }


            TblLike like = new TblLike();
            like.UserName = obj.UserName;
            foreach (var item in obj.TypeID)
            {
                like.TypeId = item;
                db.TblLikes.Add(like);

                db.SaveChanges();
            }

            db.SaveChanges();
        }
        
        //מחזיר פרטי משתמש
        [HttpGet]
        [Route("getUserDetails")]
        public dynamic GetUserDetails(string UserName)
        {
            return db.TblUsers.Where(x => x.UserName == UserName).Select(obj => new
            {
                UserName = obj.UserName,
                Password = obj.Password,
                FirstName = obj.FirstName,
                BirthDate = obj.BirthDate,
                Email = obj.Email,
                InstagramUrl = obj.InstagramUrl,
                propID = obj.TblInteresteds.Where(x => x.UserName == UserName).Select(x => x.PropertyId).ToList(),
                TypeID = obj.TblLikes.Where(x=> x.UserName == UserName).Select(x=>x.TypeId).ToList(),
                bio = obj.Bio,
                
            }).First();
        }


        //עדכון משתמש
        [HttpPost]
        [Route("updateUser")]
        public void UpdateUser(UserDTO obj)
        {

            TblUser update = db.TblUsers.FirstOrDefault(x => x.UserName == obj.UserName);
            update.Password = obj.Password;
            update.FirstName = obj.FirstName;
            update.InstagramUrl = obj.InstagramUrl;
            update.BirthDate = obj.BirthDate;
            update.Email = obj.Email;
            update.Bio = obj.Bio;

            db.SaveChanges();

            TblInterested interested = new TblInterested();
            List<short> tblInteresteds = db.TblInteresteds.Where(y => y.UserName == obj.UserName).Select(x => x.PropertyId).ToList();
            interested.UserName = obj.UserName;
            foreach (var item in obj.propID)
            {
                if (!tblInteresteds.Contains(item))
                {

                    interested.PropertyId = item;
                    db.TblInteresteds.Add(interested);
                    db.SaveChanges();
                }
            }
            var interestsToRemove = db.TblInteresteds.Where(x => x.UserName == obj.UserName && !obj.propID.Contains(x.PropertyId)).ToList();
            foreach (var item in interestsToRemove)
            {

                db.TblInteresteds.Remove(item);
                db.SaveChanges();
            }


            TblLike likes = new TblLike();
            List<short> tbllikes = db.TblLikes.Where(y => y.UserName == obj.UserName).Select(x => x.TypeId).ToList();
            likes.UserName = obj.UserName;
            foreach (var item in obj.TypeID)
            {
                if (!tbllikes.Contains(item))
                {
                    likes.TypeId = item;
                    db.TblLikes.Add(likes);
                    db.SaveChanges();
                }
            }
            var wantsToRemove = db.TblLikes.Where(x => x.UserName == obj.UserName && !obj.TypeID.Contains(x.TypeId)).ToList();
            foreach (var item in wantsToRemove)
            {

                db.TblLikes.Remove(item);
                db.SaveChanges();
            }

        }


        [HttpPut]
        [Route("signIn")] //כניסה
        public dynamic signIn(SignInDTO u)
        {
            List<TblUser> users = db.TblUsers.ToList();
            TblUser? user = users.Where(x => x.UserName == u.UserName && x.Password == u.Password).SingleOrDefault();
            //   var top3Trips = db.TblTrips.OrderByDescending(x => x.FavoriteSum).Select(y => y.TripId).Take(3).ToList();
            bool isExist = user != null;
            if (isExist)
            {
                UpdateTop3();
                UpdateInfluencer();

                return new
                {
                    isExist,
                    list = users.Where(x => x.UserName == u.UserName).Select(x => new
                    {
                        userName = x.UserName,
                        firstName = x.FirstName,
                        birthDate = x.BirthDate,
                        isInflunce = db.TblUsers.Where(x => x.UserName == u.UserName).Select(x => x.IsInfluencer.HasValue ? (bool?)(x.IsInfluencer == 1) : null).First(),
                    }).First(),
                };

            }
            else
                return isExist;
        }
        private void UpdateTop3()
        {
            List<TblTrip> top3 = db.TblTrips.Where(x => x.IsTop3 == 1).ToList();
            foreach (TblTrip trip in top3)
            {
                trip.IsTop3 = 0;
                db.SaveChanges();
            }
            var top3Trips = db.TblTrips.OrderByDescending(x => x.FavoriteSum).Take(3).ToList();

            foreach (TblTrip trip in top3Trips)
            {
                trip.IsTop3 = 1;
                db.SaveChanges();
            }
        }
        private void UpdateInfluencer()
        {
            //  foreach (var item in db.TblUsers.Where(x => x.IsInfluencer == 0).ToList())
            foreach (var item in db.TblUsers.ToList())
            {
                int? totalFavoriteSum = 0;
                foreach (var trip in db.TblTrips.Where(x => x.UserName == item.UserName).ToList())
                {
                    totalFavoriteSum += trip.FavoriteSum;
                }
                if (totalFavoriteSum >= 100)
                {
                    item.IsInfluencer = 1;
                }
                if (totalFavoriteSum < 100)
                {
                    item.IsInfluencer = 0;

                }
            }
            db.SaveChanges();
        }

        [HttpPut]
        [Route("CheckIfExist")]
        public dynamic CheckIfExist(CheckDTO obj)
        {
            return new
            {
                userName = db.TblUsers.Where(x => x.UserName == obj.UserName).Any(),
                email = db.TblUsers.Where(x => x.Email == obj.Email).Any(),
            };

        }

        [HttpGet]
        [Route("Profile")]
        public dynamic Profile(string userName)
        {
            return new
            {
                trips = db.TblTrips.Where(x => x.UserName == userName).Select(x => new
                {
                    tripTitle = x.TripTitle,
                    favoriteSum = x.FavoriteSum,
                    tripId = x.TripId,
                }).ToList(),

                following = db.TblFollows.Where(x => x.UserName == userName).Select(x => x.FollowingUserName),
                bio = db.TblUsers.Where(x=> x.UserName == userName).Select(x => x.Bio).FirstOrDefault(),
            };
        }

        [HttpGet]
        [Route("GetFavorits")]
        public dynamic GetFavorits(string userName)
        {
            List<int> ids = db.TblSavedBies.Where(x => x.UserName == userName).Select(x => x.TripId).ToList();

            List<dynamic> titlesAndIds = new List<dynamic>();
            foreach (var item in ids)
            {
                titlesAndIds.Add(db.TblTrips.Where(x => x.TripId == item).Select(x => new {
                    TripId = x.TripId,
                    TripTitle = x.TripTitle
                }).ToList());
            }

            return titlesAndIds;
        }

        [HttpPut]
        [Route("OtherUserProfile")]
        public dynamic OtherUserProfile(FollowDTO obj)
        {
            return new
            {
                trips = db.TblTrips.Where(x => x.UserName == obj.FollowingUserName).Select(x => new
                {
                    tripTitle = x.TripTitle,
                    favoriteSum = x.FavoriteSum,
                    tripId = x.TripId,
                }).ToList(),

                isFollowing = db.TblFollows.Where(x => x.UserName == obj.UserName && x.FollowingUserName == obj.FollowingUserName).Any(),
                isInflunce = db.TblUsers.Where(x => x.UserName == obj.FollowingUserName).Select(x => (bool?)(x.IsInfluencer.HasValue && x.IsInfluencer == 1)).First(),
                Bio = db.TblUsers.Where(x => x.UserName == obj.FollowingUserName).Select(x => x.Bio).FirstOrDefault()
            };
        }
    }
}



