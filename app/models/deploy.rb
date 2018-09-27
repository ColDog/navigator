class Deploy < ApplicationRecord
  belongs_to :release

  subscribe(Releases::DeployEvent) do |event|
    params = event.params

    Deploy.create!(
      uid: params[:id],
      release: Release.find_by!(uid: params[:release_id]),
      cluster: params[:cluster],
      status: 'INITIAL',
    )
  end

  subscribe(Releases::StatusEvent) do |event|
    params = event.params
    if params[:cluster]
      release = Release.find_by!(uid: params[:id])
      deploy = Deploy.find_by!(cluster: params[:cluster], release: release)
      deploy.update!(status: params[:status])
    end
  end

end
