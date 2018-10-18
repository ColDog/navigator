require 'test_helper'

class BuildCommandsTest < ActiveSupport::TestCase

  test "create a build" do
    Builds::CreateCommand.execute(
      app_uid: apps(:one).uid,
      build_uid: builds(:one).uid,
      stage_uid: stages(:one).uid,
      version: 'v1',
      values: {
        image: { repository: 'nginx', tag: 'asdfasdf' },
      },
    )
    assert_not_nil Build.find_by(app_id: apps(:one).id)
  end

end
