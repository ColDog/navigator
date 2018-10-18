class Deploy < ApplicationRecord
  belongs_to :release
  belongs_to :cluster

  subscribe(Releases::DeployEvent) do |event|
    Deploy.create!(
      uid:     event.deploy_uid,
      release: Release.find_by_uid!(event.release_uid),
      cluster: Cluster.find_by_uid!(event.cluster_uid),
      status: 'PENDING',
    )
  end

  subscribe(Releases::DeployStatusEvent) do |event|
    Deploy.find_by_uid!(event.deploy_uid).update!(status: event.status)
  end

end
