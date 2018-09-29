class Stage < ApplicationRecord
  belongs_to :app
  has_many   :clusters

  subscribe(Apps::StageCreatedEvent) do |event|
    create!({
      uid:  event.stage_uid,
      app:  App.find_by_uid!(event.app_uid),
    }.merge(
      event.params.slice(:name, :review, :auto, :promotion)
    ))
  end

  subscribe(Apps::StageDeletedEvent) do |event|
    find_by_uid!(event.stage_uid).destroy!
  end

  subscribe(Apps::StageUpdatedEvent) do |event|
    find_by_uid!(event.stage_uid).update!(
      event.params.slice(:name, :review, :auto, :promotion)
    )
  end
end
