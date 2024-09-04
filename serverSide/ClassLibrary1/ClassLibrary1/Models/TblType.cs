using System;
using System.Collections.Generic;

namespace ClassLibrary1.Models;

public partial class TblType
{
    public short TypeId { get; set; }

    public string? TypeName { get; set; }

    public virtual ICollection<TblLike> TblLikes { get; set; } = new List<TblLike>();

    public virtual ICollection<TblTripType> TblTripTypes { get; set; } = new List<TblTripType>();

    public virtual ICollection<TblTypeClick> TblTypeClicks { get; set; } = new List<TblTypeClick>();
}
