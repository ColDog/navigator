class ApplicationEvent
  attr_reader :params, :errors, :event_uid

  class BaseSchema < Dry::Validation::Schema
    configure do |config|
      config.input_processor = :sanitizer
    end
  end

  def self.schema(&block)
    if block_given?
      @schema = Dry::Validation.Schema(BaseSchema, &block)
    end
    @schema
  end

  def self.fields(*names)
    names.each { |name| define_method(name) { self.params[name] } }
  end

  def self.find_by_uid!(uid)
    Event.find_by_uid!(uid)
  end

  def self.play(params)
    self.new(params).play
  end

  def initialize(params, event_uid=nil)
    @params = params
    @errors = nil
    @event_uid = event_uid
  end

  def play
    validate
    raise ValidationError.new(errors) unless valid?
    Event.play(self.class.name, params)
  end

  def validate
    # puts "in #{self.class.name}: #{params}"
    result = self.class.schema.(params.to_h.symbolize_keys)
    @errors = result.messages
    # puts "out: #{result.output}"
    @params = HashWithIndifferentAccess.new(result.output)
    @errors = @errors.merge(event: self.class.name) unless valid?
    return valid?
  end

  def valid?
    @errors && @errors.length == 0
  end

end
