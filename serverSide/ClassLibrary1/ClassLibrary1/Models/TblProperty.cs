using System;
using System.Collections.Generic;

namespace ClassLibrary1.Models;

public partial class TblProperty
{
    public short PropertyId { get; set; }

    public string? PropDescription { get; set; }

    public virtual ICollection<TblInterested> TblInteresteds { get; set; } = new List<TblInterested>();

    public virtual ICollection<TblPropsClick> TblPropsClicks { get; set; } = new List<TblPropsClick>();

    public virtual ICollection<TblTripProperty> TblTripProperties { get; set; } = new List<TblTripProperty>();
}
