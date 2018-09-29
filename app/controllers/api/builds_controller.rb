module Api
  class BuildsController < ActionController::Base

    def create
      Builds::CreateCommand.create(build_params)
      head :no_content
    rescue ValidationError => e
      render json: { errors: e.errors }, status: 400
    end

    private

    def build_params
      params.permit!.to_h
    end

  end
end
