using System;
using System.Collections.Generic;

namespace ClassLibrary1.Models;

public partial class TblGroup
{
    public int GroupId { get; set; }

    public DateTime? GroupDate { get; set; }

    public string? GroupName { get; set; }

    public DateTime? ChangeDate { get; set; }

    public string? LastUserChange { get; set; }

    public string Manager { get; set; } = null!;

    public virtual TblUser ManagerNavigation { get; set; } = null!;

    public virtual ICollection<TblPartOfGroup> TblPartOfGroups { get; set; } = new List<TblPartOfGroup>();
}
