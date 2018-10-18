class ApplicationCommand
  attr_reader :params, :errors

  def initialize(params)
    @params = params
    @errors = nil
  end

  def self.execute(params)
    self.new(params).execute
  end

  def execute
    Rails.logger.info("Executing command #{self.class.name}: #{params}")

    command
    nil
  end

end
