class LogsController < ApplicationController
  def logs
    render json: {
      logs: ReleaseLog.where(release_uid: params[:id])
        .order(id: :asc)
        .map { |log| "[#{log.created_at}] #{log.line}" }
    }
  end
end
