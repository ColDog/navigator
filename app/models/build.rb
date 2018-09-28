class Build < ApplicationRecord
  belongs_to :app
  belongs_to :stage
  has_many   :releases
  serialize  :values

  validates_presence_of :version

  subscribe(Builds::CreatedEvent) do |event|
    Build.create!(
      uid:      event.build_uid,
      app:      App.find_by_uid!(event.app_uid),
      stage:    Stage.find_by_uid!(event.stage_uid),
      version:  event.version,
      values:   event.values,
    )
  end
end
