class Release < ApplicationRecord
  ERRORED = 'ERRORED'
  PENDING = 'PENDING'
  SUCCESS = 'SUCCESS'
  INITIAL = 'INITIAL'

  belongs_to :build
  has_many :deploys

  subscribe(Releases::CreatedEvent) do |event|
    Release.create!(
      uid:     event.release_uid,
      build:   Build.find_by_uid!(event.build_uid),
      removal: false,
      status:  INITIAL,
    )
  end

  subscribe(Releases::DeletedEvent) do |event|
    Release.create!(
      uid:     event.release_uid,
      build:   Release.find_by_uid!(event.target_release_uid).build,
      removal: true,
      status:  INITIAL,
    )
  end

  subscribe(Releases::ReleaseStatusEvent) do |event|
    Release.find_by_uid!(event.release_uid).update!(status: event.status)
  end

end
