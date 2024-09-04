using System;
using System.Collections.Generic;

namespace ClassLibrary1.Models;

public partial class TblEatsIn
{
    public int TripId { get; set; }

    public short RestaurantId { get; set; }

    public byte? RestPlaceInTrip { get; set; }

    public virtual TblRestaurant Restaurant { get; set; } = null!;

    public virtual TblTrip Trip { get; set; } = null!;
}
