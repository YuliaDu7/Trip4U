using ClassLibrary1.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using WebApi.DTO;

namespace WebApi.Controllers
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


        [HttpPut]
        [Route("changeFollow")]
        public void ChangeFollow(FollowDTO obj)
        {

            TblFollow checkFollow = db.TblFollows.Where(x => x.FollowingUserName == obj.FollowingUserName && x.UserName == obj.UserName).FirstOrDefault();

            if (checkFollow != null)
            {
                db.TblFollows.Remove(checkFollow);
            }
            else
            {
                TblFollow newFollow = new TblFollow();
                newFollow.UserName = obj.UserName;
                newFollow.FollowingUserName = obj.FollowingUserName;

                db.TblFollows.Add(newFollow);


            }
            db.SaveChanges();


        }


        //לחיצה על שמירה במועדפים ועדכון כמות השמירות בדאטה
        [HttpPut]
        [Route("saveSum")]
        public void SumSaveTrip(SavedByDTO obj)
        {
            TblSavedBy save = new TblSavedBy();
            save.UserName = obj.UserName;
            save.TripId = obj.TripId;
            db.TblSavedBies.Add(save);

            TblTrip? trip = db.TblTrips.Where(x => x.TripId == obj.TripId).FirstOrDefault();
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

            if (save != null)
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

        //מחזיר משתמשים שהמשתמש לא עוקב אחריהם
        [HttpGet]
        [Route("Getclick")]
        public dynamic Getclick(string loggedUser)
        {
            List<string> userNames = db.TblUsers
                .Where(x => !db.TblFollows.Where(f => f.UserName == loggedUser).Select(f => f.FollowingUserName).Contains(x.UserName))
                .Select(x => x.UserName).ToList();
            userNames.Add(loggedUser);

            var result = new
            {
                typesClicks = db.TblTypeClicks
                    .Where(x => userNames.Contains(x.UserName))
                    .Select(x => new { userName = x.UserName, typeId = x.TypeId, click = x.Click })
                    .ToList(),

                propsClicks = db.TblPropsClicks
                    .Where(x => userNames.Contains(x.UserName))
                    .Select(x => new { userName = x.UserName, propId = x.PropertyId, click = x.Click })
                    .ToList()

            };
            return result;
        }

        [HttpPut]
        [Route("GetInfluancer")]
        public dynamic IsInfluencer(List<string> users)
        {
            List<IsInfluencerDTO> final = db.TblUsers.Where(x => users.Contains(x.UserName))
                  .Select(u => new IsInfluencerDTO
                  {
                      IsInfluencer = u.IsInfluencer,
                      UserName = u.UserName
                  }).ToList();
            return final;
        }

        [HttpGet]
        [Route("GetTripClick")]
        public dynamic GetTripClick(string loggedUser)
        {
            return new
            {
                UserClicks = new
                {
                    userTypeClicks = db.TblTypeClicks.Where(x => x.UserName == loggedUser)
                                 .Select(x => new { typeId = x.TypeId, clicks = x.Click })
                                 .ToList(),

                    userPropClicks = db.TblPropsClicks.Where(x => x.UserName == loggedUser)
                                  .Select(x => new { propId = x.PropertyId, clicks = x.Click })
                                  .ToList(),

                    userTagsClicks = db.TblTagClicks.Where(x => x.UserName == loggedUser)
                                     .Select(x => new { TagName = db.TblTags.Where(tag => tag.TagId == x.TagId).Select(tag => tag.TagName).FirstOrDefault(), clicks = x.Click })

                                    .ToList(),
                },
                UserPreferences = new
                {
                    types = db.TblLikes.Where(x => x.UserName == loggedUser).Select(x => x.TypeId).ToList(),
                    props = db.TblInteresteds.Where(x => x.UserName == loggedUser).Select(x => x.PropertyId).ToList()
                },
                trips = db.TblTrips.Where(x => x.IsPublish==1 && x.UserName != loggedUser && !db.TblSavedBies.Where(f => f.UserName == loggedUser)
                          .Select(x => x.TripId).Contains(x.TripId))
                          .Select(x =>
                          new
                          {
                              x.TripId,
                              x.TripTitle,
                              types = db.TblTripTypes.Where(y => y.TripId == x.TripId).Select(y => y.TypeId).ToList(),
                              prop = db.TblTripProperties.Where(y => y.TripId == x.TripId).Select(y => y.PropertyId).ToList(),
                              tags = db.TblTripTags.Where(y => y.TripId == x.TripId)
                             .Select(y => db.TblTags.Where(tag => tag.TagId == y.TagId)
                                                    .Select(tag => tag.TagName)
                                                    .FirstOrDefault())
                             .ToList(),

                              userName = x.UserName

                          }

                          ).ToList()
            };
        }

        //מעדכן את הקליקים
        [HttpPut]
        [Route("SetClick")]
        public void SetClick(SavedByDTO obj)
        {
            short[] props = db.TblTripProperties.Where(x => obj.TripId == x.TripId).Select(x => x.PropertyId).ToArray();
            TblPropsClick? click;
            foreach (var prop in props)
            {
                click = db.TblPropsClicks.Where(x => x.UserName == obj.UserName && x.PropertyId == prop).FirstOrDefault();
                if (click != null)
                {
                    click.Click++;
                    db.SaveChanges();
                }
                else
                {
                    click = new TblPropsClick();
                    click.UserName = obj.UserName;
                    click.PropertyId = prop;
                    click.Click = 1;
                    db.TblPropsClicks.Add(click);
                    db.SaveChanges();
                }
            }
            short[] types = db.TblTripTypes.Where(x => obj.TripId == x.TripId).Select(x => x.TypeId).ToArray();
            TblTypeClick? clicks;
            foreach (var type in types)
            {
                clicks = db.TblTypeClicks.Where(x => x.UserName == obj.UserName && x.TypeId == type).FirstOrDefault();

                if (clicks != null)
                {
                    clicks.Click++;
                    db.SaveChanges();
                }
                else
                {
                    clicks = new TblTypeClick();
                    clicks.UserName = obj.UserName;
                    clicks.TypeId = type;
                    clicks.Click = 1;
                    db.TblTypeClicks.Add(clicks);
                    db.SaveChanges();
                }
            }
        }

        //הוספת/עדכון קליקים
        [HttpPost]
        [Route("UpdateClicks")]
        public void UpdateClicks(SavedByDTO obj)
        {
            List<short> types = db.TblTripTypes.Where(x => x.TripId == obj.TripId).Select(x => x.TypeId).ToList();
            foreach (short type in types)
            {
                if (db.TblTypeClicks.Where(x => x.UserName == obj.UserName && x.TypeId == type).Any())
                {
                    TblTypeClick update = db.TblTypeClicks.Where(x => x.UserName == obj.UserName && x.TypeId == type).FirstOrDefault();
                    update.Click++;
                    db.SaveChanges();
                }
                else
                {
                    TblTypeClick newClick = new TblTypeClick();
                    newClick.UserName = obj.UserName;
                    newClick.TypeId = type;
                    newClick.Click = 1;
                    db.TblTypeClicks.Add(newClick);
                    db.SaveChanges();
                }
            }
            List<short> props = db.TblTripProperties.Where(x => x.TripId == obj.TripId).Select(x => x.PropertyId).ToList();
            foreach (short prop in props)
            {
                if (db.TblPropsClicks.Where(x => x.UserName == obj.UserName && x.PropertyId == prop).Any())
                {
                    TblPropsClick update = db.TblPropsClicks.Where(x => x.UserName == obj.UserName && x.PropertyId == prop).FirstOrDefault();
                    update.Click++;
                    db.SaveChanges();
                }
                else
                {
                    TblPropsClick newClick = new TblPropsClick();
                    newClick.UserName = obj.UserName;
                    newClick.PropertyId = prop;
                    newClick.Click = 1;
                    db.TblPropsClicks.Add(newClick);
                    db.SaveChanges();
                }
            }
            List<short> tags = db.TblTripTags.Where(x => x.TripId == obj.TripId).Select(x => x.TagId).ToList();
            foreach (short tag in tags)
            {
                if (db.TblTagClicks.Where(x => x.UserName == obj.UserName && x.TagId == tag).Any())
                {
                    TblTagClick update = db.TblTagClicks.Where(x => x.UserName == obj.UserName && x.TagId == tag).FirstOrDefault();
                    update.Click++;
                    db.SaveChanges();
                }
                else
                {
                    TblTagClick newClick = new TblTagClick();
                    newClick.UserName = obj.UserName;
                    newClick.TagId = tag;
                    newClick.Click = 1;
                    db.TblTagClicks.Add(newClick);
                    db.SaveChanges();

                }
            }
        }
    }
}
