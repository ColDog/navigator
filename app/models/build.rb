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

  subscribe(Builds::PromotedEvent) do |event|
    build = Build.find_by_uid!(event.source_build_uid)
    stage = Stage.find_by_uid!(event.target_stage_uid)

    Build.create!(
      uid:      event.build_uid,
      app:      build.app,
      stage:    stage,
      version:  build.version,
      values:   build.values,
    )
  end

end
