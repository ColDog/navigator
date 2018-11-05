class ApplicationController < ActionController::API

  rescue_from ValidationError do |error|
    render json: {
      errors: error.errors,
      code: 'ValidationError',
    }, status: 400
  end

  rescue_from ActiveRecord::RecordInvalid do |error|
    render json: {
      errors: error.model.errors,
      code: 'ValidationError',
    }, status: 400
  end

  rescue_from ActiveRecord::RecordNotFound do |error|
    render json: {
      resource: error.model.underscore,
      code: 'NotFound',
    }, status: 400
  end

end
