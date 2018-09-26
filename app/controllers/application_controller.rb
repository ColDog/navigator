class ApplicationController < ActionController::Base
  protect_from_forgery with: :exception

  def execute_command(command, param)
    cmd = command.new(params.require(param).permit!.to_h)
    cmd.execute if cmd.validate
    cmd
  end

end
