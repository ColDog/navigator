class ReleaseJob < ApplicationJob
  queue_as :default

  subscribe(Releases::CreatedEvent) { |event| perform_later(event.event_uid) }

  def perform(event_uid)
    event = Releases::CreatedEvent.find_by_uid!(event_uid).event
    @release_uid = event.release_uid
    @build = Build.find_by_uid!(event.build_uid)
    @stage = @build.stage
    @clusters = @stage.clusters

    run
  rescue ActiveRecord::RecordNotFound => e
    set_status(Release::ERRORED, nil, e)
  end

  def run
    log("release id #{@release_uid}")
    log("starting release stage=#{@stage.name} clusters=#{@clusters.map(&:name)}")
    set_status(Release::PENDING)

    @clusters.each do |cluster|
      log("deploying to cluster #{cluster.name}")
      create_deploy(cluster)
      set_status(Release::PENDING, cluster)
      sleep 5
      set_status(Release::SUCCESS, cluster)
      log("deploying to cluster #{cluster.name} finished")
    end

    set_status(Release::SUCCESS)
    log("release complete")
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

  def log(line)
    ReleaseLog.log(@release_uid, line)
  end

end
