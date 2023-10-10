﻿using Umbraco.Cms.Core;

namespace Umbraco.Cms.Api.Management.ViewModels.Template;

public class TemplateScaffoldResponseModel : IResponseModel
{
    public string Content { get; set; } = string.Empty;
    public string Type => Constants.UdiEntityType.TemplateScaffold;
}
