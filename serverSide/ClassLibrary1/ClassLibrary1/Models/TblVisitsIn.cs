using System;
using System.Collections.Generic;

namespace ClassLibrary1.Models;

public partial class TblVisitsIn
{
    public int TripId { get; set; }

    public short PlaceId { get; set; }

    public byte? PlacePlaceInTrip { get; set; }

    public virtual TblPlace Place { get; set; } = null!;

    public virtual TblTrip Trip { get; set; } = null!;
}
