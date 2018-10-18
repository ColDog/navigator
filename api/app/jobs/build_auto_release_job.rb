class BuildAutoReleaseJob < ApplicationJob
  queue_as :default

  # subscribe(Builds::CreatedEvent) { |event| perform_later(event.event_uid) }

  def perform(event_uid)
    event = Builds::CreatedEvent.find_by_uid!(event_uid)
    app = App.find_by_uid!(event.app_uid)
    stage = app.stages.find { |s| s[:name] = event.stage }

    if stage[:auto]
      Releases::CreateCommand.new(build_id: event.build_uid).execute
    end
  rescue ActiveRecord::RecordNotFound
    nil
  end
end
