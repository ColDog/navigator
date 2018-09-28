require 'test_helper'

class AppCommandsTest < ActiveSupport::TestCase

  test "create an app" do
    Apps::CreateCommand.execute(name: 'test')
  end

  test "update an app" do
    Apps::UpdateCommand.execute(app_uid: apps(:one).uid, name: 'test2')
  end

  test "delete an app" do
    Apps::DeleteCommand.execute(app_uid: apps(:one).uid)
  end

  test "delete a (non existent) app" do
    Apps::DeleteCommand.execute(app_uid: 'asdf')
  end

  test "add a stage" do
    Apps::UpsertStageCommand.execute(app_uid: apps(:one).uid, name: 'test')
  end

  test "update a stage" do
    Apps::UpsertStageCommand.execute(
      app_uid: apps(:one).uid,
      stage_uid: stages(:one).uid,
      name: 'test2'
    )
  end

  test "add a cluster" do
    Apps::UpsertClusterCommand.execute(
      stage_uid: stages(:one).uid,
      name: 'test2'
    )
  end

  test "update a cluster" do
    Apps::UpsertClusterCommand.execute(
      stage_uid: stages(:one).uid,
      name: 'test2'
    )
  end

end
