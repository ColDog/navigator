class ReleaseRemoveJob < ApplicationJob
  queue_as :default

  subscribe(Releases::DeletedEvent) { |event| perform_later(event.event_uid) }

  def perform(event_uid)
    event = Releases::DeletedEvent.find_by_uid!(event_uid).event

    @target_release = Release.find_by_uid!(event.target_release_uid)
    @release_uid = event.release_uid
    @build = @target_release.build
    @stage = @build.stage
    @clusters = @stage.clusters

    run
  rescue ActiveRecord::RecordNotFound => e
    set_status(Release::ERRORED, nil, e)
  end

  def run
    set_status(Release::PENDING)

    @clusters.each do |cluster|
      create_deploy(cluster)
      set_status(Release::SUCCESS, cluster)
    end

    set_status(Release::SUCCESS)
  end

  def set_status(status, cluster=nil, error=nil)
    Releases::StatusCommand.execute(
      release_uid: @release_uid,
      cluster_uid: cluster.try(:uid),
      status: status,
      error: error,
    )
  end

  def create_deploy(cluster)
    Releases::DeployCommand.execute(
      release_uid: @release_uid,
      cluster_uid: cluster.uid,
    )
  end

end
