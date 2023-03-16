using Microsoft.Extensions.DependencyInjection;
using Umbraco.Cms.Core.DependencyInjection;
using Umbraco.Cms.Core.Events;
using Umbraco.Cms.Core.Models.Membership;
using Umbraco.Cms.Core.Notifications;
using Umbraco.Cms.Core.Persistence.Repositories;
using Umbraco.Cms.Core.Serialization;
using Umbraco.Extensions;

namespace Umbraco.Cms.Core.Cache;

/// <summary>
/// Handles user group cache invalidation/refreshing.
/// </summary>
/// <remarks>
/// This also needs to clear the user cache since IReadOnlyUserGroup's are attached to IUser objects.
/// </remarks>
public sealed class UserGroupCacheRefresher : PayloadCacheRefresherBase<UserGroupCacheRefresherNotification, UserGroupCacheRefresher.JsonPayload>
{
    public static readonly Guid UniqueId = Guid.Parse("45178038-B232-4FE8-AA1A-F2B949C44762");

    [Obsolete("Use the constructor that takes all parameters instead.")]
    public UserGroupCacheRefresher(AppCaches appCaches, IEventAggregator eventAggregator, ICacheRefresherNotificationFactory factory)
        : this(appCaches, StaticServiceProvider.Instance.GetRequiredService<IJsonSerializer>(), eventAggregator, factory)
    {
    }

    public UserGroupCacheRefresher(AppCaches appCaches, IJsonSerializer serializer, IEventAggregator eventAggregator, ICacheRefresherNotificationFactory factory)
        : base(appCaches, serializer, eventAggregator, factory)
    {
    }

    public override Guid RefresherUniqueId => UniqueId;

    public override string Name => "User Group Cache Refresher";

    public override void RefreshAll()
    {
        ClearAllIsolatedCacheByEntityType<IUserGroup>();
        ClearCache(Enumerable.Empty<int>());

        base.RefreshAll();
    }

    public override void Refresh(int id)
    {
        ClearCache(id.Yield());

        base.Refresh(id);
    }

    public override void Refresh(Guid id) => throw new NotSupportedException();

    public override void Refresh(JsonPayload[] payloads)
    {
        ClearCache(payloads.Select(x => x.Id));

        base.Refresh(payloads);
    }

    public override void Remove(int id)
    {
        ClearCache(id.Yield());

        base.Remove(id);
    }

    private void ClearCache(IEnumerable<int> ids)
    {
        Attempt<IAppPolicyCache?> userGroupCache = AppCaches.IsolatedCaches.Get<IUserGroup>();
        if (userGroupCache.Success && userGroupCache.Result is not null)
        {
            foreach (int id in ids)
            {
                userGroupCache.Result.Clear(RepositoryCacheKeys.GetKey<IUserGroup, int>(id));
            }

            userGroupCache.Result.ClearByKey(CacheKeys.UserGroupGetByAliasCacheKeyPrefix);
        }

        // We don't know what users belong to this group without doing a look up, so we'll need to just clear them all
        ClearAllIsolatedCacheByEntityType<IUser>();
    }

    public class JsonPayload
    {
        public JsonPayload(int id)
            => Id = id;

        public int Id { get; }
    }
}
