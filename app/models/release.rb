class Release < ApplicationRecord
  belongs_to :build
  has_many :deploys

  subscribe(Releases::CreatedEvent) do |event|
    params = event.params

    Release.create!(
      uid: params[:id],
      build_id: Build.find_by!(uid: params[:build_id]).id,
      status: 'INITIAL',
    )
  end

  subscribe(Releases::StatusEvent) do |event|
    params = event.params

    unless params[:cluster]
      release = Release.find_by!(uid: params[:id])
      release.update!(status: params[:status])
    end
  end

end
