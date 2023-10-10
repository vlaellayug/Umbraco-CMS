﻿using System.Text.Json.Serialization;
using Umbraco.Cms.Core;
using Umbraco.Cms.Core.Models;

namespace Umbraco.Cms.Api.Management.ViewModels.Telemetry;

public class TelemetryResponseModel : TelemetryRepresentationBase, IResponseModel
{
    public string Type => Constants.UdiEntityType.Telemetry;
}
