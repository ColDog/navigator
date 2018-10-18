class Cluster < ApplicationRecord
  belongs_to :app
  belongs_to :stage

  serialize :values

  subscribe(Apps::ClusterCreatedEvent) do |event|
    create!(
      name:   event.name,
      uid:    event.cluster_uid,
      app:    App.find_by_uid!(event.app_uid),
      stage:  Stage.find_by_uid!(event.stage_uid),
      values: event.values,
    )
  end

  subscribe(Apps::ClusterDeletedEvent) do |event|
    find_by_uid!(event.cluster_uid).destroy!
  end

  subscribe(Apps::ClusterUpdatedEvent) do |event|
    find_by_uid!(event.cluster_uid).update!(event.params.slice(:name, :values))
  end
end
