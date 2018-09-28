class Release < ApplicationRecord
  belongs_to :build
  has_many :deploys

  subscribe(Releases::CreatedEvent) do |event|
    Release.create!(
      uid:    event.release_uid,
      build:  Build.find_by_uid!(event.build_uid),
      status: 'INITIAL',
    )
  end

  subscribe(Releases::ReleaseStatusEvent) do |event|
    release = Deploy.find_by_uid!(event.release_uid)
    release.update!(status: event.status)
  end

end
