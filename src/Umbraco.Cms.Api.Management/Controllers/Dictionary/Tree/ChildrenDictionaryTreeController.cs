﻿using Asp.Versioning;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Umbraco.Cms.Core.Models;
using Umbraco.Cms.Core.Services;
using Umbraco.Cms.Api.Management.Services.Paging;
using Umbraco.Cms.Api.Common.ViewModels.Pagination;
using Umbraco.Cms.Api.Management.ViewModels.Tree;

namespace Umbraco.Cms.Api.Management.Controllers.Dictionary.Tree;

[ApiVersion("1.0")]
public class ChildrenDictionaryTreeController : DictionaryTreeControllerBase
{
    public ChildrenDictionaryTreeController(IEntityService entityService, IDictionaryItemService dictionaryItemService)
        : base(entityService, dictionaryItemService)
    {
    }

    [HttpGet("children")]
    [MapToApiVersion("1.0")]
    [ProducesResponseType(typeof(PagedViewModel<NamedEntityTreeItemResponseModel>), StatusCodes.Status200OK)]
    public async Task<ActionResult<PagedViewModel<NamedEntityTreeItemResponseModel>>> Children(Guid parentId, int skip = 0, int take = 100)
    {
        if (PaginationConverter.ConvertSkipTakeToPaging(skip, take, out var pageNumber, out var pageSize) == false)
        {
            return SkipTakeToPagingProblem();
        }

        PagedModel<IDictionaryItem> paginatedItems = await DictionaryItemService.GetPagedAsync(parentId, skip, take);

        return Ok(PagedViewModel(await MapTreeItemViewModels(parentId, paginatedItems.Items), paginatedItems.Total));
    }
}
