module Api
  class BuildsController < ActionController::Base
    def create
      cmd = Builds::CreateCommand.new(build_params)
      if cmd.execute
        head 201
      else
        render json: { errors: cmd.errors }, status: 400
      end
    end

    private
    def build_params
      params.permit!.to_h
    end
  end
end
