using System;
using System.Collections.Generic;

namespace ClassLibrary1.Models;

public partial class TblPlace
{
    public short PlaceId { get; set; }

    public string? PlaceName { get; set; }

    public string? PlaceDescription { get; set; }

    public string? PlacePic { get; set; }

    public string? PlaceMap { get; set; }

    public short? PlaceCost { get; set; }

    public short? ChildCost { get; set; }

    public string? RecommendedTime { get; set; }

    public virtual ICollection<TblContain> TblContains { get; set; } = new List<TblContain>();

    public virtual ICollection<TblVisitsIn> TblVisitsIns { get; set; } = new List<TblVisitsIn>();
}
