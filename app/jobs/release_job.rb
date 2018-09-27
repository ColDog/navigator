class ReleaseJob < ApplicationJob
  queue_as :default

  subscribe(Releases::CreatedEvent) { |event| perform_later(event.id) }

  def perform(event_id)
    # params = { id, build_id }
    params = Event.find(event_id).params
    @id = params[:id]

    set_status('PENDING')

    begin
      build = Build.find(params[:build_id])
    rescue ActiveRecord::RecordNotFound => e
      set_status('ERRORED', nil, e)
      return
    end

    stage = build.app.stages.find { |s| s[:name] == build.stage }
    if stage.nil?
      set_status('ERRORED', nil, "Stage not found #{build.stage}")
      return
    end

    # Set all stages to PENDING.
    stage[:clusters].each do |cluster|
      set_status('PENDING', stage[:name])
      create_deploy(cluster[:name])
    end

    stage[:clusters].each do |cluster|
      # TODO: Run the deploy.
      set_status('SUCCESS', cluster[:name])
    end

    set_status('SUCCESS')
  end

  def set_status(status, cluster=nil, error=nil)
    Releases::StatusCommand.new({
      id: @id,
      status: status,
      cluster: cluster,
      error: error,
    }).execute
  end

  def create_deploy(cluster)
    Releases::DeployCommand.new({
      release_id: @id,
      cluster: cluster,
    }).execute
  end

end
