using System;
using System.Collections.Generic;

namespace ClassLibrary1.Models;

public partial class TblFollow
{
    public string UserName { get; set; } = null!;

    public string FollowingUserName { get; set; } = null!;

    public bool? Dummy { get; set; }

    public virtual TblUser FollowingUserNameNavigation { get; set; } = null!;
}
