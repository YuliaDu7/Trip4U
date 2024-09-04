using ClassLibrary1.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using WebApplication1.DTO;

namespace WebApplication1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DataController : ControllerBase
    {

        Trip4UContext db = new Trip4UContext();



        //סתם בדיקה
        [HttpGet]
        public IEnumerable<string> Get()
        {
            return db.TblUsers.Select(x => x.UserName);
        }



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
            user.UserPic = obj.UserPic;
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


        //עדכון משתמש
        [HttpPost]
        [Route("updateUser")]
        public void UpdateUser(UserDTO obj)
        {

            TblUser update = db.TblUsers.FirstOrDefault(x => x.UserName == obj.UserName);
            update.UserName = obj.UserName;
            update.Password = obj.Password;
            update.FirstName = obj.FirstName;
            update.InstagramUrl = obj.InstagramUrl;
            update.BirthDate = obj.BirthDate;
            ////update.UserPic = obj.UserPic;
            update.Email = obj.Email;
            update.IsInfluencer = 0;
            db.SaveChanges();

            TblInterested interested = new TblInterested();
            interested.UserName = obj.UserName;
            foreach (var item in obj.propID)
            {
                if (db.TblInteresteds.Where(y => y.UserName == obj.UserName && y.PropertyId == item).FirstOrDefault() == null)
                {
                    //add the propertyID to TblInterested
                    interested.PropertyId = item;
                    db.TblInteresteds.Add(interested);
                    db.SaveChanges();
                }
            }
            var interestsToRemove = db.TblInteresteds.Where(x => x.UserName == obj.UserName && !obj.propID.Contains(x.PropertyId)).ToList();
            foreach (var item in interestsToRemove)
            {
                //if (!obj.propID.Contains(item.PropertyId))
                //    {
                // remove.....
                //    }
                //remove the propertyID to TblInterested
                db.TblInteresteds.Remove(item);
                db.SaveChanges();
            }


        }

        ////הוספת עוקב לרשימת עוקבים
        //[HttpPost]
        //[Route("follow")]
        //public void addFollow(FollowDTO obj)
        //{
        //    TblFollow follow = new TblFollow();
        //    follow.UserName = obj.UserName;
        //    follow.FollowingUserName = obj.FollowingUserName;

        //    db.TblFollows.Add(follow);

        //    db.SaveChanges();
        //}


        //// remove follow
        //[HttpDelete]
        //[Route("deleteFollow")]
        //public dynamic DeleteFollow(FollowDTO obj)
        //{
        //    TblFollow f = db.TblFollows.Where(x => x.FollowingUserName == obj.FollowingUserName && x.UserName == obj.UserName).FirstOrDefault();

        //    if (f != null)
        //    {
        //        db.TblFollows.Remove(f);
        //        db.SaveChanges();
        //        return Ok("");

        //    }
        //    else
        //    {
        //        //צריך?
        //        return NotFound("faild to delete");

        //    }
        //}



        //לבדוק כאן ולהחזיר תשובה אם קיים או לא


        [HttpPut]
        [Route("signIn")] //כניסה
        public dynamic signIn(SignInDTO u)
        {
            TblUser? user = db.TblUsers.Where(x => x.UserName == u.UserName && x.Password == u.Password).SingleOrDefault();
            var top3Trips = db.TblTrips.OrderByDescending(x => x.FavoriteSum).Select(y => y.TripId).Take(3).ToList();
            bool isExist = user != null; // אם לא נל יחזיר לי שזה טרו וזה אומר שקיים
            return new { isExist, top3Trips };
            // return user != null;
        }





        // להחזיר לצורך הרשמה סוגי העדפות   
        //[HttpGet]
        //[Route("GetTypeID")]
        //public dynamic GetTypeID()
        //{

        //    return db.TblTypes.Select(x =>new { x.TypeId, x.TypeName }).ToList();

        //}
        //// להחזיר לצורך הרשמה סוגי העדפות
        //// אפשר לוותר?
        //[HttpGet]
        //[Route("GetPropID")]
        //public dynamic GetPropID()
        //{

        //    return db.TblProperties.Select(x => new { x.PropertyId, x.PropDescription }).ToList();

        //}



        //בדיקת משפיען בעת כניסה למערכת? אפשר לעשות בסוף כל יום?
        [HttpPut]
        [Route("updateInfluencer")]
        public void UpdateInfluencer()
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
                    item.IsInfluencer = 1; // Update IsInfluencer to 1 = true 
                }
                if (totalFavoriteSum < 100)
                {
                    item.IsInfluencer = 0;

                }
            }
            db.SaveChanges();
        }
    }
}
