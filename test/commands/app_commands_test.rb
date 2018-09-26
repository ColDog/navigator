require 'test_helper'

class AppCommandsTest < ActiveSupport::TestCase

  test "create an app" do
    cmd = Apps::CreateCommand.new(name: 'test')

    assert cmd.execute
  end

  test "update an app" do
    cmd = Apps::UpdateStagesCommand.new(id: apps(:one).id, stages: [{
      name: 'test',
      environment: 'test',
    }])
    assert cmd.execute
  end

  test "delete an app" do
    cmd = Apps::DeleteCommand.new(id: apps(:one).id)
    assert cmd.execute
  end

  test "delete a (non existent) app" do
    cmd = Apps::DeleteCommand.new(id: 'asdf')
    assert cmd.execute
  end

end
