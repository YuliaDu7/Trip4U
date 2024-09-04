using ClassLibrary1.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using WebApplication1.DTO;

namespace WebApplication1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ActionsController : ControllerBase
    {

        Trip4UContext db = new Trip4UContext();


        //הוספת/עדכון תגובה
        [HttpPost]
        [Route("AddComment")]
        public void AddComment(AddCommentDTO obj)
        {

            TblAction? action = db.TblActions.Where(x => x.TripId == obj.TripId && x.UserName == obj.UserName).FirstOrDefault();

            if (action != null)
            {
                if (obj.Comment == "")
                    action.Comment = null;
                else
                    action.Comment = obj.Comment;

            }
            else
            {
                action = new TblAction();
                action.TripId = obj.TripId;
                action.Comment = obj.Comment;
                action.UserName = obj.UserName;
                db.TblActions.Add(action);
            }


            db.SaveChanges();
        }



        //הוספת עוקב לרשימת עוקבים
        [HttpPost]
        [Route("follow")]
        public void AddFollow(FollowDTO obj)
        {
            TblFollow follow = new TblFollow();
            follow.UserName = obj.UserName;
            follow.FollowingUserName = obj.FollowingUserName;

            db.TblFollows.Add(follow);

            db.SaveChanges();
        }


        // הסרת עוקב
        [HttpDelete]
        [Route("deleteFollow")]
        public dynamic DeleteFollow(FollowDTO obj)
        {
            TblFollow f = db.TblFollows.Where(x => x.FollowingUserName == obj.FollowingUserName && x.UserName == obj.UserName).FirstOrDefault();

            if (f != null)
            {
                db.TblFollows.Remove(f);
                db.SaveChanges();
                return Ok("");

            }
            else
                //צריך?
                return NotFound("faild to delete");


        }

        //לחיצה על שמירה במועדפים ועדכון כמות השמירות בדאטה
        [HttpPost]
        [Route("saveSum")]
        public void SumSaveTrip(SavedByDTO obj)
        {
            TblSavedBy save = new TblSavedBy();
            save.UserName = obj.UserName;
            save.TripId = obj.TripId;
            db.TblSavedBies.Add(save);

            TblTrip trip = db.TblTrips.Where(x => x.TripId == obj.TripId).FirstOrDefault();
            trip.FavoriteSum++;

            db.SaveChanges();
        }

        //הסרת מועדפים
        [HttpDelete]
        [Route("deleteFavorite")]
        public dynamic DeleteFavorite(SavedByDTO obj)
        {
            TblTrip? trip = db.TblTrips.Where(x => x.TripId == obj.TripId).FirstOrDefault();
            TblSavedBy? save = db.TblSavedBies.Where(x => x.TripId == obj.TripId && x.UserName == obj.UserName).FirstOrDefault();

            if (trip != null)
            {
                trip.FavoriteSum--; ;
                db.TblSavedBies.Remove(save);
                db.SaveChanges();
                return Ok("");

            }
            else
            {
                return NotFound("faild to delete");

            }
        }
    }
}
