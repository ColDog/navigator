class ReleaseJob < ApplicationJob
  ERRORED = 'ERRORED'
  PENDING = 'PENDING'
  SUCCESS = 'SUCCESS'
  INITIAL = 'INITIAL'

  queue_as :default

  subscribe(Releases::CreatedEvent) { |event| perform_later(event.event_uid) }

  def perform(event_uid)
    event = Releases::CreatedEvent.find_by_uid!(event_uid)
    @release_uid = event.release_uid

    @build = Build.find_by_uid!(event.build_uid)
    @stage = @build.stage
    @clusters = @stage.clusters

    run
  rescue ActiveRecord::RecordNotFound => e
    set_status(ERRORED, nil, e)
  end

  def run
    set_status(PENDING)

    @clusters.each do |cluster|
      create_deploy(cluster)
    end

    @clusters.each do |cluster|
      set_status(SUCCESS, cluster)
    end

    set_status(SUCCESS)
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
