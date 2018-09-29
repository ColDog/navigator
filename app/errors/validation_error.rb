class ValidationError < StandardError
  attr_reader :errors

  def initialize(errors)
    @errors = errors
  end

  def message
    @errors.map { |key, msg| "#{key}: #{msg.join(', ')}" }.join(',')
  end
end
