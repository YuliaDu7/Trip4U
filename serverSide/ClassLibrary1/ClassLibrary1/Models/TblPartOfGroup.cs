using System;
using System.Collections.Generic;

namespace ClassLibrary1.Models;

public partial class TblPartOfGroup
{
    public int GroupId { get; set; }

    public string UserName { get; set; } = null!;

    public bool? Dummy { get; set; }

    public virtual TblGroup Group { get; set; } = null!;
}
