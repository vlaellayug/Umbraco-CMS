using Umbraco.Cms.Core;

namespace Umbraco.Cms.Api.Management.ViewModels.TemporaryFile;

public class TemporaryFileResponseModel: IResponseModel
{
    public Guid Id { get; set; }

    public DateTime? AvailableUntil { get; set; }

    public string FileName { get; set; } = string.Empty;
    public string Type => Constants.UdiEntityType.Temporaryfile;
}
