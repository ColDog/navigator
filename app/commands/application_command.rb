class ApplicationCommand
  attr_reader :params, :errors

  class ValidationError < Exception
    def initialize(errors)
      @errors = errors
    end

    def message
      @errors.map { |key, msg| "#{key}: #{msg.join(', ')}" }.join(',')
    end
  end

  def self.schema(&block)
    @schema = Dry::Validation.Schema &block if block_given?
    @schema
  end

  def self.fields(*names)
    names.each { |name| define_method(name) { self.params[name] } }
  end

  def initialize(params)
    @params = params
    @errors = nil
  end

  def self.execute(params)
    self.new(params).execute
  end

  def execute
    raise ValidationError.new(errors) unless validate
    command
    nil
  end

  def name
    self.class.name
  end

  def validate
    return true unless self.class.schema
    @errors = self.class.schema.call(params).messages
    return valid?
  end

  def valid?
    @errors && @errors.length == 0
  end

end
