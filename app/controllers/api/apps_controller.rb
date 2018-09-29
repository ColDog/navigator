module Api
  class AppsController < ActionController::Base
    include AppHelper

    def index
      render json: { data: App.all.map { |app| { id: app.uid, name: app.name } } }
    end

    def show
      render json: { data: get_app_manifest(params[:app_uid]) }
    rescue ActiveRecord::RecordNotFound => e
      render json: { errors: { app: 'DoesNotExist' } }, status: 400
    end

    def create
      create_app_from_manifest(app_params)
      head :no_content
    rescue ValidationError => e
      render json: { errors: e.errors }, status: 400
    end

    private
    def app_params
      params.permit!.to_h
    end

  end
end
