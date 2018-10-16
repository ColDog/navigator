module Api
  class BuildsController < ActionController::Base

    def create
      Builds::CreateCommand.execute(build_params)
      render json: { request_id: request.request_id }
    rescue ValidationError => e
      render json: { errors: e.errors }, status: 400
    end

    private

    def build_params
      params.permit!.to_h.slice(:version, :values).merge(
        app_uid:   App.find_by_name!(params[:app]).uid,
        stage_uid: Stage.find_by_name!(params[:stage]).uid,
      )
    end

  end
end
