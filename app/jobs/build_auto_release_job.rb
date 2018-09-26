class BuildAutoReleaseJob < ApplicationJob
  queue_as :default

  subscribe(Builds::CreatedEvent) { |event| perform_later(event.id) }

  def perform(event_id)
    # params = { id, name, version, values, stage }
    params = Event.find(event_id).params

    app = App.find_by!(name: params[:name])
    stage = app.stages.find { |s| s[:name] = params[:stage] }

    if stage[:auto]
      # Run the release.
    end
  rescue ActiveRecord::RecordNotFound
    nil
  end
end
