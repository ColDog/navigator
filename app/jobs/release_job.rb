class ReleaseJob < ApplicationJob
  queue_as :default

  subscribe(Releases::CreatedEvent) { |event| perform_later(event.id) }

  def perform(event_id)
    # params = { id, build_id }
    params = Event.find(event_id).params
    @id = params[:id]
    build = Build.find(params[:build_id])

    set_status('PENDING')

    set_status('SUCCESS')
  rescue ActiveRecord::RecordNotFound
    set_status('ERRORED', 'Build does not exist')
  end

  def set_status(status, error=nil)
    Releases::StatusCommand.new({ id: @id, status: status, error: error })
  end
end
