using System;
using System.Collections.Generic;

namespace ClassLibrary1.Models;

public partial class TblLike
{
    public string UserName { get; set; } = null!;

    public short TypeId { get; set; }

    public bool? Dummy { get; set; }

    public virtual TblType Type { get; set; } = null!;

    public virtual TblUser UserNameNavigation { get; set; } = null!;
}
