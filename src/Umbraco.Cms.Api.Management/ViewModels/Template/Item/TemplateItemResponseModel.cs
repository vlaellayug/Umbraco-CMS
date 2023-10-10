﻿using Umbraco.Cms.Api.Management.ViewModels.Item;
using Umbraco.Cms.Core;

namespace Umbraco.Cms.Api.Management.ViewModels.Template.Item;

public class TemplateItemResponseModel : ItemResponseModelBase
{
    public required string Alias { get; set; }
    public override string Type => Constants.UdiEntityType.Template;
}
