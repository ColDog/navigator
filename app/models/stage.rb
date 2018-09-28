class Stage < ApplicationRecord
  belongs_to :app
  has_many   :clusters

  subscribe(Apps::StageCreatedEvent) do |event|
    create!(name: event.name, uid: event.stage_uid)
  end

  subscribe(Apps::StageDeletedEvent) do |event|
    find_by_uid!(event.stage_uid).destroy!
  end

  subscribe(Apps::StageUpdatedEvent) do |event|
    find_by_uid!(event.stage_uid).update!(event.params)
  end
end
