using System;
using System.Collections.Generic;

namespace ClassLibrary1.Models;

public partial class TblTripProperty
{
    public int TripId { get; set; }

    public short PropertyId { get; set; }

    public bool? Dummy { get; set; }

    public virtual TblProperty Property { get; set; } = null!;

    public virtual TblTrip Trip { get; set; } = null!;
}
