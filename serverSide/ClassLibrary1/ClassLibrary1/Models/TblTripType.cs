using System;
using System.Collections.Generic;

namespace ClassLibrary1.Models;

public partial class TblTripType
{
    public int TripId { get; set; }

    public short TypeId { get; set; }

    public bool? Dummy { get; set; }

    public virtual TblTrip Trip { get; set; } = null!;

    public virtual TblType Type { get; set; } = null!;
}
