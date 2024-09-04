using System;
using System.Collections.Generic;

namespace ClassLibrary1.Models;

public partial class TblSavedBy
{
    public int TripId { get; set; }

    public string UserName { get; set; } = null!;

    public bool? Dummy { get; set; }

    public virtual TblTrip Trip { get; set; } = null!;

    public virtual TblUser UserNameNavigation { get; set; } = null!;
}
