using System;
using System.Collections.Generic;

namespace ClassLibrary1.Models;

public partial class TblTag
{
    public short TagId { get; set; }

    public string? TagName { get; set; }

    public virtual ICollection<TblTagClick> TblTagClicks { get; set; } = new List<TblTagClick>();

    public virtual ICollection<TblTripTag> TblTripTags { get; set; } = new List<TblTripTag>();
}
