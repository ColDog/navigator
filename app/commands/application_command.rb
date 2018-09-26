class ApplicationCommand
  attr_accessor :params, :errors

  def initialize(params)
    @params = params
    @errors = nil
  end
end
