using System;
using System.Collections.Generic;

namespace ClassLibrary1.Models;

public partial class TblTripTag
{
    public int TripId { get; set; }

    public short TagId { get; set; }

    public bool? Dummy { get; set; }

    public virtual TblTag Tag { get; set; } = null!;

    public virtual TblTrip Trip { get; set; } = null!;
}
