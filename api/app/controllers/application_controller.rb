class ApplicationController < ActionController::API
  rescue_from ValidationError,              with: :render_validation_error
  rescue_from ActiveRecord::RecordNotFound, with: :render_notfound_error

  def render_validation_error(error)
    render json: {
      errors: error.errors,
      code: 'ValidationError',
    }, status: 400
  end

  def render_notfound_error(error)
    render json: {
      resource: error.model.underscore,
      code: 'NotFound',
    }, status: 400
  end
end
