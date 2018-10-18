class Stage < ApplicationRecord
  belongs_to :app
  has_many   :clusters
  has_many   :builds
  has_many   :releases, through: :builds

  def current
    builds.last
  end

  def previous
    rel = released
    return nil unless rel
    builds.where('id < ?', rel.id).last
  end

  def released
    releases.last.try(:build)
  end

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
