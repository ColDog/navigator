class Cluster < ApplicationRecord
  belongs_to :app
  belongs_to :stage

  subscribe(Apps::ClusterCreatedEvent) do |event|
    create!(name: event.name, uid: event.cluster_uid)
  end

  subscribe(Apps::ClusterDeletedEvent) do |event|
    find_by_uid!(event.cluster_uid).destroy!
  end

  subscribe(Apps::ClusterUpdatedEvent) do |event|
    find_by_uid!(event.cluster_uid).update!(event.params)
  end
end
