class ApplicationEvent
  attr_reader :params, :errors, :event_uid

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
    raise ValidationError.new(errors) unless validate
    Event.play(name, params)
  end

  def name
    self.class.name
  end

  def validate
    @errors = self.class.schema.call(params).messages
    return valid?
  end

  def valid?
    @errors && @errors.length == 0
  end

end
